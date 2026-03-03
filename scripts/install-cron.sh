#!/usr/bin/env bash
# ============================================================
# CompliCore — Install 24/7 Cron Schedule (every 6 hours)
# Run this once to register the pipeline with cron.
# ============================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PIPELINE="$SCRIPT_DIR/run-all-agents.sh"
CRON_MARKER="# complicore-agent-pipeline"

# Cron expression: every 6 hours (00:00, 06:00, 12:00, 18:00)
CRON_EXPR="0 */6 * * *"
CRON_LINE="$CRON_EXPR $PIPELINE $CRON_MARKER"

echo "Installing CompliCore agent pipeline cron job..."
echo "  Schedule : every 6 hours (00:00 / 06:00 / 12:00 / 18:00)"
echo "  Script   : $PIPELINE"
echo ""

# Remove any existing ComplicCore cron entry, then add the new one
(crontab -l 2>/dev/null | grep -v "$CRON_MARKER"; echo "$CRON_LINE") | crontab -

echo "✓ Cron job installed. Current crontab:"
crontab -l | grep "$CRON_MARKER"
echo ""
echo "To remove: run  crontab -e  and delete the line containing '$CRON_MARKER'"
