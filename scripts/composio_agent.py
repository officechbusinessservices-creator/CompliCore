#!/usr/bin/env python3
"""
CompliCore Connect Apps — Composio + Claude Agent SDK Integration

Uses Composio as an MCP tool router with the Claude Agent SDK to
orchestrate CompliCore's external app integrations and connected services.

Usage:
    # First, authorize OAuth toolkits (one-time per user):
    python scripts/composio_agent.py --authorize gmail google_calendar slack

    # Then run queries:
    python scripts/composio_agent.py "Send an email to ..."

    # Or authorize all default toolkits at once:
    python scripts/composio_agent.py --authorize

Requires:
    pip install composio composio-claude-agent-sdk claude-agent-sdk
"""

import asyncio
import os
import sys
from composio import Composio
from claude_agent_sdk import query, ClaudeAgentOptions

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

COMPOSIO_API_KEY = os.environ.get(
    "COMPOSIO_API_KEY",
    "ak_w93wAW6GPMgAL35pU79F",
)

EXTERNAL_USER_ID = os.environ.get(
    "COMPOSIO_USER_ID",
    "pg-test-d5b191b8-368d-43b0-b89a-8c0f1399e670",
)

CALLBACK_URL = os.environ.get(
    "COMPOSIO_CALLBACK_URL",
    "https://complicore.app/api/composio/callback",
)

# Toolkits that require OAuth authorization before use
OAUTH_TOOLKITS = ["gmail", "google_calendar", "slack", "github"]

SYSTEM_PROMPT = """\
You are the CompliCore operations assistant. You help manage a compliance-first
short-term rental platform. You can:

- Send emails and notifications to hosts, guests, and operations teams
- Manage calendar events for property bookings, cleaning, and maintenance
- Create tasks and tickets for the operations pipeline
- Interact with connected third-party services via Composio

Always confirm destructive actions before proceeding. Be concise and professional.
"""

# ---------------------------------------------------------------------------
# Composio session setup
# ---------------------------------------------------------------------------

def create_session(manage_connections: bool = False):
    """Initialize Composio and return a tool router session.

    Args:
        manage_connections: If True, Composio auto-manages OAuth flows.
            If False (default), you must call authorize_toolkit() manually
            for each OAuth-based service before using its tools.
    """
    composio = Composio(api_key=COMPOSIO_API_KEY)
    session = composio.create(
        user_id=EXTERNAL_USER_ID,
        manage_connections=manage_connections,
    )
    return session


def authorize_toolkit(session, toolkit: str, callback_url: str | None = None) -> str:
    """Manually authorize a user for a specific toolkit via OAuth.

    Returns the redirect URL the user must visit to complete authorization.
    Blocks until the connection is established or times out.
    """
    url = callback_url or CALLBACK_URL

    print(f"\n🔐 Authorizing {toolkit}...")
    connection_request = session.authorize(
        toolkit=toolkit,
        callback_url=url,
    )

    redirect_url = connection_request.redirect_url
    print(f"   Please visit: {redirect_url}")

    # Block until the user completes the OAuth flow
    connected_account = connection_request.wait_for_connection()
    print(f"   ✓ {toolkit} connected (account: {connected_account.id})")

    return connected_account.id


def ensure_toolkits_authorized(session, toolkits: list[str] | None = None):
    """Authorize multiple toolkits interactively.

    Args:
        session: Composio session.
        toolkits: List of toolkit names to authorize.
            Defaults to OAUTH_TOOLKITS if not specified.
    """
    for toolkit in (toolkits or OAUTH_TOOLKITS):
        try:
            authorize_toolkit(session, toolkit)
        except Exception as e:
            print(f"   ✗ {toolkit} authorization failed: {e}")


# ---------------------------------------------------------------------------
# Agent loop
# ---------------------------------------------------------------------------

async def run_agent(prompt: str, session):
    """Send a prompt to Claude via the Agent SDK with Composio MCP tools."""
    options = ClaudeAgentOptions(
        system_prompt=SYSTEM_PROMPT,
        permission_mode="bypassPermissions",
        mcp_servers={
            "composio": {
                "type": session.mcp.type,
                "url": session.mcp.url,
                "headers": session.mcp.headers,
            }
        },
    )

    async for message in query(prompt=prompt, options=options):
        print(message)


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

EXAMPLE_PROMPTS = [
    "Send an email to office.ch.business.services@gmail.com with subject 'CompliCore Sync Report' and body 'All 16 connectors healthy. Last full sync: 2026-03-02 08:30 UTC.'",
    "Create a calendar event for tomorrow at 10am: 'Property #42 deep clean inspection'",
    "List my upcoming calendar events for this week",
    "Send a Slack message to #ops-alerts: 'Hostfully OAuth token expired — re-auth required'",
    "Create a task: 'Renew Booking.com API credentials before March 15'",
]


async def main():
    # --authorize mode: connect OAuth toolkits before querying
    if "--authorize" in sys.argv:
        sys.argv.remove("--authorize")
        toolkits = [a for a in sys.argv[1:] if not a.startswith("-")]
        session = create_session(manage_connections=False)
        ensure_toolkits_authorized(session, toolkits or None)
        print("\n✓ Authorization complete. You can now run queries.")
        return

    session = create_session(manage_connections=False)
    tools = session.tools()
    print(f"Composio session ready — {len(tools)} tools available\n")

    if len(sys.argv) > 1:
        prompt = " ".join(sys.argv[1:])
    else:
        print("CompliCore Composio Agent")
        print("=" * 40)
        print("\nExample prompts:")
        for i, p in enumerate(EXAMPLE_PROMPTS, 1):
            print(f"  {i}. {p[:80]}{'...' if len(p) > 80 else ''}")
        print()
        raw = input("Enter prompt (or number 1-5): ").strip()

        if raw.isdigit() and 1 <= int(raw) <= len(EXAMPLE_PROMPTS):
            prompt = EXAMPLE_PROMPTS[int(raw) - 1]
        else:
            prompt = raw

    print(f"\n📡 Prompt: {prompt}\n")
    await run_agent(prompt, session)


if __name__ == "__main__":
    asyncio.run(main())
