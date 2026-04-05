## Render Services

render.yaml defines the full Complicore stack for Render deployment.

### Services

| Service | Type | Purpose |
|---------|------|---------|
| `complicore-web` | Web Service | Next.js frontend (port 3000) |
| `complicore-api` | Web Service | FastAPI backend (port 4000) |
| `complicore-worker` | Background Worker | Temporal orchestrator |
| `complicore-db` | PostgreSQL | Primary database |
| `complicore-redis` | Redis | Cache & message broker |

### External Dependencies

| Service | Setup | Purpose |
|---------|-------|---------|
| Temporal Cloud | Sign up at temporal.io | Workflow orchestration |
| Qdrant Cloud | Sign up at qdrant.tech | Vector embeddings |

### Deploy

```bash
# 1. Connect your GitHub repo to Render
# 2. Import render.yaml
# 3. Set environment variables in Render dashboard
# 4. Deploy
```
