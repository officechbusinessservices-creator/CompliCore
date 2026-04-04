#!/usr/bin/env bash
set -euo pipefail

MODE="online"
WHEEL_DIR="./vendor/wheels"
VENV_DIR=".venv"

usage() {
  echo "Usage: bash scripts/setup_python_env.sh [--online] [--offline <wheel_dir>] [--verify-only]"
}

print_missing_wheels() {
  local missing_csv="$1"
  while IFS= read -r pkg; do
    [[ -n "$pkg" ]] && echo "        $pkg"
  done < <(tr "," "\n" <<<"$missing_csv")
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --online)
      MODE="online"
      shift
      ;;
    --offline)
      MODE="offline"
      WHEEL_DIR="${2:-./vendor/wheels}"
      shift 2
      ;;
    --verify-only)
      MODE="verify"
      shift
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

python3 -m venv "$VENV_DIR"
# shellcheck disable=SC1091
source "$VENV_DIR/bin/activate"

python3 -m ensurepip --upgrade || true

if [[ "$MODE" == "online" ]]; then
  python3 -m pip install --upgrade pip setuptools wheel || true
  python3 -m pip install -r requirements.txt
elif [[ "$MODE" == "offline" ]]; then
  if [[ ! -d "$WHEEL_DIR" ]]; then
    echo "[ERROR] Offline wheel directory not found: $WHEEL_DIR"
    echo "[HINT] Build artifacts on a connected machine: bash scripts/build_wheelhouse.sh"
    exit 1
  fi

  if ! compgen -G "$WHEEL_DIR/*.whl" >/dev/null; then
    echo "[ERROR] Wheel directory exists but contains no wheel artifacts: $WHEEL_DIR"
    echo "[HINT] This is an artifact provisioning failure, not a script failure."
    echo "[HINT] Populate $WHEEL_DIR with predownloaded wheels from requirements.txt."
    exit 1
  fi

  export WHEEL_DIR
  missing_wheels="$(python3 - <<'PY'
import os
from pathlib import Path

wheel_dir = Path(os.environ["WHEEL_DIR"])
req_path = Path("requirements.txt")

requirements = []
for line in req_path.read_text().splitlines():
    line = line.strip()
    if not line or line.startswith("#"):
        continue
    pkg = line.split("==", 1)[0].strip().lower().replace("-", "_")
    requirements.append(pkg)

wheel_names = [p.name.lower().replace("-", "_") for p in wheel_dir.glob("*.whl")]
missing = []
for req in requirements:
    prefix = req + "_"
    if not any(name.startswith(prefix) for name in wheel_names):
        missing.append(req)

print(",".join(missing))
PY
)"

  if [[ -n "$missing_wheels" ]]; then
    echo "[ERROR] Offline wheelhouse is incomplete. Missing package wheels for:"
    print_missing_wheels "$missing_wheels"
    echo "[HINT] This is an artifact provisioning failure."
    echo "[HINT] Rebuild on connected machine: bash scripts/build_wheelhouse.sh"
    exit 1
  fi

  python3 -m pip install --no-index --find-links="$WHEEL_DIR" -r requirements.txt
elif [[ "$MODE" == "verify" ]]; then
  python3 - <<'PY'
import importlib

mods = [
    "sqlalchemy",
    "dotenv",
    "fastapi",
    "uvicorn",
    "pydantic",
    "redis",
    "temporalio",
    "qdrant_client",
    "httpx",
    "structlog",
    "openai",
    "anthropic",
]
missing = []
for m in mods:
    try:
        importlib.import_module(m)
    except Exception:
        missing.append(m)
if missing:
    print("[ERROR] Missing modules:", ", ".join(missing))
    print("[HINT] Install dependencies first:")
    print("       bash scripts/setup_python_env.sh --online")
    print("       OR bash scripts/setup_python_env.sh --offline ./vendor/wheels")
    raise SystemExit(1)
print("All core modules available.")
PY
fi

echo "Python environment setup complete in mode: $MODE"
