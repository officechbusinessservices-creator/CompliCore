# Worker Scaling Playbook (1 → 100+)

This playbook defines the required layered scale path for CompliCore workers.

## Layered scale order

1. Stabilize one worker and verify 10 successful workflow runs in sequence.
2. Split functional queues (orchestrator/planning/research/execution/review/policy/artifact/scheduler/plugin/context).
3. Split worker classes by role.
4. Add bounded worker concurrency and queue-specific limits.
5. Move from manual terminals to supervised processes.
6. Scale by waves (5, 15, 30, 60, 100+ workers).
7. Record worker identity + heartbeat in control plane.
8. Monitor fleet health and queue behavior continuously.

## Worker heartbeat control surface

Use `POST /workers/heartbeat` from each running worker process. Fields include:

- `worker_id`
- `worker_type`
- `queue_name`
- `host`
- `version`
- `status`
- `current_load`
- `max_concurrency`
- `current_workspace`
- `current_role`

Read live state from:

- `GET /workers`
- `GET /fleet/summary`

## Recommended launcher

Use role-based launcher script:

```bash
source .venv/bin/activate
bash scripts/run_worker_class.sh research research-queue 8
```

This sets `WORKER_ROLES`, `TEMPORAL_TASK_QUEUES`, `WORKER_TYPE`, and `WORKER_MAX_CONCURRENCY` before starting `apps/worker/run_orchestrator.py`.

## Scaling profile file

`configs/worker_scaling_plan.json` is the machine-readable source for queues, worker classes, waves, and autoscaling rules.
