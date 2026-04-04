#!/bin/bash
echo "🚀 Starting CompliCore AI Agents with Dozzle monitoring..."

# Start your main stack including Dozzle
docker-compose up -d

echo "📊 Monitoring dashboard: http://localhost:8081"
echo "🔧 Waiting for services to be ready..."
sleep 3

echo ""
echo "✅ Services started!"
docker-compose ps
