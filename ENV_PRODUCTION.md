# 🔐 Variables de Entorno para Producción

## Archivo: `.env` (En el Servidor)

Copiar este contenido al archivo `.env` en el servidor de producción:

```env
# ====================================
# PRODUCTION ENVIRONMENT VARIABLES
# SweetTrip 2.0 - www.sweettripcandy.com
# ====================================

# Supabase Configuration
VITE_SUPABASE_URL=https://pmqcegwfucfbwwmwumkk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtcWNlZ3dmdWNmYnd3bXd1bWtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTc3NzMsImV4cCI6MjA3MjkzMzc3M30.1oXas_KE7PBq6GyjOkV9lFZaAqQZGlE-8YLCSNgnDjc

# Stripe Configuration (LIVE MODE)
# Get these from: https://dashboard.stripe.com/apikeys
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_PUBLISHABLE_KEY_HERE
STRIPE_SECRET_KEY=sk_live_YOUR_SECRET_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE

# Email Configuration
VITE_ADMIN_EMAIL=orders@sweettripcandy.com

# App Configuration (PRODUCTION)
VITE_APP_URL=https://www.sweettripcandy.com
VITE_APP_NAME=SweetTrip
VITE_APP_DESCRIPTION=International Candy E-commerce Platform

# Environment
NODE_ENV=production

# Server Configuration
PORT=3001
```

## ⚠️ IMPORTANTE:

### Antes de Desplegar:

1. **STRIPE_WEBHOOK_SECRET**: Obtener de Stripe Dashboard después de crear el webhook
2. **VITE_APP_URL**: Cambiar a www.sweettripcandy.com (ya está correcto arriba)
3. **NODE_ENV**: DEBE ser "production"

### Diferencias Local vs Producción:

| Variable | Local | Producción |
|----------|-------|------------|
| VITE_APP_URL | http://localhost:3000 | https://www.sweettripcandy.com |
| NODE_ENV | development | production |
| STRIPE_WEBHOOK_SECRET | (no necesario) | whsec_... (REQUERIDO) |

### Cómo Aplicar en el Servidor:

```bash
# SSH al servidor
ssh user@sweettripcandy.com

# Ir al directorio del proyecto
cd /var/www/sweettrip

# Crear archivo .env
nano .env

# Pegar el contenido de arriba
# Ctrl+X, Y, Enter para guardar

# Verificar que esté correcto
cat .env

# Rebuild del frontend con las nuevas variables
npm run build

# Reiniciar backend
pm2 restart sweettrip-backend
```

## 🔑 Obtener el Webhook Secret de Stripe:

1. Ir a: https://dashboard.stripe.com/webhooks
2. Crear webhook endpoint: `https://www.sweettripcandy.com/api/webhook`
3. Seleccionar eventos:
   - checkout.session.completed
   - payment_intent.succeeded
   - payment_intent.payment_failed
4. Copiar el **Signing secret** (empieza con whsec_)
5. Añadir a .env como `STRIPE_WEBHOOK_SECRET`

## ✅ Verificación Post-Despliegue:

```bash
# 1. Verificar que las variables se cargaron
pm2 logs sweettrip-backend | grep "Stripe backend server running"

# 2. Probar el health check
curl https://api.sweettripcandy.com/api/health

# 3. Verificar frontend
curl https://www.sweettripcandy.com | head -20

# 4. Probar checkout (añadir producto y comprar)
```

---

**Fecha de Creación**: $(date)
**Versión**: 2.0
**Última Actualización**: Preparado para producción

