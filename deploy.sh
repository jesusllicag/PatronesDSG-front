#!/bin/bash

# Script de deployment automático para PatronesDSG
# Este script maneja el ciclo completo: build, git commit y push

set -e  # Detener en caso de error

echo "🚀 Iniciando proceso de deployment..."

# PREDEPLOY: Limpiar y construir el proyecto
echo ""
echo "📦 [PREDEPLOY] Ejecutando build de producción..."
npm run build

# Verificar que el build fue exitoso
if [ ! -d "dist" ]; then
  echo "❌ Error: La carpeta dist no fue generada"
  exit 1
fi

# DEPLOY: Subir cambios al repositorio de dist
echo ""
echo "📤 [DEPLOY] Desplegando a repositorio..."
cd dist/

# Configurar URL del repositorio
REPO_URL="git@github.com:jesusllicag/patronesDSG.git"
echo "📂 Repositorio destino: $REPO_URL"

# Verificar si ya existe un repositorio git
if [ ! -d ".git" ]; then
  echo "⚙️  Inicializando repositorio git en dist/"
  git init
  git branch -M main
  git remote add origin "$REPO_URL"
else
  # Actualizar la URL del remote si ya existe
  git remote set-url origin "$REPO_URL" 2>/dev/null || git remote add origin "$REPO_URL"
fi

# Agregar y commitear cambios
git add .

# Permitir mensaje de commit personalizado o usar uno por defecto
COMMIT_MSG="${1:-Deploy $(date +'%Y-%m-%d %H:%M:%S')}"
git commit -m "$COMMIT_MSG" || echo "⚠️  No hay cambios para commitear"

# Hacer push
echo "⬆️  Subiendo cambios al repositorio remoto..."
git push origin main --force

cd ..

# POSTDEPLOY: Limpieza y notificación
echo ""
echo "🧹 [POSTDEPLOY] Finalizando deployment..."
echo ""
echo "✅ Deployment completado exitosamente!"
echo "📍 Repositorio actualizado en: $(cd dist && git remote get-url origin)"
