#!/bin/bash
set -euo pipefail

# Only run in Claude Code remote (web) sessions
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

REPO_ROOT="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"

echo "[session-start] Installing frontend dependencies..."
npm install --prefix "$REPO_ROOT"

echo "[session-start] Installing backend dependencies..."
npm install --prefix "$REPO_ROOT/backend"

echo "[session-start] Generating Prisma client..."
cd "$REPO_ROOT/backend" && npx prisma generate

echo "[session-start] Done."
