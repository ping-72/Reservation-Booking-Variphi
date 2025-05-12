#!/bin/bash

# Make the wait-for-it script executable
chmod +x wait-for-it.sh

# Make sure Docker is running
echo "Checking if Docker is running..."
if ! docker info > /dev/null 2>&1; then
  echo "Docker is not running. Please start Docker and try again."
  exit 1
fi

echo "Starting all microservices with Docker Compose..."
docker-compose up -d

echo "Waiting for services to start..."
sleep 5

echo "Checking service status..."
docker-compose ps

echo "All microservices are now running!"
echo "Frontend UI: http://localhost:5173"
echo "Auth Service API: http://localhost:5000"
echo "Reservation Service API: http://localhost:5002"
echo "Ticket Service API: http://localhost:5003"
echo "Payment Service API: http://localhost:5004"
echo "
To stop all services, run: docker-compose down
To view logs, run: docker-compose logs -f
" 