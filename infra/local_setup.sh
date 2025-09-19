#!/bin/bash

# Function to print status messages
print_status() {
  echo "===================================="
  echo "$1"
  echo "===================================="
}

# Database Setup
print_status "Running and building the database service in detach mode"
docker compose -f ./../docker-compose.pg-only.yml up -d build

rint_status "Running the app service in detach mode"
docker compose -f ./../project-management-api/docker-compose.yaml up -d

print_status "Application setup complete!"
