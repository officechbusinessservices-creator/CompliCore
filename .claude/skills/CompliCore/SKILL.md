# CompliCore Development Patterns

> Auto-generated skill from repository analysis

## Overview

CompliCore is a TypeScript-based compliance management application built with Next.js and Prisma. It features a full-stack architecture with authentication, database management, and CI/CD workflows. The codebase follows consistent patterns for database migrations, API integrations, and testing infrastructure.

## Coding Conventions

### File Naming
- Use **camelCase** for all file names
- Test files follow pattern: `*.test.ts`
- Migration files: `*/migration.sql` in timestamped directories

### Import/Export Style
```typescript
// Use relative imports
import { AuthController } from '../controllers/auth-controller'
import { prismaUserRepo } from './prisma-user-repo'

// Use named exports
export const authService = new AuthService()
export { UserRepository } from './user-repository'
```

### Commit Messages
- Use conventional prefixes: `fix:`, `feat:`, `chore:`
- Keep messages around 63 characters
- Examples: `fix: auth token validation`, `feat: add user dashboard`

## Workflows

### Database Schema Migration
**Trigger:** When adding new database tables or modifying existing schema
**Command:** `/add-database-table`

1. Generate Prisma migration file with descriptive name
2. Update `backend/prisma/schema.prisma` with new models/fields
3. Update related API routes in `backend/src/routes/*.ts`
4. Add comprehensive tests in `backend/src/__tests__/*.test.ts`
5. Run migration locally to verify schema changes

```typescript
// Example schema addition
model ComplianceRecord {
  id        String   @id @default(cuid())
  title     String
  status    String
  userId    String
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}
```

### Pull Request Merge Workflow
**Trigger:** When integrating feature work into main branches
**Command:** `/merge-pr`

1. Create feature branch from main/complicore
2. Submit pull request with clear description
3. Ensure CI checks pass in `.github/workflows/ci.yml`
4. Request code review from team members
5. Merge to main/complicore after approval

### Authentication Enhancement
**Trigger:** When enhancing auth, adding security features, or fixing auth bugs
**Command:** `/enhance-auth`

1. Update auth controllers in `backend/src/controllers/auth-controller.ts`
2. Modify user repositories in `backend/src/lib/prisma-user-repo.ts`
3. Add WebAuthn/security features in `backend/src/lib/webauthn-stepup.ts`
4. Update API tests in `backend/src/__tests__/api.test.ts`
5. Test authentication flows end-to-end

```typescript
// Example auth enhancement
export class AuthController {
  async enhanceStepUp(req: Request, res: Response) {
    const { userId, challenge } = req.body
    const result = await webAuthnStepUp.verify(userId, challenge)
    return res.json({ success: result.verified })
  }
}
```

### Frontend Page API Integration
**Trigger:** When wiring up frontend components to real backend data
**Command:** `/connect-api`

1. Update page components in `src/app/(auth)/*.tsx`
2. Add API client calls in `src/lib/api-client.ts`
3. Update corresponding route handlers in `backend/src/routes/*.ts`
4. Add proper loading and error states to UI components
5. Replace mock data with real API responses

```typescript
// Example API integration
export async function getComplianceData() {
  const response = await fetch('/api/compliance')
  if (!response.ok) throw new Error('Failed to fetch')
  return response.json()
}
```

### CI Workflow Updates
**Trigger:** When fixing build issues or improving automated testing
**Command:** `/fix-ci`

1. Update GitHub Actions workflow in `.github/workflows/ci.yml`
2. Fix database connections and environment setup
3. Update environment variables in `backend/src/lib/env.ts`
4. Test CI pipeline with sample PR
5. Verify all checks pass consistently

### Testing Infrastructure Setup
**Trigger:** When adding tests or improving testing infrastructure
**Command:** `/add-tests`

1. Add test configuration files (`vitest.config.ts`)
2. Create test files following `*.test.tsx` or `*.test.ts` pattern
3. Update package dependencies for testing frameworks
4. Add test utilities in `src/test/` directory
5. Ensure tests run in CI pipeline

```typescript
// Example test structure
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

describe('ComplianceList', () => {
  it('renders compliance items', async () => {
    render(<ComplianceList />)
    expect(screen.getByText('Compliance Records')).toBeInTheDocument()
  })
})
```

### Documentation Updates
**Trigger:** When documenting features, APIs, or setup procedures
**Command:** `/update-docs`

1. Create or update markdown files in `docs/` directory
2. Add comprehensive API documentation
3. Update `README.md`, `CLAUDE.md`, and setup guides
4. Add configuration examples like `.env.local.example`
5. Update `DEV_SETUP.md` with current procedures

## Testing Patterns

CompliCore uses **Vitest** as the primary testing framework:

- Test files use pattern: `*.test.ts` or `*.test.tsx`
- Backend tests in: `backend/src/__tests__/`
- Frontend tests in: `src/test/`
- API tests cover authentication, database operations, and route handlers
- Component tests use React Testing Library for UI components

```typescript
// Backend API test example
describe('Auth API', () => {
  it('should authenticate valid user', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password' })
    
    expect(response.status).toBe(200)
    expect(response.body.token).toBeDefined()
  })
})
```

## Commands

| Command | Purpose |
|---------|---------|
| `/add-database-table` | Generate Prisma migrations and update schema |
| `/merge-pr` | Handle pull request workflow and CI checks |
| `/enhance-auth` | Add or modify authentication features |
| `/connect-api` | Wire frontend components to backend APIs |
| `/fix-ci` | Update and troubleshoot CI/CD pipeline |
| `/add-tests` | Create tests and improve test coverage |
| `/update-docs` | Add or update project documentation |