```markdown
# CompliCore Development Patterns

> Auto-generated skill from repository analysis

## Overview

This skill introduces the core development patterns and workflows used in the CompliCore repository, a Python-based backend with a Next.js frontend. It covers coding conventions, commit styles, and the most common workflows for contributing, maintaining, and documenting the codebase. By following these patterns, contributors can ensure consistency, reliability, and ease of collaboration across the project.

## Coding Conventions

### File Naming

- Use **camelCase** for file names.
  - Example: `userProfile.py`, `dataLoader.js`

### Import Style

- Use **alias imports** to clarify module usage.
  - Python example:
    ```python
    import pandas as pd
    import numpy as np
    ```
  - JavaScript example:
    ```javascript
    import dbClient from './dbClient'
    ```

### Export Style

- Use **default exports** for modules.
  - JavaScript example:
    ```javascript
    export default function handler(req, res) {
      // ...
    }
    ```

### Commit Patterns

- Commit types are mixed, with prefixes such as `docs`, `feat`, `chore`.
- Commit messages are concise (average ~69 characters).

## Workflows

### Add or Update Skill Docs
**Trigger:** When adding new skills or updating documentation for agent skills  
**Command:** `/add-skill-doc`

1. Create or update `SKILL.md` files in one or more of the following directories:
    - `.claude/skills/`
    - `.agent/skills/`
    - `.codebuddy/skills/`
    - `.codex/skills/`
    - `.continue/skills/`
    - `.cursor/skills/`
    - `.gemini/skills/`
2. Optionally, add or update related resource files (e.g., `data/*.csv`, `scripts/*.py`, `templates/*.template`).
3. Update `AGENTS.md` or related index/readme files to reflect the changes.

**Example:**
```bash
# Add a new skill documentation
/add-skill-doc
```

---

### Dependency Bump via Dependabot
**Trigger:** When a dependency update is needed for security, bugfix, or maintenance  
**Command:** `/bump-dependency`

1. Update `package-lock.json` or `requirements.txt` in the relevant directory.
2. Commit with a message referencing 'bump', 'dependabot', and the dependency name/version.

**Example:**
```bash
# Bump a Python dependency
/bump-dependency
```

---

### Add or Update API or Workflow Logic
**Trigger:** When adding new workflows, updating workflow logic, or extending API capabilities  
**Command:** `/add-workflow-logic`

1. Edit or create files such as:
    - `apps/api/main.py`
    - `apps/worker/run_orchestrator.py`
    - `packages/shared/run_store.py`
    - `packages/workflows/operator_copilot.py`
2. Update `Makefile` or `docker-compose.yml` if new services/scripts are needed.
3. Update documentation in `docs/operations/*` if relevant.

**Example:**
```python
# apps/api/main.py
from fastapi import FastAPI

app = FastAPI()

@app.get("/status")
def read_status():
    return {"status": "ok"}
```
```bash
# Add new workflow logic
/add-workflow-logic
```

---

### Add or Update Ops or Deployment Docs
**Trigger:** When improving onboarding, deployment, or operational documentation  
**Command:** `/update-ops-docs`

1. Edit or create files in `docs/operations/`, `deploy/`, or add new `.md` files for deployment.
2. Update `Makefile`, `scripts/*.sh`, or `docker-compose.yml` as needed.
3. Update `QUICK_START.md`, `README.md`, or `requirements.txt`.

**Example:**
```bash
# Update deployment documentation
/update-ops-docs
```

---

### Merge Main or Feature Branch
**Trigger:** When merging a feature branch or synchronizing with main  
**Command:** `/merge-main`

1. Merge main or feature branch, resulting in updates across many files.
2. Resolve conflicts and update documentation, configs, and code as needed.

**Example:**
```bash
# Merge main into your feature branch
git checkout feature/my-feature
git merge main
# Resolve conflicts, then
/merge-main
```

## Testing Patterns

- **Test files** follow the pattern: `*.test.*`
- The specific testing framework is unknown, but typical usage might be:
    - Python: `pytest` or `unittest`
    - JavaScript: `jest` or `vitest`
- Place test files alongside the code or in a dedicated `tests/` directory.

**Example:**
```python
# userProfile.test.py
def test_user_profile_creation():
    assert create_user_profile("Alice") is not None
```

## Commands

| Command             | Purpose                                                      |
|---------------------|--------------------------------------------------------------|
| /add-skill-doc      | Add or update skill documentation in agent/skill directories |
| /bump-dependency    | Bump npm or Python dependencies via dependabot               |
| /add-workflow-logic | Implement or update workflow logic or API endpoints          |
| /update-ops-docs    | Add or update operational/deployment documentation           |
| /merge-main         | Merge main or feature branches and resolve conflicts         |
```
