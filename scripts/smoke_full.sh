#!/usr/bin/env bash
set -euo pipefail

LOG_DIR=".smoke-logs"
mkdir -p "$LOG_DIR"

cleanup() {
  pkill -f "uvicorn apps.api.main:app" >/dev/null 2>&1 || true
  pkill -f "python apps/worker/run_orchestrator.py" >/dev/null 2>&1 || true
}
trap cleanup EXIT

echo "[1/10] setup python env"
bash scripts/setup_python_env.sh --online
source .venv/bin/activate

echo "[2/10] init db"
python scripts/init_db.py

echo "[3/10] infra up"
docker compose up -d

echo "[4/10] api health"
nohup uvicorn apps.api.main:app --host 0.0.0.0 --port 8000 >"$LOG_DIR/api.log" 2>&1 &
for _ in {1..40}; do
  curl -sf http://localhost:8000/health >/dev/null && break
  sleep 1
done
curl -sf http://localhost:8000/system/health/deep >/dev/null

echo "[5/10] worker boot"
nohup python apps/worker/run_orchestrator.py >"$LOG_DIR/worker.log" 2>&1 &
sleep 3

echo "[6/10] workflow start (approval path)"
START_OUTPUT=$(python apps/cli/start_workflow.py --objective "Smoke full" --workspace complicore --role ceo --no-wait)
echo "$START_OUTPUT"
RUN_ID=$(python - <<'PY'
import ast,sys
print(ast.literal_eval(sys.stdin.read())["db_run_id"])
PY
<<< "$START_OUTPUT")

echo "[7/10] verify approval pending"
for _ in {1..40}; do
  APPROVALS=$(curl -sf http://localhost:8000/approvals)
  if [[ "$APPROVALS" != "[]" ]]; then
    break
  fi
  sleep 1
done
APPROVAL_ID=$(python - <<'PY'
import json,sys
rows=json.loads(sys.stdin.read())
print(rows[0]["id"])
PY
<<< "$APPROVALS")

echo "[8/10] approve"
curl -sf -X POST "http://localhost:8000/approvals/${APPROVAL_ID}/decision" \
  -H "Content-Type: application/json" \
  -d '{"decision":"approve","decided_by":"smoke-test"}' >/dev/null

echo "[9/10] verify completion + audit + artifact"
for _ in {1..60}; do
  STATUS=$(curl -sf "http://localhost:8000/workflow/${RUN_ID}/status")
  if python - <<'PY'
import json,sys
obj=json.loads(sys.stdin.read())
print(obj["status"])
PY
<<< "$STATUS" | grep -q "completed"; then
    break
  fi
  sleep 1
done

curl -sf "http://localhost:8000/audit" >/dev/null
DETAIL=$(curl -sf "http://localhost:8000/workflow/${RUN_ID}")
python - <<'PY'
import json,sys
obj=json.loads(sys.stdin.read())
assert len(obj["artifacts"]) > 0, "expected artifact"
print("artifact ok")
PY
<<< "$DETAIL"

echo "[10/10] metrics summary"
curl -sf "http://localhost:8000/metrics/summary" >/dev/null

echo "smoke_full.sh passed"
