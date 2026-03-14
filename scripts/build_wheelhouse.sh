#!/usr/bin/env bash
set -euo pipefail

mkdir -p vendor/wheels
python3 -m pip download -r requirements.txt -d vendor/wheels

echo "Wheelhouse built at vendor/wheels"
