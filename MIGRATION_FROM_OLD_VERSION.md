# 🔄 Guía de Migración: Versión Antigua → SweetTrip 2.0

## 📌 Resumen

Esta guía te ayudará a reemplazar la versión antigua de SweetTrip que está en www.sweettripcandy.com con la nueva versión 2.0.

---

## ⚠️ IMPORTANTE: Backup Primero

### Antes de hacer cualquier cambio:

```bash
# SSH al servidor actual
ssh user@sweettripcandy.com

# Hacer backup completo
sudo mkdir -p /backups
sudo tar -czf /backups/sweettrip-old-$(date +%Y%m%d).tar.gz /var/www/html/

# Backup de la base de datos (si aplica)
# Si tienes MySQL/PostgreSQL local, hacer dump
```

---

## 🗺️ Plan de Migración

### Opción A: Migración Directa (Downtime Mínimo - 5 min)

**Pasos:**

1. **Preparar nueva versión en directorio temporal**
2. **Hacer switch rápido con Nginx**
3. **Verificar funcionamiento**
4. **Rollback si algo falla**

### Opción B: Migración Gradual (Sin Downtime)

**Pasos:**

1. **Subir nueva versión a subdomain** (beta.sweettripcandy.com)
2. **Probar completamente**
3. **Switch del DNS cuando esté listo**

---

## 🚀 Migración Directa (Recomendada)

### Paso 1: Preparar el Servidor

```bash
# SSH al servidor
ssh user@sweettripcandy.com

# Detener servicios antiguos si hay
sudo systemctl stop apache2  # o el web server actual
# O si usa PM2:
pm2 stop all

# Crear directorio para nueva versión
sudo mkdir -p /var/www/sweettrip-new
```

### Paso 2: Subir Nueva Versión

**Desde tu máquina local:**

```bash
cd /home/hectormoy/Desktop/st2.1/SweetTrip2.0

# Crear tarball del proyecto
tar -czf sweettrip-2.0.tar.gz \
  --exclude=node_modules \
  --exclude=.git \
  --exclude=dist \
  --exclude=.env \
  .

# Subir al servidor
scp sweettrip-2.0.tar.gz user@sweettripcandy.com:/tmp/
```

**En el servidor:**

```bash
# Extraer archivos
cd /var/www/sweettrip-new
sudo tar -xzf /tmp/sweettrip-2.0.tar.gz

# Cambiar permisos
sudo chown -R $USER:$USER /var/www/sweettrip-new
```

### Paso 3: Instalar Dependencias

```bash
cd /var/www/sweettrip-new

# Instalar dependencias
npm install

# Copiar variables de entorno
nano .env
# Pegar contenido de ENV_PRODUCTION.md
```

### Paso 4: Build del Frontend

```bash
npm run build

# Verificar que dist/ se creó
ls -la dist/
```

### Paso 5: Configurar Nginx

```bash
# Backup de configuración antigua
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup

# Crear nueva configuración
sudo nano /etc/nginx/sites-available/sweettrip

# Pegar configuración (ver setup-server.sh para el contenido)

# Habilitar nueva configuración
sudo ln -sf /etc/nginx/sites-available/sweettrip /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Probar configuración
sudo nginx -t

# Si todo OK, recargar
sudo systemctl reload nginx
```

### Paso 6: Iniciar Backend

```bash
cd /var/www/sweettrip-new

# Iniciar con PM2
pm2 start server.cjs --name sweettrip-backend

# Auto-start en reboot
pm2 save
pm2 startup

# Verificar estado
pm2 status
```

### Paso 7: Verificar Funcionamiento

```bash
# Health check del backend
curl http://localhost:3001/api/health

# Check del frontend
curl http://localhost | grep SweetTrip

# Desde navegador
# Ir a: https://www.sweettripcandy.com
```

### Paso 8: SSL (Si no está configurado)

```bash
sudo certbot --nginx -d sweettripcandy.com -d www.sweettripcandy.com

# Verificar renovación automática
sudo certbot renew --dry-run
```

---

## 🔄 Rollback (Si algo sale mal)

```bash
# Detener nueva versión
pm2 stop sweettrip-backend

# Restaurar nginx antiguo
sudo cp /etc/nginx/sites-available/default.backup /etc/nginx/sites-enabled/default
sudo systemctl reload nginx

# Restaurar archivos antiguos
sudo rm -rf /var/www/html
sudo tar -xzf /backups/sweettrip-old-*.tar.gz -C /

# Reiniciar servidor web antiguo
sudo systemctl start apache2  # o lo que usabas antes
```

---

## 📊 Verificación Post-Migración

### Checklist:

- [ ] ✅ Sitio carga en https://www.sweettripcandy.com
- [ ] ✅ Productos se muestran correctamente
- [ ] ✅ Carrito funciona
- [ ] ✅ Checkout redirige a Stripe
- [ ] ✅ Pagos se procesan correctamente
- [ ] ✅ Emails se envían (cliente + admin)
- [ ] ✅ Login/Register funcionan
- [ ] ✅ Social login funciona (Google/Facebook)
- [ ] ✅ Cambio de idioma funciona
- [ ] ✅ Responsive en móvil
- [ ] ✅ SSL activo (candado verde)

### Tests de Compra:

1. **Test Completo:**
   - Añadir productos al carrito
   - Checkout como invitado
   - Completar pago en Stripe
   - Verificar email de confirmación
   - Verificar que llegó email a admin

2. **Test de Login:**
   - Login con email/password
   - Login con Google
   - Login con Facebook
   - Verificar perfil de usuario

3. **Test Mobile:**
   - Abrir en móvil
   - Navegar por productos
   - Probar checkout
   - Verificar responsive

---

## 🔧 Troubleshooting Común

### Frontend no carga:

```bash
# Verificar que dist/ existe
ls -la /var/www/sweettrip-new/dist

# Verificar permisos
sudo chown -R www-data:www-data /var/www/sweettrip-new/dist

# Verificar nginx
sudo nginx -t
sudo systemctl status nginx
```

### Backend no responde:

```bash
# Ver logs
pm2 logs sweettrip-backend

# Verificar que .env existe
cat /var/www/sweettrip-new/.env

# Reiniciar
pm2 restart sweettrip-backend
```

### Stripe no funciona:

- Verificar STRIPE_SECRET_KEY en .env
- Verificar que backend está corriendo en puerto 3001
- Revisar logs: `pm2 logs sweettrip-backend`
- Verificar en Stripe Dashboard

---

## 📁 Cambiar Root Directory Permanentemente

Una vez verificado que todo funciona:

```bash
# Opción 1: Mover archivos
sudo rm -rf /var/www/html-old
sudo mv /var/www/html /var/www/html-old
sudo mv /var/www/sweettrip-new /var/www/sweettrip

# Opción 2: Actualizar symlink
sudo rm /var/www/html
sudo ln -s /var/www/sweettrip/dist /var/www/html
```

---

## 📧 Diferencias Clave vs Versión Antigua

### Nueva Arquitectura:

| Componente | Antigua | Nueva |
|------------|---------|-------|
| Frontend | HTML/JS Estático | React + TypeScript + Vite |
| Backend | PHP/WordPress? | Node.js + Express |
| Pagos | Manual/Otro | Stripe Checkout |
| Base de Datos | MySQL Local? | Supabase (PostgreSQL Cloud) |
| Autenticación | Básica | Supabase Auth + OAuth |
| Emails | Manual | Zapier Webhooks Automáticos |
| Idiomas | Solo Inglés? | 4 Idiomas (ES, EN, FR, PT) |

### Nuevas Funcionalidades:

- ✅ Guest Checkout
- ✅ Social Login (Google/Facebook)
- ✅ Multi-idioma
- ✅ Product Detail mejorado
- ✅ Notificaciones automáticas
- ✅ UI/UX moderna
- ✅ Mobile-first responsive
- ✅ PWA ready

---

## 🎯 Timeline Recomendado

### Día 1: Preparación
- Setup del servidor
- Instalar dependencias
- Configurar .env

### Día 2: Migración
- Subir código
- Build y configurar
- Probar en subdomain

### Día 3: Go Live
- Switch de DNS/Nginx
- Monitorear primeras horas
- Ajustes finales

---

## 📞 Soporte Post-Migración

Primeras 48 horas: Monitorear activamente
- Logs de Nginx
- Logs de PM2
- Dashboard de Stripe
- Emails de clientes

---

**¡La nueva versión está lista para reemplazar la antigua!** 🎉

