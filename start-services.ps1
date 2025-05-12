# Flight Reservation System - Startup Script
Write-Host "Flight Reservation System - Starting Services" -ForegroundColor Cyan

# Check if Docker is running
Write-Host "Checking if Docker is running..." -ForegroundColor Yellow
try {
    $dockerInfo = docker info
    if (-not $?) {
        throw "Docker is not running"
    }
} catch {
    Write-Host "Docker is not running. Please start Docker Desktop and try again." -ForegroundColor Red
    exit 1
}

Write-Host "Docker is running!" -ForegroundColor Green

# Start all services
Write-Host "Starting all microservices with Docker Compose..." -ForegroundColor Yellow
docker-compose up -d

# Wait for services to start
Write-Host "Waiting for services to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check service status
Write-Host "Checking service status..." -ForegroundColor Yellow
docker-compose ps

# Display URL information
Write-Host "`nAll microservices are now running!" -ForegroundColor Green
Write-Host "`nAccess the application at:" -ForegroundColor Cyan
Write-Host "  Frontend UI:              http://localhost:5173" -ForegroundColor White
Write-Host "  Auth Service API:         http://localhost:5000" -ForegroundColor White
Write-Host "  Reservation Service API:  http://localhost:5002" -ForegroundColor White
Write-Host "  Ticket Service API:       http://localhost:5003" -ForegroundColor White
Write-Host "  Payment Service API:      http://localhost:5004" -ForegroundColor White

Write-Host "`nUseful commands:" -ForegroundColor Cyan
Write-Host "  Stop all services:        docker-compose down" -ForegroundColor White
Write-Host "  View all logs:            docker-compose logs -f" -ForegroundColor White
Write-Host "  View specific service:    docker-compose logs -f <service-name>" -ForegroundColor White
Write-Host "  Restart everything:       docker-compose restart" -ForegroundColor White 