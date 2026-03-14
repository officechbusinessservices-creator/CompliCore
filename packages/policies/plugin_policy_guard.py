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


def evaluate_plugin_execution_policy(plugin: dict, details: dict, request: dict) -> tuple[bool, list[str]]:
    violations: list[str] = []
    permissions = details.get("permissions", [])

    def _scopes(permission_name: str) -> set[str]:
        return {str(p.get("scope")) for p in permissions if p.get("permission_name") == permission_name and p.get("allowed")}

    workspace = request.get("workspace", "global")
    role = request.get("role", "global")
    timeout_s = int(request.get("timeout_s", 30))

    workspace_scopes = _scopes("workspace_access")
    if "global" not in workspace_scopes and workspace not in workspace_scopes:
        violations.append(f"Workspace `{workspace}` not allowed by plugin scope")

    role_scopes = _scopes("role_access")
    if "global" not in role_scopes and role not in role_scopes:
        violations.append(f"Role `{role}` not allowed by plugin scope")

    if timeout_s > 120:
        violations.append("Timeout budget exceeded (max 120s)")

    requested_mcp_endpoints = set(request.get("requested_mcp_endpoints", []))
    allowed_mcp_scopes = _scopes("mcp_endpoints")
    if requested_mcp_endpoints and "declared" not in allowed_mcp_scopes and not requested_mcp_endpoints.issubset(allowed_mcp_scopes):
        violations.append("Requested MCP endpoints exceed declared permission")

    requested_tools = set(request.get("requested_tools", []))
    allowed_tool_scopes = _scopes("allowed_tools")
    if requested_tools and allowed_tool_scopes and not requested_tools.issubset(allowed_tool_scopes):
        violations.append("Requested tools exceed plugin allowed_tools scope")

    return (len(violations) == 0, violations)
