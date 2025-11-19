# Guía de Despliegue Automático

Este proyecto está configurado con GitHub Actions para crear automáticamente un **release** con la carpeta `dist` cuando se hace push a la rama de producción.

## 🚀 Configuración

### 1. Verificar la rama de producción

El workflow está configurado para ejecutarse en la rama `main`. Si tu rama de producción es diferente (ej: `master`, `production`), edita el archivo `.github/workflows/deploy-production.yml`:

```yaml
on:
  push:
    branches:
      - main # Cambia esto a tu rama de producción
```

### 2. ¿Cómo funciona?

Cada vez que hagas push a la rama `main`, el workflow:

1. ✅ Instala las dependencias
2. ✅ Ejecuta el linter (no bloquea si hay warnings)
3. ✅ Genera el build de producción (`npm run build`)
4. ✅ Verifica que la carpeta `dist` fue generada
5. ✅ Crea un archivo ZIP con todo el contenido de `dist`
6. ✅ Crea un nuevo release en GitHub con:
   - Tag: `v{numero_de_build}` (ej: v1, v2, v3...)
   - Nombre: `Release v{numero} - Build {commit_short}`
   - Archivo adjunto: `dist-build.zip` con todo el contenido de `dist`
   - Descripción automática con información del commit

### 3. Permisos necesarios

El workflow necesita permisos de escritura en el repositorio para crear releases. Estos permisos se configuran automáticamente con `GITHUB_TOKEN`, pero asegúrate de que:

- El repositorio tenga habilitados los "Workflow permissions" en Settings → Actions → General
- La opción "Read and write permissions" esté seleccionada

## 📋 Dónde encontrar los releases

1. Ve a tu repositorio en GitHub
2. Haz clic en la pestaña **"Releases"** (o ve a `https://github.com/{usuario}/{repositorio}/releases`)
3. Verás todos los releases creados automáticamente
4. Cada release contiene:
   - Un archivo ZIP descargable con toda la carpeta `dist`
   - Información del commit que generó el release
   - Fecha y autor del cambio

## 📥 Cómo usar el release

1. Descarga el archivo `dist-build.zip` del release
2. Descomprime el archivo en tu servidor de producción
3. Configura tu servidor web para servir los archivos de la carpeta `dist`

**Ejemplo con Nginx:**

```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    root /ruta/a/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 🔒 Seguridad

- La carpeta `dist` está en `.gitignore` (no se sube al repo)
- Se genera en cada build, asegurando que siempre esté actualizada
- Los secrets se almacenan de forma segura en GitHub

## 🐛 Troubleshooting

### El workflow no se ejecuta

- Verifica que estás haciendo push a la rama correcta (`main`)
- Verifica que hay cambios en los archivos monitoreados
- Revisa la pestaña "Actions" en GitHub

### El build falla

- Revisa los logs en GitHub Actions
- Verifica que todas las dependencias están en `package.json`
- Asegúrate de que el comando `npm run build` funciona localmente

### El release no se crea

- Verifica que los permisos del workflow están configurados correctamente
- Revisa que `GITHUB_TOKEN` esté disponible (se configura automáticamente)
- Asegúrate de que el repositorio tenga permisos de escritura habilitados
- Revisa los logs en GitHub Actions para ver errores específicos

### El archivo ZIP está vacío o corrupto

- Verifica que el build se completó correctamente
- Revisa que la carpeta `dist` contiene archivos
- Verifica los logs del paso "Crear archivo ZIP con dist"

## 📝 Notas

- El workflow solo se ejecuta en la rama de producción (`main`)
- Los cambios en `dist` no activan el workflow (está en `.gitignore`)
- El build se ejecuta en un entorno limpio cada vez
- Cada release tiene un número incremental único (`v1`, `v2`, `v3`...)
- El archivo ZIP contiene toda la carpeta `dist` lista para desplegar
- Los releases se crean automáticamente, no necesitas hacer nada manual

## 🎯 Ventajas de usar Releases

✅ **Versionado claro**: Cada release tiene un número único  
✅ **Historial completo**: Puedes ver todos los builds anteriores  
✅ **Descarga fácil**: Un solo archivo ZIP con todo lo necesario  
✅ **Información detallada**: Cada release incluye info del commit  
✅ **Rollback fácil**: Puedes descargar cualquier release anterior si hay problemas
