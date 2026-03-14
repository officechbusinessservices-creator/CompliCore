# Quick Start Guide

Get CompliCore up and running in 5 minutes!

## 🚀 Fastest Way to Start

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

```bash
# Development
npm run dev              # Start frontend
cd backend && npm run dev # Start backend

# Building
npm run build            # Build for production
npm run start            # Start production server

# Testing
npm test                 # Run all tests
npm run lint             # Check code quality

# Database
cd backend
npx prisma studio        # Open database GUI
npx prisma migrate dev   # Run migrations
npm run seed             # Seed sample data
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### Database Connection Error

```bash
# Check PostgreSQL is running
brew services list

# Start PostgreSQL
brew services start postgresql@15

# Create database
createdb rental_dev
```

### Module Not Found

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 Learn More

- **[User Guide](./USER_GUIDE.md)** - Complete documentation
- **[Deployment Guide](./DEPLOYMENT.md)** - Production deployment
- **[README](./README.md)** - Full project overview

## 💡 Tips

1. **No Database?** The frontend works standalone with mock data
2. **Want to customize?** Edit files in `src/app/` and see changes instantly
3. **Need help?** Check the [User Guide](./USER_GUIDE.md) or [docs/](./docs/) folder

## 🎉 You're Ready!

Start exploring the platform at [http://localhost:3000](http://localhost:3000)

Happy coding! 🚀
