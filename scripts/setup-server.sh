#!/bin/bash

# ====================================
# SweetTrip 2.0 - Server Setup Script
# First-time setup for production server
# ====================================

set -e

echo "🔧 SweetTrip 2.0 - Server Setup"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root or with sudo"
    exit 1
fi

echo -e "${GREEN}Step 1: Installing Node.js${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

echo ""
echo -e "${GREEN}Step 2: Installing Nginx${NC}"
apt-get install -y nginx

echo ""
echo -e "${GREEN}Step 3: Installing PM2${NC}"
npm install -g pm2

echo ""
echo -e "${GREEN}Step 4: Installing Certbot (SSL)${NC}"
apt-get install -y certbot python3-certbot-nginx

echo ""
echo -e "${GREEN}Step 5: Creating project directory${NC}"
mkdir -p /var/www/sweettrip
cd /var/www/sweettrip

echo ""
echo -e "${GREEN}Step 6: Cloning repository${NC}"
echo "Clone your repository manually:"
echo "git clone <your-repo-url> ."

echo ""
echo -e "${GREEN}Step 7: Nginx Configuration${NC}"
cat > /etc/nginx/sites-available/sweettrip << 'NGINX_EOF'
server {
    listen 80;
    server_name www.sweettripcandy.com sweettripcandy.com;

    root /var/www/sweettrip/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml+rss image/svg+xml;

    # Frontend - React SPA
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, must-revalidate";
    }

    # Static assets caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API Backend Proxy
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
NGINX_EOF

# Enable site
ln -sf /etc/nginx/sites-available/sweettrip /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test nginx config
nginx -t

echo ""
echo -e "${GREEN}Step 8: Firewall Configuration${NC}"
ufw allow 'Nginx Full'
ufw allow OpenSSH
ufw --force enable

echo ""
echo "======================================"
echo -e "${GREEN}✅ Server Setup Complete!${NC}"
echo "======================================"
echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Clone your repository:"
echo "   cd /var/www/sweettrip"
echo "   git clone <repo-url> ."
echo ""
echo "2. Install dependencies:"
echo "   npm install"
echo ""
echo "3. Create .env file:"
echo "   nano .env"
echo "   (Copy content from ENV_PRODUCTION.md)"
echo ""
echo "4. Build frontend:"
echo "   npm run build"
echo ""
echo "5. Start backend:"
echo "   pm2 start server.cjs --name sweettrip-backend"
echo "   pm2 save"
echo "   pm2 startup"
echo ""
echo "6. Get SSL certificate:"
echo "   sudo certbot --nginx -d sweettripcandy.com -d www.sweettripcandy.com"
echo ""
echo "7. Reload nginx:"
echo "   sudo systemctl reload nginx"
echo ""
echo "✅ Your site will be live at: https://www.sweettripcandy.com"
echo ""

