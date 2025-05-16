# PowerShell Script to restart the API gateway service

Write-Host "Stopping API Gateway service..." -ForegroundColor Yellow
docker-compose stop api-gateway

Write-Host "Building API Gateway service..." -ForegroundColor Yellow
docker-compose build api-gateway

Write-Host "Starting API Gateway service..." -ForegroundColor Green
docker-compose up -d api-gateway

Write-Host "Checking API Gateway logs..." -ForegroundColor Cyan
docker-compose logs -f api-gateway 