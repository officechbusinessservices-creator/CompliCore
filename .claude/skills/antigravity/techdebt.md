Scan the CompliCore codebase for technical debt. Report findings in four categories:

**CRITICAL** (blocks production readiness):
- Missing authentication on routes that should be protected
- TODO/FIXME comments in payment or auth code
- Hardcoded secrets or credentials (even test values)
- Disabled security middleware

**HIGH** (fix before next milestone):
- Routes missing Zod input validation
- Prisma queries without select (returning full model)
- Missing error handling in external service calls
- console.log statements in production code paths

**MEDIUM** (fix within this sprint):
- Duplicate code that should be a shared utility
- Inconsistent naming (camelCase vs snake_case mixed)
- Missing TypeScript types (any usage)
- Tests that test implementation rather than behavior

**LOW** (backlog):
- Missing JSDoc on public functions
- Outdated dependency versions
- Unused imports

Scan these directories:
- backend/src/routes/ (all route files)
- backend/src/lib/ (all utility files)
- backend/src/plugins/ (all plugin files)
- src/app/ (all frontend page files)
- src/components/ (all frontend component files)

Format output as a markdown table per category:
| File | Line | Issue | Suggested Fix |

After reporting, ask: "Which category should I fix first?"
Do not fix anything until the user confirms the category.
