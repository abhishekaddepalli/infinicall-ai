# Production Deployment Guide: InfiniCall AI

This guide documents the exact procedure to deploy **InfiniCall AI** on a standardized **Ubuntu 24.04 LTS** VPS architecture.

---

## 1. System Architecture Overview

- **Operating System:** Ubuntu 24.04 LTS (Noble Numbat)
- **Server Resources:** 8 vCPU, 16 GB RAM, 400 GB SSD
- **Public Ports:**
  - `22123` → SSH (Standard hardened port)
  - `80` → HTTP (Nginx)
  - `443` → HTTPS (Nginx + Let's Encrypt SSL via Certbot)
- **All application ports remain strictly internal:**
  - `127.0.0.1:3100` → Backend API, WebSockets, Queue Worker (Node.js/Express)
  - `127.0.0.1:3101` → Frontend Application (Next.js)
  - `127.0.0.1:27017` → MongoDB Database
  - `127.0.0.1:6379` → Redis (BullMQ queue broker)
- **Process Manager:** `systemd` (NO PM2, NO Docker, NO aaPanel/Coolify)
- **Web Server:** `Nginx` (Reverse proxy with WebSocket support)
- **Filesystem Standard:** `/www/apps/infinicall`
- **Application User:** `www-data:www-data` (Non-root execution)

---

## 2. Directory Layout Standard

```
/www/
├── apps/
│   └── infinicall/
│       ├── autocall-api/          # Backend API, WebSockets, BullMQ Queue
│       │   ├── .env               # Production backend secrets
│       │   ├── server.js          # Entry point (binds to 127.0.0.1:3100)
│       │   └── uploads/           # Writable uploads directory (www-data)
│       ├── autocall-next/         # Frontend Next.js application
│       │   ├── .env               # Production frontend config
│       │   └── .next/             # Production build artifacts (www-data)
│       ├── deploy/                # Deployment configurations
│       │   ├── nginx/             # Nginx reverse proxy template
│       │   └── systemd/           # Systemd unit files
│       └── DEPLOYMENT.md          # This documentation
├── deploy/                        # Deployment automation scripts
└── backups/                       # Automated database and asset backups
```

---

## 3. Server Prerequisites & Dependencies

On your clean Ubuntu 24.04 server, ensure the required software packages are installed:

### 3.1. System Packages & Tools
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git unzip gnupg2 software-properties-common nginx certbot python3-certbot-nginx ufw fail2ban
```

### 3.2. Node.js 22.x LTS
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```
Verify:
```bash
node -v   # Should output v22.x
npm -v    # Should output v10.x
```

### 3.3. MongoDB 8.0 / 7.0
```bash
curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-8.0.gpg --yes
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list
sudo apt update && sudo apt install -y mongodb-org
sudo systemctl enable --now mongod
```

### 3.4. Redis Server
```bash
sudo apt install -y redis-server
sudo systemctl enable --now redis-server
```

---

## 4. Database Setup (Dedicated User, Non-Root)

Connect to MongoDB via `mongosh` to create a dedicated application database and a dedicated non-root user:

```bash
mongosh
```

Execute inside MongoDB shell:
```javascript
use infinicall;

db.createUser({
  user: "infinicall_user",
  pwd: "GENERATE_STRONG_DATABASE_PASSWORD_HERE",
  roles: [
    { role: "readWrite", db: "infinicall" },
    { role: "dbAdmin", db: "infinicall" }
  ]
});

exit;
```

---

## 5. Application Installation Steps

### Step 1: Clone Repository into Standard Path
```bash
sudo mkdir -p /www/apps
cd /www/apps
sudo git clone https://github.com/abhishekaddepalli/infinicall-ai.git infinicall
cd /www/apps/infinicall
```

### Step 2: Configure Backend Environment (`autocall-api/.env`)
```bash
cd /www/apps/infinicall/autocall-api
sudo cp .env.example .env
sudo nano .env
```

Set the following critical variables:
```ini
NODE_ENV=production
PORT=3100
HOST=127.0.0.1
APP_URL=https://app.example.com
FRONTEND_URL=https://app.example.com
ALLOWED_ORIGINS=https://app.example.com

# Database Connection (Dedicated non-root user)
MONGODB_URI=mongodb://infinicall_user:GENERATE_STRONG_DATABASE_PASSWORD_HERE@127.0.0.1:27017/infinicall?authSource=infinicall

# Redis for BullMQ Queue
REDIS_URL=redis://127.0.0.1:6379

# Generate 64-char random secrets: openssl rand -hex 32
JWT_SECRET=your_generated_jwt_secret
SESSION_SECRET=your_generated_session_secret
TOKEN_ENCRYPTION_KEY=exact_32_character_encryption_key

# Admin Credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=SetAStrongProductionPassword123!
ADMIN_NAME=Super Admin
```

### Step 3: Install Backend Dependencies & Seed
```bash
cd /www/apps/infinicall/autocall-api
sudo npm install --production
# Auto-seeds default roles, plans, and super admin:
sudo node -e "require('dotenv').config(); require('./server.js');" &
sleep 5
sudo killall node || true
```

### Step 4: Configure Frontend Environment (`autocall-next/.env`)
```bash
cd /www/apps/infinicall/autocall-next
sudo cp .env.example .env
sudo nano .env
```

Set:
```ini
NODE_ENV=production
PORT=3101
HOSTNAME=127.0.0.1
NEXT_PUBLIC_API_BASE_URL=https://app.example.com/api
NEXT_PUBLIC_STORAGE_URL=https://app.example.com/
NEXT_PUBLIC_SOCKET_URL=https://app.example.com
```

### Step 5: Install Frontend Dependencies & Build Next.js
```bash
cd /www/apps/infinicall/autocall-next
sudo npm install
sudo npm run build
```

---

## 6. Filesystem Permissions

Set ownership strictly to `www-data:www-data` without using insecure permissions like `777`:

```bash
sudo chown -R www-data:www-data /www/apps/infinicall
sudo find /www/apps/infinicall -type d -exec chmod 755 {} +
sudo find /www/apps/infinicall -type f -exec chmod 644 {} +

# Protect .env files from unauthorized read
sudo chmod 600 /www/apps/infinicall/autocall-api/.env
sudo chmod 600 /www/apps/infinicall/autocall-next/.env
```

---

## 7. Systemd Service Configuration

Install the pre-configured systemd unit files:

### 7.1. Install Services
```bash
sudo cp /www/apps/infinicall/deploy/systemd/infinicall-backend.service /etc/systemd/system/
sudo cp /www/apps/infinicall/deploy/systemd/infinicall-frontend.service /etc/systemd/system/

sudo systemctl daemon-reload
```

### 7.2. Start and Enable Services
```bash
sudo systemctl enable --now infinicall-backend
sudo systemctl enable --now infinicall-frontend
```

### 7.3. Verify Service Status
```bash
sudo systemctl status infinicall-backend --no-pager
sudo systemctl status infinicall-frontend --no-pager
```

---

## 8. Nginx Reverse Proxy & SSL Setup

### 8.1. Deploy Nginx Configuration
```bash
sudo cp /www/apps/infinicall/deploy/nginx/infinicall.conf /etc/nginx/sites-available/infinicall.conf

# Replace app.example.com with your actual domain
sudo sed -i 's/app.example.com/your-actual-domain.com/g' /etc/nginx/sites-available/infinicall.conf

# Enable site and remove default
sudo ln -sf /etc/nginx/sites-available/infinicall.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t
sudo systemctl reload nginx
```

### 8.2. Obtain SSL Certificate via Certbot
```bash
sudo certbot --nginx -d your-actual-domain.com --non-interactive --agree-tos -m admin@your-actual-domain.com
```

Certbot automatically adds SSL directives (`listen 443 ssl;`, certificates, and HTTP to HTTPS redirection) to `/etc/nginx/sites-available/infinicall.conf`.

---

## 9. Verification & Health Checks

Verify your deployment with internal and external health checks:

### 9.1. Internal Backend Health Check
```bash
curl -s http://127.0.0.1:3100/api/health | jq .
```
Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-09-17T12:00:00.000Z",
  "uptime": 120,
  "services": {
    "api": "up",
    "database": "connected",
    "redis": "configured"
  }
}
```

### 9.2. Internal Frontend HTTP Check
```bash
curl -I http://127.0.0.1:3101
```
Expected response: `HTTP/1.1 200 OK`

### 9.3. External Public HTTPS Check
```bash
curl -I https://your-actual-domain.com
curl -s https://your-actual-domain.com/api/health | jq .
```

---

## 10. Service Maintenance Commands

- **Restart Backend:**
  ```bash
  sudo systemctl restart infinicall-backend
  ```
- **Restart Frontend:**
  ```bash
  sudo systemctl restart infinicall-frontend
  ```
- **View Live Backend Logs:**
  ```bash
  sudo journalctl -u infinicall-backend -f
  ```
- **View Live Frontend Logs:**
  ```bash
  sudo journalctl -u infinicall-frontend -f
  ```
- **Update Application:**
  ```bash
  cd /www/apps/infinicall
  sudo git pull origin main
  cd autocall-api && sudo npm install --production
  cd ../autocall-next && sudo npm install && sudo npm run build
  sudo chown -R www-data:www-data /www/apps/infinicall
  sudo systemctl restart infinicall-backend infinicall-frontend
  ```
