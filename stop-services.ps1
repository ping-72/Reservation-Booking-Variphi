# Flight Reservation System - Shutdown Script
Write-Host "Flight Reservation System - Stopping Services" -ForegroundColor Cyan

# Check if Docker is running
Write-Host "Checking if Docker is running..." -ForegroundColor Yellow
try {
    $dockerInfo = docker info
    if (-not $?) {
        throw "Docker is not running"
    }
} catch {
    Write-Host "Docker is not running. Cannot stop services." -ForegroundColor Red
    exit 1
}

# Stop all services
Write-Host "Stopping all microservices..." -ForegroundColor Yellow
docker-compose down

Write-Host "`nAll services have been stopped." -ForegroundColor Green
Write-Host "To start services again, run: .\start-services.ps1" -ForegroundColor Cyan

# Option to remove volumes
$removeVolumes = Read-Host "Do you want to remove persistent volumes as well? (y/n)"
if ($removeVolumes -eq "y" -or $removeVolumes -eq "Y") {
    Write-Host "Removing volumes..." -ForegroundColor Yellow
    docker-compose down -v
    Write-Host "Volumes have been removed." -ForegroundColor Green
} 