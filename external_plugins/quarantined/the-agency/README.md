# The Agency (Quarantined External Plugin)

This package registers **The Agency** as a quarantined external plugin candidate for Antigravity OS.

- Source: https://github.com/msitarzewski/agency-agents
- State: `quarantined`
- Activation: **blocked** until governance review is complete

## Why quarantined

This plugin source includes a large external roster and multi-tool install paths. It must pass Antigravity plugin governance checks before production activation.

## Required review checklist

- source repository verified
- license and ownership reviewed
- command definitions reviewed
- agent behavior reviewed
- skill content reviewed
- MCP/network scope reviewed
- secrets exposure risk reviewed
- sandbox policy assigned

## Promotion path

1. Record review in `plugin_reviews`
2. Record approved permissions in `plugin_permissions`
3. Transition `plugin_states` from `quarantined` -> `approved`
4. Move package from `external_plugins/quarantined/the-agency` to `external_plugins/approved/the-agency`
