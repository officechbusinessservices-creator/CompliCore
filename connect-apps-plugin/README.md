# CompliCore Connect Apps Plugin

A Claude Code MCP plugin for managing CompliCore's external application integrations.

## Usage

```bash
claude --plugin-dir ./connect-apps-plugin
```

## Setup

```bash
cd connect-apps-plugin
npm install
npm run build
```

## Available Tools

| Tool | Description |
|------|-------------|
| `list_connectors` | List all connectors, optionally filtered by category or status |
| `get_connector` | Get details for a specific connector including env vars and sync history |
| `connect_app` | Activate a connection (API key or OAuth code) |
| `disconnect_app` | Disconnect and revoke credentials for a connector |
| `trigger_sync` | Trigger a data sync (full, listings, bookings, availability, pricing, payouts) |
| `get_sync_history` | View recent sync history for one or all connectors |
| `check_env_vars` | Check which required env vars are set vs missing for a connector |

## Connector Categories

| Category | Connectors |
|----------|-----------|
| `pms` | Guesty, Hostaway, Lodgify, Beds24, Hostfully |
| `ota` | Airbnb, VRBO, Booking.com |
| `payment` | Stripe, PayPal |
| `smart-lock` | August, Schlage, Yale |
| `accounting` | QuickBooks Online, Xero |
| `insurance` | Superhog |

## Example Prompts

Once the plugin is loaded with `claude --plugin-dir ./connect-apps-plugin`, you can ask Claude:

- _"Which PMS connectors are currently connected?"_
- _"Show me the required environment variables for Guesty."_
- _"Connect Stripe with my API key sk-..."_
- _"Trigger a full sync with Hostaway."_
- _"What errors occurred in recent syncs?"_
- _"Check which env vars are missing for Airbnb."_
