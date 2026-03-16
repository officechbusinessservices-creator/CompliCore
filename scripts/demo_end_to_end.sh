#!/usr/bin/env bash
set -euo pipefail

MODE="online"
WHEEL_DIR="./vendor/wheels"
START_SCHEDULER=0
SKIP_INFRA=0
NOHUP_DIR="./.demo-logs"

usage() {
  cat <<USAGE
Usage: bash scripts/demo_end_to_end.sh [options]

Options:
  --online                 Setup Python deps using online mode (default)
  --offline <wheel_dir>    Setup Python deps from local wheelhouse
  --with-scheduler         Also launch scheduler process
  --skip-infra             Skip docker compose up -d
  -h, --help               Show this help message

What this does:
  1) (optional) Starts infrastructure with docker compose up -d
  2) Bootstraps Python environment
  3) Initializes DB schema
  4) Starts API + worker in background
  5) Starts one workflow run
  6) Loads plugin inventory + dispatches plugin command
  7) Queries API endpoints: /health /runs /steps /audit

Background logs:
  $NOHUP_DIR/api.log
  $NOHUP_DIR/worker.log
  $NOHUP_DIR/scheduler.log (if enabled)
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --online)
      MODE="online"
      shift
      ;;
    --offline)
      MODE="offline"
      WHEEL_DIR="${2:?Missing value for --offline <wheel_dir>}"
      shift 2
      ;;
    --with-scheduler)
      START_SCHEDULER=1
      shift
      ;;
    --skip-infra)
      SKIP_INFRA=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown arg: $1"
      usage
      exit 1
      ;;
  esac
done

mkdir -p "$NOHUP_DIR"
DEMO_LOG="$NOHUP_DIR/demo.log"
exec > >(tee -a "$DEMO_LOG") 2>&1

if [[ "$SKIP_INFRA" -eq 0 ]]; then
  echo "[1/7] Starting infrastructure..."
  docker compose up -d
else
  echo "[1/7] Skipping infrastructure startup (--skip-infra)."
fi

echo "[2/7] Bootstrapping Python environment ($MODE)..."
if [[ "$MODE" == "online" ]]; then
  bash scripts/setup_python_env.sh --online
else
  bash scripts/setup_python_env.sh --offline "$WHEEL_DIR"
fi

# shellcheck disable=SC1091
source .venv/bin/activate

echo "[3/7] Initializing DB schema..."
python scripts/init_db.py

echo "[4/7] Starting API on :8000 (background)..."
pkill -f "uvicorn apps.api.main:app" >/dev/null 2>&1 || true
nohup uvicorn apps.api.main:app --host 0.0.0.0 --port 8000 >"$NOHUP_DIR/api.log" 2>&1 &
API_PID=$!
echo "    API PID: $API_PID"

echo "[5/7] Starting worker (background)..."
pkill -f "python apps/worker/run_orchestrator.py" >/dev/null 2>&1 || true
nohup python apps/worker/run_orchestrator.py >"$NOHUP_DIR/worker.log" 2>&1 &
WORKER_PID=$!
echo "    Worker PID: $WORKER_PID"

if [[ "$START_SCHEDULER" -eq 1 ]]; then
  echo "[5b/7] Starting scheduler (background)..."
  pkill -f "python apps/scheduler/run.py" >/dev/null 2>&1 || true
  nohup python apps/scheduler/run.py >"$NOHUP_DIR/scheduler.log" 2>&1 &
  SCHED_PID=$!
  echo "    Scheduler PID: $SCHED_PID"
fi

echo "[6/7] Waiting for API to become healthy..."
for _ in {1..30}; do
  if curl -sf http://localhost:8000/health >/dev/null; then
    break
  fi
  sleep 1
done
curl -s http://localhost:8000/health || true

echo "[7/8] Starting one workflow run + querying outputs..."
python apps/cli/start_workflow.py
curl -s http://localhost:8000/runs
printf "\n"
curl -s http://localhost:8000/steps
printf "\n"
curl -s http://localhost:8000/audit
printf "\n"

echo "[8/8] Plugin load + validate + dispatch demo..."
python scripts/sync_plugins_registry.py || true
curl -s -X POST http://localhost:8000/plugins/load
printf "\n"
curl -s -X POST http://localhost:8000/plugins/validate -H "Content-Type: application/json" -d "{\"plugin_path\":\"plugins/role-ceo\"}"
printf "\n"
curl -s -X POST http://localhost:8000/plugins/dispatch -H "Content-Type: application/json" -d "{\"command\":\"weekly-brief\",\"workspace\":\"complicore\",\"role\":\"ceo\",\"objective\":\"Create weekly CEO brief\",\"constraints\":[\"budget\",\"timebox\"]}"
printf "\n"
curl -s -X POST http://localhost:8000/plugins/validate -H "Content-Type: application/json" -d "{\"plugin_path\":\"plugins/role-marketer\"}"
printf "\n"
curl -s -X POST http://localhost:8000/plugins/dispatch -H "Content-Type: application/json" -d "{\"command\":\"weekly-business-review\",\"workspace\":\"complicore\",\"role\":\"marketer\",\"objective\":\"Generate weekly business review\",\"constraints\":[\"kpis\",\"outcomes\"]}"
printf "\n"
curl -s -X POST http://localhost:8000/plugins/validate -H "Content-Type: application/json" -d "{\"plugin_path\":\"plugins/role-sales\"}"
printf "\n"
curl -s -X POST http://localhost:8000/plugins/dispatch -H "Content-Type: application/json" -d "{\"command\":\"next-followups\",\"workspace\":\"complicore\",\"role\":\"sales\",\"objective\":\"Prepare follow-ups\",\"constraints\":[\"pipeline\",\"open-loops\"]}"
curl -s -X POST http://localhost:8000/plugins/validate -H "Content-Type: application/json" -d "{\"plugin_path\":\"plugins/role-cro\"}"
printf "\n"
curl -s -X POST http://localhost:8000/plugins/dispatch -H "Content-Type: application/json" -d "{\"command\":\"revenue-brief\",\"workspace\":\"complicore\",\"role\":\"cro\",\"objective\":\"Generate CRO revenue brief\",\"constraints\":[\"pipeline\",\"actions\"]}"
printf "\n"
curl -s -X POST http://localhost:8000/programs/partnership-advancement/run -H "Content-Type: application/json" -d "{\"workspace\":\"complicore\",\"owner_role\":\"cro\"}"
printf "\n"
printf "\nDone. Logs in %s\n" "$NOHUP_DIR"
