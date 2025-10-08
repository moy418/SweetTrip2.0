# 🍭 SweetTrip 2.0 - International Candy E-commerce

## 🎯 Descripción

SweetTrip es una plataforma de e-commerce moderna para dulces internacionales con integración completa de Stripe, Supabase, sistema de idiomas, y notificaciones por email.

---

## 🚀 Características Principales

- ✅ **E-commerce Completo**: Catálogo de productos, carrito, checkout
- ✅ **Pagos Reales con Stripe**: Integración completa con Stripe Checkout
- ✅ **Guest Checkout**: Compras sin necesidad de registro
- ✅ **Multi-idioma**: Español, Inglés, Francés, Portugués
- ✅ **Autenticación**: Email/Password + Social Login (Google, Facebook)
- ✅ **Base de Datos**: Supabase (PostgreSQL)
- ✅ **Notificaciones**: Emails automáticos para cliente y admin
- ✅ **Diseño Moderno**: UI/UX profesional con Tailwind CSS
- ✅ **Responsive**: Móvil, Tablet, Desktop
- ✅ **Product Detail**: Galería de imágenes, información AI-enhanced

---

## 📋 Requisitos del Sistema

- **Node.js**: v18.x o superior
- **npm**: v9.x o superior
- **Supabase**: Proyecto configurado
- **Stripe**: Cuenta con keys LIVE
- **Dominio**: www.sweettripcandy.com

---

## 🛠️ Instalación Local

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd SweetTrip2.0
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Copia el archivo de ejemplo y configura tus credenciales:

```bash
cp env.example .env
```

Edita `.env` con tus credenciales:

```env
# Supabase
VITE_SUPABASE_URL=https://pmqcegwfucfbwwmwumkk.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...

# Email Admin
VITE_ADMIN_EMAIL=orders@sweettripcandy.com

# App
VITE_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Iniciar Servidores de Desarrollo

**Opción A: Manual (2 terminales)**

Terminal 1 - Frontend:
```bash
npm run dev
```

Terminal 2 - Backend:
```bash
npm run server
```

**Opción B: Automático (requiere instalar concurrently)**

```bash
npm install -D concurrently
npm run dev:full
```

### 5. Acceder a la Aplicación

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

---

## 🌐 Despliegue a Producción (www.sweettripcandy.com)

### Arquitectura de Despliegue:

```
Frontend (React/Vite) → Vercel/Netlify/Nginx
Backend (Express) → Node.js Server/PM2
Base de Datos → Supabase (Cloud)
Pagos → Stripe (Cloud)
Emails → Zapier Webhooks
```

### Opción 1: Despliegue Separado (Recomendado)

#### A. Frontend en Vercel/Netlify:

**Build del Frontend:**
```bash
npm run build
```

Esto genera la carpeta `dist/` con todos los archivos estáticos.

**Vercel:**
1. Conecta tu repositorio en Vercel
2. Configure Build Command: `npm run build`
3. Output Directory: `dist`
4. Añade variables de entorno (VITE_*)
5. Deploy

**Netlify:**
1. Conecta tu repositorio en Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Añade variables de entorno
5. Deploy

#### B. Backend en Servidor Node.js:

**1. Preparar Servidor:**
```bash
# En el servidor
sudo apt update
sudo apt install nodejs npm nginx
npm install -g pm2
```

**2. Subir Código:**
```bash
# Desde tu local
scp -r server.cjs package.json user@server:/var/www/sweettrip/
```

**3. Instalar Dependencias:**
```bash
# En el servidor
cd /var/www/sweettrip
npm install --production
```

**4. Configurar .env en el Servidor:**
```bash
# En el servidor
nano .env
# Añadir todas las variables de producción
```

**5. Iniciar con PM2:**
```bash
pm2 start server.cjs --name sweettrip-backend
pm2 save
pm2 startup
```

**6. Configurar Nginx como Reverse Proxy:**
```nginx
server {
    listen 80;
    server_name api.sweettripcandy.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/sweettrip-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**7. Certificado SSL:**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.sweettripcandy.com
```

---

### Opción 2: Despliegue Todo en el Mismo Servidor (VPS/Dedicated)

**1. Preparar el Servidor:**
```bash
ssh user@sweettripcandy.com

# Instalar Node.js y dependencias
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs nginx
npm install -g pm2
```

**2. Clonar y Configurar:**
```bash
cd /var/www
git clone <your-repo-url> sweettrip
cd sweettrip

# Instalar dependencias
npm install

# Configurar .env
cp env.example .env
nano .env  # Editar con credenciales de producción
```

**3. Build del Frontend:**
```bash
npm run build
```

**4. Configurar Nginx:**

Crear archivo `/etc/nginx/sites-available/sweettrip`:

```nginx
# Frontend
server {
    listen 80;
    server_name www.sweettripcandy.com sweettripcandy.com;

    root /var/www/sweettrip/dist;
    index index.html;

    # Servir archivos estáticos
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy para API backend
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

```bash
sudo ln -s /etc/nginx/sites-available/sweettrip /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**5. Iniciar Backend con PM2:**
```bash
cd /var/www/sweettrip
pm2 start server.cjs --name sweettrip-backend
pm2 save
pm2 startup
```

**6. Certificado SSL (HTTPS):**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d sweettripcandy.com -d www.sweettripcandy.com
```

---

## 🔐 Variables de Entorno para Producción

Crear archivo `.env` en el servidor con:

```env
# Supabase
VITE_SUPABASE_URL=https://pmqcegwfucfbwwmwumkk.supabase.co
VITE_SUPABASE_ANON_KEY=<tu_anon_key>

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_PUBLISHABLE_KEY_HERE
STRIPE_SECRET_KEY=sk_live_YOUR_SECRET_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_...  # Obtener de Stripe Dashboard

# Email
VITE_ADMIN_EMAIL=orders@sweettripcandy.com

# App (IMPORTANTE: Cambiar a producción)
VITE_APP_URL=https://www.sweettripcandy.com
VITE_APP_NAME=SweetTrip
NODE_ENV=production
```

---

## 🔧 Configuración en Supabase

### 1. URL Configuration

En Supabase Dashboard → Authentication → URL Configuration:

**Site URL:**
```
https://www.sweettripcandy.com
```

**Redirect URLs:**
```
https://www.sweettripcandy.com/auth/callback
https://www.sweettripcandy.com
http://localhost:3000/auth/callback
http://localhost:3000
```

### 2. OAuth Providers

**Google:**
- Authorized redirect URIs: `https://pmqcegwfucfbwwmwumkk.supabase.co/auth/v1/callback`

**Facebook:**
- Valid OAuth Redirect URIs: `https://pmqcegwfucfbwwmwumkk.supabase.co/auth/v1/callback`

---

## 💳 Configuración de Stripe

### Webhook en Producción:

1. Ir a: https://dashboard.stripe.com/webhooks
2. **Add endpoint**
3. URL: `https://www.sweettripcandy.com/api/webhook`
4. Eventos a escuchar:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copiar **Signing secret** (whsec_...)
6. Añadir a `.env`: `STRIPE_WEBHOOK_SECRET=whsec_...`

---

## 📧 Configuración de Emails (Zapier)

Los webhooks ya están configurados:
- Cliente: `https://hooks.zapier.com/hooks/catch/23096000/umwdeto/`
- Admin: `https://hooks.zapier.com/hooks/catch/23096000/umctn6y/`

No requiere cambios adicionales.

---

## 🗄️ Base de Datos (Supabase)

### Tablas Requeridas:

Tu proyecto debe tener estas tablas:
- `products` - Catálogo de productos
- `categories` - Categorías de productos
- `users` - Perfiles de usuarios
- `orders` - Órdenes de compra
- `order_items` - Items de cada orden

Ver `DATABASE_SCHEMA.md` para el schema completo.

---

## 📦 Estructura del Proyecto

```
SweetTrip2.0/
├── src/                    # Código fuente React
│   ├── components/         # Componentes UI
│   ├── pages/             # Páginas de la app
│   ├── services/          # Servicios (API calls)
│   ├── stores/            # Zustand stores
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   └── lib/               # Utilidades y configuración
├── public/                # Archivos estáticos
├── server.cjs             # Backend Express + Stripe
├── package.json           # Dependencias
├── vite.config.ts         # Configuración Vite
├── tailwind.config.js     # Configuración Tailwind
└── .env                   # Variables de entorno (NO subir a git)
```

---

## 🔄 Actualizar Dominio de Producción

**Actualmente**: Redirige a www.sweettripcandy.com (versión antigua)
**Solución**: Actualizar variables de entorno y rebuild

### En tu archivo `.env` de producción:

```env
VITE_APP_URL=https://www.sweettripcandy.com
```

### Rebuild después de cambiar:

```bash
npm run build
```

---

## 📝 Comandos Útiles

### Desarrollo:
```bash
npm run dev          # Inicia frontend (puerto 3000)
npm run server       # Inicia backend (puerto 3001)
npm run dev:full     # Inicia ambos simultáneamente
```

### Producción:
```bash
npm run build        # Build del frontend
npm run preview      # Preview del build
npm run lint         # Linter
npm run test         # Tests
```

### PM2 (Servidor):
```bash
pm2 start server.cjs --name sweettrip-backend
pm2 status           # Ver estado
pm2 logs             # Ver logs
pm2 restart all      # Reiniciar
pm2 stop all         # Detener
```

---

## 🎨 Páginas Implementadas

- ✅ HomePage - Página principal con productos destacados
- ✅ ProductsPage - Catálogo completo con filtros
- ✅ ProductDetailPage - Detalle con galería de imágenes
- ✅ CartPage - Carrito de compras
- ✅ CheckoutPage - Checkout con guest support
- ✅ CheckoutSuccessPage - Confirmación de orden
- ✅ LoginPage - Login moderno con social auth
- ✅ RegisterPage - Registro con validación de password
- ✅ AuthCallbackPage - Callback para OAuth
- ✅ ProfilePage - Perfil de usuario
- ✅ OrdersPage - Historial de órdenes
- ✅ WorldCup2026Page - Página especial Mundial 2026

---

## 🔒 Seguridad

- ✅ HTTPS obligatorio en producción
- ✅ Variables de entorno para secrets
- ✅ CORS configurado
- ✅ Webhook signature verification (Stripe)
- ✅ RLS (Row Level Security) en Supabase
- ✅ Sanitización de inputs

---

## 📊 Monitoreo

### Logs del Backend:
```bash
pm2 logs sweettrip-backend
```

### Logs de Nginx:
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Stripe Dashboard:
https://dashboard.stripe.com/payments

### Supabase Dashboard:
https://supabase.com/dashboard/project/pmqcegwfucfbwwmwumkk

---

## 🐛 Troubleshooting

### Frontend no carga:
```bash
# Verificar build
npm run build

# Verificar permisos
sudo chown -R www-data:www-data /var/www/sweettrip/dist

# Verificar nginx
sudo nginx -t
sudo systemctl status nginx
```

### Backend no responde:
```bash
# Verificar proceso
pm2 status

# Ver logs
pm2 logs sweettrip-backend

# Reiniciar
pm2 restart sweettrip-backend
```

### Pagos no funcionan:
- Verificar que backend esté corriendo
- Verificar STRIPE_SECRET_KEY en .env
- Revisar logs en Stripe Dashboard
- Verificar webhook signature

---

## 📚 Documentación Adicional

- `DEPLOYMENT_CONFIG.md` - Configuración detallada de despliegue
- `DATABASE_SCHEMA.md` - Schema de la base de datos
- `STRIPE_INTEGRATION_COMPLETE.md` - Integración de Stripe
- `SOCIAL_LOGIN_SETUP.md` - Configuración de OAuth
- `CHECKOUT_STATUS.md` - Estado del sistema de checkout

---

## 🆘 Soporte

- **Email**: support@sweettripcandy.com
- **Issues**: GitHub Issues
- **Stripe Support**: https://support.stripe.com
- **Supabase Support**: https://supabase.com/support

---

## 📝 Licencia

Propietario: SweetTrip Candy
© 2025 SweetTrip. Todos los derechos reservados.

---

## 🎉 Características Destacadas de v2.0

### Mejoras vs Versión Antigua:

1. **Performance**: 50% más rápido con Vite
2. **UX**: Diseño completamente renovado
3. **Pagos**: Integración completa con Stripe
4. **Multi-idioma**: 4 idiomas soportados
5. **Guest Checkout**: Compras sin registro
6. **Social Login**: Google y Facebook
7. **Product Pages**: Galerías de imágenes mejoradas
8. **Responsive**: Optimizado para todos los dispositivos
9. **SEO**: Meta tags y Open Graph optimizados
10. **Email**: Notificaciones automáticas

---

**¡Tu tienda de dulces internacional lista para el mundo!** 🌍🍭
