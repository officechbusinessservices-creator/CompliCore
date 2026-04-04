#!/usr/bin/env bash
set -euo pipefail

# Blue-Green release script
# Deploys GREEN, runs deep readiness + API smoke checks, then switches Nginx live symlink to GREEN.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ENV_FILE:-$ROOT_DIR/.env.prod}"
DOMAIN="${DOMAIN:-yourdomain.com}"
ACTIVE_LINK="${ACTIVE_LINK:-/etc/nginx/sites-enabled/complicore-active.conf}"
GREEN_SITE="${GREEN_SITE:-/etc/nginx/sites-available/complicore-green.conf}"
GREEN_WEB_URL="${GREEN_WEB_URL:-http://127.0.0.1:3002}"
GREEN_API_URL="${GREEN_API_URL:-http://127.0.0.1:4002}"
SMOKE_MAX_RETRIES="${SMOKE_MAX_RETRIES:-30}"
SMOKE_RETRY_SLEEP_SECONDS="${SMOKE_RETRY_SLEEP_SECONDS:-2}"

cd "$ROOT_DIR"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "ERROR: env file not found: $ENV_FILE"
  exit 1
fi

read_env_value() {
  local key="$1"
  awk -F= -v target="$key" '$1 == target {sub(/^[^=]*=/, "", $0); print $0; exit}' "$ENV_FILE"
}

for key in DATABASE_URL JWT_SECRET NEXT_PUBLIC_API_BASE; do
  value="$(read_env_value "$key" || true)"
  if [[ -z "${value:-}" ]]; then
    echo "ERROR: missing required key in $ENV_FILE: $key"
    exit 1
  fi
done

DATABASE_URL_VALUE="$(read_env_value DATABASE_URL)"
JWT_SECRET_VALUE="$(read_env_value JWT_SECRET)"

if [[ "${#JWT_SECRET_VALUE}" -lt 32 ]]; then
  echo "ERROR: JWT_SECRET must be at least 32 characters."
  exit 1
fi

if [[ "$DATABASE_URL_VALUE" =~ @(db|localhost|127\.0\.0\.1)(:|/|$) ]]; then
  echo "ERROR: DATABASE_URL points to a local/per-stack host ($DATABASE_URL_VALUE)."
  echo "       Use a shared production DB endpoint so blue/green deploys use the same database safely."
  exit 1
fi

echo "[1/5] Deploying GREEN stack (web+api)..."
docker compose \
  --env-file "$ENV_FILE" \
  -p complicore-green \
  -f docker-compose.prod.yml \
  -f docker-compose.green.yml \
  up -d --build --remove-orphans web api

echo "[2/5] Running deep readiness checks on GREEN..."
for i in $(seq 1 "$SMOKE_MAX_RETRIES"); do
  if curl -fsS "$GREEN_WEB_URL/" >/dev/null \
    && curl -fsS "$GREEN_API_URL/health" >/dev/null \
    && curl -fsS "$GREEN_API_URL/health/ready" >/dev/null; then
    break
  fi
  if [[ "$i" -eq "$SMOKE_MAX_RETRIES" ]]; then
    echo "ERROR: readiness checks failed after retries"
    exit 1
  fi
  sleep "$SMOKE_RETRY_SLEEP_SECONDS"
done

echo "[3/5] Running API smoke flow on GREEN (/v1)..."
SMOKE_EMAIL="release-smoke-$(date +%s)-$RANDOM@example.com"
SMOKE_PASSWORD="ReleaseSmoke123!"
REGISTER_BODY_FILE="$(mktemp)"
LOGIN_BODY_FILE="$(mktemp)"
BOOKING_BODY_FILE="$(mktemp)"
trap 'rm -f "$REGISTER_BODY_FILE" "$LOGIN_BODY_FILE" "$BOOKING_BODY_FILE"' EXIT

REGISTER_PAYLOAD="$(printf '{"email":"%s","password":"%s","firstName":"Release","lastName":"Smoke","role":"host"}' "$SMOKE_EMAIL" "$SMOKE_PASSWORD")"
register_status="$(curl -sS -o "$REGISTER_BODY_FILE" -w '%{http_code}' \
  -X POST "$GREEN_API_URL/v1/auth/register" \
  -H "Content-Type: application/json" \
  --data "$REGISTER_PAYLOAD")"

if [[ "$register_status" != "201" ]]; then
  echo "ERROR: /v1/auth/register smoke failed with status $register_status"
  cat "$REGISTER_BODY_FILE"
  exit 1
fi

ACCESS_TOKEN="$(sed -n 's/.*"accessToken":"\([^"]*\)".*/\1/p' "$REGISTER_BODY_FILE" | head -n1)"
if [[ -z "$ACCESS_TOKEN" ]]; then
  LOGIN_PAYLOAD="$(printf '{"email":"%s","password":"%s"}' "$SMOKE_EMAIL" "$SMOKE_PASSWORD")"
  login_status="$(curl -sS -o "$LOGIN_BODY_FILE" -w '%{http_code}' \
    -X POST "$GREEN_API_URL/v1/auth/login" \
    -H "Content-Type: application/json" \
    --data "$LOGIN_PAYLOAD")"
  if [[ "$login_status" != "200" ]]; then
    echo "ERROR: /v1/auth/login smoke failed with status $login_status"
    cat "$LOGIN_BODY_FILE"
    exit 1
  fi
  ACCESS_TOKEN="$(sed -n 's/.*"accessToken":"\([^"]*\)".*/\1/p' "$LOGIN_BODY_FILE" | head -n1)"
fi

if [[ -z "$ACCESS_TOKEN" ]]; then
  echo "ERROR: smoke flow did not receive accessToken"
  exit 1
fi

BOOKING_PAYLOAD="$(printf '{"confirmation_code":"RLS-%s","listing_id":1,"guest_name":"Release Smoke","property":"Release Candidate","check_in":"2026-03-10","check_out":"2026-03-12"}' "$(date +%s)")"
booking_status="$(curl -sS -o "$BOOKING_BODY_FILE" -w '%{http_code}' \
  -X POST "$GREEN_API_URL/v1/bookings" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  --data "$BOOKING_PAYLOAD")"

if [[ "$booking_status" != "200" ]]; then
  echo "ERROR: /v1/bookings smoke failed with status $booking_status"
  cat "$BOOKING_BODY_FILE"
  exit 1
fi

logout_status="$(curl -sS -o /dev/null -w '%{http_code}' -X POST "$GREEN_API_URL/v1/auth/logout")"
if [[ "$logout_status" != "200" ]]; then
  echo "ERROR: /v1/auth/logout smoke failed with status $logout_status"
  exit 1
fi

echo "[4/5] Switching Nginx live traffic to GREEN..."
sudo ln -sfn "$GREEN_SITE" "$ACTIVE_LINK"
sudo nginx -t
sudo systemctl reload nginx

echo "[5/5] Done. GREEN is now live for domain: $DOMAIN"
echo "Tip: If needed, rollback with: ./scripts/rollback.sh"
