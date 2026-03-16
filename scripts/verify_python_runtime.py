from __future__ import annotations

import importlib
import sys

MODULES = [
    "fastapi",
    "uvicorn",
    "sqlalchemy",
    "pydantic",
    "dotenv",
    "temporalio",
    "requests",
]


def main() -> int:
    missing: list[str] = []
    for mod in MODULES:
        try:
            importlib.import_module(mod)
        except Exception:
            missing.append(mod)

    if missing:
        print(f"Python runtime verification failed. Missing: {', '.join(missing)}")
        return 1

    print("Python runtime verified.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
