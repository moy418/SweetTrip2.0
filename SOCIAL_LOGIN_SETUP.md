# 🔐 Configuración de Social Login - SweetTrip

## ✅ Ya Implementado en el Código:

- ✅ Función `signInWithSocial` en authStore
- ✅ Botones de Google y Facebook en Login/Register
- ✅ Página de callback `/auth/callback`
- ✅ Loading states y animaciones
- ✅ Manejo de errores

## 🚀 Configuración en Supabase (5 minutos):

### Paso 1: Ir a tu Dashboard de Supabase

1. Abre: https://supabase.com/dashboard/project/pmqcegwfucfbwwmwumkk
2. Ve a **Authentication** → **Providers**

---

### Paso 2: Habilitar Google OAuth

#### 2.1 Crear Credenciales en Google Cloud:

1. Ve a: https://console.cloud.google.com/
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Application type: **Web application**
6. Name: "SweetTrip"

#### 2.2 Configurar URLs autorizadas:

**Authorized JavaScript origins:**
```
http://localhost:3000
https://pmqcegwfucfbwwmwumkk.supabase.co
```

**Authorized redirect URIs:**
```
https://pmqcegwfucfbwwmwumkk.supabase.co/auth/v1/callback
```

#### 2.3 Copiar Credenciales:

- Copia el **Client ID**
- Copia el **Client Secret**

#### 2.4 Configurar en Supabase:

1. En tu proyecto Supabase → **Authentication** → **Providers**
2. Busca **Google** y haz click
3. **Enable** Google provider
4. Pega el **Client ID**
5. Pega el **Client Secret**
6. **Save**

---

### Paso 3: Habilitar Facebook OAuth

#### 3.1 Crear App en Facebook Developers:

1. Ve a: https://developers.facebook.com/
2. Click **My Apps** → **Create App**
3. Choose **Consumer** o **Business**
4. App name: "SweetTrip"
5. Contact email: tu email
6. Create App

#### 3.2 Configurar Facebook Login:

1. En el dashboard de tu app → **Add Product**
2. Selecciona **Facebook Login** → **Set Up**
3. Choose **Web**
4. Site URL: `http://localhost:3000`

#### 3.3 Configurar Valid OAuth Redirect URIs:

1. Ve a **Facebook Login** → **Settings**
2. En **Valid OAuth Redirect URIs** añade:
```
https://pmqcegwfucfbwwmwumkk.supabase.co/auth/v1/callback
```

#### 3.4 Copiar Credenciales:

1. Ve a **Settings** → **Basic**
2. Copia el **App ID**
3. Click **Show** en App Secret y cópialo

#### 3.5 Configurar en Supabase:

1. En tu proyecto Supabase → **Authentication** → **Providers**
2. Busca **Facebook** y haz click
3. **Enable** Facebook provider
4. Pega el **App ID** (como Client ID)
5. Pega el **App Secret** (como Client Secret)
6. **Save**

---

### Paso 4: Configurar URLs en Supabase

1. Ve a **Authentication** → **URL Configuration**
2. **Site URL**: `http://localhost:3000`
3. **Redirect URLs**: Añade estas URLs:
   ```
   http://localhost:3000/auth/callback
   http://localhost:3000
   ```

4. Click **Save**

---

## 🧪 Probar Social Login:

### En Localhost:

1. Ve a: http://localhost:3000/login
2. Click en botón **Google** o **Facebook**
3. Autoriza la aplicación
4. Serás redirigido a `/auth/callback`
5. Luego a la página principal (logged in)

### Debugging:

Si algo no funciona:
1. Abre Developer Tools (F12)
2. Ve a Console
3. Busca mensajes de error
4. Verifica que las URLs de callback coincidan exactamente

---

## 📋 Checklist de Configuración:

- [ ] Google Cloud Console - OAuth Client creado
- [ ] Google - Client ID y Secret copiados
- [ ] Supabase - Google provider habilitado
- [ ] Facebook Developers - App creada
- [ ] Facebook - App ID y Secret copiados  
- [ ] Supabase - Facebook provider habilitado
- [ ] Supabase - Site URL configurada
- [ ] Supabase - Redirect URLs añadidas
- [ ] Prueba en localhost

---

## 🎯 Resultado Final:

Una vez configurado, tus usuarios podrán:
- ✅ Login con Google en 1 click
- ✅ Login con Facebook en 1 click
- ✅ Sin necesidad de crear contraseña
- ✅ Información del perfil auto-completada
- ✅ Experiencia rápida y segura

---

## 🔧 Para Producción:

Cuando despliegues a producción, necesitas:

1. **Actualizar URLs en Google:**
   - Añadir tu dominio a Authorized origins
   - Actualizar redirect URIs con tu dominio

2. **Actualizar URLs en Facebook:**
   - Cambiar Site URL a tu dominio
   - Actualizar Valid OAuth Redirect URIs

3. **Actualizar en Supabase:**
   - Site URL: `https://tudominio.com`
   - Redirect URLs: Añadir `https://tudominio.com/auth/callback`

---

**Estado Actual:** ✅ Código implementado | ⏳ Esperando configuración en Supabase

**Tiempo estimado de configuración:** 5-10 minutos

¡Una vez configurado, el social login funcionará perfectamente! 🎉

