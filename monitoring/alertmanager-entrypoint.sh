#!/bin/sh
set -eu

TEMPLATE_CONFIG="/etc/alertmanager/alertmanager.yml"
RENDERED_CONFIG="/tmp/alertmanager.generated.yml"

if [ -z "${ALERTMANAGER_SLACK_WEBHOOK_URL:-}" ]; then
  echo "ERROR: ALERTMANAGER_SLACK_WEBHOOK_URL is required" >&2
  exit 1
fi

if [ -z "${ALERTMANAGER_SLACK_CHANNEL:-}" ]; then
  echo "ERROR: ALERTMANAGER_SLACK_CHANNEL is required" >&2
  exit 1
fi

ESCAPED_WEBHOOK_URL="$(printf '%s' "$ALERTMANAGER_SLACK_WEBHOOK_URL" | sed 's/[&|]/\\&/g')"
ESCAPED_CHANNEL="$(printf '%s' "$ALERTMANAGER_SLACK_CHANNEL" | sed 's/[&|]/\\&/g')"

sed \
  -e "s|__ALERTMANAGER_SLACK_WEBHOOK_URL__|$ESCAPED_WEBHOOK_URL|g" \
  -e "s|__ALERTMANAGER_SLACK_CHANNEL__|$ESCAPED_CHANNEL|g" \
  "$TEMPLATE_CONFIG" > "$RENDERED_CONFIG"

exec /bin/alertmanager --config.file="$RENDERED_CONFIG"
