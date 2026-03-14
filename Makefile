.PHONY: infra-up infra-down setup-python install-deps init-db api worker scheduler start-workflow query-workflow venv venv-offline venv-verify wheelhouse

infra-up:
	docker compose up -d

infra-down:
	docker compose down

setup-python:
	bash scripts/setup_python_env.sh --online

install-deps: setup-python

venv:
	bash scripts/setup_python_env.sh --online

venv-offline:
	bash scripts/setup_python_env.sh --offline ./vendor/wheels

venv-verify:
	bash scripts/setup_python_env.sh --verify-only

wheelhouse:
	bash scripts/build_wheelhouse.sh

init-db:
	python scripts/init_db.py

api:
	uvicorn apps.api.main:app --reload --port 8000

worker:
	python apps/worker/run_orchestrator.py

scheduler:
	python apps/scheduler/run.py

start-workflow:
	python apps/cli/start_workflow.py

query-workflow:
	python apps/cli/query_workflow.py
