# Deployment Guide

This guide covers deploying CompliCore to production environments.

## Prerequisites

- Node.js 20+ installed
- PostgreSQL 16+ database
- Redis instance (optional but recommended)
- Domain name configured
- SSL certificate (handled by hosting providers)

## Environment Setup

### Frontend (.env.local)

```bash
# Copy the example file
cp .env.local.example .env.local

# Required variables:
NEXT_PUBLIC_API_BASE=https://your-backend-url.com
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=generate-a-secure-random-string
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### Backend (backend/.env)

```bash
cd backend
cp .env.example .env

# Required variables:
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=generate-a-secure-random-string
REDIS_URL=redis://host:6379
PORT=4000
NODE_ENV=production
```

## Deployment Options

### Option 1: Netlify (Frontend) + Render (Backend)

#### Deploy Backend to Render

1. **Create a new Web Service** in Render
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: complicore-backend
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Instance Type**: Starter or higher

4. **Add Environment Variables**:
   ```
   DATABASE_URL=<your-postgres-url>
   JWT_SECRET=<generate-secure-key>
   REDIS_URL=<your-redis-url>
   PORT=4000
   NODE_ENV=production
   ```

5. **Add PostgreSQL Database**:
   - Create a new PostgreSQL instance in Render
   - Copy the Internal Database URL
   - Update DATABASE_URL environment variable

6. **Deploy**: Render will automatically deploy on push to main branch

#### Deploy Frontend to Netlify

1. **Create a new site** in Netlify
2. Connect your GitHub repository
3. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Base directory**: (leave empty)

4. **Add Environment Variables**:
   ```
   NEXT_PUBLIC_API_BASE=https://your-backend.onrender.com
   NEXTAUTH_URL=https://your-site.netlify.app
   NEXTAUTH_SECRET=<same-as-backend>
   NEXT_PUBLIC_SITE_URL=https://your-site.netlify.app
   NEXT_PUBLIC_SITE_NAME=CompliCore
   ```

5. **Install Next.js Plugin**: Netlify will automatically detect and install `@netlify/plugin-nextjs`

6. **Deploy**: Push to main branch to trigger deployment

### Option 2: Vercel (All-in-One)

1. **Import Project** to Vercel
2. **Configure Root Directory**: Leave as root for frontend
3. **Add Environment Variables** (same as Netlify above)
4. **Deploy Backend Separately** using Render or Railway

### Option 3: Docker + Cloud Provider

#### Build Docker Images

```bash
# Backend
cd backend
docker build -t complicore-backend .

# Frontend
docker build -t complicore-frontend .
```

#### Deploy to AWS/GCP/Azure

Use your cloud provider's container service:
- AWS: ECS/Fargate
- GCP: Cloud Run
- Azure: Container Instances

## AWS Production Hardening (ECS/EC2/Lambda)

Use this checklist when deploying CompliCore on AWS.

### 1) Secrets & Configuration

- Store runtime secrets in **AWS Secrets Manager** (preferred) or **SSM Parameter Store**.
- Do **not** keep production secrets in `.env` files on disk or in git.
- Rotate at minimum:
  - `JWT_SECRET`
  - `DATABASE_URL` credentials
  - `REDIS_URL` credentials
- Inject secrets at runtime:
  - **ECS**: Task Definition `secrets` from Secrets Manager/SSM
  - **Lambda**: environment + KMS-encrypted values (or extension fetch from Secrets Manager)
  - **EC2**: IAM role + startup fetch script (never bake secrets into AMI)

### 2) TLS, Edge, and Proxy Trust

- Terminate TLS at **ALB** (or CloudFront + ALB).
- Enforce HTTPS redirects at the edge/load balancer.
- Restrict backend security groups to ALB-only ingress.
- If using cookie auth, ensure secure cookie attributes in production:
  - `HttpOnly`
  - `Secure`
  - `SameSite=Lax` (or `Strict` when possible)

### 3) Network & Database Security

- Run app, Redis, and database in private subnets where possible.
- Use **RDS** with TLS (`DB_SSL=true`) and strict cert validation (`DB_SSL_REJECT_UNAUTHORIZED=true`).
- Apply least-privilege DB user permissions (no admin/superuser for app traffic).
- Restrict DB and Redis inbound rules to application security groups only.

### 4) CORS, Rate Limits, and Input Controls

- Set `ALLOWED_ORIGINS` to explicit production frontend domains.
- Keep strict `ALLOWED_METHODS` and `BODY_LIMIT_BYTES` limits.
- Tune `RATE_LIMIT_MAX`/`RATE_LIMIT_WINDOW` for production load + abuse tolerance.
- Keep centralized Zod env + request validation enabled.

### 5) Observability & Detection

- Ship app logs to **CloudWatch Logs** with retention policy.
- Add CloudWatch alarms for:
  - 5XX spike
  - auth failure spike
  - latency and saturation thresholds
- Enable **AWS WAF** on ALB/CloudFront for baseline managed protections.
- Keep CloudTrail enabled for IAM/config auditability.

### 6) Compute Choice Notes

- **ECS/Fargate**: best default for long-running API services.
- **Lambda**: good for event-driven/low-idle workloads; account for cold starts and DB connection strategy.
- **EC2**: highest control, highest ops burden (patching/host hardening required).

## Database Setup

### Run Migrations

```bash
cd backend
npx prisma migrate deploy
npx prisma generate
npm run seed
```

### Backup Strategy

Set up automated backups:
- Render: Automatic daily backups included
- AWS RDS: Configure automated snapshots
- Manual: Use `pg_dump` for PostgreSQL

## Post-Deployment Checklist

- [ ] Verify environment variables are set correctly
- [ ] Test database connection
- [ ] Run database migrations
- [ ] Seed initial data
- [ ] Test API endpoints
- [ ] Verify frontend loads correctly
- [ ] Test authentication flow
- [ ] Check error logging
- [ ] Configure custom domain
- [ ] Set up SSL certificate
- [ ] Configure DNS records
- [ ] Test all major features
- [ ] Set up monitoring (optional)
- [ ] Configure backup strategy

## Custom Domain Setup

### Netlify

1. Go to **Domain settings**
2. Add custom domain
3. Update DNS records:
   ```
   Type: A
   Name: @
   Value: 75.2.60.5

   Type: CNAME
   Name: www
   Value: your-site.netlify.app
   ```

### Render

1. Go to **Settings** → **Custom Domain**
2. Add your domain
3. Update DNS records as instructed

## Monitoring & Logging

### Recommended Tools

- **Error Tracking**: Sentry
- **Analytics**: Plausible or Google Analytics
- **Uptime Monitoring**: UptimeRobot
- **Performance**: Vercel Analytics or Lighthouse CI
- **Public API Sources**: Review available providers in [PUBLIC_APIS.md](./PUBLIC_APIS.md) if you plan to integrate external data feeds.

For Alertmanager Slack notifications, set:

- `ALERTMANAGER_SLACK_WEBHOOK_URL`
- `ALERTMANAGER_SLACK_CHANNEL`

### Setup Sentry (Optional)

```bash
npm install @sentry/nextjs

# Add to next.config.js
const { withSentryConfig } = require('@sentry/nextjs');

# Add SENTRY_DSN to environment variables
```

## Performance Optimization

### Frontend

- Enable image optimization (already configured)
- Use CDN for static assets
- Enable compression (already configured)
- Implement caching headers

### Backend

- Enable Redis caching
- Use connection pooling for database
- Implement rate limiting
- Enable GZIP compression

## Security Checklist

- [ ] HTTPS enabled (SSL certificate)
- [ ] Security headers configured (already in next.config.js)
- [ ] Environment variables secured
- [ ] Database credentials rotated
- [ ] API rate limiting enabled
- [ ] CORS configured properly
- [ ] Input validation enabled
- [ ] SQL injection protection (Prisma ORM)
- [ ] XSS protection enabled
- [ ] CSRF protection enabled
- [ ] Review [SECURITY_GUIDE.md](./SECURITY_GUIDE.md) for Open Deep Research hardening

## Scaling Considerations

### Horizontal Scaling

- Use load balancer (AWS ALB, GCP Load Balancer)
- Deploy multiple backend instances
- Use Redis for session storage
- Implement database read replicas

### Vertical Scaling

- Upgrade instance size on Render/Vercel
- Increase database resources
- Optimize queries and indexes

## Troubleshooting

### Common Issues

**Build fails on Netlify**
- Check Node.js version (should be 20+)
- Verify all dependencies are in package.json
- Check build logs for specific errors

**Database connection fails**
- Verify DATABASE_URL is correct
- Check firewall rules
- Ensure database is running

**API requests fail**
- Verify NEXT_PUBLIC_API_BASE is correct
- Check CORS configuration
- Verify backend is running

**Authentication issues**
- Ensure NEXTAUTH_SECRET matches on frontend/backend
- Verify NEXTAUTH_URL is correct
- Check JWT_SECRET is set

## Rollback Procedure

### Netlify
1. Go to **Deploys**
2. Find previous successful deploy
3. Click **Publish deploy**

### Render
1. Go to **Events**
2. Find previous successful deploy
3. Click **Rollback to this version**

## Blue-Green Production Launch (Docker + Nginx)

For zero-downtime launch and fast rollback, run two isolated environments on the same host:

- **Blue** = current live stack
- **Green** = new candidate stack

Keep Nginx as the single public entrypoint and switch upstream target only after health checks pass.
Both blue and green must point at the same external production database via `DATABASE_URL`.

### Files included in this repo

- `docker-compose.prod.yml` (production-hardened compose stack)
- `deploy/nginx/complicore.conf` (TLS reverse proxy template)

### 1) Prepare production secrets (required)

Create host-level environment values (do not commit secrets):

- `DATABASE_URL`
- `JWT_SECRET`
- `NEXT_PUBLIC_API_BASE`

Also set backend production cookie/transport values:

- `NODE_ENV=production`
- `COOKIE_SECURE=true`
- `DB_SSL=true` (or provider-required value)

### 2) Launch green stack (candidate)

Use a dedicated project name so containers are isolated from blue:

```bash
docker compose -p complicore-green -f docker-compose.prod.yml up -d --build
```

Verify health:

```bash
docker compose -p complicore-green -f docker-compose.prod.yml ps
curl -fsS http://127.0.0.1:3000/ >/dev/null && echo "green web ok"
curl -fsS http://127.0.0.1:4000/health/ready >/dev/null && echo "green api ready ok"
```

### 3) Switch traffic in Nginx

Point Nginx upstream to green and reload:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

Because Nginx is the edge, users should not observe downtime during the switch.

### 4) Instant rollback (if needed)

If error rate or latency spikes, revert Nginx upstream to blue and reload immediately.
Then investigate green while blue continues serving traffic.

### 5) Decommission old blue after stability window

After monitoring confirms stability (for example 30-60 minutes):

```bash
docker compose -p complicore-blue -f docker-compose.prod.yml down
```

## Launch Day Command Checklist

Run these checks immediately before traffic cutover:

1. **Secrets check**

```bash
printenv | grep -E 'SECRET|JWT|DATABASE_URL'
```

2. **Firewall check**

```bash
sudo ufw status
```

Only ports `80`, `443`, and your SSH port should be open publicly.

3. **Smoke test app + DB path**

```bash
docker compose -p complicore-green -f docker-compose.prod.yml up -d --build
curl -fsS http://127.0.0.1:3000/ >/dev/null && echo "frontend ok"
curl -fsS http://127.0.0.1:4000/health/ready >/dev/null && echo "backend ready ok"
```

## Golden Hour Post-Launch Checklist

- **+1 min**: `docker ps` and confirm app containers show healthy status.
- **+5 min**: verify Grafana panels are receiving fresh data points.
- **+15 min**: run smoke flow (login + write action) and confirm DB persistence.
- **+30 min**: verify backup job/status marker exists for launch day window.

## Single Launch Acceptance Checklist (Owners + Status)

Use this as the final go/no-go gate. Proceed only when every row is marked `Done` and evidence is attached.

| Done | # | Acceptance Item | Owner | Status | Evidence |
| --- | --- | --- | --- | --- | --- |
| [ ] | 6 | Custom domain + SSL verified for frontend and backend | `@owner` | `Not Started` | DNS + SSL validation output/screenshots |
| [ ] | 7 | Alerts active (UptimeRobot + Render notifications) | `@owner` | `Not Started` | Triggered test alert + notification receipt |
| [ ] | 8 | Backup + restore drill completed (staging restore executed at least once) | `@owner` | `Not Started` | Restore run log with timestamp/environment |
| [ ] | 9 | Release tag created + rollback path documented and tested | `@owner` | `Not Started` | Tag link + rollback command/log reference |
| [ ] | 10 | Security cleanup complete: rotate placeholder/exposed secrets and keep secrets only in platform env managers | `@owner` | `Not Started` | Rotation record + secret manager audit note |

## Emergency Stop Guidance

Standard safe stop:

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml down --remove-orphans
```

Destructive reset (includes volume removal) — use only for non-production recovery/testing:

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml down --volumes --remove-orphans
```

## Ongoing Security Maintenance Cadence

- **Monthly**: `npm update` and `npm audit` (root and `backend/`).
- **Weekly**: review Grafana error-rate and latency dashboards.
- **Daily**: verify S3/Postgres backup success timestamps and restore readiness.

## Optional: Watchtower Auto-Deploy (Label-Scoped)

`docker-compose.prod.yml` includes an optional `watchtower` service that can auto-apply new container images.

### Safety model

- Auto-updates are **label-scoped only** (`WATCHTOWER_LABEL_ENABLE=true`).
- `web` and `api` are opted-in:
  - `com.centurylinklabs.watchtower.enable=true`
- `db` is explicitly opted-out:
  - `com.centurylinklabs.watchtower.enable=false`

### Important blue-green note

For strict release governance, keep blue-green `release.sh`/`rollback.sh` as your primary deployment path.
Use Watchtower as a convenience only when your image publishing/tagging process is controlled.

### Notifications (recommended)

Set in `.env.prod`:

```bash
WATCHTOWER_NOTIFICATION_URL=slack://token@channel-id
WATCHTOWER_NOTIFICATION_TITLE_TAG=CompliCore-Prod
WATCHTOWER_POLL_INTERVAL=300
TZ=America/New_York
```

Then start/update it with:

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d watchtower
```

## Important Pre-Launch Security Note

If any API keys/tokens were ever committed to git (including examples), treat them as compromised:

1. Rotate exposed tokens immediately.
2. Replace committed values with placeholders.
3. Move runtime secrets to a proper secret manager or server environment.

## Secret Rotation + Graceful Shutdown (Final Polish)

The backend now supports a zero-downtime JWT key rotation window and graceful termination during container restarts.

### JWT key rotation (current + previous)

Set these in backend runtime env:

- `JWT_SECRET` = active signing key
- `JWT_PREVIOUS_SECRET` = previous key (temporary, e.g. 24h overlap)

Rotation workflow:

1. Generate a new strong `JWT_SECRET`.
2. Move old `JWT_SECRET` value into `JWT_PREVIOUS_SECRET`.
3. Deploy.
4. After overlap window, clear `JWT_PREVIOUS_SECRET` and deploy again.

This allows existing sessions signed with the previous key to remain valid during rollout.

### Graceful shutdown behavior

Backend now traps `SIGTERM`/`SIGINT`, closes Fastify cleanly, and exits only after hooks/connections are drained.
This reduces risk of interrupted in-flight requests during Watchtower or blue-green restarts.

## Two-Command Blue-Green Operations (Audited)

To simplify launch/rollback, use:

- `scripts/release.sh` → deploys GREEN, smoke-tests it, then switches live traffic to GREEN.
- `scripts/rollback.sh` → immediately switches live traffic back to BLUE.

### Required prerequisites

1. Nginx site files installed on server:
   - `/etc/nginx/sites-available/complicore-blue.conf`
   - `/etc/nginx/sites-available/complicore-green.conf`
2. Active symlink managed by scripts:
   - `/etc/nginx/sites-enabled/complicore-active.conf`
3. Production env file present at project root:
   - `.env.prod`
4. Blue/green compose override files present:
   - `docker-compose.blue.yml`
   - `docker-compose.green.yml`

### One-time setup

```bash
chmod +x scripts/release.sh scripts/rollback.sh
```

### Deploy release (GREEN live)

```bash
./scripts/release.sh
```

### Emergency rollback (BLUE live)

```bash
./scripts/rollback.sh
```

### Optional env overrides for custom paths

Both scripts support overrides:

- `ENV_FILE`
- `ACTIVE_LINK`
- `GREEN_SITE` (release)
- `BLUE_SITE` (rollback)
- `DOMAIN` (release; informational)

Example:

```bash
ENV_FILE=/opt/complicore/.env.prod ./scripts/release.sh
ACTIVE_LINK=/etc/nginx/sites-enabled/complicore-live.conf ./scripts/rollback.sh
```

## Release Tag Registry

Track every production release here. Add a row each time you tag a release.

| Tag | Commit | Date | Notes |
| --- | --- | --- | --- |
| `release-20260218-073919` | `c903d01` | 2026-02-18 | Post-launch stable checkpoint — health routes + tsconfig fix |
| `release-20260218-074206` | `c903d01` | 2026-02-18 | Post-launch stable checkpoint — duplicate tag (same commit) |

### Create a new release tag (run after every successful deploy)

```bash
cd /Users/eliaschouchani/Downloads/rental-platform-architecture
git fetch origin
COMMIT="$(git rev-parse origin/main)"
TAG="release-$(date +%Y%m%d-%H%M%S)"
git tag -a "$TAG" "$COMMIT" -m "Post-launch stable checkpoint: $TAG"
git push origin "$TAG"
echo "✅ Tagged: $TAG → $COMMIT"
```

### Rollback to a previous release tag

**Render (backend):**
1. Render → `complicore-engine-1` → **Deploys** → find the deploy matching the tag commit → **Redeploy**.
2. Verify: `curl -fsS https://complicore-engine-1.onrender.com/health`

**Netlify (frontend):**
1. Netlify → **Deploys** → find the deploy matching the tag commit → **Publish deploy**.
2. Verify: open frontend URL and confirm it loads.

**Local rollback verification:**
```bash
git fetch origin --tags
git checkout <tag-name>
# verify locally if needed
git checkout main
```

### Rollback success criteria
- `GET /health` returns `{"status":"ok"}`
- `GET /v1/modules/overview` returns data array
- Frontend homepage loads without errors
- Measured time-to-recover recorded in this table

---

## Support

For issues or questions:
- Check documentation in `/docs` folder
- Review operations quick reference in [MAINTENANCE_CHEAT_SHEET.md](./MAINTENANCE_CHEAT_SHEET.md)
- Review API documentation at `/api-docs`
- Contact: support@complicore.com

## Maintenance Mode

To enable maintenance mode:

```bash
# Add to .env.local
NEXT_PUBLIC_MAINTENANCE_MODE=true
```

Create `src/middleware.ts`:
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true') {
    return NextResponse.rewrite(new URL('/maintenance', request.url));
  }
}
```
