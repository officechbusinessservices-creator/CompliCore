#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

MODE="online"
WHEEL_DIR="./vendor/wheels"

usage() {
  cat <<USAGE
Usage: bash scripts/bootstrap.sh [--online] [--offline <wheel_dir>] [--skip-infra]
USAGE
}

SKIP_INFRA=0
while [[ $# -gt 0 ]]; do
  case "$1" in
    --online)
      MODE="online"
      shift
      ;;
    --offline)
      MODE="offline"
      WHEEL_DIR="${2:?Missing wheel directory}"
      shift 2
      ;;
    --skip-infra)
      SKIP_INFRA=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown arg: $1"
      usage
      exit 1
      ;;
  esac
done

bash scripts/preflight.sh

if [[ "$SKIP_INFRA" -eq 0 ]]; then
  docker compose up -d
fi

if [[ "$MODE" == "online" ]]; then
  bash scripts/setup_python_env.sh --online
else
  bash scripts/setup_python_env.sh --offline "$WHEEL_DIR"
fi

# shellcheck disable=SC1091
source .venv/bin/activate
python3 scripts/verify_python_runtime.py
python3 scripts/init_db.py
bash scripts/check_services.sh || true

echo "Bootstrap completed."
