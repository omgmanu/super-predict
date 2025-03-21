# Deployment Guide

This guide explains how to deploy the SuperSeed project on a Linux server using Docker Compose.

## Prerequisites

- A Linux server with SSH access
- Docker and Docker Compose installed on the server
- Git installed on the server (optional, for pulling from repository)

## Deployment Steps

### 1. Install Docker and Docker Compose (if not already installed)

```bash
# Update package lists
sudo apt update

# Install required packages
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add your user to the docker group to run commands without sudo
sudo usermod -aG docker $USER
```

Log out and log back in for group changes to take effect.

### 2. Clone or Copy Project Files to Server

#### Option A: Clone from Git Repository (if using Git)

```bash
git clone <your-repository-url> /path/to/superseed-project
cd /path/to/superseed-project
```

#### Option B: Copy Files Directly (using SCP)

From your local machine:

```bash
scp -r /path/to/local/superseed-project user@server-ip:/path/to/remote/superseed-project
```

### 3. Build and Start the Containers

Navigate to your project directory on the server:

```bash
cd /path/to/superseed-project

# Build and start containers in detached mode
docker-compose up -d --build

# Check if containers are running
docker-compose ps
```

### 4. Access Your Application

- Frontend: `http://your-server-ip`
- API: `http://your-server-ip:3000`

### 5. Management Commands

```bash
# View logs
docker-compose logs

# View logs for a specific service
docker-compose logs client
docker-compose logs api

# Follow logs in real-time
docker-compose logs -f

# Stop containers
docker-compose stop

# Stop and remove containers
docker-compose down

# Restart services
docker-compose restart

# Restart a specific service
docker-compose restart api
```

### 6. Updates and Maintenance

To update your application after making changes:

```bash
# Pull latest code (if using Git)
git pull

# Rebuild and restart containers
docker-compose up -d --build
```

## Troubleshooting

- **Networking Issues**: Ensure ports 80 and 3000 are allowed in your firewall settings.
- **Permission Issues**: Ensure the user has permissions to run Docker commands.
- **Container Errors**: Check logs using `docker-compose logs` for detailed error messages.

## Backup

To backup your application:

```bash
# Create a backup directory
mkdir -p ~/backups

# Backup Docker volumes (if any)
docker run --rm -v superseed_data:/data -v ~/backups:/backup alpine tar czf /backup/superseed-data-$(date +%Y%m%d).tar.gz /data
``` 