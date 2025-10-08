# 📤 Instrucciones para Subir al Repositorio

## ✅ Commit Ya Realizado

El commit se hizo exitosamente con 28 archivos:

```
Commit: 74a2c16
Mensaje: "SweetTrip 2.0 - Production ready deployment"
Archivos: 28 changed, 7945 insertions(+), 1148 deletions(-)
```

---

## 🔐 Para Hacer el Push:

### Opción 1: Usar GitHub CLI (Recomendado)

```bash
# Instalar gh si no lo tienes
sudo apt install gh

# Autenticar
gh auth login

# Hacer push
cd /home/hectormoy/Desktop/st2.1/SweetTrip2.0
git push origin main
```

### Opción 2: Usar Token de GitHub

1. **Generar Token:**
   - Ir a: https://github.com/settings/tokens
   - Click "Generate new token" (classic)
   - Seleccionar scopes: `repo` (todos)
   - Copiar el token

2. **Hacer Push con Token:**

```bash
cd /home/hectormoy/Desktop/st2.1/SweetTrip2.0

# Método 1: Con credenciales en URL (temporal)
git push https://TU_TOKEN@github.com/moy418/SweetTrip2.0.git main

# Método 2: Guardar credenciales
git config credential.helper store
git push origin main
# Te pedirá usuario y password (usa el token como password)
```

### Opción 3: Usar SSH

```bash
# Generar key SSH
ssh-keygen -t ed25519 -C "tu_email@ejemplo.com"

# Copiar key pública
cat ~/.ssh/id_ed25519.pub

# Ir a GitHub → Settings → SSH Keys → New SSH key
# Pegar la key

# Cambiar remote a SSH
git remote set-url origin git@github.com:moy418/SweetTrip2.0.git

# Push
git push origin main
```

### Opción 4: Desde GitHub Desktop o Visual Studio Code

Si usas alguno de estos, simplemente:
- Abre el proyecto
- Ve a Source Control
- Click en "Push"

---

## ✅ Verificar que Subió Correctamente

Después del push exitoso:

1. Ir a: https://github.com/moy418/SweetTrip2.0
2. Verificar que ves el commit reciente
3. Verificar que están todos los archivos:
   - ✅ README.md actualizado
   - ✅ server.cjs nuevo
   - ✅ Guías de deployment
   - ✅ Scripts en carpeta scripts/
   - ✅ Páginas actualizadas

---

## 🚀 Siguiente Paso Después del Push:

Una vez que el código esté en GitHub:

```bash
# En el servidor de producción
ssh user@sweettripcandy.com

# Seguir DEPLOY_NOW.md
cd /var/www/sweettrip
git clone https://github.com/moy418/SweetTrip2.0.git .

# O si ya existe:
git pull origin main

# Continuar con los pasos del deployment...
```

---

**Estado Actual**: ✅ Commit realizado, esperando push
**Repositorio**: https://github.com/moy418/SweetTrip2.0

