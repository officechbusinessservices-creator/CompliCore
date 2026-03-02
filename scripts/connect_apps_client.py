#!/usr/bin/env python3
"""
CompliCore Connect Apps — Anthropic Skills Integration

Demonstrates invoking the connect-apps MCP skill via the Anthropic Messages API.
The skill gives Claude access to CompliCore's 16 external app connectors
(PMS, OTA, payment, smart-lock, accounting, insurance).

Usage:
    export ANTHROPIC_API_KEY="sk-ant-..."
    python scripts/connect_apps_client.py

Requires:
    pip install anthropic
"""

import os
import sys
import json
import anthropic

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

MODEL = "claude-sonnet-4-20250514"

# MCP skill definition matching connect-apps-plugin/mcp.json
CONNECT_APPS_SKILL = {
    "name": "complicore-connect-apps",
    "description": (
        "Manage CompliCore external app integrations: PMS providers, "
        "OTA channels, payment processors, smart locks, accounting, "
        "and insurance connectors."
    ),
    "tools": [
        {
            "name": "list_connectors",
            "description": "List all app connectors, optionally filtered by category or status.",
            "input_schema": {
                "type": "object",
                "properties": {
                    "category": {
                        "type": "string",
                        "enum": ["pms", "ota", "payment", "smart-lock", "accounting", "insurance"],
                        "description": "Filter by connector category",
                    },
                    "status": {
                        "type": "string",
                        "enum": ["connected", "disconnected", "error", "configured"],
                        "description": "Filter by connection status",
                    },
                },
            },
        },
        {
            "name": "get_connector",
            "description": "Get details for a specific connector including env vars and sync history.",
            "input_schema": {
                "type": "object",
                "properties": {
                    "connectorId": {
                        "type": "string",
                        "description": "Connector ID (e.g. 'guesty', 'stripe', 'airbnb')",
                    },
                },
                "required": ["connectorId"],
            },
        },
        {
            "name": "connect_app",
            "description": "Activate a connection to an external app with credentials.",
            "input_schema": {
                "type": "object",
                "properties": {
                    "connectorId": {"type": "string", "description": "Connector ID"},
                    "apiKey": {"type": "string", "description": "API key (for apiKey connectors)"},
                    "oauthCode": {"type": "string", "description": "OAuth code (for OAuth connectors)"},
                    "webhookUrl": {"type": "string", "description": "Webhook URL to register"},
                },
                "required": ["connectorId"],
            },
        },
        {
            "name": "disconnect_app",
            "description": "Disconnect and revoke credentials for a connector.",
            "input_schema": {
                "type": "object",
                "properties": {
                    "connectorId": {"type": "string", "description": "Connector ID"},
                },
                "required": ["connectorId"],
            },
        },
        {
            "name": "trigger_sync",
            "description": "Trigger a data sync with a connected app.",
            "input_schema": {
                "type": "object",
                "properties": {
                    "connectorId": {"type": "string", "description": "Connector ID"},
                    "syncType": {
                        "type": "string",
                        "enum": ["full", "listings", "bookings", "availability", "pricing", "payouts"],
                        "description": "Type of data to sync (default: full)",
                    },
                },
                "required": ["connectorId"],
            },
        },
        {
            "name": "get_sync_history",
            "description": "View recent sync history for all or a specific connector.",
            "input_schema": {
                "type": "object",
                "properties": {
                    "connectorId": {"type": "string", "description": "Filter by connector ID"},
                    "limit": {"type": "number", "description": "Max records (default: 20)"},
                },
            },
        },
        {
            "name": "check_env_vars",
            "description": "Check which required env vars are set vs missing for a connector.",
            "input_schema": {
                "type": "object",
                "properties": {
                    "connectorId": {"type": "string", "description": "Connector ID"},
                },
                "required": ["connectorId"],
            },
        },
    ],
}

# ---------------------------------------------------------------------------
# Simulated tool execution (mirrors connect-apps-plugin logic)
# In production, this would call the MCP server over stdio or HTTP.
# ---------------------------------------------------------------------------

CONNECTORS = {
    "guesty":      {"name": "Guesty",           "category": "pms",        "auth": "oauth",  "status": "configured"},
    "hostaway":    {"name": "Hostaway",         "category": "pms",        "auth": "apiKey", "status": "connected"},
    "lodgify":     {"name": "Lodgify",          "category": "pms",        "auth": "apiKey", "status": "disconnected"},
    "beds24":      {"name": "Beds24",           "category": "pms",        "auth": "apiKey", "status": "connected"},
    "hostfully":   {"name": "Hostfully",        "category": "pms",        "auth": "oauth",  "status": "error"},
    "airbnb":      {"name": "Airbnb",           "category": "ota",        "auth": "oauth",  "status": "connected"},
    "vrbo":        {"name": "VRBO",             "category": "ota",        "auth": "apiKey", "status": "connected"},
    "booking-com": {"name": "Booking.com",      "category": "ota",        "auth": "apiKey", "status": "disconnected"},
    "stripe":      {"name": "Stripe",           "category": "payment",    "auth": "apiKey", "status": "connected"},
    "paypal":      {"name": "PayPal",           "category": "payment",    "auth": "oauth",  "status": "configured"},
    "august":      {"name": "August Smart Lock","category": "smart-lock", "auth": "oauth",  "status": "connected"},
    "schlage":     {"name": "Schlage Encode",   "category": "smart-lock", "auth": "apiKey", "status": "disconnected"},
    "yale":        {"name": "Yale Access",      "category": "smart-lock", "auth": "oauth",  "status": "disconnected"},
    "quickbooks":  {"name": "QuickBooks Online","category": "accounting", "auth": "oauth",  "status": "configured"},
    "xero":        {"name": "Xero",             "category": "accounting", "auth": "oauth",  "status": "disconnected"},
    "superhog":    {"name": "Superhog",         "category": "insurance",  "auth": "apiKey", "status": "configured"},
}


def handle_tool_call(name: str, input_data: dict) -> str:
    """Simulate the MCP tool execution locally for demo purposes."""
    if name == "list_connectors":
        items = list(CONNECTORS.items())
        if cat := input_data.get("category"):
            items = [(k, v) for k, v in items if v["category"] == cat]
        if st := input_data.get("status"):
            items = [(k, v) for k, v in items if v["status"] == st]
        lines = [f"{'ID':<14} {'Name':<20} {'Category':<12} {'Status':<14}"]
        lines.append("-" * 60)
        for cid, c in items:
            lines.append(f"{cid:<14} {c['name']:<20} {c['category']:<12} {c['status']:<14}")
        return "\n".join(lines)

    if name == "get_connector":
        cid = input_data.get("connectorId", "")
        if cid not in CONNECTORS:
            return f"Connector '{cid}' not found."
        c = CONNECTORS[cid]
        return json.dumps(c, indent=2)

    if name == "check_env_vars":
        cid = input_data.get("connectorId", "")
        if cid not in CONNECTORS:
            return f"Connector '{cid}' not found."
        return f"Environment variable check for '{cid}': simulated — run the MCP server for real results."

    if name == "trigger_sync":
        cid = input_data.get("connectorId", "")
        sync_type = input_data.get("syncType", "full")
        if cid not in CONNECTORS:
            return f"Connector '{cid}' not found."
        if CONNECTORS[cid]["status"] != "connected":
            return f"Cannot sync — '{cid}' is {CONNECTORS[cid]['status']}. Connect first."
        return f"Sync triggered: {cid} ({sync_type}) — success (simulated)"

    return f"Tool '{name}' executed with: {json.dumps(input_data)}"


# ---------------------------------------------------------------------------
# Agentic loop
# ---------------------------------------------------------------------------

def run(prompt: str) -> str:
    """
    Send a prompt to Claude with the connect-apps tools, then handle
    any tool_use blocks in an agentic loop until a final text response.
    """
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        sys.exit("Error: Set ANTHROPIC_API_KEY environment variable.")

    client = anthropic.Anthropic(api_key=api_key)

    messages = [{"role": "user", "content": prompt}]

    system_prompt = (
        "You are the CompliCore integration assistant. You manage external app "
        "connectors for a short-term rental platform. Use the provided tools to "
        "answer questions about connector status, trigger syncs, and diagnose issues. "
        "Always check connector status before attempting operations."
    )

    # Agentic tool-use loop
    while True:
        response = client.messages.create(
            model=MODEL,
            max_tokens=4096,
            system=system_prompt,
            tools=CONNECT_APPS_SKILL["tools"],
            messages=messages,
        )

        # If the model stopped without tool use, return the text
        if response.stop_reason == "end_turn":
            return "\n".join(
                block.text for block in response.content if block.type == "text"
            )

        # Process tool_use blocks
        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                print(f"  → Calling tool: {block.name}({json.dumps(block.input)})")
                result = handle_tool_call(block.name, block.input)
                tool_results.append(
                    {
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": result,
                    }
                )

        # Feed the assistant response + tool results back
        messages.append({"role": "assistant", "content": response.content})
        messages.append({"role": "user", "content": tool_results})


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

EXAMPLE_PROMPTS = [
    "Which connectors are currently connected?",
    "Show me all PMS connectors and their status.",
    "Trigger an availability sync with Airbnb.",
    "Which connectors have errors? How do I fix them?",
    "Check the environment variables for Stripe.",
]


def main():
    if len(sys.argv) > 1:
        prompt = " ".join(sys.argv[1:])
    else:
        print("CompliCore Connect Apps — Anthropic Skills Client")
        print("=" * 50)
        print("\nExample prompts:")
        for i, p in enumerate(EXAMPLE_PROMPTS, 1):
            print(f"  {i}. {p}")
        print()
        prompt = input("Enter prompt (or number 1-5): ").strip()

        if prompt.isdigit() and 1 <= int(prompt) <= len(EXAMPLE_PROMPTS):
            prompt = EXAMPLE_PROMPTS[int(prompt) - 1]

    print(f"\n📡 Prompt: {prompt}\n")
    result = run(prompt)
    print(f"\n{result}")


if __name__ == "__main__":
    main()
