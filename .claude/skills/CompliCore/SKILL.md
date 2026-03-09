# CompliCore Development Patterns

> Auto-generated skill from repository analysis

## Overview

CompliCore is a Next.js TypeScript application focused on compliance management with a full-stack architecture. The codebase follows modern development practices with a backend API, authenticated dashboard features, database management through Prisma, and comprehensive testing with Vitest. The project emphasizes clean code organization, proper authentication flows, and robust CI/CD processes.

## Coding Conventions

### File Naming
- Use **camelCase** for all file names
- Test files follow the pattern `*.test.ts`
- Page components use `page.tsx` in Next.js app directory structure

### Import/Export Style
- Use **relative imports** for local modules
- Prefer **named exports** over default exports
- Example:
```typescript
// Import style
import { AuthController } from '../controllers/auth-controller'
import { prisma } from '../../lib/prisma'

// Export style
export const userService = {
  // implementation
}

export { validateToken, generateJWT }
```

### Commit Convention
- Use prefixes: `fix:`, `feat:`, `chore:`
- Keep messages around 63 characters
- Examples:
  - `feat: add user dashboard authentication flow`
  - `fix: resolve CI pipeline deployment issues`
  - `chore: update prisma schema for new model`

## Workflows

### Merge Pull Request Workflow
**Trigger:** When merging feature branches or coordinating between main/complicore branches
**Command:** `/merge-pr`

1. Create pull request from feature branch to target branch
2. Review code changes and ensure CI passes
3. Address any review feedback or conflicts
4. Merge to target branch using appropriate merge strategy
5. Update branch references and clean up feature branch
6. Verify deployment pipeline runs successfully

### Fix Build Deployment Issues
**Trigger:** When build fails or deployment configuration needs updates
**Command:** `/fix-ci`

1. Identify the specific build or deployment failure from CI logs
2. Update CI configuration in `.github/workflows/ci.yml` if needed
3. Fix environment variables in `backend/src/lib/env.ts`
4. Update dependencies in `package.json` and `package-lock.json`
5. Validate pipeline runs successfully
6. Test deployment in staging environment

Example environment config:
```typescript
// backend/src/lib/env.ts
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  NODE_ENV: z.enum(['development', 'production', 'test'])
})

export const env = envSchema.parse(process.env)
```

### Database Schema Migration
**Trigger:** When adding new database tables or modifying existing schema
**Command:** `/add-model`

1. Update Prisma schema in `backend/prisma/schema.prisma`
2. Generate migration files using `npx prisma migrate dev`
3. Apply database migrations to development environment
4. Update related API endpoints in `backend/src/routes/`
5. Update TypeScript types and Prisma client usage
6. Test database operations in `backend/src/lib/prisma.ts`

Example schema addition:
```prisma
// backend/prisma/schema.prisma
model ComplianceRecord {
  id          String   @id @default(cuid())
  title       String
  status      Status   @default(PENDING)
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Auth Dashboard Feature Development
**Trigger:** When adding new authenticated user features or dashboard pages
**Command:** `/add-auth-page`

1. Create new page component in `src/app/(auth)/[feature]/page.tsx`
2. Integrate with backend APIs via `src/lib/api-client.ts`
3. Add authentication checks and middleware
4. Update routing and navigation components
5. Implement corresponding backend routes in `backend/src/routes/`
6. Update auth controller in `backend/src/controllers/auth-controller.ts`

Example authenticated page:
```typescript
// src/app/(auth)/dashboard/page.tsx
import { AuthGuard } from '@/components/auth/AuthGuard'
import { DashboardContent } from '@/components/dashboard/DashboardContent'

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}
```

### Backend API Testing
**Trigger:** When implementing new API endpoints or fixing backend functionality
**Command:** `/add-api-tests`

1. Write API integration tests in `backend/src/__tests__/`
2. Add test data setup and teardown procedures
3. Test authentication flows and protected endpoints
4. Validate API contracts and response schemas
5. Test error handling and edge cases
6. Ensure test coverage meets project standards

Example API test:
```typescript
// backend/src/__tests__/api.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../app'

describe('Auth API', () => {
  beforeEach(async () => {
    // Setup test data
  })

  it('should authenticate valid user', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password' })
    
    expect(response.status).toBe(200)
    expect(response.body.token).toBeDefined()
  })
})
```

### Documentation Updates
**Trigger:** When updating project structure, APIs, or development processes
**Command:** `/update-docs`

1. Update relevant documentation files (`README.md`, `CLAUDE.md`, etc.)
2. Add technical specifications for new features
3. Update setup guides in `DEV_SETUP.md`
4. Document API changes and breaking changes
5. Update `CHANGELOG.md` with version information
6. Review and update inline code documentation

## Testing Patterns

### Framework: Vitest
- Test files use `*.test.ts` pattern
- Focus on integration tests for API endpoints
- Include authentication flow testing
- Use proper setup/teardown for database state

### Example Test Structure:
```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

describe('Feature Name', () => {
  beforeEach(async () => {
    // Setup test environment
  })

  afterEach(async () => {
    // Cleanup test data
  })

  it('should handle specific case', async () => {
    // Test implementation
  })
})
```

## Commands

| Command | Purpose |
|---------|---------|
| `/merge-pr` | Execute standard pull request merge workflow |
| `/fix-ci` | Resolve CI/CD pipeline and deployment issues |
| `/add-model` | Add new database model with migrations |
| `/add-auth-page` | Create authenticated dashboard feature |
| `/add-api-tests` | Write comprehensive backend API tests |
| `/update-docs` | Update project documentation and guides |