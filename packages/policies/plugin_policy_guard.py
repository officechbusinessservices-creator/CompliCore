from __future__ import annotations


REQUIRED_DECLARATIONS = {
    "workspace_access",
    "role_access",
    "secrets_use",
    "network_use",
    "mcp_endpoints",
}


def evaluate_plugin_enable_policy(plugin: dict, details: dict) -> tuple[bool, list[str]]:
    violations: list[str] = []

    if plugin.get("state") != "approved":
        violations.append("Plugin state must be approved")
    if plugin.get("trust_level") not in {"reviewed", "trusted"}:
        violations.append("Plugin trust level must be reviewed or trusted")

    permissions = details.get("permissions", [])
    declared_scopes = {p.get("permission_name") for p in permissions}
    missing = REQUIRED_DECLARATIONS - declared_scopes
    if missing:
        violations.append(f"Missing permission declarations: {', '.join(sorted(missing))}")

    disallowed = [p for p in permissions if p.get("allowed") is False]
    if disallowed:
        names = ", ".join(sorted({p.get("permission_name", "unknown") for p in disallowed}))
        violations.append(f"Plugin has disallowed permissions: {names}")

    return (len(violations) == 0, violations)
