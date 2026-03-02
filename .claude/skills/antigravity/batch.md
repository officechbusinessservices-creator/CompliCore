Execute a batch of independent tasks in sequence for CompliCore.

$ARGUMENTS

For each task in the list above:
1. Read the relevant file(s) before touching anything
2. Implement the minimal change required
3. Run the appropriate verification:
   - Backend change: `cd backend && npm test`
   - Frontend change: `npm run lint`
   - Schema change: `cd backend && npx prisma validate` (then HALT — do not run migrations)
4. Commit with message: `[type]([scope]): [what was done]`
5. Report result: DONE | FAILED | SKIPPED

Rules:
- If any task FAILS verification, HALT immediately. Report the failure. Do not continue.
- If a task requires a Prisma migration (new model or breaking field change), SKIP it.
  Write the proposed schema change to .claude/notes/schema-requests.md instead.
- Commit each task separately with a clean commit message.
- Do not batch multiple tasks into one commit.
- Report a final summary table: Task | Status | Commit SHA | Notes
