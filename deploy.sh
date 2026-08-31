#!/usr/bin/env bash
# ==============================================================================
# Instant Mechanic Live Operations Dashboard - Deployment Script
# Target: Ubuntu / Debian AWS EC2 or VPS
# ==============================================================================

set -e

echo "🚗 Starting Instant Mechanic Deployment..."

# Update and install Docker if not present
if ! command -v docker &> /dev/null; then
    echo "📦 Installing Docker..."
    sudo apt-get update
    sudo apt-get install -y ca-certificates curl gnupg lsb-release
    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
fi

# Build and start container
echo "🏗️ Building and running containerized application on port 3000..."
docker compose down || true
docker compose up -d --build

echo "✅ Deployment successful! Service running at http://$(curl -s ifconfig.me):3000"
