#!/usr/bin/env bash
set -euo pipefail

DEST="${1:-external_plugins/quarantined/openclaw/upstream}"

if [[ -d "$DEST/.git" ]]; then
  echo "OpenClaw repo already cloned at $DEST"
  exit 0
fi

git clone --depth 1 https://github.com/openclaw/openclaw.git "$DEST"
echo "Cloned openclaw/openclaw to $DEST"
