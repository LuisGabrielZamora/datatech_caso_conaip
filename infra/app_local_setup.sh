#!/bin/bash

# Function to print status messages
print_status() {
  echo "===================================="
  echo "$1"
  echo "===================================="
}

# Build and run the app service
print_status "Building the app service"
docker compose -f ./project-management-api/docker-compose.yaml build

print_status "Running the app service in detach mode"
# docker compose -f ./project-management-api/docker-compose.yaml up -d
docker compose -f ./project-management-api/docker-compose.yaml up

print_status "Application setup complete!"
