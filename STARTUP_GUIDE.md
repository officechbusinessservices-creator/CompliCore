# 🚀 **CompliCore AI Agents - Startup & Monitoring Guide**

## Quick Start

```bash
cd /Users/eliaschouchani/Complicore/CompliCore
docker-compose up -d
```

**Expected Output:**
```
[+] Running services
 ✔ Network complicore_default    Created
 ✔ Container complicore-redis-1  Started
 ✔ Container complicore-analysis-agent-1    Started
 ✔ Container complicore-template-agent-1    Started
 ✔ Container complicore-filtering-agent-1   Started
 ✔ Container complicore-dozzle   Started
```

---

## ✅ **Verification Commands**

### Check all containers are running
```bash
docker-compose ps
```

**Expected Output:**
```
NAME                            COMMAND                  SERVICE             STATUS              PORTS
complicore-redis-1              "docker-entrypoint.…"    redis               Up                  0.0.0.0:6379→6379/tcp
complicore-analysis-agent-1     "python analysis_age…"   analysis-agent      Up
complicore-template-agent-1     "python template_ag…"    template-agent      Up
complicore-filtering-agent-1    "python filtering_a…"    filtering-agent     Up                  0.0.0.0:8080→8080/tcp
complicore-dozzle              "/dozzle"                 dozzle              Up                  0.0.0.0:8081→8080/tcp
```

### Quick status check
```bash
docker ps --filter "label=com.docker.compose.project=complicore" --format "table {{.Names}}\t{{.Status}}"
```

---

## 📊 **Monitor Real-Time Activity**

### Stream all logs (recommended for development)
```bash
docker-compose logs -f
```

### Watch specific service
```bash
docker-compose logs -f analysis-agent      # Analysis Agent only
docker-compose logs -f template-agent      # Template Agent only
docker-compose logs -f filtering-agent     # Filtering Agent only
docker-compose logs -f redis               # Redis only
```

### Get last N lines
```bash
docker-compose logs --tail=50 -f           # Last 50 lines
docker-compose logs --tail=10 analysis-agent
```

**What you should see:**
```
analysis-agent-1      | INFO: 🔍 Scanning AI Hub (93 projects)...
analysis-agent-1      | INFO: 📊 Analyzing "AI-Powered Video Editor" - categorizing...
analysis-agent-1      | INFO: ✅ Project analysis completed: Video Editor → Creative/Intermediate

template-agent-1      | INFO: 🏗️  Generating template for pattern: video-processing
template-agent-1      | INFO: 📁 Created starter: video_editor_template_v2

filtering-agent-1     | INFO: 🎯 Applying smart filters...
filtering-agent-1     | INFO: 📈 Filtered 12 projects by difficulty: Intermediate
filtering-agent-1     | INFO: 🌐 Dashboard updated: http://localhost:8080

redis-1               | 1:M 05 Jan 12:30:45.000 * Ready to accept connections
```

---

## 🔍 **Health & Resource Monitoring**

### Check individual service logs
```bash
docker-compose logs analysis-agent --tail=20
docker-compose logs template-agent --tail=20
docker-compose logs filtering-agent --tail=20
```

### Monitor resource usage
```bash
# Real-time stats for all containers
docker stats

# Specific format
docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"

# CompliCore containers only
docker stats --filter "label=com.docker.compose.project=complicore"
```

### Check disk space
```bash
docker system df
```

---

## 🎯 **Access Your AI Agents**

| Service | URL | Purpose |
|---------|-----|---------|
| **Web Dashboard** | http://localhost:8080 | Filtering Agent UI - view filtered projects |
| **Dozzle Logs** | http://localhost:8081 | Real-time log viewer for all containers |
| **Redis CLI** | `redis-cli -h localhost -p 6379` | Direct Redis access for debugging |

### Test API connectivity
```bash
# Check filtering agent health
curl http://localhost:8080/health

# List filtered projects
curl http://localhost:8080/projects
```

---

## 🔄 **Service Management**

### Start all services
```bash
docker-compose up -d
```

### Stop all services (without removing data)
```bash
docker-compose down
```

### Stop and remove all data
```bash
docker-compose down -v
```

### Restart a specific service
```bash
docker-compose restart analysis-agent
docker-compose restart template-agent
docker-compose restart filtering-agent
```

### View service logs with timestamps
```bash
docker-compose logs --timestamps -f
```

---

## 📈 **Performance & Scaling**

### Scale analysis agent to 3 instances
```bash
docker-compose up -d --scale analysis-agent=3
```

### Check current scaling
```bash
docker-compose ps | grep analysis-agent
```

### Scale back down
```bash
docker-compose up -d --scale analysis-agent=1
```

---

## 💾 **Data Management**

### Backup Redis data
```bash
docker-compose exec redis redis-cli BGSAVE
docker cp complicore-redis-1:/data/dump.rdb ./redis_backup.rdb
```

### Restore Redis data
```bash
docker cp ./redis_backup.rdb complicore-redis-1:/data/dump.rdb
docker-compose restart redis
```

### Clear Redis cache (WARNING: Clears all task queue)
```bash
docker-compose exec redis redis-cli FLUSHALL
```

### View Redis statistics
```bash
docker-compose exec redis redis-cli INFO stats
```

---

## ⚠️ **Troubleshooting**

### Containers won't start
```bash
# Check detailed logs
docker-compose logs --tail=100

# Verify Docker daemon is running
docker ps

# Check system resources
docker system df
```

### Service crashes repeatedly
```bash
# View exit code
docker-compose ps

# Get detailed error logs
docker-compose logs analysis-agent --tail=50

# Restart with fresh state
docker-compose down -v && docker-compose up -d
```

### High CPU/Memory usage
```bash
# Monitor in real-time
docker stats --no-stream

# Check which container is consuming resources
docker top complicore-analysis-agent-1

# Reduce scale if needed
docker-compose up -d --scale analysis-agent=1
```

### Redis connection issues
```bash
# Test Redis connectivity
docker-compose exec redis redis-cli ping

# Check Redis logs
docker-compose logs redis --tail=20

# Force reconnect agents
docker-compose restart analysis-agent template-agent filtering-agent
```

---

## 🚀 **Automated Startup Script**

Use the provided startup script to automate everything:

```bash
./start-complicore-with-dozzle.sh
```

This will:
- ✅ Start all CompliCore services
- ✅ Start Dozzle log viewer
- ✅ Display service status
- ✅ Show dashboard URL (http://localhost:8081)

---

## 📋 **Complete Workflow Example**

```bash
# 1. Start the system
docker-compose up -d

# 2. Wait for services to stabilize (5-10 seconds)
sleep 10

# 3. Verify all containers are running
docker-compose ps

# 4. Check resource usage
docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"

# 5. Monitor real-time activity
docker-compose logs -f --tail=20

# 6. In another terminal, access the dashboard
open http://localhost:8080  # macOS
# or
xdg-open http://localhost:8080  # Linux
# or
start http://localhost:8080  # Windows

# 7. View logs with Dozzle (optional)
open http://localhost:8081  # macOS
```

---

## 🎯 **What CompliCore Does 24/7**

Once running, your system will:

- **Analysis Agent**
  - ✅ Scans AI Hub for new projects (every 60s)
  - ✅ Categorizes by difficulty & type
  - ✅ Updates project metadata

- **Template Agent**
  - ✅ Detects patterns in projects
  - ✅ Generates starter templates automatically
  - ✅ Stores templates in `/app/data/templates/`

- **Filtering Agent**
  - ✅ Applies smart filters in real-time
  - ✅ Updates web dashboard (http://localhost:8080)
  - ✅ Maintains filtered project cache

- **Redis**
  - ✅ Manages task queue
  - ✅ Stores project metadata
  - ✅ Coordinates agent communication

---

## 📞 **Support Commands**

```bash
# Show all running processes
docker-compose ps -a

# Show container IDs
docker-compose ps --quiet

# Show container IP addresses
docker inspect $(docker-compose ps -q) --format='{{.Name}} - {{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}'

# Export logs to file
docker-compose logs > logs_$(date +%Y%m%d_%H%M%S).txt

# Check for errors in logs
docker-compose logs | grep -i error

# Follow specific pattern in logs
docker-compose logs -f | grep "ERROR\|WARN\|❌"
```

---

## ✨ **Pro Tips**

1. **Keep logs terminal open** - Open a dedicated terminal for `docker-compose logs -f` to watch activity
2. **Use Dozzle** - http://localhost:8081 provides a clean UI for log monitoring
3. **Monitor resources** - Run `docker stats` in another terminal to track CPU/memory
4. **Scale as needed** - Start with 1 analysis-agent, scale up if processing is slow
5. **Backup regularly** - Save Redis dumps weekly with `docker-compose exec redis redis-cli BGSAVE`

Happy analyzing! 🎉
