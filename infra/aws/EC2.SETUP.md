# 🚀 Ubuntu Server Setup: Docker, Docker Compose, Nginx, NVM & Node.js 20

This guide installs **Docker**, **Docker Compose**, **Nginx**, and **NVM** with **Node.js 20** on Ubuntu Server.  
It also fixes the common Docker permission issue.

---

## 1. Update your system

```bash
sudo apt update && sudo apt upgrade -y
```

## 2. Install Docker

```bash
# Install prerequisites
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker’s official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# Add the Docker APT repository
sudo add-apt-repository \
   "deb [arch=$(dpkg --print-architecture)] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) stable"

# Update package index again
sudo apt update

# Install Docker CE
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Enable and start Docker
sudo systemctl enable docker
sudo systemctl start docker

# Add your user to the docker group (logout/login needed)
sudo usermod -aG docker $USER
```

## 3. Install Docker Compose (plugin version)

```bash
sudo apt install -y docker-compose-plugin
docker compose version
```

## 4. Install Nginx

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

## 5. Install NVM (Node Version Manager)

```bash
# Get latest nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash

# Load nvm immediately (otherwise, logout/login required)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

## 6. Install Node.js 20 using NVM

```bash
# Get latest nvm
nvm install 20
nvm use 20
nvm alias default 20

# Verify versions
node -v
npm -v
```

## 7. Fix Docker Permission Error

```bash
sudo usermod -aG docker $USER

# Option 2: Apply new group without reboot
newgrp docker

# Check permissions
ls -l /var/run/docker.sock
```

## 8. Building and running the Api

```bash
# Provide permission to run the script bash
chmod +x ./infra/app_local_setup.sh

# Run the script bash and enjoy!
./infra/app_local_setup.sh
```
