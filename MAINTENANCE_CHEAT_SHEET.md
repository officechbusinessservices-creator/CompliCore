# 2026 Maintenance Cheat Sheet

Use this quick reference to keep your production containers healthy and responsive.

## Tier-1 Tri-Lens Monitoring (Real-Time)

Use all 3 lenses together:

1. **Command Line Forensics** (raw truth)
2. **Grafana Dashboards** (trends over time)
3. **Synthetic Probes** (real user experience by region)

---

## 0) Production context (CompliCore)

For production commands in this repo, prefer:

`docker compose --env-file .env.prod -f docker-compose.prod.yml <command>`

Examples below include this form where relevant.

## 1) What’s happening now? (Monitoring)

| Command | Action | Purpose |
| --- | --- | --- |
| `docker ps` | List running containers | Verify core services are UP and healthy. |
| `docker stats` | Live resource stream | Inspect CPU, memory, network I/O and regional spikes. |
| `docker compose --env-file .env.prod -f docker-compose.prod.yml top` | List running processes | Identify hot processes in each service. |

### Quick Tier-1 checks

- Containers + health: `docker ps`
- Resource spikes: `docker stats`
- App logs (routing/compliance): `docker compose --env-file .env.prod -f docker-compose.prod.yml logs -f api web`
- DB logs: `docker compose --env-file .env.prod -f docker-compose.prod.yml logs -f db`

## 2) Forensics (Logs)

- Follow all services: `docker compose --env-file .env.prod -f docker-compose.prod.yml logs -f`
- Follow one service: `docker compose --env-file .env.prod -f docker-compose.prod.yml logs -f web` (or `api`, `db`)
- Search logs: `docker compose --env-file .env.prod -f docker-compose.prod.yml logs | grep "500"`
- Recent window: `docker compose --env-file .env.prod -f docker-compose.prod.yml logs --since 30m`

> CCP-201 hint: search for your jurisdiction routing markers in app logs (for example `EU`, `APAC`, `geo-fence`, `residency`, `routing`) to verify policy execution.

## 3) Trend Lens (Grafana Golden Signals)

Track these continuously:

- **Latency** (global + regional): target under your SLO threshold
- **Traffic**: stable throughput by region
- **Error Rate** (5xx): should remain near zero
- **Ledger Integrity / Sync**: target 99.99%
- **APAC geo-fencing sync**: watch for drift from 100%

If dashboards are local, open Grafana from your mapped port (example):

- `open http://localhost:3001`

Use your provisioned dashboard files as reference:

- `monitoring/grafana/dashboards/complicore-dashboard.json`

## 4) User Lens (Synthetic Probes)

Use an external probe service (Pingdom/Uptime Kuma/Site24x7) and configure:

- Probes from **New York, London, Singapore**
- 5-minute checks for:
  - Homepage/API health
  - Login flow (or auth endpoint)
  - Deed creation critical path (synthetic transaction)
- SSL cert expiry alerts

This validates global user experience and catches region-specific routing regressions.

## 5) Sovereign-Specific: Node Sweep / CCP-201 verification

If you expose a dedicated audit tool inside validator containers:

```bash
docker exec <node_container> ccp-audit --region APAC --depth 100
```

If not available, use current stack-safe alternatives:

```bash
# Check recent API logs for APAC residency/routing markers
docker compose --env-file .env.prod -f docker-compose.prod.yml logs --since 30m api | grep -Ei "apac|geo|residency|routing|jurisdiction"

# Check health and error trends quickly
docker compose --env-file .env.prod -f docker-compose.prod.yml ps
docker compose --env-file .env.prod -f docker-compose.prod.yml logs --since 30m api | grep -Ei "error|timeout|5.."
```

## 6) Surgeon mode (Debugging)

- Enter app container shell: `docker exec -it <container_name> sh`
- Test service reachability: `docker exec -it <app_container> ping db`
- Inspect env vars: `docker exec <container_name> env`

## 7) Janitor mode (Cleanup)

- Safe cleanup: `docker system prune`
- Deep cleanup: `docker system prune -a --volumes`

> Caution: verify your DB volume is attached to an active container before deep prune.

## 8) Maintenance mode (Updates)

```bash
# Pull latest images
docker compose pull

# Refresh app service only (keep dependencies untouched)
docker compose up -d --no-deps web

# Confirm health
docker compose ps
```

## 9) Log rotation (prevent disk-full outages)

Add this under services in compose files:

```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

## 10) Watchtower operations (Auto-Deploy)

- Start/update Watchtower only:
  - `docker compose --env-file .env.prod -f docker-compose.prod.yml up -d watchtower`
- Verify Watchtower status:
  - `docker compose -f docker-compose.prod.yml ps watchtower`
- Follow Watchtower actions:
  - `docker compose -f docker-compose.prod.yml logs -f watchtower`

> Keep DB and stateful services opted out with `com.centurylinklabs.watchtower.enable=false`.

---

## Quick Incident Triage

- **Site slow** → `docker stats` + Grafana latency panels
- **Site down** → `docker ps` + `docker compose ... logs --since 15m`
- **Ledger out of sync** → check integrity/sync metrics in Grafana + routing markers in API logs
- **Regional anomaly** → compare probe results (NY/London/Singapore) + APAC/EU/US routing logs
