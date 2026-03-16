#!/usr/bin/env bash
set -euo pipefail

ROLE="${1:-orchestrator}"
QUEUE="${2:-orchestrator-queue}"
CONCURRENCY="${3:-4}"

export WORKER_ROLES="${ROLE}"
export TEMPORAL_TASK_QUEUES="${QUEUE}"
export WORKER_TYPE="${ROLE}"
export WORKER_MAX_CONCURRENCY="${CONCURRENCY}"

python3 apps/worker/run_orchestrator.py
