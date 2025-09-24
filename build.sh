#!/bin/bash
# Build script para Render
echo "🚀 Iniciando build del proyecto iWallet..."

# Instalar dependencias del backend
echo "📦 Instalando dependencias del backend..."
npm install

# Ir al frontend e instalar dependencias
echo "📦 Instalando dependencias del frontend..."
cd front
npm install

# Compilar el frontend usando npx para asegurar que vite esté disponible
echo "🔨 Compilando frontend..."
npx vite build

# Volver al backend
cd ..

echo "✅ Build completado exitosamente!"