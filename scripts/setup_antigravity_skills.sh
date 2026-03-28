#!/usr/bin/env bash
set -euo pipefail

SKILLS_PATH="${HOME}/.gemini/antigravity/skills"

usage() {
  echo "Usage: bash scripts/setup_antigravity_skills.sh [--path <skills_path>]"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --path)
      SKILLS_PATH="${2:?Missing value for --path}"
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

mkdir -p "$SKILLS_PATH"

echo "[INFO] Installing Antigravity skills into: $SKILLS_PATH"
npx antigravity-awesome-skills --path "$SKILLS_PATH"
