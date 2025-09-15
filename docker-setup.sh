#!/bin/bash

#!/bin/bash

# Skema/Canvora Docker Setup Script
# Simple production deployment with NeonDB support

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Skema/Canvora Production Setup${NC}"
echo "=========================================="

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

print_status "Docker and Docker Compose are installed"

# Function to show usage
show_usage() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start       Start the application"
    echo "  stop        Stop all services"
    echo "  restart     Restart all services"
    echo "  logs        Show logs for all services"
    echo "  clean       Clean up containers and volumes"
    echo "  migrate     Run database migrations"
    echo "  backup      Backup database (if using local DB)"
    echo "  --help      Show this help message"
}

# Function to check environment file
check_env_file() {
    if [ ! -f ".env" ]; then
        print_warning ".env file not found. Creating from example..."
        if [ -f ".env.example" ]; then
            cp .env.example .env
            print_info "Please edit .env with your actual values"
            print_warning "Required: DATABASE_URL (from NeonDB), NEXTAUTH_SECRET, JWT_SECRET, RESEND_API_KEY"
            return 1
        else
            print_error "No .env.example found. Please create .env file manually."
            exit 1
        fi
    fi
    
    # Check for required variables
    if ! grep -q "DATABASE_URL.*postgresql" .env; then
        print_error "DATABASE_URL not found in .env. Please add your NeonDB connection string."
        exit 1
    fi
    
    return 0
}

# Function to start application
start_app() {
    print_info "Starting Skema/Canvora application..."
    
    if ! check_env_file; then
        print_warning "Please update .env with your settings and run again."
        exit 1
    fi
    
    # Build and start services
    docker-compose up --build -d
    
    print_status "Application started!"
    print_info "Services available at:"
    echo "  • Web App: http://localhost:3000"
    echo "  • WebSocket: ws://localhost:8080"
    
    # Wait for services to be healthy
    print_info "Waiting for services to be ready..."
    sleep 10
    
    # Run database migrations
    print_info "Running database migrations..."
    docker-compose exec web npx prisma migrate deploy
    
    print_status "Application is ready!"
    print_info "Access your app at: http://localhost:3000"
}

# Function to stop services
stop_services() {
    print_info "Stopping all services..."
    docker-compose down
    print_status "All services stopped"
}

# Function to restart services
restart_services() {
    print_info "Restarting all services..."
    docker-compose restart
    print_status "All services restarted"
}

# Function to show logs
show_logs() {
    print_info "Showing logs for all services..."
    docker-compose logs -f
}

# Function to clean up
clean_up() {
    print_warning "This will remove all containers and volumes. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_info "Cleaning up Docker resources..."
        docker-compose down --volumes --remove-orphans
        docker system prune -f
        print_status "Cleanup completed"
    else
        print_info "Cleanup cancelled"
    fi
}

# Function to run database migrations
run_migrations() {
    print_info "Running database migrations..."
    
    if docker-compose ps | grep -q "web.*Up"; then
        docker-compose exec web npx prisma migrate deploy
        print_status "Migrations completed"
    else
        print_error "Web service is not running. Please start the application first."
        exit 1
    fi
}

# Function to backup database (only works if using local PostgreSQL)
backup_database() {
    print_info "Database backup is not needed with NeonDB as it handles backups automatically."
    print_info "You can access backups through your Neon dashboard at: https://console.neon.tech"
}

# Main script logic
case "$1" in
    "start")
        start_app
        ;;
    "stop")
        stop_services
        ;;
    "restart")
        restart_services
        ;;
    "logs")
        show_logs
        ;;
    "clean")
        clean_up
        ;;
    "migrate")
        run_migrations
        ;;
    "backup")
        backup_database
        ;;
    "--help"|"help"|"")
        show_usage
        ;;
    *)
        print_error "Unknown command: $1"
        show_usage
        exit 1
        ;;
esac

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info >/dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    print_status "Docker is running ✓"
}

# Function to check if required files exist
check_requirements() {
    if [ ! -f ".env" ]; then
        print_warning ".env file not found. Creating from .env.example..."
        if [ -f ".env.example" ]; then
            cp .env.example .env
            print_warning "Please edit .env file with your actual values before proceeding."
            exit 1
        else
            print_error ".env.example file not found. Please create environment configuration."
            exit 1
        fi
    fi
    print_status "Environment configuration found ✓"
}

# Function to build and start development environment
start_development() {
    print_status "Starting development environment..."
    
    # Stop any existing containers
    docker-compose -f docker-compose.dev.yml down
    
    # Build and start services
    docker-compose -f docker-compose.dev.yml up --build -d
    
    print_status "Development environment started!"
    print_status "Web app: http://localhost:3000"
    print_status "WebSocket server: ws://localhost:8080"
    print_status "PostgreSQL: localhost:5432"
    print_status "Redis: localhost:6379"
}

# Function to build and start production environment
start_production() {
    print_status "Starting production environment..."
    
    # Stop any existing containers
    docker-compose down
    
    # Build and start services
    docker-compose up --build -d
    
    print_status "Production environment started!"
    print_status "Web app: http://localhost:3000"
    print_status "WebSocket server: ws://localhost:8080"
}

# Function to stop all services
stop_services() {
    print_status "Stopping all services..."
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
    print_status "All services stopped."
}

# Function to view logs
view_logs() {
    local service=${1:-""}
    if [ -z "$service" ]; then
        print_status "Showing logs for all services..."
        docker-compose logs -f
    else
        print_status "Showing logs for $service..."
        docker-compose logs -f "$service"
    fi
}

# Function to run database migrations
run_migrations() {
    print_status "Running database migrations..."
    docker-compose exec web bun run --cwd packages/db prisma migrate deploy
    print_status "Migrations completed."
}

# Function to reset database
reset_database() {
    print_warning "This will destroy all data in the database. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_status "Resetting database..."
        docker-compose exec web bun run --cwd packages/db prisma migrate reset --force
        print_status "Database reset completed."
    else
        print_status "Database reset cancelled."
    fi
}

# Function to show help
show_help() {
    echo "Skema Docker Management Script"
    echo ""
    echo "Usage: ./docker-setup.sh [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  dev         Start development environment with hot reload"
    echo "  prod        Start production environment"
    echo "  stop        Stop all running services"
    echo "  logs        View logs for all services"
    echo "  logs [service]  View logs for specific service (web, ws-server, postgres, redis)"
    echo "  migrate     Run database migrations"
    echo "  reset-db    Reset database (destroys all data)"
    echo "  build       Build all Docker images"
    echo "  clean       Remove all containers, images, and volumes"
    echo "  status      Show status of all services"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./docker-setup.sh dev"
    echo "  ./docker-setup.sh logs web"
    echo "  ./docker-setup.sh migrate"
}

# Function to build images
build_images() {
    print_status "Building Docker images..."
    docker-compose build
    docker-compose -f docker-compose.dev.yml build
    print_status "Build completed."
}

# Function to clean up Docker resources
clean_docker() {
    print_warning "This will remove all Skema-related containers, images, and volumes. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_status "Cleaning up Docker resources..."
        docker-compose down -v --rmi all
        docker-compose -f docker-compose.dev.yml down -v --rmi all
        docker system prune -f
        print_status "Cleanup completed."
    else
        print_status "Cleanup cancelled."
    fi
}

# Function to show service status
show_status() {
    print_status "Service Status:"
    echo ""
    docker-compose ps
    echo ""
    print_status "Development Services:"
    docker-compose -f docker-compose.dev.yml ps
}

# Main script logic
case "${1:-help}" in
    dev)
        check_docker
        check_requirements
        start_development
        ;;
    prod)
        check_docker
        check_requirements
        start_production
        ;;
    stop)
        stop_services
        ;;
    logs)
        view_logs "$2"
        ;;
    migrate)
        run_migrations
        ;;
    reset-db)
        reset_database
        ;;
    build)
        check_docker
        build_images
        ;;
    clean)
        clean_docker
        ;;
    status)
        show_status
        ;;
    help|*)
        show_help
        ;;
esac