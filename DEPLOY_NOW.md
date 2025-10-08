# 🚀 GUÍA RÁPIDA DE DESPLIEGUE - SweetTrip 2.0

## ⚡ Despliegue Express (30 minutos)

Esta es la guía paso a paso para reemplazar la versión antigua en **www.sweettripcandy.com**.

---

## 📋 Pre-requisitos

- ✅ Acceso SSH al servidor de sweettripcandy.com
- ✅ Credenciales de Supabase (ya las tienes)
- ✅ Credenciales de Stripe (ya las tienes)
- ✅ Dominio apuntando al servidor

---

## 🎯 PASO A PASO

### 1️⃣ Preparar Código para Subir (EN TU MÁQUINA LOCAL)

```bash
cd /home/hectormoy/Desktop/st2.1/SweetTrip2.0

# Añadir todos los archivos al repo
git add .

# Commit
git commit -m "SweetTrip 2.0 - Ready for production deployment

- Complete Stripe integration
- Guest checkout enabled
- Multi-language support (ES, EN, FR, PT)
- Social login (Google, Facebook)
- Modern UI/UX
- Email notifications
- Product detail pages with galleries
- Mobile responsive"

# Push al repositorio
git push origin main
```

### 2️⃣ Conectar al Servidor

```bash
ssh user@sweettripcandy.com
```

### 3️⃣ Setup Inicial del Servidor (Solo Primera Vez)

```bash
# Descargar y ejecutar script de setup
curl -o setup-server.sh https://raw.githubusercontent.com/<tu-repo>/main/scripts/setup-server.sh
sudo chmod +x setup-server.sh
sudo ./setup-server.sh
```

**O manualmente:**

```bash
# Instalar Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs nginx

# Instalar PM2
sudo npm install -g pm2

# Instalar Certbot para SSL
sudo apt install certbot python3-certbot-nginx
```

### 4️⃣ Clonar el Proyecto

```bash
# Crear directorio
sudo mkdir -p /var/www/sweettrip
sudo chown -R $USER:$USER /var/www/sweettrip

# Clonar repositorio
cd /var/www/sweettrip
git clone <URL-DE-TU-REPOSITORIO> .

# O si ya existe:
git pull origin main
```

### 5️⃣ Configurar Variables de Entorno

```bash
cd /var/www/sweettrip

# Crear .env desde la plantilla
nano .env
```

**Copiar este contenido exacto:**

```env
# Supabase (get from: https://supabase.com/dashboard/project/pmqcegwfucfbwwmwumkk/settings/api)
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

# Stripe (get from: https://dashboard.stripe.com/apikeys)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_PUBLISHABLE_KEY
STRIPE_SECRET_KEY=sk_live_YOUR_SECRET_KEY

# Email
VITE_ADMIN_EMAIL=orders@sweettripcandy.com

# App Configuration
VITE_APP_URL=https://www.sweettripcandy.com
VITE_APP_NAME=SweetTrip
NODE_ENV=production
PORT=3001
```

**NOTA**: Copia las keys reales de tu archivo `.env` local al crear el `.env` en el servidor.

Guardar: `Ctrl+X`, `Y`, `Enter`

### 6️⃣ Instalar Dependencias y Build

```bash
# Instalar dependencias
npm install

# Build del frontend
npm run build

# Verificar que dist/ se creó
ls -la dist/
```

### 7️⃣ Configurar Nginx

```bash
# Crear configuración
sudo nano /etc/nginx/sites-available/sweettrip
```

**Copiar esta configuración:**

```nginx
server {
    listen 80;
    server_name www.sweettripcandy.com sweettripcandy.com;

    root /var/www/sweettrip/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;

    # Frontend
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API Backend
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Activar configuración:**

```bash
# Habilitar sitio
sudo ln -sf /etc/nginx/sites-available/sweettrip /etc/nginx/sites-enabled/

# Desactivar sitio antiguo
sudo rm -f /etc/nginx/sites-enabled/default

# Probar configuración
sudo nginx -t

# Recargar nginx
sudo systemctl reload nginx
```

### 8️⃣ Iniciar Backend

```bash
cd /var/www/sweettrip

# Iniciar con PM2
pm2 start server.cjs --name sweettrip-backend

# Guardar configuración PM2
pm2 save

# Auto-start en reboot
pm2 startup
# (Copiar y ejecutar el comando que muestra)
```

### 9️⃣ Configurar SSL (HTTPS)

```bash
# Obtener certificado SSL
sudo certbot --nginx -d sweettripcandy.com -d www.sweettripcandy.com

# Seguir las instrucciones (acepta términos, ingresa email, etc.)
```

### 🔟 Configurar Webhook de Stripe

1. Ir a: https://dashboard.stripe.com/webhooks
2. **Add endpoint**
3. **Endpoint URL**: `https://www.sweettripcandy.com/api/webhook`
4. **Events to send**:
   - `checkout.session.completed`
   - `payment_intent.succeeded`  
   - `payment_intent.payment_failed`
5. Click **Add endpoint**
6. Copiar el **Signing secret** (whsec_...)
7. Añadirlo al .env:

```bash
nano .env
# Añadir línea:
# STRIPE_WEBHOOK_SECRET=whsec_...
# Guardar y cerrar

# Reiniciar backend
pm2 restart sweettrip-backend
```

---

## ✅ VERIFICACIÓN FINAL

### Tests Rápidos:

```bash
# 1. Health check del backend
curl https://www.sweettripcandy.com/api/health

# 2. PM2 status
pm2 status

# 3. Nginx status
sudo systemctl status nginx
```

### Tests en Navegador:

1. ✅ Abrir: https://www.sweettripcandy.com
2. ✅ Ver productos
3. ✅ Cambiar idioma (🌐 selector)
4. ✅ Click en producto → ver galería
5. ✅ Añadir al carrito
6. ✅ Checkout como invitado
7. ✅ Completar pago (usar tarjeta REAL en modo live)
8. ✅ Verificar email de confirmación
9. ✅ Probar login/register
10. ✅ Probar social login (Google/Facebook)

---

## 🎉 ¡LISTO!

Tu sitio está ahora en producción en:
**https://www.sweettripcandy.com**

---

## 📊 Monitoreo Post-Despliegue

### Ver Logs en Tiempo Real:

```bash
# Logs del backend
pm2 logs sweettrip-backend

# Logs de Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Dashboards a Monitorear:

- **Stripe**: https://dashboard.stripe.com/payments
- **Supabase**: https://supabase.com/dashboard/project/pmqcegwfucfbwwmwumkk
- **Zapier**: Para verificar que los emails se envían

---

## 🆘 Si Algo Sale Mal

### Rollback Rápido:

```bash
# Detener nueva versión
pm2 stop sweettrip-backend

# Restaurar nginx antiguo
sudo systemctl start <servidor-antiguo>

# Contactar soporte
```

### Logs para Debugging:

```bash
pm2 logs sweettrip-backend --lines 100
sudo tail -50 /var/log/nginx/error.log
```

---

## 📞 Contacto de Emergencia

- Email: support@sweettripcandy.com
- Stripe Support: https://support.stripe.com
- Supabase Support: https://supabase.com/support

---

**Tiempo Estimado Total**: 30-45 minutos
**Downtime Esperado**: 5-10 minutos (durante el switch de Nginx)
**Dificultad**: Media

**¡Éxito con el despliegue!** 🚀🍭

