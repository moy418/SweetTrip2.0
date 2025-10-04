# Deployment Configuration - SweetTrip

## Overview

This document outlines the complete deployment configuration for SweetTrip, including Docker setup, environment variables, build processes, and server configuration.

## Docker Configuration

### Dockerfile
```dockerfile
# Multi-stage build for production
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Production stage
FROM nginx:alpine

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy environment configuration script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Start nginx
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  sweettrip:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    volumes:
      - ./logs:/var/log/nginx
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # Optional: Add database service
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: sweettrip_db
      POSTGRES_USER: sweettrip_user
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

volumes:
  postgres_data:
```

### Docker Entrypoint Script
```bash
#!/bin/sh
# docker-entrypoint.sh

# Replace environment variables in nginx config
envsubst '${NGINX_SERVER_NAME} ${NGINX_PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Start nginx
exec "$@"
```

## Nginx Configuration

### Production Nginx Config
```nginx
# nginx.conf
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    # Performance
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 20M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.stripe.com https://*.supabase.co;" always;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

    server {
        listen 80;
        server_name ${NGINX_SERVER_NAME} www.${NGINX_SERVER_NAME};
        root /usr/share/nginx/html;
        index index.html;

        # Security
        server_tokens off;

        # Main location
        location / {
            try_files $uri $uri/ /index.html;
            
            # Cache static assets
            location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
                expires 1y;
                add_header Cache-Control "public, immutable";
            }
        }

        # API proxy (if needed)
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://backend:3000/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Stripe webhooks
        location /webhooks/stripe {
            limit_req zone=api burst=5 nodelay;
            proxy_pass http://backend:3000/webhooks/stripe;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Health check
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }

        # Error pages
        error_page 404 /index.html;
        error_page 500 502 503 504 /50x.html;
        location = /50x.html {
            root /usr/share/nginx/html;
        }
    }
}
```

## Environment Variables

### Production Environment
```bash
# .env.production
NODE_ENV=production

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email Services
VITE_EMAILJS_SERVICE_ID=service_...
VITE_EMAILJS_TEMPLATE_ID=template_...
VITE_EMAILJS_PUBLIC_KEY=...

# Zapier
VITE_ZAPIER_ORDER_WEBHOOK=https://hooks.zapier.com/...

# Google APIs
VITE_GOOGLE_PLACES_API_KEY=AIza...
VITE_GOOGLE_ANALYTICS_ID=G-...

# Monitoring
VITE_ERROR_MONITORING_URL=https://...
VITE_SENTRY_DSN=https://...

# Site Configuration
VITE_SITE_NAME=SweetTrip
VITE_SITE_URL=https://sweettripcandy.com
VITE_CONTACT_EMAIL=contact@sweettripcandy.com

# Nginx
NGINX_SERVER_NAME=sweettripcandy.com
NGINX_PORT=80
```

### Development Environment
```bash
# .env.development
NODE_ENV=development

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe (Test)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email Services
VITE_EMAILJS_SERVICE_ID=service_...
VITE_EMAILJS_TEMPLATE_ID=template_...
VITE_EMAILJS_PUBLIC_KEY=...

# Site Configuration
VITE_SITE_NAME=SweetTrip (Dev)
VITE_SITE_URL=http://localhost:4001
VITE_CONTACT_EMAIL=dev@sweettripcandy.com
```

## Build Process

### Vite Configuration
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: !isProd,
    minify: isProd ? 'esbuild' : false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          stripe: ['@stripe/stripe-js', '@stripe/react-stripe-js'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 4001,
    host: '0.0.0.0',
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
});
```

### Build Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "build:prod": "NODE_ENV=production vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "docker:build": "docker build -t sweettrip .",
    "docker:run": "docker run -p 80:80 sweettrip",
    "docker:compose": "docker-compose up -d",
    "docker:logs": "docker-compose logs -f",
    "docker:stop": "docker-compose down"
  }
}
```

## SSL Configuration

### Let's Encrypt with Certbot
```bash
# Install Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d sweettripcandy.com -d www.sweettripcandy.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Nginx SSL Configuration
```nginx
# SSL configuration
server {
    listen 443 ssl http2;
    server_name sweettripcandy.com www.sweettripcandy.com;

    ssl_certificate /etc/letsencrypt/live/sweettripcandy.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/sweettripcandy.com/privkey.pem;

    # SSL settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Rest of configuration...
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name sweettripcandy.com www.sweettripcandy.com;
    return 301 https://$server_name$request_uri;
}
```

## Process Management

### PM2 Configuration
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'sweettrip',
    script: 'serve.cjs',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
```

### Systemd Service
```ini
# /etc/systemd/system/sweettrip.service
[Unit]
Description=SweetTrip E-commerce Application
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/sweettrip
ExecStart=/usr/bin/node serve.cjs
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

## Monitoring and Logging

### Log Configuration
```typescript
// src/lib/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'sweettrip' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export default logger;
```

### Health Check Endpoint
```typescript
// src/routes/health.ts
import { Request, Response } from 'express';

export const healthCheck = async (req: Request, res: Response) => {
  try {
    // Check database connection
    const dbStatus = await checkDatabaseConnection();
    
    // Check external services
    const stripeStatus = await checkStripeConnection();
    const supabaseStatus = await checkSupabaseConnection();
    
    const status = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version,
      services: {
        database: dbStatus,
        stripe: stripeStatus,
        supabase: supabaseStatus
      }
    };
    
    res.status(200).json(status);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
};
```

## Backup Strategy

### Database Backup
```bash
#!/bin/bash
# backup-db.sh

# Configuration
DB_NAME="sweettrip_db"
DB_USER="sweettrip_user"
BACKUP_DIR="/var/backups/sweettrip"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Create database backup
pg_dump -h localhost -U $DB_USER -d $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/db_backup_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +7 -delete

echo "Database backup completed: db_backup_$DATE.sql.gz"
```

### File Backup
```bash
#!/bin/bash
# backup-files.sh

# Configuration
SOURCE_DIR="/var/www/sweettrip"
BACKUP_DIR="/var/backups/sweettrip/files"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Create file backup
tar -czf $BACKUP_DIR/files_backup_$DATE.tar.gz -C $SOURCE_DIR .

# Keep only last 7 days of backups
find $BACKUP_DIR -name "files_backup_*.tar.gz" -mtime +7 -delete

echo "File backup completed: files_backup_$DATE.tar.gz"
```

## Deployment Scripts

### Deploy Script
```bash
#!/bin/bash
# deploy.sh

set -e

echo "🚀 Starting SweetTrip deployment..."

# Configuration
APP_DIR="/var/www/sweettrip"
BACKUP_DIR="/var/backups/sweettrip"
GIT_REPO="https://github.com/your-username/sweettrip.git"
BRANCH="main"

# Create backup
echo "📦 Creating backup..."
./backup-db.sh
./backup-files.sh

# Pull latest code
echo "📥 Pulling latest code..."
cd $APP_DIR
git fetch origin
git reset --hard origin/$BRANCH

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production

# Build application
echo "🔨 Building application..."
npm run build:prod

# Restart services
echo "🔄 Restarting services..."
sudo systemctl restart sweettrip
sudo systemctl reload nginx

# Health check
echo "🏥 Performing health check..."
sleep 10
curl -f http://localhost/health || {
    echo "❌ Health check failed!"
    exit 1
}

echo "✅ Deployment completed successfully!"
```

### Rollback Script
```bash
#!/bin/bash
# rollback.sh

set -e

echo "🔄 Starting SweetTrip rollback..."

# Configuration
APP_DIR="/var/www/sweettrip"
BACKUP_DIR="/var/backups/sweettrip"

# Get latest backup
LATEST_BACKUP=$(ls -t $BACKUP_DIR/db_backup_*.sql.gz | head -n1)
LATEST_FILES=$(ls -t $BACKUP_DIR/files_backup_*.tar.gz | head -n1)

if [ -z "$LATEST_BACKUP" ] || [ -z "$LATEST_FILES" ]; then
    echo "❌ No backup found!"
    exit 1
fi

echo "📦 Restoring from backup: $LATEST_BACKUP"

# Restore database
echo "🗄️ Restoring database..."
gunzip -c $LATEST_BACKUP | psql -h localhost -U sweettrip_user -d sweettrip_db

# Restore files
echo "📁 Restoring files..."
tar -xzf $LATEST_FILES -C $APP_DIR

# Restart services
echo "🔄 Restarting services..."
sudo systemctl restart sweettrip
sudo systemctl reload nginx

# Health check
echo "🏥 Performing health check..."
sleep 10
curl -f http://localhost/health || {
    echo "❌ Health check failed!"
    exit 1
}

echo "✅ Rollback completed successfully!"
```

## CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/sweettrip
            ./deploy.sh
```

## Performance Optimization

### Caching Strategy
```nginx
# Nginx caching
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Vary Accept-Encoding;
}

# API caching
location /api/products {
    proxy_cache api_cache;
    proxy_cache_valid 200 5m;
    proxy_cache_key "$scheme$request_method$host$request_uri";
    add_header X-Cache-Status $upstream_cache_status;
}
```

### CDN Configuration
```typescript
// CDN optimization
export const getOptimizedImageUrl = (url: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
}) => {
  if (url.includes('cloudflare.com')) {
    const params = new URLSearchParams();
    if (options.width) params.set('width', options.width.toString());
    if (options.height) params.set('height', options.height.toString());
    if (options.quality) params.set('quality', options.quality.toString());
    if (options.format) params.set('format', options.format);
    
    return `${url}?${params.toString()}`;
  }
  
  return url;
};
```

## Security Considerations

### Security Headers
```nginx
# Security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.stripe.com https://*.supabase.co;" always;
```

### Rate Limiting
```nginx
# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

location /api/ {
    limit_req zone=api burst=20 nodelay;
    # ... rest of configuration
}
```

## Troubleshooting

### Common Issues
1. **Build failures**: Check Node.js version and dependencies
2. **Docker issues**: Verify Dockerfile and docker-compose.yml
3. **Nginx errors**: Check configuration syntax and permissions
4. **SSL problems**: Verify certificate installation and renewal
5. **Database connection**: Check connection strings and permissions

### Debug Commands
```bash
# Check Docker logs
docker logs sweettrip-container

# Check Nginx status
sudo systemctl status nginx

# Check application logs
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log

# Test configuration
sudo nginx -t

# Check SSL certificate
sudo certbot certificates
```

## Migration Notes

1. **Environment**: Set up all environment variables
2. **SSL**: Configure SSL certificates
3. **Database**: Set up database and run migrations
4. **Monitoring**: Configure logging and monitoring
5. **Backup**: Set up automated backups
6. **Security**: Implement security headers and rate limiting
7. **Performance**: Optimize caching and CDN
8. **Testing**: Test all functionality in production environment
