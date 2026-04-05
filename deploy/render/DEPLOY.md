# Complicore Production Deployment Guide

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Render Cloud                         │
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌───────────────┐ │
│  │  Next.js     │───▶│  FastAPI     │───▶│  Temporal     │ │
│  │  Frontend    │    │  Backend     │    │  Cloud        │ │
│  │  (:3000)     │    │  (:4000)     │    │               │ │
│  └──────┬───────┘    └──────┬───────┘    └───────────────┘ │
│         │                   │                                │
│         ▼                   ▼                                │
│  ┌──────────────┐    ┌──────────────┐                       │
│  │  PostgreSQL  │◀───│  Redis       │                       │
│  │  (Managed)   │    │  (Managed)   │                       │
│  └──────────────┘    └──────────────┘                       │
│                                                             │
│  ┌──────────────┐                                           │
│  │  Background  │                                           │
│  │  Worker      │                                           │
│  │  (Temporal)  │                                           │
│  └──────────────┘                                           │
└─────────────────────────────────────────────────────────────┘
```

## Quick Deploy

### 1. Prepare Your Repository

```bash
# Ensure you're on main with latest changes
git checkout main
git pull origin main

# Run pre-flight check
bash deploy/render/preflight.sh
```

### 2. Connect to Render

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **New +** → **Blueprint**
3. Connect your GitHub repository
4. Render will auto-detect `render.yaml`

### 3. Configure Environment Variables

In the Render dashboard, set these variables (marked as `sync: false` in render.yaml):

| Variable | Description | Example |
|----------|-------------|---------|
| `TEMPORAL_HOST` | Temporal Cloud gRPC endpoint | `complicore.tmprl.cloud:7233` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-proj-...` |
| `ANTHROPIC_API_KEY` | Anthropic API key (optional) | `sk-ant-...` |
| `GEMINI_API_KEY` | Google Gemini API key (optional) | `AIza...` |

Render auto-configures:
- `DATABASE_URL` — from managed PostgreSQL
- `REDIS_URL` — from managed Redis
- `NEXTAUTH_SECRET` — auto-generated
- `NEXT_PUBLIC_API_BASE` — from API service URL

### 4. Deploy

Click **Apply** in the Render Blueprint dashboard. Render will:

1. Provision PostgreSQL 16 database
2. Provision Redis instance
3. Build and deploy Next.js frontend
4. Build and deploy FastAPI backend
5. Start the Temporal worker

### 5. Verify

After deployment completes:

```bash
# Check frontend
curl -I https://complicore-web.onrender.com

# Check API health
curl https://complicore-api.onrender.com/health

# Check Temporal worker logs
# View in Render dashboard → complicore-worker → Logs
```

## Post-Deploy Setup

### Temporal Cloud Setup

1. Sign up at [temporal.io](https://temporal.io)
2. Create a namespace: `complicore-prod`
3. Generate mTLS certificates
4. Add the endpoint to `TEMPORAL_HOST` in Render

### Database Migrations

```bash
# Connect to the Render database
render psql complicore-db

# Create tables
python -c "
from packages.shared.db import engine, Base
from packages.shared.models import *
Base.metadata.create_all(engine)
print('Tables created')
"
```

### Domain Configuration

1. In Render dashboard, go to **complicore-web** → **Settings**
2. Add your custom domain (e.g., `app.complicore.co`)
3. Update DNS with the provided CNAME
4. Render auto-provisions SSL via Let's Encrypt

### Monitoring

- **Grafana**: Access via Render dashboard → complicore-web → Metrics
- **Logs**: Each service has a Logs tab in the Render dashboard
- **Health checks**: All services have built-in health checks

## Cost Estimate

| Service | Plan | Monthly Cost |
|---------|------|-------------|
| Frontend (Web) | Starter | $7 |
| API (Web) | Starter | $7 |
| Worker (Background) | Starter | $7 |
| PostgreSQL | Starter | $7 |
| Redis | Starter | $7 |
| **Total** | | **~$35/mo** |

## Scaling

### Vertical Scaling

Upgrade individual services in Render dashboard:
- **Starter** → **Standard** → **Pro**

### Horizontal Scaling

For the API service:
1. Go to **complicore-api** → **Settings**
2. Increase **Instances** (up to 10 on higher plans)

### Database Scaling

1. Go to **complicore-db** → **Settings**
2. Upgrade plan for more storage and connections

## Troubleshooting

### Frontend 500 Errors

```bash
# Check logs in Render dashboard
# Common causes:
# - NEXT_PUBLIC_API_BASE not set correctly
# - Missing NEXTAUTH_SECRET
# - Build failed (check build logs)
```

### API Connection Refused

```bash
# Check DATABASE_URL is set
# Check Temporal Cloud connectivity
# Verify requirements.txt has all dependencies
```

### Worker Not Processing Jobs

```bash
# Check TEMPORAL_HOST is correct
# Verify Temporal Cloud namespace exists
# Check worker logs for authentication errors
```

### Database Connection Issues

```bash
# Verify DATABASE_URL format:
# postgresql://user:pass@host:5432/dbname
# Check Render database is in "Available" state
```

## Rollback

1. Go to the service in Render dashboard
2. Click **Manual Deploy** → **Deploy a previous commit**
3. Select the commit to roll back to

## Security Checklist

- [x] `NODE_ENV=production`
- [x] `COOKIE_SECURE=true`
- [x] `DB_SSL=true`
- [x] `NEXTAUTH_SECRET` auto-generated (32+ chars)
- [ ] API keys rotated regularly
- [ ] Temporal mTLS certificates configured
- [ ] Database backups enabled (Render auto-backs up)
- [ ] Custom domain with SSL configured
- [ ] Alert notifications configured (Slack/email)
