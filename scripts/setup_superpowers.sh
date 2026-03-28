#!/usr/bin/env bash
set -euo pipefail

MODE="codex"
REPO_URL="https://github.com/obra/superpowers"

usage() {
  cat <<EOF
Usage: bash scripts/setup_superpowers.sh [--mode codex|gemini|claude|cursor|manual]

Modes:
  codex   : print Codex install instruction and create local install note
  gemini  : run 'gemini extensions install https://github.com/obra/superpowers'
  claude  : print Claude marketplace commands
  cursor  : print Cursor plugin command
  manual  : create local install note only
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --mode)
      MODE="${2:?Missing value for --mode}"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1"
      usage
      exit 1
      ;;
  esac
done

mkdir -p docs/operations

cat > docs/operations/superpowers-install-note.md <<EOF
# Superpowers Install Note

Repository: ${REPO_URL}

Codex install instruction:
Fetch and follow instructions from https://raw.githubusercontent.com/obra/superpowers/refs/heads/main/.codex/INSTALL.md

Gemini CLI:
  gemini extensions install https://github.com/obra/superpowers

Claude marketplace:
  /plugin install superpowers@claude-plugins-official

Cursor:
  /add-plugin superpowers
EOF

case "$MODE" in
  codex)
    echo "[INFO] Saved install note to docs/operations/superpowers-install-note.md"
    echo "[INFO] For Codex: Fetch and follow instructions from https://raw.githubusercontent.com/obra/superpowers/refs/heads/main/.codex/INSTALL.md"
    ;;
  gemini)
    if command -v gemini >/dev/null 2>&1; then
      gemini extensions install "$REPO_URL"
    else
      echo "[WARN] gemini CLI not found. See docs/operations/superpowers-install-note.md"
    fi
    ;;
  claude)
    echo "/plugin install superpowers@claude-plugins-official"
    echo "/plugin marketplace add obra/superpowers-marketplace"
    echo "/plugin install superpowers@superpowers-marketplace"
    ;;
  cursor)
    echo "/add-plugin superpowers"
    ;;
  manual)
    echo "[INFO] Saved install note to docs/operations/superpowers-install-note.md"
    ;;
  *)
    echo "Unknown mode: $MODE"
    usage
    exit 1
    ;;
esac
