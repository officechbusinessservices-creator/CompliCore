Perform a full audit of backend/prisma/schema.prisma.

Step 1: Read backend/prisma/schema.prisma completely.

Step 2: Check each model for:
- Primary key: every model has `id` with `@id`
- Unique constraints: email, confirmation_code, and plan code must be `@unique`
- Relation integrity: both sides of every `@relation` are defined correctly
- Updated timestamps: models needing audit trails have `@updatedAt`
- Index coverage: frequently filtered fields have `@@index`

Step 3: Flag sensitive fields that store PII or credentials:
- access_code, wifi_password, wifi_ssid → should be encrypted at application layer
- guest email/phone → note PII classification

Step 4: Run schema validation:
```
cd backend && npx prisma validate
```

Step 5: Report findings as a markdown table:
| Model | Field | Issue | Recommended Fix | Severity |

Severity levels:
- HIGH: missing @id, broken @relation, missing @unique on unique business keys
- MEDIUM: missing @updatedAt on auditable models, missing indexes on FK fields
- LOW: naming inconsistency, missing comments on sensitive fields

Step 6: For each HIGH severity item, implement the fix immediately.
For MEDIUM and LOW, report and ask for prioritization.
