# Development Environment Setup

This guide documents the setup for running CompliCore in development mode with both frontend and backend servers.

## Prerequisites

- Node.js 20+
- Docker (for PostgreSQL)
- npm

## Quick Start

### 1. Environment Setup

The environment files have been created with secure, cryptographically-generated secrets:

- **Frontend**: `.env.local` (at repository root)
- **Backend**: `.env` (in `backend/` directory)

These files are already configured with:
- Secure JWT secrets (32+ bytes)
- Secure webhook secrets
- Local development URLs
- Demo credentials enabled for backend

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install
```

### 3. Start PostgreSQL Database

```bash
# Start PostgreSQL via Docker
docker compose up -d db

# Verify database is running
docker compose ps db
```

The database will be available at `localhost:5433` (mapped from container port 5432).

### 4. Initialize Database

```bash
# Generate Prisma client and push schema
npx prisma generate
npx prisma db push
```

### 5. Run Development Servers

Open two terminal windows:

#### Terminal 1 — Backend
```bash
cd backend && npm run dev
```

The backend API will start at http://localhost:4000

#### Terminal 2 — Frontend
```bash
npm run dev
```

The frontend will start at http://localhost:3000

## Verification

Once both servers are running:

- **Frontend**: Visit http://localhost:3000 - you should see the CompliCore homepage
- **Backend**: Visit http://localhost:4000 - you should see `{"status":"ok","service":"complicore-backend"}`

## Environment Variables

### Frontend (.env.local)
- `NEXTAUTH_SECRET`: Auto-generated secure secret for NextAuth
- `NEXT_PUBLIC_API_BASE`: Backend API URL (http://localhost:4000)
- `DEMO_EMAIL` / `DEMO_PASSWORD`: Demo login credentials

### Backend (.env)
- `JWT_SECRET`: Auto-generated secure JWT signing secret
- `PMS_WEBHOOK_SECRET`: Auto-generated secure webhook HMAC secret
- `DATABASE_URL`: PostgreSQL connection (postgres://postgres:password@localhost:5433/rental_dev)
- `ENABLE_DEMO_FALLBACK`: Set to `true` for development (uses in-memory auth)

## Notes

- All secrets are cryptographically generated using `crypto.randomBytes(32)`
- Environment files are in `.gitignore` and will not be committed
- The backend uses `ENABLE_DEMO_FALLBACK=true` for development, which enables in-memory authentication
- PostgreSQL is accessible on port 5433 (to avoid conflicts with local PostgreSQL installations)

## Troubleshooting

### Port Already in Use
If port 3000 or 4000 is already in use:
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9
lsof -ti:4000 | xargs kill -9
```

### Database Connection Issues
```bash
# Check database is running
docker compose ps db

# View database logs
docker compose logs db

# Restart database
docker compose restart db
```

### Prisma Client Issues
```bash
# Regenerate Prisma client
npx prisma generate

# Reset database
npx prisma db push --force-reset
```
