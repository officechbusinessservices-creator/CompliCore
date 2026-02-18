#!/usr/bin/env bash
set -euo pipefail

# Blue-Green rollback script
# Switches Nginx live symlink back to BLUE immediately.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ACTIVE_LINK="${ACTIVE_LINK:-/etc/nginx/sites-enabled/complicore-active.conf}"
BLUE_SITE="${BLUE_SITE:-/etc/nginx/sites-available/complicore-blue.conf}"

cd "$ROOT_DIR"

echo "[1/2] Switching Nginx live traffic to BLUE..."
sudo ln -sfn "$BLUE_SITE" "$ACTIVE_LINK"
sudo nginx -t
sudo systemctl reload nginx

echo "[2/2] Done. BLUE is now live."
echo "Tip: Inspect GREEN logs with: docker compose -p complicore-green -f docker-compose.prod.yml -f docker-compose.green.yml logs --tail=200"
