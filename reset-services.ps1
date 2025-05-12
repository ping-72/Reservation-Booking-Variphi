# Flight Reservation System - Service Reset Script
Write-Host "Flight Reservation System - Resetting Services" -ForegroundColor Cyan

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

# Stop all containers
Write-Host "Stopping all containers..." -ForegroundColor Yellow
docker-compose down

# Remove volumes to start fresh
Write-Host "Removing volumes for a clean start..." -ForegroundColor Yellow
docker-compose down -v

# Remove any stray containers/networks
Write-Host "Cleaning up any stray resources..." -ForegroundColor Yellow
docker system prune -f

# Make the wait-for-it script executable
Write-Host "Preparing scripts..." -ForegroundColor Yellow
Set-Content -Path wait-for-it.sh -Value (Get-Content -Path wait-for-it.sh) -Encoding utf8
if (-not $?) {
    Write-Host "Warning: Could not update the wait-for-it.sh script line endings." -ForegroundColor Yellow
}

# Rebuild all containers
Write-Host "Rebuilding all containers..." -ForegroundColor Yellow
docker-compose build --no-cache

# Start the database first
Write-Host "Starting PostgreSQL database first..." -ForegroundColor Yellow
docker-compose up -d postgres

# Wait for PostgreSQL to be healthy
Write-Host "Waiting for PostgreSQL to be healthy..." -ForegroundColor Yellow
$pgHealthy = $false
$attempts = 0
$maxAttempts = 30

while (-not $pgHealthy -and $attempts -lt $maxAttempts) {
    $attempts++
    Write-Host "." -NoNewline -ForegroundColor Yellow
    Start-Sleep -Seconds 1
    
    $pgStatus = docker-compose ps postgres | Select-String "healthy"
    if ($pgStatus) {
        $pgHealthy = $true
    }
}

Write-Host ""
if ($pgHealthy) {
    Write-Host "PostgreSQL is healthy!" -ForegroundColor Green
} else {
    Write-Host "PostgreSQL health check timed out. Continuing anyway..." -ForegroundColor Yellow
}

# Start the remaining services
Write-Host "Starting the remaining services..." -ForegroundColor Yellow
docker-compose up -d

# Wait for services to finish starting up
Write-Host "Waiting for all services to initialize (45 seconds)..." -ForegroundColor Yellow
for ($i = 0; $i -lt 45; $i++) {
    if ($i % 5 -eq 0) {
        Write-Host "$i seconds" -NoNewline -ForegroundColor Cyan
    }
    Write-Host "." -NoNewline -ForegroundColor Green
    Start-Sleep -Seconds 1
}
Write-Host ""

# Check service status
Write-Host "Checking service status..." -ForegroundColor Yellow
docker-compose ps

# Display URL information
Write-Host "`nAll microservices have been reset and are now running!" -ForegroundColor Green
Write-Host "`nAccess the application at:" -ForegroundColor Cyan
Write-Host "  Frontend UI:              http://localhost:5173" -ForegroundColor White
Write-Host "  Auth Service API:         http://localhost:5000" -ForegroundColor White
Write-Host "  Reservation Service API:  http://localhost:5002" -ForegroundColor White
Write-Host "  Ticket Service API:       http://localhost:5003" -ForegroundColor White
Write-Host "  Payment Service API:      http://localhost:5004" -ForegroundColor White

Write-Host "`nTo view logs from a specific service:" -ForegroundColor Cyan
Write-Host "  docker-compose logs auth-service" -ForegroundColor White
Write-Host "  docker-compose logs reservation-service" -ForegroundColor White
Write-Host "  docker-compose logs ticket-service" -ForegroundColor White
Write-Host "  docker-compose logs payment-service" -ForegroundColor White 