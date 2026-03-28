# 🚀 Quick Start: Deploy to complicore.live

## Problem Solved ✅
Netlify was failing because it couldn't find Next.js configuration files. All required files have been created and committed locally.

## What You Need to Do (3 Simple Steps)

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.local.example .env.local

# 3. Start the development server
npm run dev
```

**That's it!** Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 What You Get

Without any additional setup, you can explore:

- ✅ **Homepage** - Platform overview and features
- ✅ **Architecture Diagrams** - Interactive system visualizations
- ✅ **Booking Prototype** - Full booking flow demo
- ✅ **Host Dashboard** - Property management interface
- ✅ **API Documentation** - Complete API reference

## 🎯 Next Steps

### Option 1: Explore the Platform (No Setup Required)

Just browse the features:

- Visit `/prototype` for the booking demo
- Check `/diagrams` for architecture visualizations
- Review `/api-docs` for API documentation

### Option 2: Add Backend (Optional)

For full functionality with database:

```bash
# Navigate to backend
cd backend

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Set up database (requires PostgreSQL)
npx prisma generate
npx prisma migrate dev
npm run seed

# Start backend server
npm run dev
```

Backend runs on [http://localhost:4000](http://localhost:4000)

### Option 3: Use Docker (Easiest for Backend)

```bash
# Start PostgreSQL with Docker
docker compose up -d

# Set up database
cd backend
npx prisma generate
npx prisma db push
npm run seed
npm run dev
```

### Option 4: Self-Running Worker Layer (Temporal-style)

Start in this order so agents execute in workers (not in the dashboard):

```bash
docker compose up -d postgres redis temporal qdrant prometheus grafana
uvicorn apps.api.main:app --host 0.0.0.0 --port 8000
python apps.worker.run_orchestrator.py
python apps.worker.run_researcher.py
python apps.worker.run_executor.py
python apps.worker.run_reviewer.py
python apps.worker.run_policy_guard.py
python apps.worker.run_memory_manager.py
python apps.scheduler.run.py
npm --prefix apps/dashboard run dev
```

The dashboard should observe/control runs; workers and scheduler are what make the system self-running.
See [`docs/operations/worker-layer-startup.md`](./docs/operations/worker-layer-startup.md) for the runbook.

## 🔑 Environment Variables

### Minimal Setup (.env.local)

```bash
NEXT_PUBLIC_API_BASE=http://localhost:4000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

### Full Setup (backend/.env)

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/rental_dev
JWT_SECRET=your-jwt-secret
REDIS_URL=redis://localhost:6379
PORT=4000
```

## 📱 Key URLs

| Feature   | URL                                       | Description       |
| --------- | ----------------------------------------- | ----------------- |
| Homepage  | http://localhost:3000                     | Platform overview |
| Prototype | http://localhost:3000/prototype           | Booking demo      |
| Dashboard | http://localhost:3000/prototype/dashboard | Host dashboard    |
| Diagrams  | http://localhost:3000/diagrams            | Architecture      |
| API Docs  | http://localhost:3000/api-docs            | API reference     |
| Login     | http://localhost:3000/login               | Demo login        |

## 🎨 Demo Credentials

```
Email: demo@complicore.com
Password: Demo1234
```

## 🛠️ Common Commands
### Step 1: Get the Patch File
Download the patch file: `0001-next-js-config-fix.patch`

### Step 2: Apply to Your GitHub Repo
```bash
# Clone your repo (if not already cloned)
git clone https://github.com/officechbusinessservices-creator/CompliCore.git
cd CompliCore

# Apply the patch
git apply /path/to/0001-next-js-config-fix.patch

# Push to GitHub
git push origin main
```

### Step 3: Wait for Netlify
Once you push to GitHub, Netlify will automatically:
1. Detect the changes
2. Start a new build with **Node.js** (not Python)
3. Deploy successfully to **complicore.live**

## Files Being Added
- ✅ `package.json` - Node.js dependencies
- ✅ `tsconfig.json` - TypeScript config
- ✅ `next.config.ts` - Next.js config
- ✅ `postcss.config.js` - CSS pipeline
- ✅ `.gitignore` - Git ignore rules

## That's It!
Your site will be live at **complicore.live** once the Netlify build completes (usually 1-3 minutes).

## Need Help?
See `DEPLOYMENT_INSTRUCTIONS.md` for detailed information and alternative methods.
