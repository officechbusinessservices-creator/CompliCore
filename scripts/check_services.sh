#!/usr/bin/env bash
set -euo pipefail

API_URL="${API_URL:-http://localhost:8000}"
TEMPORAL_UI_URL="${TEMPORAL_UI_URL:-http://localhost:8080}"
QDRANT_URL="${QDRANT_URL:-http://localhost:6333/healthz}"
POSTGRES_CONTAINER="${POSTGRES_CONTAINER:-complicore-postgres}"
REDIS_CONTAINER="${REDIS_CONTAINER:-complicore-redis}"
TEMPORAL_CONTAINER="${TEMPORAL_CONTAINER:-complicore-temporal}"

ok() { echo "[ok] $*"; }
warn() { echo "[warn] $*"; }

if command -v docker >/dev/null 2>&1; then
  for container in "$POSTGRES_CONTAINER" "$REDIS_CONTAINER" "$TEMPORAL_CONTAINER"; do
    if docker ps --format '{{.Names}}' | grep -q "^${container}$"; then
      ok "container running (${container})"
    else
      warn "container not running (${container})"
    fi
  done
else
  warn "docker command not found"
fi

if curl -sf "$API_URL/health" >/dev/null; then
  ok "api healthy ($API_URL/health)"
else
  warn "api not reachable ($API_URL/health)"
fi

if curl -sf "$API_URL/system/health/deep" >/dev/null; then
  ok "deep health endpoint reachable"
else
  warn "deep health endpoint not reachable"
fi

if pgrep -f "python3 apps/worker/run_orchestrator.py|python apps/worker/run_orchestrator.py" >/dev/null; then
  ok "worker process running"
else
  warn "worker process not found"
fi

if pgrep -f "python3 apps/scheduler/run.py|python apps/scheduler/run.py" >/dev/null; then
  ok "scheduler process running"
else
  warn "scheduler process not found"
fi

if curl -sf "$TEMPORAL_UI_URL" >/dev/null; then
  ok "temporal ui reachable ($TEMPORAL_UI_URL)"
else
  warn "temporal ui not reachable ($TEMPORAL_UI_URL)"
fi

if curl -sf "$QDRANT_URL" >/dev/null; then
  ok "qdrant reachable ($QDRANT_URL)"
else
  warn "qdrant not reachable ($QDRANT_URL)"
fi
