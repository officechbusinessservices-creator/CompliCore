# CompliCore

CompliCore is a compliance infrastructure platform that embeds regulatory controls, privacy-by-design, and auditability into property operations. It enforces jurisdictional rules across listings, bookings, payments, and communications through secure, vendor-neutral architecture with transparent automation and human oversight.

## Local Development

This workspace contains a Next.js frontend and a minimal Fastify+TypeScript backend for local development.

Quick start (backend):

1. Copy env template:

```bash
cd backend
cp .env.example .env
# edit DATABASE_URL to point to your Postgres
```

2. Install and prepare Prisma (if using database):

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed
```

If you don't have Postgres locally, use Docker Compose (recommended):

```bash
docker compose up -d
cd backend
npx prisma generate
npx prisma db push --accept-data-loss
npm run seed
```

If Docker isn't available, install Postgres locally and update DATABASE_URL.

Example (Homebrew):

```bash
brew install postgresql@15
brew services start postgresql@15
createdb rental_dev
cd backend
cp .env.example .env
open .env  # set DATABASE_URL
npx prisma generate
npx prisma db push --accept-data-loss
npm run seed
```

3. Start backend:

```bash
npm run dev
```

Frontend (root):

1. Create `.env.local` with `NEXT_PUBLIC_API_BASE=http://localhost:4000`
2. Start Next.js: `npm run dev`

Notes:
- Backend has demo fallback data if DB is not configured.
- See `backend/prisma/schema.prisma` for models.

## Privacy & Security Hardening Notes

- **PII minimization**: UI modules only render anonymized listing data by default. Avoid displaying access codes, guest PII, or full addresses in public views.
- **Token handling**: Use short-lived JWT access tokens; store tokens in memory and rotate frequently. Avoid localStorage for sensitive tokens in production.
- **RBAC**: Enforce role-based access (host/admin) on backend routes; audit sensitive operations (bookings, payouts, guest messaging).
- **Data encryption**: Encrypt sensitive fields at rest (e.g., access codes, payment metadata). Enforce TLS in transit for all API calls.
- **Logging**: Redact emails, phone numbers, and access codes from logs. Keep a data-retention policy for audit trails.

## Deployment (Render + Netlify)

### Backend (Render)

1. Create a new **Web Service** in Render.
2. Point to the repo root, then set the **Root Directory** to `backend`.
3. Use `npm install` as the build command and `npm run start` as the start command.
4. Add environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `PORT=4000`
5. Add a managed Postgres instance (or external) and update `DATABASE_URL`.

### Frontend (Netlify)

1. Create a new site in Netlify and link the repo.
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add env var `NEXT_PUBLIC_API_BASE` pointing to the Render backend URL.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
