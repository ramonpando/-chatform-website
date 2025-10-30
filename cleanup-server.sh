#!/bin/bash

echo "🧹 ChatForm - Server Cleanup Script"
echo "===================================="
echo ""

# Check current space
echo "📊 Espacio ANTES de limpiar:"
df -h / | grep -v Filesystem
echo ""

# Stop all containers
echo "🛑 Deteniendo containers..."
docker stop $(docker ps -aq) 2>/dev/null || echo "No containers running"
echo ""

# Remove all containers
echo "🗑️  Eliminando containers..."
docker rm $(docker ps -aq) 2>/dev/null || echo "No containers to remove"
echo ""

# Remove all images
echo "🗑️  Eliminando imágenes Docker..."
docker rmi $(docker images -q) -f 2>/dev/null || echo "No images to remove"
echo ""

# Prune everything
echo "🧹 Limpiando sistema Docker completo..."
docker system prune -a --volumes -f
echo ""

# Clean Dokploy builds
echo "🧹 Limpiando builds de Dokploy..."
rm -rf /etc/dokploy/applications/*/code/.next 2>/dev/null || echo "No .next folders"
rm -rf /etc/dokploy/applications/*/code/node_modules 2>/dev/null || echo "No node_modules"
rm -rf /var/lib/docker/tmp/* 2>/dev/null || echo "No docker tmp"
echo ""

# Clean npm cache
echo "🧹 Limpiando cache de npm..."
npm cache clean --force 2>/dev/null || echo "npm cache already clean"
echo ""

# Clean log files
echo "🧹 Limpiando logs de Docker..."
truncate -s 0 /var/lib/docker/containers/*/*-json.log 2>/dev/null || echo "No logs to clean"
echo ""

# Check final space
echo "📊 Espacio DESPUÉS de limpiar:"
df -h / | grep -v Filesystem
echo ""

echo "✅ Limpieza completada!"
echo ""
echo "💡 Ahora puedes intentar el deploy de nuevo"
