.PHONY: infra-up infra-down setup-python install-deps init-db api worker scheduler start-workflow query-workflow venv venv-offline venv-verify wheelhouse skills-bootstrap skills-bootstrap-path demo-e2e demo-e2e-offline smoke-full context-gateway plugin-cli plugin-list plugin-inspect sync-plugins

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

skills-bootstrap:
	bash scripts/setup_antigravity_skills.sh

# Usage: make skills-bootstrap-path SKILLS_PATH=/custom/path
skills-bootstrap-path:
	bash scripts/setup_antigravity_skills.sh --path "$(SKILLS_PATH)"

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

demo-e2e:
	bash scripts/demo_end_to_end.sh --online

demo-e2e-offline:
	bash scripts/demo_end_to_end.sh --offline ./vendor/wheels

smoke-full:
	bash scripts/smoke_full.sh

context-gateway:
	uvicorn apps.context_gateway.main:app --reload --port 8010

plugin-cli:
	python apps/cli/plugin_lifecycle.py --help

plugin-list:
	python apps/cli/plugin_lifecycle.py list

# Usage: make plugin-inspect NAME=role-ceo
plugin-inspect:
	python apps/cli/plugin_lifecycle.py inspect "$(NAME)"

sync-plugins:
	python scripts/sync_plugins_registry.py
