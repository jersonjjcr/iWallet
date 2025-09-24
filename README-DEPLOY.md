# iWallet - Gestor de Gastos Personales

## Full Stack Application

### Backend (Node.js + Express + SQLite/PostgreSQL)
- API REST completa
- Autenticación JWT
- Base de datos SQLite (desarrollo) / PostgreSQL (producción)

### Frontend (React + Vite + TailwindCSS)  
- Interfaz moderna y responsiva
- Tema claro/oscuro
- Gestión de gastos, categorías y estadísticas

## Despliegue

### Variables de entorno necesarias:
```
NODE_ENV=production
JWT_SECRET=tu-clave-secreta-aqui
PORT=3000
DATABASE_URL=postgresql://... (opcional, usa SQLite si no está presente)
```

### Comandos:
```bash
npm install
npm start
```