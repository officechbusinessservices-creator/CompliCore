# Architecture Decisions — CompliCore

This file records significant architecture decisions made during development.
Format: ## [DATE] — [TOPIC] with rationale and alternatives considered.

---

## 2026-03-02 — Antigravity System Adopted

**Decision:** Implement the Antigravity parallel worktree + Plan Mode + slash command workflow.

**Rationale:** CompliCore has multiple independent domains (payments, PMS, AI, UI) that can be
developed in parallel without conflicts. Using git worktrees + parallel Claude Code sessions
compresses multi-day sprints into single-day work.

**Alternatives considered:**
- Sequential development on a single branch: ruled out due to time cost
- Feature flags for all parallel work: adds runtime complexity with no benefit here

**Outcome:** See ANTIGRAVITY.md for the full implementation guide.

---
