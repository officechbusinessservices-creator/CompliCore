---
name: add-or-update-skill-docs
description: Workflow command scaffold for add-or-update-skill-docs in CompliCore.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /add-or-update-skill-docs

Use this workflow when working on **add-or-update-skill-docs** in `CompliCore`.

## Goal

Adds or updates skill documentation, often across multiple agent/skill directories and related resources/scripts.

## Common Files

- `.claude/skills/*/SKILL.md`
- `.agent/skills/*/SKILL.md`
- `.codebuddy/skills/*/SKILL.md`
- `.codex/skills/*/SKILL.md`
- `.continue/skills/*/SKILL.md`
- `.cursor/skills/*/SKILL.md`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Create or update SKILL.md files in one or more .claude/skills/, .agent/skills/, .codebuddy/skills/, .codex/skills/, .continue/skills/, .cursor/skills/, .gemini/skills/ directories
- Optionally add or update related resource files (e.g., data/*.csv, scripts/*.py, templates/*.template)
- Update AGENTS.md or related index/readme files

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.