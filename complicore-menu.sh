#!/bin/bash

# CompliCore Interactive Menu
set -e

show_menu() {
    clear
    cat << 'EOF'
╔════════════════════════════════════════════════════════════════════════════╗
║                  🎯 CompliCore AI Agents - Main Menu                       ║
╚════════════════════════════════════════════════════════════════════════════╝

EOF
    
    echo "📊 Service Status:"
    docker-compose ps 2>/dev/null | tail -n +2 || echo "  ⚠️  Services not running"
    
    echo ""
    echo "🎯 Main Menu:"
    echo "  1. Start all services"
    echo "  2. Stop all services"
    echo "  3. View logs (all services)"
    echo "  4. View logs (API only)"
    echo "  5. View logs (Web only)"
    echo "  6. Check service status"
    echo "  7. View resource usage (docker stats)"
    echo "  8. Open Grafana dashboard"
    echo "  9. Open Prometheus dashboard"
    echo " 10. Open Dozzle log viewer"
    echo " 11. Restart a service"
    echo " 12. View database"
    echo " 13. Backup database"
    echo " 14. Help"
    echo " 15. Exit"
    echo ""
}

handle_menu() {
    case $1 in
        1)
            echo "🚀 Starting all services..."
            docker-compose up -d
            echo "✅ Services started!"
            sleep 2
            ;;
        2)
            echo "⛔ Stopping all services..."
            docker-compose down
            echo "✅ Services stopped!"
            sleep 2
            ;;
        3)
            echo "📋 Displaying all logs (press Ctrl+C to exit)..."
            sleep 1
            docker-compose logs -f
            ;;
        4)
            echo "📋 Displaying API logs (press Ctrl+C to exit)..."
            sleep 1
            docker-compose logs -f api
            ;;
        5)
            echo "📋 Displaying Web logs (press Ctrl+C to exit)..."
            sleep 1
            docker-compose logs -f web
            ;;
        6)
            echo "📊 Service Status:"
            docker-compose ps
            echo ""
            read -p "Press Enter to continue..."
            ;;
        7)
            echo "📊 Resource Usage (press Ctrl+C to exit):"
            sleep 1
            docker stats --no-stream
            echo ""
            read -p "Press Enter to continue..."
            ;;
        8)
            echo "🌐 Opening Grafana at http://localhost:3002..."
            if command -v open &> /dev/null; then
                open http://localhost:3002
            elif command -v xdg-open &> /dev/null; then
                xdg-open http://localhost:3002
            else
                echo "Please open http://localhost:3002 in your browser"
            fi
            sleep 2
            ;;
        9)
            echo "🌐 Opening Prometheus at http://localhost:9090..."
            if command -v open &> /dev/null; then
                open http://localhost:9090
            elif command -v xdg-open &> /dev/null; then
                xdg-open http://localhost:9090
            else
                echo "Please open http://localhost:9090 in your browser"
            fi
            sleep 2
            ;;
        10)
            echo "🌐 Opening Dozzle at http://localhost:8081..."
            if command -v open &> /dev/null; then
                open http://localhost:8081
            elif command -v xdg-open &> /dev/null; then
                xdg-open http://localhost:8081
            else
                echo "Please open http://localhost:8081 in your browser"
            fi
            sleep 2
            ;;
        11)
            clear
            echo "🔄 Select service to restart:"
            echo "  1. API"
            echo "  2. Web"
            echo "  3. Database"
            echo "  4. Prometheus"
            echo "  5. Grafana"
            echo "  6. Cancel"
            read -p "Choice: " service_choice
            
            case $service_choice in
                1) docker-compose restart api && echo "✅ API restarted!" ;;
                2) docker-compose restart web && echo "✅ Web restarted!" ;;
                3) docker-compose restart db && echo "✅ Database restarted!" ;;
                4) docker-compose restart prometheus && echo "✅ Prometheus restarted!" ;;
                5) docker-compose restart grafana && echo "✅ Grafana restarted!" ;;
                6) ;;
                *) echo "❌ Invalid choice" ;;
            esac
            sleep 2
            ;;
        12)
            echo "🗄️  Connecting to PostgreSQL database..."
            docker-compose exec db psql -U postgres rental_dev
            ;;
        13)
            BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
            echo "💾 Backing up database to $BACKUP_FILE..."
            docker-compose exec db pg_dump -U postgres rental_dev > "$BACKUP_FILE"
            echo "✅ Database backed up to $BACKUP_FILE"
            ls -lh "$BACKUP_FILE"
            sleep 2
            ;;
        14)
            ./complicore-help
            read -p "Press Enter to continue..."
            ;;
        15)
            echo "👋 Goodbye!"
            exit 0
            ;;
        *)
            echo "❌ Invalid choice"
            sleep 2
            ;;
    esac
}

# Main loop
while true; do
    show_menu
    read -p "Enter your choice (1-15): " choice
    handle_menu "$choice"
done
