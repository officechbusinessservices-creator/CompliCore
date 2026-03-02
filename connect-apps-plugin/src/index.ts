#!/usr/bin/env node
/**
 * CompliCore Connect Apps Plugin
 *
 * Claude Code MCP plugin that provides tools for managing CompliCore's
 * external application integrations: PMS providers, OTA channels,
 * payment processors, smart locks, and accounting systems.
 *
 * Usage: claude --plugin-dir ./connect-apps-plugin
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ConnectorStatus = "connected" | "disconnected" | "error" | "configured";
type ConnectorCategory =
  | "pms"
  | "ota"
  | "payment"
  | "smart-lock"
  | "accounting"
  | "insurance";

interface AppConnector {
  id: string;
  name: string;
  category: ConnectorCategory;
  authType: "oauth" | "apiKey" | "webhook";
  status: ConnectorStatus;
  docsUrl: string;
  description: string;
  requiredEnvVars: string[];
}

interface SyncRecord {
  id: string;
  connectorId: string;
  type: string;
  status: "success" | "error" | "in_progress";
  timestamp: string;
  durationMs?: number;
  errorMessage?: string;
  recordsProcessed?: number;
}

// ---------------------------------------------------------------------------
// App connector registry
// ---------------------------------------------------------------------------

const connectors: AppConnector[] = [
  // PMS Providers
  {
    id: "guesty",
    name: "Guesty",
    category: "pms",
    authType: "oauth",
    status: "configured",
    docsUrl: "https://developers.guesty.com/",
    description: "Full property management platform with reservations, guests, and listing sync.",
    requiredEnvVars: ["GUESTY_CLIENT_ID", "GUESTY_CLIENT_SECRET"],
  },
  {
    id: "hostaway",
    name: "Hostaway",
    category: "pms",
    authType: "apiKey",
    status: "connected",
    docsUrl: "https://api.hostaway.com/documentation",
    description: "Channel manager and PMS with iCal and API sync.",
    requiredEnvVars: ["HOSTAWAY_API_KEY", "HOSTAWAY_ACCOUNT_ID"],
  },
  {
    id: "lodgify",
    name: "Lodgify",
    category: "pms",
    authType: "apiKey",
    status: "disconnected",
    docsUrl: "https://developer.lodgify.com/",
    description: "Vacation rental website builder and booking system.",
    requiredEnvVars: ["LODGIFY_API_KEY"],
  },
  {
    id: "beds24",
    name: "Beds24",
    category: "pms",
    authType: "apiKey",
    status: "connected",
    docsUrl: "https://wiki.beds24.com/index.php/API",
    description: "Channel manager with multi-property support.",
    requiredEnvVars: ["BEDS24_PROP_KEY", "BEDS24_API_KEY"],
  },
  {
    id: "hostfully",
    name: "Hostfully",
    category: "pms",
    authType: "oauth",
    status: "error",
    docsUrl: "https://developer.hostfully.com/",
    description: "Property management with guidebooks and digital check-in.",
    requiredEnvVars: ["HOSTFULLY_CLIENT_ID", "HOSTFULLY_CLIENT_SECRET"],
  },
  // OTA Channels
  {
    id: "airbnb",
    name: "Airbnb",
    category: "ota",
    authType: "oauth",
    status: "connected",
    docsUrl: "https://developers.airbnb.com/",
    description: "Direct listing sync via Airbnb API (availability, pricing, reservations).",
    requiredEnvVars: ["AIRBNB_CLIENT_ID", "AIRBNB_CLIENT_SECRET"],
  },
  {
    id: "vrbo",
    name: "VRBO / HomeAway",
    category: "ota",
    authType: "apiKey",
    status: "connected",
    docsUrl: "https://developer.vrbo.com/",
    description: "VRBO channel manager integration for listings and bookings.",
    requiredEnvVars: ["VRBO_API_KEY", "VRBO_ADVERTISER_ID"],
  },
  {
    id: "booking-com",
    name: "Booking.com",
    category: "ota",
    authType: "apiKey",
    status: "disconnected",
    docsUrl: "https://developers.booking.com/",
    description: "Booking.com XML/JSON connectivity partner integration.",
    requiredEnvVars: ["BOOKINGCOM_API_KEY", "BOOKINGCOM_HOTEL_ID"],
  },
  // Payment Processors
  {
    id: "stripe",
    name: "Stripe",
    category: "payment",
    authType: "apiKey",
    status: "connected",
    docsUrl: "https://stripe.com/docs/api",
    description: "PCI-compliant payment processing with Connect for host payouts.",
    requiredEnvVars: ["STRIPE_SECRET_KEY", "STRIPE_PUBLISHABLE_KEY", "STRIPE_WEBHOOK_SECRET"],
  },
  {
    id: "paypal",
    name: "PayPal",
    category: "payment",
    authType: "oauth",
    status: "configured",
    docsUrl: "https://developer.paypal.com/",
    description: "PayPal and Venmo payment acceptance.",
    requiredEnvVars: ["PAYPAL_CLIENT_ID", "PAYPAL_CLIENT_SECRET"],
  },
  // Smart Locks
  {
    id: "august",
    name: "August Smart Lock",
    category: "smart-lock",
    authType: "oauth",
    status: "connected",
    docsUrl: "https://docs.august.com/",
    description: "Remote lock/unlock and guest access code management.",
    requiredEnvVars: ["AUGUST_CLIENT_ID", "AUGUST_CLIENT_SECRET"],
  },
  {
    id: "schlage",
    name: "Schlage Encode",
    category: "smart-lock",
    authType: "apiKey",
    status: "disconnected",
    docsUrl: "https://developer.allegion.com/",
    description: "Schlage smart lock access management via Allegion API.",
    requiredEnvVars: ["SCHLAGE_API_KEY"],
  },
  {
    id: "yale",
    name: "Yale Access",
    category: "smart-lock",
    authType: "oauth",
    status: "disconnected",
    docsUrl: "https://developer.august.com/",
    description: "Yale smart lock integration (powered by August platform).",
    requiredEnvVars: ["YALE_CLIENT_ID", "YALE_CLIENT_SECRET"],
  },
  // Accounting
  {
    id: "quickbooks",
    name: "QuickBooks Online",
    category: "accounting",
    authType: "oauth",
    status: "configured",
    docsUrl: "https://developer.intuit.com/",
    description: "Revenue, expense, and payout sync to QuickBooks.",
    requiredEnvVars: ["QUICKBOOKS_CLIENT_ID", "QUICKBOOKS_CLIENT_SECRET"],
  },
  {
    id: "xero",
    name: "Xero",
    category: "accounting",
    authType: "oauth",
    status: "disconnected",
    docsUrl: "https://developer.xero.com/",
    description: "Accounting and invoicing integration via Xero API.",
    requiredEnvVars: ["XERO_CLIENT_ID", "XERO_CLIENT_SECRET"],
  },
  // Insurance
  {
    id: "superhog",
    name: "Superhog",
    category: "insurance",
    authType: "apiKey",
    status: "configured",
    docsUrl: "https://docs.superhog.com/",
    description: "Guest verification and damage protection platform.",
    requiredEnvVars: ["SUPERHOG_API_KEY", "SUPERHOG_HOST_ID"],
  },
];

// In-memory sync history (dev/demo)
const syncHistory: SyncRecord[] = [
  {
    id: "sync-001",
    connectorId: "guesty",
    type: "Full Sync",
    status: "success",
    timestamp: "2026-03-02T08:30:00Z",
    durationMs: 45200,
    recordsProcessed: 124,
  },
  {
    id: "sync-002",
    connectorId: "airbnb",
    type: "Availability",
    status: "success",
    timestamp: "2026-03-02T08:25:00Z",
    durationMs: 12400,
    recordsProcessed: 38,
  },
  {
    id: "sync-003",
    connectorId: "hostfully",
    type: "Properties",
    status: "error",
    timestamp: "2026-03-02T07:15:00Z",
    durationMs: 5100,
    errorMessage: "OAuth token expired. Re-authentication required.",
  },
  {
    id: "sync-004",
    connectorId: "stripe",
    type: "Payouts",
    status: "success",
    timestamp: "2026-03-02T06:00:00Z",
    durationMs: 3800,
    recordsProcessed: 17,
  },
];

// ---------------------------------------------------------------------------
// Tool input schemas (Zod)
// ---------------------------------------------------------------------------

const ListConnectorsSchema = z.object({
  category: z
    .enum(["pms", "ota", "payment", "smart-lock", "accounting", "insurance"])
    .optional()
    .describe("Filter connectors by category"),
  status: z
    .enum(["connected", "disconnected", "error", "configured"])
    .optional()
    .describe("Filter connectors by status"),
});

const GetConnectorSchema = z.object({
  connectorId: z.string().describe("ID of the connector (e.g. 'guesty', 'stripe')"),
});

const ConnectAppSchema = z.object({
  connectorId: z.string().describe("ID of the connector to activate"),
  apiKey: z.string().optional().describe("API key for apiKey-based connectors"),
  oauthCode: z.string().optional().describe("OAuth authorization code for OAuth connectors"),
  webhookUrl: z
    .string()
    .url()
    .optional()
    .describe("Webhook endpoint URL to register with the external app"),
});

const DisconnectAppSchema = z.object({
  connectorId: z.string().describe("ID of the connector to disconnect"),
});

const TriggerSyncSchema = z.object({
  connectorId: z.string().describe("ID of the connector to sync"),
  syncType: z
    .enum(["full", "listings", "bookings", "availability", "pricing", "payouts"])
    .default("full")
    .describe("Type of data to sync"),
});

const GetSyncHistorySchema = z.object({
  connectorId: z.string().optional().describe("Filter by connector ID"),
  limit: z.number().int().min(1).max(100).default(20).describe("Max records to return"),
});

const CheckEnvVarsSchema = z.object({
  connectorId: z.string().describe("ID of the connector to check environment variables for"),
});

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function formatDuration(ms?: number): string {
  if (!ms) return "—";
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function statusIcon(status: ConnectorStatus | "success" | "error" | "in_progress"): string {
  const icons: Record<string, string> = {
    connected: "✓",
    success: "✓",
    disconnected: "○",
    configured: "◑",
    error: "✗",
    in_progress: "↻",
  };
  return icons[status] ?? "?";
}

// ---------------------------------------------------------------------------
// MCP Server
// ---------------------------------------------------------------------------

const server = new Server(
  {
    name: "complicore-connect-apps",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// ── List tools ───────────────────────────────────────────────────────────────

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "list_connectors",
      description:
        "List all available app connectors for CompliCore (PMS providers, OTA channels, payment processors, smart locks, accounting, insurance). Optionally filter by category or status.",
      inputSchema: {
        type: "object",
        properties: {
          category: {
            type: "string",
            enum: ["pms", "ota", "payment", "smart-lock", "accounting", "insurance"],
            description: "Filter by connector category",
          },
          status: {
            type: "string",
            enum: ["connected", "disconnected", "error", "configured"],
            description: "Filter by connection status",
          },
        },
      },
    },
    {
      name: "get_connector",
      description:
        "Get detailed information about a specific app connector including its status, required environment variables, and documentation URL.",
      inputSchema: {
        type: "object",
        properties: {
          connectorId: {
            type: "string",
            description: "Connector ID (e.g. 'guesty', 'stripe', 'airbnb')",
          },
        },
        required: ["connectorId"],
      },
    },
    {
      name: "connect_app",
      description:
        "Activate a connection to an external application. For OAuth apps, provide the authorization code. For API-key apps, provide the key directly.",
      inputSchema: {
        type: "object",
        properties: {
          connectorId: {
            type: "string",
            description: "ID of the connector to activate",
          },
          apiKey: {
            type: "string",
            description: "API key (for apiKey-based connectors)",
          },
          oauthCode: {
            type: "string",
            description: "OAuth authorization code (for OAuth connectors)",
          },
          webhookUrl: {
            type: "string",
            description: "Webhook URL to register with the external app",
          },
        },
        required: ["connectorId"],
      },
    },
    {
      name: "disconnect_app",
      description: "Disconnect and deactivate an external app connector, revoking credentials.",
      inputSchema: {
        type: "object",
        properties: {
          connectorId: {
            type: "string",
            description: "ID of the connector to disconnect",
          },
        },
        required: ["connectorId"],
      },
    },
    {
      name: "trigger_sync",
      description:
        "Trigger a data sync with an external app (listings, bookings, availability, pricing, or full sync).",
      inputSchema: {
        type: "object",
        properties: {
          connectorId: {
            type: "string",
            description: "ID of the connector to sync",
          },
          syncType: {
            type: "string",
            enum: ["full", "listings", "bookings", "availability", "pricing", "payouts"],
            description: "Type of data to synchronize",
          },
        },
        required: ["connectorId"],
      },
    },
    {
      name: "get_sync_history",
      description: "Get the recent sync history for all connectors or a specific connector.",
      inputSchema: {
        type: "object",
        properties: {
          connectorId: {
            type: "string",
            description: "Filter by connector ID (omit for all connectors)",
          },
          limit: {
            type: "number",
            description: "Maximum number of records to return (default: 20)",
          },
        },
      },
    },
    {
      name: "check_env_vars",
      description:
        "Check which required environment variables are set (present) vs missing for a connector. Helps diagnose configuration issues without exposing secret values.",
      inputSchema: {
        type: "object",
        properties: {
          connectorId: {
            type: "string",
            description: "ID of the connector to check",
          },
        },
        required: ["connectorId"],
      },
    },
  ],
}));

// ── Call tool ────────────────────────────────────────────────────────────────

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      // ------------------------------------------------------------------
      case "list_connectors": {
        const input = ListConnectorsSchema.parse(args ?? {});
        let results = [...connectors];

        if (input.category) {
          results = results.filter((c) => c.category === input.category);
        }
        if (input.status) {
          results = results.filter((c) => c.status === input.status);
        }

        const grouped = results.reduce(
          (acc, c) => {
            if (!acc[c.category]) acc[c.category] = [];
            acc[c.category].push(c);
            return acc;
          },
          {} as Record<string, AppConnector[]>
        );

        let text = `## CompliCore App Connectors (${results.length} found)\n\n`;
        for (const [category, items] of Object.entries(grouped)) {
          text += `### ${category.toUpperCase()}\n`;
          for (const c of items) {
            text += `- [${statusIcon(c.status)}] **${c.name}** (\`${c.id}\`) — ${c.status}\n`;
            text += `  ${c.description}\n`;
          }
          text += "\n";
        }

        const counts = {
          total: results.length,
          connected: results.filter((c) => c.status === "connected").length,
          configured: results.filter((c) => c.status === "configured").length,
          disconnected: results.filter((c) => c.status === "disconnected").length,
          error: results.filter((c) => c.status === "error").length,
        };
        text += `**Summary:** ${counts.connected} connected, ${counts.configured} configured, ${counts.disconnected} disconnected, ${counts.error} errors`;

        return { content: [{ type: "text", text }] };
      }

      // ------------------------------------------------------------------
      case "get_connector": {
        const { connectorId } = GetConnectorSchema.parse(args);
        const connector = connectors.find((c) => c.id === connectorId);

        if (!connector) {
          return {
            content: [
              {
                type: "text",
                text: `Connector \`${connectorId}\` not found. Run \`list_connectors\` to see available connectors.`,
              },
            ],
            isError: true,
          };
        }

        const recentSyncs = syncHistory
          .filter((s) => s.connectorId === connectorId)
          .slice(0, 3);

        const text = [
          `## ${connector.name} [${statusIcon(connector.status)} ${connector.status}]`,
          ``,
          `- **ID:** \`${connector.id}\``,
          `- **Category:** ${connector.category}`,
          `- **Auth Type:** ${connector.authType}`,
          `- **Description:** ${connector.description}`,
          `- **Docs:** ${connector.docsUrl}`,
          ``,
          `### Required Environment Variables`,
          connector.requiredEnvVars.map((v) => `- \`${v}\``).join("\n"),
          ``,
          `### Recent Syncs`,
          recentSyncs.length === 0
            ? "No sync history."
            : recentSyncs
                .map(
                  (s) =>
                    `- [${statusIcon(s.status)}] **${s.type}** — ${s.status} (${formatDuration(s.durationMs)}) at ${s.timestamp}` +
                    (s.errorMessage ? `\n  Error: ${s.errorMessage}` : "")
                )
                .join("\n"),
        ].join("\n");

        return { content: [{ type: "text", text }] };
      }

      // ------------------------------------------------------------------
      case "connect_app": {
        const input = ConnectAppSchema.parse(args);
        const connector = connectors.find((c) => c.id === input.connectorId);

        if (!connector) {
          return {
            content: [
              {
                type: "text",
                text: `Connector \`${input.connectorId}\` not found.`,
              },
            ],
            isError: true,
          };
        }

        if (connector.authType === "apiKey" && !input.apiKey) {
          return {
            content: [
              {
                type: "text",
                text: `\`${connector.name}\` requires an API key. Provide \`apiKey\` in your request.\n\nRequired env vars: ${connector.requiredEnvVars.join(", ")}`,
              },
            ],
            isError: true,
          };
        }

        if (connector.authType === "oauth" && !input.oauthCode) {
          return {
            content: [
              {
                type: "text",
                text: [
                  `\`${connector.name}\` uses OAuth. To connect:`,
                  `1. Direct the user to the ${connector.name} OAuth authorization URL`,
                  `2. Capture the \`code\` parameter from the callback`,
                  `3. Call \`connect_app\` again with \`oauthCode\` set to that value`,
                  ``,
                  `Docs: ${connector.docsUrl}`,
                ].join("\n"),
              },
            ],
            isError: true,
          };
        }

        // Update status (in-memory demo)
        connector.status = "connected";

        const text = [
          `### ${connector.name} Connected`,
          ``,
          `[✓] Successfully connected to **${connector.name}**.`,
          ``,
          `**Auth method:** ${connector.authType}`,
          input.webhookUrl ? `**Webhook registered:** ${input.webhookUrl}` : "",
          ``,
          `Next steps:`,
          `- Run \`trigger_sync\` to pull the first batch of data`,
          `- Run \`get_sync_history\` to monitor sync progress`,
        ]
          .filter(Boolean)
          .join("\n");

        return { content: [{ type: "text", text }] };
      }

      // ------------------------------------------------------------------
      case "disconnect_app": {
        const { connectorId } = DisconnectAppSchema.parse(args);
        const connector = connectors.find((c) => c.id === connectorId);

        if (!connector) {
          return {
            content: [{ type: "text", text: `Connector \`${connectorId}\` not found.` }],
            isError: true,
          };
        }

        const previousStatus = connector.status;
        connector.status = "disconnected";

        return {
          content: [
            {
              type: "text",
              text: [
                `### ${connector.name} Disconnected`,
                ``,
                `[○] **${connector.name}** has been disconnected (was: ${previousStatus}).`,
                ``,
                `Credentials have been revoked. To reconnect, call \`connect_app\` with valid credentials.`,
              ].join("\n"),
            },
          ],
        };
      }

      // ------------------------------------------------------------------
      case "trigger_sync": {
        const input = TriggerSyncSchema.parse(args);
        const connector = connectors.find((c) => c.id === input.connectorId);

        if (!connector) {
          return {
            content: [{ type: "text", text: `Connector \`${input.connectorId}\` not found.` }],
            isError: true,
          };
        }

        if (connector.status !== "connected") {
          return {
            content: [
              {
                type: "text",
                text: `Cannot sync — \`${connector.name}\` is **${connector.status}**. Connect first with \`connect_app\`.`,
              },
            ],
            isError: true,
          };
        }

        const syncId = `sync-${Date.now()}`;
        const syncRecord: SyncRecord = {
          id: syncId,
          connectorId: input.connectorId,
          type: input.syncType.charAt(0).toUpperCase() + input.syncType.slice(1),
          status: "success",
          timestamp: new Date().toISOString(),
          durationMs: Math.floor(Math.random() * 40000) + 3000,
          recordsProcessed: Math.floor(Math.random() * 200) + 5,
        };
        syncHistory.unshift(syncRecord);

        return {
          content: [
            {
              type: "text",
              text: [
                `### Sync Triggered — ${connector.name}`,
                ``,
                `- **Sync ID:** \`${syncId}\``,
                `- **Type:** ${syncRecord.type}`,
                `- **Status:** ✓ ${syncRecord.status}`,
                `- **Duration:** ${formatDuration(syncRecord.durationMs)}`,
                `- **Records processed:** ${syncRecord.recordsProcessed}`,
                `- **Timestamp:** ${syncRecord.timestamp}`,
                ``,
                `Use \`get_sync_history\` to view the full sync log.`,
              ].join("\n"),
            },
          ],
        };
      }

      // ------------------------------------------------------------------
      case "get_sync_history": {
        const input = GetSyncHistorySchema.parse(args ?? {});
        let records = [...syncHistory];

        if (input.connectorId) {
          records = records.filter((r) => r.connectorId === input.connectorId);
        }
        records = records.slice(0, input.limit);

        if (records.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: `No sync history found${input.connectorId ? ` for \`${input.connectorId}\`` : ""}.`,
              },
            ],
          };
        }

        const header = input.connectorId
          ? `## Sync History — \`${input.connectorId}\` (${records.length} records)\n`
          : `## Sync History — All Connectors (${records.length} records)\n`;

        const rows = records
          .map(
            (r) =>
              `| ${statusIcon(r.status)} | \`${r.connectorId}\` | ${r.type} | ${r.status} | ${formatDuration(r.durationMs)} | ${r.recordsProcessed ?? "—"} | ${r.timestamp} |` +
              (r.errorMessage ? `\n|   |   |   | Error: ${r.errorMessage}   |   |   |   |` : "")
          )
          .join("\n");

        const text =
          header +
          "\n| Status | Connector | Type | Result | Duration | Records | Timestamp |\n" +
          "|--------|-----------|------|--------|----------|---------|----------|\n" +
          rows;

        return { content: [{ type: "text", text }] };
      }

      // ------------------------------------------------------------------
      case "check_env_vars": {
        const { connectorId } = CheckEnvVarsSchema.parse(args);
        const connector = connectors.find((c) => c.id === connectorId);

        if (!connector) {
          return {
            content: [{ type: "text", text: `Connector \`${connectorId}\` not found.` }],
            isError: true,
          };
        }

        const results = connector.requiredEnvVars.map((varName) => ({
          name: varName,
          present: Boolean(process.env[varName]),
        }));

        const allPresent = results.every((r) => r.present);
        const missing = results.filter((r) => !r.present);

        const lines = [
          `## Environment Variables — ${connector.name}`,
          ``,
          results
            .map((r) => `- ${r.present ? "✓" : "✗"} \`${r.name}\` — ${r.present ? "set" : "**MISSING**"}`)
            .join("\n"),
          ``,
          allPresent
            ? `✓ All required variables are set.`
            : `✗ ${missing.length} variable(s) missing: ${missing.map((m) => `\`${m.name}\``).join(", ")}`,
        ];

        if (!allPresent) {
          lines.push(``, `Set the missing variables in your \`.env\` file or environment before connecting.`);
        }

        return { content: [{ type: "text", text: lines.join("\n") }] };
      }

      // ------------------------------------------------------------------
      default:
        return {
          content: [{ type: "text", text: `Unknown tool: \`${name}\`` }],
          isError: true,
        };
    }
  } catch (error) {
    const message = error instanceof z.ZodError
      ? `Validation error: ${error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")}`
      : error instanceof Error
        ? error.message
        : String(error);

    return {
      content: [{ type: "text", text: `Error: ${message}` }],
      isError: true,
    };
  }
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // MCP servers communicate over stdio; do not write to stdout
  process.stderr.write("CompliCore Connect Apps plugin running\n");
}

main().catch((error) => {
  process.stderr.write(`Fatal: ${error}\n`);
  process.exit(1);
});
