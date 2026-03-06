Perform a performance audit of the CompliCore backend.

Step 1: Scan all files in backend/src/routes/ for N+1 query patterns:
- A Prisma findMany/findFirst inside a .map() or .forEach() loop
- Multiple sequential awaits that could be a single query with include/select
- Missing pagination on list endpoints (returning unbounded result sets)

Step 2: Check Redis cache usage:
- Read backend/src/lib/redis.ts
- Are expensive queries (listings list, analytics) cached?
- Are cache TTLs appropriate for the data?
- Is cache invalidated on mutations?

Step 3: Check for missing database indexes:
- booking.listing_id should be indexed
- booking.status should be indexed
- payment.booking_id should be indexed
- message.booking_id should be indexed

Step 4: Check for unbounded queries (missing take/limit):
- Any findMany() without a `take` parameter is a potential DoS vector

Step 5: Report as a table:
| Route File | Issue Type | Estimated Impact | Priority |

Priority:
- P0: N+1 in hot path (booking list, listing list) — fix immediately
- P1: missing cache on expensive query — fix this sprint
- P2: missing index — add in next migration
- P3: style/cleanup — backlog

Step 6: For each P0 issue:
1. Show the current code
2. Show the optimized version
3. Ask for approval before implementing
