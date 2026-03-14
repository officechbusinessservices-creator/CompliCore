from __future__ import annotations

import asyncio
import hashlib
import importlib.util
import json
from pathlib import Path

from packages.policies.plugin_policy_guard import (
    evaluate_plugin_enable_policy,
    evaluate_plugin_execution_policy,
)
from packages.shared.run_store import (
    add_plugin_version,
    get_plugin_by_name,
    get_plugin_details,
    register_plugin,
    set_plugin_permissions,
    write_audit,
)

ALLOWED_WORKSPACE_SCOPES = {"global", "complicore", "livily", "personal", "zelloo"}
ALLOWED_ROLE_SCOPES = {"global", "ceo", "builder", "marketer", "operator", "sales", "researcher", "cro"}
REQUIRED_MANIFEST_FIELDS = {"name", "version", "description", "commands", "agents", "skills"}


class PluginValidationError(Exception):
    pass


def _read_json(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:  # noqa: BLE001
        raise PluginValidationError(f"Invalid JSON at {path}: {exc}") from exc


def _validate_markdown_file(path: Path) -> None:
    text = path.read_text(encoding="utf-8").strip()
    if not text:
        raise PluginValidationError(f"Empty markdown file: {path}")
    if not text.startswith("#"):
        raise PluginValidationError(f"Markdown file must start with heading: {path}")


def _compute_sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def validate_plugin_manifest(plugin_root: Path) -> dict:
    manifest_path = plugin_root / ".claude-plugin" / "plugin.json"
    if not manifest_path.exists():
        raise PluginValidationError(f"Missing manifest: {manifest_path}")
    manifest = _read_json(manifest_path)

    missing_fields = REQUIRED_MANIFEST_FIELDS - set(manifest.keys())
    if missing_fields:
        raise PluginValidationError(f"Missing manifest fields: {sorted(missing_fields)}")

    name = manifest.get("name", "")
    if not name or "/" in name or ".." in name:
        raise PluginValidationError("Invalid plugin name")

    workspace_scope = set(manifest.get("workspace_scope", ["global"]))
    if not workspace_scope.issubset(ALLOWED_WORKSPACE_SCOPES):
        raise PluginValidationError(f"Invalid workspace scope: {sorted(workspace_scope - ALLOWED_WORKSPACE_SCOPES)}")

    role_scope = set(manifest.get("role_scope", ["global"]))
    if not role_scope.issubset(ALLOWED_ROLE_SCOPES):
        raise PluginValidationError(f"Invalid role scope: {sorted(role_scope - ALLOWED_ROLE_SCOPES)}")

    declared_permissions = set(manifest.get("required_permissions", []))
    required = {"workspace_access", "role_access", "secrets_use", "network_use", "mcp_endpoints"}
    if not required.issubset(declared_permissions):
        missing = required - declared_permissions
        raise PluginValidationError(f"Undeclared permissions: {sorted(missing)}")

    commands_dir = plugin_root / manifest["commands"].replace("./", "")
    agents_dir = plugin_root / manifest["agents"].replace("./", "")
    skills_dir = plugin_root / manifest["skills"].replace("./", "")

    for directory in [commands_dir, agents_dir, skills_dir]:
        if not directory.exists() or not directory.is_dir():
            raise PluginValidationError(f"Missing plugin directory: {directory}")

    command_files = sorted(commands_dir.rglob("*.md"))
    if not command_files:
        raise PluginValidationError("No command markdown files found")

    command_names = set()
    for file_path in command_files:
        _validate_markdown_file(file_path)
        cmd = file_path.stem
        if cmd in command_names:
            raise PluginValidationError(f"Duplicate command name: {cmd}")
        command_names.add(cmd)

    agent_files = sorted(agents_dir.rglob("*.md"))
    if not agent_files:
        raise PluginValidationError("No agent markdown files found")
    for file_path in agent_files:
        _validate_markdown_file(file_path)

    skill_handlers: dict[str, Path] = {}
    skill_dirs = [p for p in skills_dir.iterdir() if p.is_dir()]
    if not skill_dirs:
        raise PluginValidationError("No skill directories found")

    for skill_dir in skill_dirs:
        skill_doc = skill_dir / "SKILL.md"
        skill_handler = skill_dir / "handler.py"
        if not skill_doc.exists() or not skill_handler.exists():
            raise PluginValidationError(f"Skill directory must contain SKILL.md and handler.py: {skill_dir}")
        _validate_markdown_file(skill_doc)
        skill_handlers[skill_dir.name] = skill_handler

    mcp_path = plugin_root / ".mcp.json"
    if mcp_path.exists():
        _read_json(mcp_path)

    return {
        "manifest": manifest,
        "manifest_path": manifest_path,
        "manifest_hash": _compute_sha256(manifest_path),
        "commands": sorted(command_names),
        "skill_handlers": {k: str(v) for k, v in skill_handlers.items()},
        "plugin_root": str(plugin_root),
    }


def discover_plugins() -> list[Path]:
    roots = [Path("plugins"), Path("external_plugins") / "approved"]
    manifests = []
    for root in roots:
        if root.exists():
            manifests.extend([p.parent.parent for p in root.rglob(".claude-plugin/plugin.json")])
    return sorted(set(manifests))


def load_plugins_into_registry() -> dict:
    loaded = []
    failed = []

    for plugin_root in discover_plugins():
        try:
            validated = validate_plugin_manifest(plugin_root)
            manifest = validated["manifest"]
            source_type = "external" if "external_plugins" in plugin_root.parts else "internal"
            plugin = register_plugin(
                name=manifest["name"],
                source_type=source_type,
                source_url=manifest.get("source"),
                owner=manifest.get("owner"),
                trust_level="reviewed",
                state=manifest.get("state", "approved"),
            )
            add_plugin_version(plugin["id"], manifest["version"], validated["manifest_hash"], manifest)

            permissions = []
            for permission_name in manifest.get("required_permissions", []):
                permissions.append({"permission_name": permission_name, "scope": "declared", "allowed": True})
            for workspace in manifest.get("workspace_scope", ["global"]):
                permissions.append({"permission_name": "workspace_access", "scope": workspace, "allowed": True})
            for role in manifest.get("role_scope", ["global"]):
                permissions.append({"permission_name": "role_access", "scope": role, "allowed": True})
            set_plugin_permissions(plugin["id"], permissions)

            write_audit("plugin", manifest["name"], "plugin_loaded", {"hash": validated["manifest_hash"]})

            loaded.append(
                {
                    "name": manifest["name"],
                    "version": manifest["version"],
                    "commands": validated["commands"],
                    "skills": sorted(validated["skill_handlers"].keys()),
                }
            )
        except Exception as exc:  # noqa: BLE001
            failed.append({"plugin_root": str(plugin_root), "error": str(exc)})
            write_audit("plugin", str(plugin_root), "plugin_load_failed", {"error": str(exc)})

    return {"loaded": loaded, "failed": failed}


def _resolve_command(command_name: str) -> tuple[dict, dict, str] | None:
    for plugin_root in discover_plugins():
        validated = validate_plugin_manifest(plugin_root)
        manifest = validated["manifest"]
        if command_name in validated["commands"]:
            mapping = manifest.get("command_skill_map", {})
            skill_name = mapping.get(command_name)
            if not skill_name:
                skill_name = sorted(validated["skill_handlers"].keys())[0]
            return manifest, validated, skill_name
    return None


def _execute_skill_handler(handler_path: Path, payload: dict) -> dict:
    spec = importlib.util.spec_from_file_location("plugin_skill_handler", handler_path)
    if spec is None or spec.loader is None:
        raise PluginValidationError(f"Cannot load handler: {handler_path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    if not hasattr(module, "run"):
        raise PluginValidationError(f"Handler missing run(payload) function: {handler_path}")
    result = module.run(payload)
    if not isinstance(result, dict):
        raise PluginValidationError("Skill handler must return dict")
    return result


async def dispatch_plugin_command(
    command_name: str,
    workspace: str,
    role: str,
    objective: str,
    constraints: list[str],
    timeout_s: int = 30,
) -> dict:
    resolved = _resolve_command(command_name)
    if not resolved:
        raise PluginValidationError(f"Command not found: {command_name}")

    manifest, validated, skill_name = resolved
    plugin = get_plugin_by_name(manifest["name"])
    details = get_plugin_details(manifest["name"])
    if not plugin or not details:
        raise PluginValidationError("Plugin not registered")

    enabled_ok, enable_violations = evaluate_plugin_enable_policy(plugin, details)
    exec_ok, exec_violations = evaluate_plugin_execution_policy(
        plugin,
        details,
        {
            "workspace": workspace,
            "role": role,
            "requested_tools": [],
            "requested_mcp_endpoints": [],
            "timeout_s": timeout_s,
        },
    )

    if not enabled_ok or not exec_ok:
        violations = enable_violations + exec_violations
        write_audit("plugin", manifest["name"], "plugin_policy_denied", {"violations": violations})
        raise PluginValidationError("; ".join(violations))

    handler_path = Path(validated["skill_handlers"][skill_name])
    payload = {
        "workspace": workspace,
        "role": role,
        "objective": objective,
        "constraints": constraints,
        "command": command_name,
    }

    write_audit("plugin", manifest["name"], "plugin_execution_start", payload)
    try:
        result = await asyncio.wait_for(asyncio.to_thread(_execute_skill_handler, handler_path, payload), timeout=timeout_s)
        write_audit("plugin", manifest["name"], "plugin_execution_finish", {"command": command_name, "skill": skill_name})
        return {
            "plugin": manifest["name"],
            "command": command_name,
            "skill": skill_name,
            "result": result,
        }
    except Exception as exc:  # noqa: BLE001
        write_audit("plugin", manifest["name"], "plugin_execution_failure", {"error": str(exc)})
        raise
