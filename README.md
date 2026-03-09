# CompliCore - Compliance-First Rental Platform
<img width="6250" height="6250" alt="2" src="https://github.com/user-attachments/assets/fafe9ec5-0a66-4c8d-9481-52ed9ccd1f29" />

[![CI](https://github.com/officechbusinessservices-creator/CompliCore/actions/workflows/ci.yml/badge.svg)](https://github.com/officechbusinessservices-creator/CompliCore/actions/workflows/ci.yml)

CompliCore is a comprehensive, vendor-neutral architecture for short-term rental platforms. Built with privacy-by-design, ethical AI, and global compliance at its core.

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ 
- PostgreSQL 16+ (optional for full backend)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/complicore.git
cd complicore

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the platform.

### Backend Setup (Optional)

```bash
cd backend
cp .env.example .env
# Edit .env with your database URL

# Install dependencies
npm install

# Run database migrations
npx prisma generate
npx prisma migrate dev
npm run seed

# Start backend server
npm run dev
```

Backend runs on [http://localhost:4000](http://localhost:4000)

## ✨ Features

### Core Platform
- 🏠 **Listing Management** - Create and manage property listings
- 📅 **Booking Engine** - Real-time availability and instant booking
- 💳 **Payment Processing** - Secure, PCI-compliant payments
- 💬 **Guest Communications** - Real-time messaging system
- ⭐ **Review System** - Guest and host reviews
- 📊 **Analytics Dashboard** - Performance metrics and insights

### AI-Powered Features
- 💰 **Dynamic Pricing** - Market-based price optimization
- 🤖 **Smart Messaging** - AI-suggested responses
- 📝 **Listing Optimizer** - SEO and content recommendations
- 📈 **Demand Forecasting** - Predictive analytics
- 🔍 **Guest Screening** - Automated risk assessment
- 💭 **Sentiment Analysis** - Review and message analysis

### Integrations
- 🏨 **OTA Channels** - Airbnb, VRBO, Booking.com
- 🔐 **Smart Locks** - Automated access control
- 🏢 **PMS Systems** - Property management integration
- 💼 **Accounting** - QuickBooks, Xero integration
- 🛡️ **Insurance** - Damage protection providers

## 🎯 Key Principles

- **🔒 Privacy by Design** - GDPR/CCPA compliant with data minimization
- **☁️ Vendor Neutral** - Multi-cloud ready, no lock-in
- **🤖 AI with Guardrails** - Transparent, explainable AI
- **🛡️ Security First** - Zero-trust architecture, encryption everywhere

## 📚 Documentation

- **[User Guide](./USER_GUIDE.md)** - Complete user documentation
- **[Deployment Guide](./DEPLOYMENT.md)** - Production deployment instructions
- **[Security Guide](./SECURITY_GUIDE.md)** - Open Deep Research hardening notes
- **[Architecture Overview](./docs/architecture/overview.md)** - Directory structure, frontend/backend design, and integrations
- **[API Endpoints](./docs/api/endpoints.md)** - All REST endpoints with method, auth, and request/response details
- **[Security & Compliance Framework](./docs/security/compliance_framework.md)** - Auth, RBAC, rate limiting, encryption
- **[Performance Optimization Guide](./docs/performance/optimization_guide.md)** - Prisma indexes, caching, Next.js optimizations
- **[Testing Framework](./docs/testing/framework.md)** - Test runner setup, how to run tests, example patterns
- **[API Reference](http://localhost:3000/api-docs)** - Interactive API documentation
- **[Public APIs Catalog](./PUBLIC_APIS.md)** - Full public-apis.org reference list

## 🗺️ Project Structure

```
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── (auth)/            # Authenticated routes
│   │   ├── (portal)/          # User portals
│   │   ├── (prototype)/       # Feature prototypes
│   │   ├── landing/           # Landing pages
│   │   └── api/               # API routes
│   ├── components/            # React components
│   ├── lib/                   # Utility functions
│   └── styles/                # Global styles
├── backend/
│   ├── src/
│   │   ├── routes/            # API routes
│   │   ├── lib/               # Backend utilities
│   │   └── plugins/           # Fastify plugins
│   └── prisma/                # Database schema
├── docs/                      # Architecture documentation
├── specs/                     # OpenAPI specifications
└── database/                  # SQL schemas

```

## 🌐 Live Demo

Explore the platform features:

- **Homepage** - [/](http://localhost:3000)
- **Architecture Diagrams** - [/diagrams](http://localhost:3000/diagrams)
- **Booking Prototype** - [/prototype](http://localhost:3000/prototype)
- **Host Dashboard** - [/prototype/dashboard](http://localhost:3000/prototype/dashboard)
- **API Documentation** - [/api-docs](http://localhost:3000/api-docs)

## 🧪 Testing

```bash
# Run all tests
npm test

# Run backend tests
cd backend && npm test

# Run linting
npm run lint
```

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy Options

**Netlify (Frontend)**
```bash
# Build command
npm run build

# Publish directory
.next
```

**Render (Backend)**
```bash
# Build command
cd backend && npm install && npm run build

# Start command
npm run start
```

**Vercel (All-in-One)**
- Import project from GitHub
- Configure environment variables
- Deploy automatically

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Context
- **Authentication**: NextAuth.js

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Fastify
- **Database**: PostgreSQL 16+
- **ORM**: Prisma
- **Cache**: Redis
- **API**: REST

### Infrastructure
- **Hosting**: Netlify, Vercel, Render
- **Database**: Render PostgreSQL, AWS RDS
- **Storage**: S3-compatible
- **CDN**: Cloudflare, CloudFront
- **Monitoring**: Sentry, Plausible

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔐 Security

Security is our top priority. If you discover a security vulnerability, please email security@complicore.com.

## 📞 Support

- **Email**: support@complicore.com
- **Documentation**: [/docs](./docs/)
- **Issues**: [GitHub Issues](https://github.com/your-org/complicore/issues)

## 🗺️ Roadmap

See [docs/05-ROADMAP.md](./docs/05-ROADMAP.md) for the complete development roadmap.

### Current Phase: MVP (P1)
- ✅ Core platform architecture
- ✅ Booking engine prototype
- ✅ Host dashboard
- ✅ API documentation
- 🚧 Payment integration
- 🚧 Guest messaging
- 📋 Review system

### Coming Soon (P2)
- OTA channel integrations
- Smart lock integration
- Advanced analytics
- Mobile app

---

**CompliCore** - Built with ❤️ for the rental industry

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

## Frontend Setup for HttpOnly Cookie Auth (React/Vue)

When backend auth uses HttpOnly cookies, frontend code should **not** store JWTs in local/session storage.
The browser stores/sends cookies automatically, but only if credentials are enabled.

### React / Next.js (fetch)

```ts
const API = process.env.NEXT_PUBLIC_API_BASE;

await fetch(`${API}/v1/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({ email, password }),
});

const me = await fetch(`${API}/v1/auth/me`, {
  credentials: "include",
});
```

### Vue/React (Axios)

```ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || process.env.NEXT_PUBLIC_API_BASE,
  withCredentials: true,
});
```

### Login state strategy

Because HttpOnly cookies are not readable by JavaScript:

1. On app load, call `/v1/auth/me`.
2. If 200, store returned user profile in app state.
3. If 401, treat as logged out.

### CORS/cookie alignment checklist

- Backend CORS must include exact frontend origin(s): `ALLOWED_ORIGINS`
- Backend must allow credentials (`credentials: true`)
- Frontend must send credentials (`credentials: "include"` or `withCredentials: true`)
- For cross-site production cookies, use:
  - `COOKIE_SECURE=true`
  - `COOKIE_SAME_SITE=none`
  - HTTPS only

## UI Shells & CI Enhancements (Latest)

### Frontend route shells

The app now uses layout groups for clearer IA and future feature expansion:

- `src/app/(public)/layout.tsx`
- `src/app/(auth)/layout.tsx`
- `src/app/(portal)/layout.tsx`
- `src/app/(prototype)/layout.tsx`
- Root wrapper: `src/app/layout.tsx`

Auth placeholders added for key host console screens:

- `src/app/(auth)/dashboard/page.tsx`
- `src/app/(auth)/listings/page.tsx`
- `src/app/(auth)/bookings/page.tsx`
- `src/app/(auth)/pricing/page.tsx`
- `src/app/(auth)/messaging/page.tsx`
- `src/app/(auth)/ops/page.tsx`

### CI workflow upgrades

The CI pipeline now includes coverage for backend tests and a placeholder OpenAPI drift check:

- `.github/workflows/ci.yml`

## Demo Login (NextAuth Credentials)

This project includes a demo login using NextAuth Credentials. Add these to your `.env.local`:

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=change-me
DEMO_EMAIL=demo@complicore.com
DEMO_PASSWORD=Demo1234
```

Login page: `/login`


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
