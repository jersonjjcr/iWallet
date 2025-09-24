#!/bin/bash
# Build script para Render
echo "🚀 Iniciando build del proyecto iWallet..."

# Instalar dependencias del backend
echo "📦 Instalando dependencias del backend..."
npm install

# Ir al frontend e instalar dependencias
echo "📦 Instalando dependencias del frontend..."
cd front

# Limpiar cache y reinstalar
echo "🧹 Limpiando cache..."
rm -rf node_modules package-lock.json
npm install

# Verificar que vite esté instalado
echo "🔍 Verificando instalación de Vite..."
npm list vite

# Compilar el frontend
echo "🔨 Compilando frontend..."
NODE_OPTIONS="--max-old-space-size=4096" npx vite build

# Verificar que se creó dist
echo "✅ Verificando carpeta dist..."
ls -la dist/

# Volver al backend
cd ..

echo "✅ Build completado exitosamente!"