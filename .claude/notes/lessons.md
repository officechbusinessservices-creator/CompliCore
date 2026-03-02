# Lessons Learned — CompliCore

Auto-appended at the end of sessions where a non-obvious problem was solved.

Format:
## [DATE] — [TOPIC]
**Problem:** What went wrong or was confusing
**Root cause:** Why
**Solution:** Exact fix
**Prevention:** Rule to add or check next time

---

## 2026-03-02 — Antigravity System Bootstrap

**Problem:** Development velocity was limited by sequential single-session work across multiple
independent feature domains (payments, PMS, AI, UI).

**Root cause:** No established workflow for running parallel Claude Code sessions without
branch conflicts or context contamination.

**Solution:** Implemented the Antigravity System (see ANTIGRAVITY.md):
- Git worktrees for parallel isolation
- Plan Mode protocol before every feature
- Custom slash commands for audit automation
- Notes directory for cross-session coordination

**Prevention:** Always use Plan Mode before touching code that spans more than two files.
Always check .claude/notes/schema-requests.md before running any migration.

---
