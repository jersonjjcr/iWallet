#!/bin/bash
# Build script para Render
echo "🚀 Iniciando build del proyecto iWallet..."

# Instalar dependencias del backend
echo "📦 Instalando dependencias del backend..."
npm install

# Ir al frontend e instalar dependencias
echo "📦 Instalando dependencias del frontend..."
cd front

# Instalar dependencias con force para resolver conflictos
echo "🧹 Instalando dependencias del frontend..."
npm install --force

# Verificar que vite esté instalado correctamente
echo "🔍 Verificando instalación de Vite..."
npm list vite
echo "🔍 Verificando ruta de vite..."
ls -la node_modules/.bin/vite || echo "Vite no encontrado en .bin"

# Compilar el frontend usando la ruta completa
echo "🔨 Compilando frontend..."
./node_modules/.bin/vite build

# Verificar que se creó dist
echo "✅ Verificando carpeta dist..."
ls -la dist/ || echo "Error: dist no fue creada"

# Volver al backend
cd ..

echo "✅ Build completado exitosamente!"