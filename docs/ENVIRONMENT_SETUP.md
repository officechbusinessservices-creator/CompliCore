# Environment Setup Guide

This document explains the environment variable configuration for CompliCore.

## Quick Setup

### Frontend Environment

```bash
# Copy the example file
cp .env.local.example .env.local

# Edit .env.local and update NEXTAUTH_SECRET with a secure random string
# You can generate one with:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Backend Environment

```bash
# Copy the example file
cd backend
cp .env.example .env

# Edit backend/.env and update at minimum:
# - DATABASE_URL: Your PostgreSQL connection string
# - JWT_SECRET: Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
# - PMS_WEBHOOK_SECRET: Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Validation

After setting up your environment files, validate the configuration:

```bash
./scripts/validate-env.sh
```

This script checks:
- ✅ Required files exist (.env.local and backend/.env)
- ✅ Required variables are present
- ✅ Secrets meet minimum length requirements (32+ characters)

## Frontend Variables (.env.local)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE` | Yes | Backend API URL | `http://localhost:4000` |
| `NEXTAUTH_URL` | Yes | Frontend canonical URL | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Yes | NextAuth secret (min 32 chars) | Generate with crypto |
| `DEMO_EMAIL` | No | Demo login email | `demo@complicore.com` |
| `DEMO_PASSWORD` | No | Demo login password | `Demo1234` |

## Backend Variables (backend/.env)

### Critical Variables (Must Change)

| Variable | Required | Description | Default/Example |
|----------|----------|-------------|-----------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string | `postgres://user:pass@localhost:5432/rental_dev` |
| `JWT_SECRET` | Yes | JWT signing secret (min 32 chars) | Generate with crypto |
| `PMS_WEBHOOK_SECRET` | Prod | HMAC secret for PMS webhooks | Generate with crypto |

### Important Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `4000` | Backend server port |
| `ALLOWED_ORIGINS` | `http://localhost:3000` | CORS allowed origins |
| `ENABLE_DEMO_FALLBACK` | `false` | In-memory auth (dev only) |
| `WEBAUTHN_MFA_ENABLED` | `true` | Enable WebAuthn MFA |

See `backend/.env.example` for the complete list of variables.

## Security Notes

### Secret Generation

**Always generate cryptographically secure secrets:**

```bash
# For JWT_SECRET and NEXTAUTH_SECRET (base64 encoded)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# For PMS_WEBHOOK_SECRET (hex encoded)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Production Requirements

In production, ensure:
- ✅ All secrets are strong and unique (never use defaults)
- ✅ `ENABLE_DEMO_FALLBACK=false` (enforced by validation)
- ✅ `COOKIE_SECURE=true` for HTTPS
- ✅ `DB_SSL=true` with proper certificate validation
- ✅ `PMS_WEBHOOK_SECRET` is set and shared with PMS providers
- ✅ Never commit `.env.local` or `backend/.env` files to git

## Troubleshooting

### "NEXTAUTH_SECRET must be at least 32 characters"

Generate a new secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output and set it as `NEXTAUTH_SECRET` in `.env.local`.

### "JWT_SECRET must be at least 32 characters"

Generate a new secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output and set it as `JWT_SECRET` in `backend/.env`.

### "DATABASE_URL is required"

Ensure `DATABASE_URL` is set in `backend/.env`:
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/rental_dev
```

For Docker Compose:
```bash
DATABASE_URL=postgresql://postgres:password@db:5432/rental_dev
```

### Validation Script Fails

Run the validation script to see specific errors:
```bash
./scripts/validate-env.sh
```

Fix any reported issues and run again.

## Files Structure

```
CompliCore/
├── .env.local.example      # Frontend template (committed)
├── .env.local              # Frontend config (gitignored)
├── backend/
│   ├── .env.example        # Backend template (committed)
│   └── .env                # Backend config (gitignored)
└── scripts/
    └── validate-env.sh     # Validation script
```

## Next Steps

After setting up environment variables:

1. **Install dependencies:**
   ```bash
   npm install
   cd backend && npm install
   ```

2. **Set up database (backend only):**
   ```bash
   cd backend
   npx prisma generate
   npx prisma migrate dev
   npm run seed
   ```

3. **Start development servers:**
   ```bash
   # Terminal 1: Frontend
   npm run dev

   # Terminal 2: Backend
   cd backend && npm run dev
   ```

4. **Visit the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000

## Additional Resources

- [README.md](../README.md) - Project overview
- [QUICK_START.md](../QUICK_START.md) - 5-minute setup guide
- [DEPLOYMENT.md](../DEPLOYMENT.md) - Production deployment
- [CLAUDE.md](../CLAUDE.md) - Complete technical reference
