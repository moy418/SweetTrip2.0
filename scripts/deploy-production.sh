#!/bin/bash

# ====================================
# SweetTrip 2.0 - Production Deployment Script
# ====================================

set -e  # Exit on error

echo "🚀 Starting SweetTrip 2.0 Deployment..."
echo "======================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/var/www/sweettrip"
DOMAIN="www.sweettripcandy.com"
BACKEND_PORT=3001

echo -e "${YELLOW}📋 Pre-deployment Checklist${NC}"
echo "1. Supabase configured"
echo "2. Stripe keys in .env"
echo "3. Domain DNS pointing to server"
echo "4. SSL certificate ready"
echo ""

read -p "Continue with deployment? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "Deployment cancelled."
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Step 1: Updating code from repository${NC}"
cd $PROJECT_DIR
git pull origin main

echo ""
echo -e "${GREEN}✅ Step 2: Installing/Updating dependencies${NC}"
npm install --production

echo ""
echo -e "${GREEN}✅ Step 3: Building frontend${NC}"
npm run build

echo ""
echo -e "${GREEN}✅ Step 4: Setting correct permissions${NC}"
sudo chown -R www-data:www-data $PROJECT_DIR/dist
sudo chmod -R 755 $PROJECT_DIR/dist

echo ""
echo -e "${GREEN}✅ Step 5: Restarting backend with PM2${NC}"
pm2 restart sweettrip-backend || pm2 start server.cjs --name sweettrip-backend

echo ""
echo -e "${GREEN}✅ Step 6: Reloading Nginx${NC}"
sudo nginx -t
sudo systemctl reload nginx

echo ""
echo -e "${GREEN}✅ Step 7: Verifying deployment${NC}"

# Health check
sleep 2
HEALTH_CHECK=$(curl -s http://localhost:$BACKEND_PORT/api/health | grep -o '"status":"ok"' || echo "")

if [ -z "$HEALTH_CHECK" ]; then
    echo -e "${RED}❌ Backend health check failed!${NC}"
    pm2 logs sweettrip-backend --lines 20
    exit 1
else
    echo -e "${GREEN}✅ Backend is healthy${NC}"
fi

# Frontend check
FRONTEND_CHECK=$(curl -s http://localhost | grep -o "SweetTrip" || echo "")

if [ -z "$FRONTEND_CHECK" ]; then
    echo -e "${RED}❌ Frontend check failed!${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Frontend is serving${NC}"
fi

echo ""
echo "======================================"
echo -e "${GREEN}🎉 Deployment Successful!${NC}"
echo "======================================"
echo ""
echo "📊 Service Status:"
pm2 status

echo ""
echo "🌐 Your site is live at:"
echo "   https://$DOMAIN"
echo ""
echo "📍 Endpoints:"
echo "   Frontend: https://$DOMAIN"
echo "   Backend Health: https://$DOMAIN/api/health"
echo ""
echo "📝 Next Steps:"
echo "1. Test the site: https://$DOMAIN"
echo "2. Test checkout flow"
echo "3. Verify emails are being sent"
echo "4. Check Stripe dashboard for test payments"
echo ""
echo "📊 Monitor logs with:"
echo "   pm2 logs sweettrip-backend"
echo "   sudo tail -f /var/log/nginx/access.log"
echo ""

