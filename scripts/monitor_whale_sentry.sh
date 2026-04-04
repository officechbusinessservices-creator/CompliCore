#!/usr/bin/env bash
set -euo pipefail

API_BASE_URL="${API_BASE_URL:-http://localhost:4000/v1}"
OUT_DIR="${OUT_DIR:-./monitoring/out}"
INTERVAL_SECONDS="${INTERVAL_SECONDS:-300}"
WINDOW_HOURS="${WINDOW_HOURS:-24}"
WHALE_ALERT_THRESHOLD="${WHALE_ALERT_THRESHOLD:-1}"
MAX_ERROR_RATE_PCT="${MAX_ERROR_RATE_PCT:-5}"

mkdir -p "$OUT_DIR"

START_EPOCH="$(date +%s)"
END_EPOCH="$((START_EPOCH + WINDOW_HOURS * 3600))"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
LOG_FILE="$OUT_DIR/whale-sentry-${STAMP}.log"
SUMMARY_FILE="$OUT_DIR/whale-sentry-${STAMP}.summary.json"

echo "[monitor] starting 24h whale/sentry monitor" | tee -a "$LOG_FILE"
echo "[monitor] api=$API_BASE_URL interval=${INTERVAL_SECONDS}s window=${WINDOW_HOURS}h" | tee -a "$LOG_FILE"

iterations=0
error_samples=0
whale_alert_samples=0

while [[ "$(date +%s)" -lt "$END_EPOCH" ]]; do
  iterations=$((iterations + 1))
  now_utc="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

  whale_json="$(curl -fsS "$API_BASE_URL/economic/whale/status")"
  sentry_json="$(curl -fsS "$API_BASE_URL/economic/sentry/events?limit=100")"

  alerts_count="$(echo "$whale_json" | jq -r '.alerts | length')"
  watchlist_count="$(echo "$whale_json" | jq -r '.watchlist | length')"
  sentry_count="$(echo "$sentry_json" | jq -r '.count')"
  failed_count="$(echo "$sentry_json" | jq -r '[.data[] | select(.status == "FAILED")] | length')"

  if [[ "$alerts_count" -ge "$WHALE_ALERT_THRESHOLD" ]]; then
    whale_alert_samples=$((whale_alert_samples + 1))
    echo "[$now_utc] ALERT whale threshold reached: alerts=$alerts_count" | tee -a "$LOG_FILE"
  fi

  if [[ "$sentry_count" -gt 0 ]]; then
    error_rate="$(awk -v f="$failed_count" -v t="$sentry_count" 'BEGIN { printf "%.2f", (f/t)*100 }')"
  else
    error_rate="0.00"
  fi

  awk -v e="$error_rate" -v m="$MAX_ERROR_RATE_PCT" 'BEGIN { if (e > m) exit 0; exit 1 }' && {
    error_samples=$((error_samples + 1))
    echo "[$now_utc] ALERT sentry error rate high: ${error_rate}% > ${MAX_ERROR_RATE_PCT}%" | tee -a "$LOG_FILE"
  } || true

  echo "[$now_utc] sample#$iterations alerts=$alerts_count watchlist=$watchlist_count sentry=$sentry_count failed=$failed_count errorRate=${error_rate}%" | tee -a "$LOG_FILE"
  sleep "$INTERVAL_SECONDS"
done

cat > "$SUMMARY_FILE" <<JSON
{
  "startedAtEpoch": $START_EPOCH,
  "endedAtEpoch": $(date +%s),
  "iterations": $iterations,
  "whaleAlertSamples": $whale_alert_samples,
  "errorSamples": $error_samples,
  "apiBaseUrl": "$API_BASE_URL",
  "intervalSeconds": $INTERVAL_SECONDS,
  "windowHours": $WINDOW_HOURS,
  "logFile": "$LOG_FILE"
}
JSON

echo "[monitor] complete. summary: $SUMMARY_FILE" | tee -a "$LOG_FILE"