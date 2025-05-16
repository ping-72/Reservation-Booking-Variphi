#!/bin/bash
# Script to restart the API gateway service

echo "Stopping API Gateway service..."
docker-compose stop api-gateway

echo "Building API Gateway service..."
docker-compose build api-gateway

echo "Starting API Gateway service..."
docker-compose up -d api-gateway

echo "Checking API Gateway logs..."
docker-compose logs -f api-gateway 