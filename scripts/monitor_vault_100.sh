#!/usr/bin/env bash
set -euo pipefail

API_BASE_URL="${API_BASE_URL:-http://localhost:4000/v1}"
POLL_SECONDS="${POLL_SECONDS:-30}"
MAX_WAIT_MINUTES="${MAX_WAIT_MINUTES:-0}"

echo "[vault-watch] monitoring vault funding via $API_BASE_URL/economic/governance/capital-call/status"

start_epoch="$(date +%s)"
max_wait_seconds=0
if [[ "$MAX_WAIT_MINUTES" -gt 0 ]]; then
  max_wait_seconds=$((MAX_WAIT_MINUTES * 60))
fi

while true; do
  now_utc="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  payload="$(curl -fsS "$API_BASE_URL/economic/governance/capital-call/status")"

  tvv_usd="$(echo "$payload" | jq -r '.tvvUsd // 0')"
  raised_usd="$(echo "$payload" | jq -r '.capitalCall.raisedAmountUsd // 0')"
  target_usd="$(echo "$payload" | jq -r '.capitalCall.targetAmountUsd // 4000000')"
  vault_target=$((tvv_usd + target_usd))
  vault_current=$((tvv_usd + raised_usd))

  progress="$(awk -v c="$vault_current" -v t="$vault_target" 'BEGIN { if (t<=0) { print "0.00" } else { printf "%.2f", (c/t)*100 } }')"
  echo "[$now_utc] vault=$vault_current/$vault_target (${progress}%) expansionRaised=$raised_usd/$target_usd"

  if [[ "$vault_current" -ge "$vault_target" && "$vault_target" -gt 0 ]]; then
    echo "[vault-watch] 🚨 ALERT: Vault is 100% funded. Trigger final operator notification now."
    exit 0
  fi

  if [[ "$max_wait_seconds" -gt 0 ]]; then
    elapsed=$(( $(date +%s) - start_epoch ))
    if [[ "$elapsed" -ge "$max_wait_seconds" ]]; then
      echo "[vault-watch] max wait reached (${MAX_WAIT_MINUTES}m). exiting without 100% trigger"
      exit 2
    fi
  fi

  sleep "$POLL_SECONDS"
done
