#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

ok() { echo "[ok] $*"; }
fail() { echo "[fail] $*"; exit 1; }

[[ -f docker-compose.yml ]] || fail "missing docker-compose.yml"
[[ -f requirements.txt ]] || fail "missing requirements.txt"
[[ -f scripts/check_services.sh ]] || fail "missing scripts/check_services.sh"
[[ -f scripts/init_db.py ]] || fail "missing scripts/init_db.py"
[[ -f apps/api/main.py ]] || fail "missing apps/api/main.py"
[[ -f apps/worker/run_orchestrator.py ]] || fail "missing apps/worker/run_orchestrator.py"
[[ -f apps/scheduler/run.py ]] || fail "missing apps/scheduler/run.py"
[[ -f apps/cli/start_workflow.py ]] || fail "missing apps/cli/start_workflow.py"
[[ -f apps/cli/query_workflow.py ]] || fail "missing apps/cli/query_workflow.py"

if [[ -f .env ]]; then
  ok "found .env"
else
  echo "[warn] .env missing (runtime may fail if DATABASE_URL or API keys are required)"
fi

command -v python3 >/dev/null 2>&1 || fail "python3 not found"
ok "python3 found: $(python3 --version 2>/dev/null)"

if command -v docker >/dev/null 2>&1; then
  ok "docker found: $(docker --version 2>/dev/null | head -n1)"
else
  fail "docker not found"
fi

if docker compose version >/dev/null 2>&1; then
  ok "docker compose found"
else
  fail "docker compose not available"
fi

echo "Preflight passed."
