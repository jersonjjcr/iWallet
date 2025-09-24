# iWallet - Gestor de Gastos Personales (Backend)

Un sistema backend para gestionar gastos personales con autenticación JWT y base de datos SQLite.

## 🚀 Características

- ✅ Autenticación y registro de usuarios
- ✅ Gestión de categorías personalizadas
- ✅ CRUD completo de gastos
- ✅ Estadísticas y reportes
- ✅ Paginación y filtros
- ✅ Base de datos SQLite
- ✅ Seguridad con JWT
- ✅ API REST completa

## 🛠️ Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Ejecutar en producción
npm start
```

## 📋 Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```
PORT=3000
JWT_SECRET=tu_clave_secreta_muy_segura_aqui
DB_PATH=./database.sqlite
```

## 📚 API Endpoints

### Autenticación

#### POST /api/auth/register
Registrar un nuevo usuario.

**Body:**
```json
{
  "username": "usuario",
  "email": "usuario@email.com",
  "password": "contraseña123"
}
```

#### POST /api/auth/login
Iniciar sesión.

**Body:**
```json
{
  "username": "usuario",
  "password": "contraseña123"
}
```

#### GET /api/auth/me
Obtener información del usuario actual (requiere autenticación).

**Headers:**
```
Authorization: Bearer tu_token_jwt
```

### Categorías

#### GET /api/categories
Obtener todas las categorías del usuario.

#### POST /api/categories
Crear una nueva categoría.

**Body:**
```json
{
  "name": "Alimentación",
  "description": "Gastos en comida y bebidas",
  "color": "#e74c3c"
}
```

#### PUT /api/categories/:id
Actualizar una categoría.

#### DELETE /api/categories/:id
Eliminar una categoría.

#### GET /api/categories/stats
Obtener estadísticas de gastos por categoría.

**Query params:**
- `startDate`: fecha de inicio (YYYY-MM-DD)
- `endDate`: fecha de fin (YYYY-MM-DD)

### Gastos

#### GET /api/expenses
Obtener todos los gastos del usuario con paginación.

**Query params:**
- `page`: número de página (default: 1)
- `limit`: elementos por página (default: 10)
- `category`: filtrar por categoría
- `startDate`: fecha de inicio
- `endDate`: fecha de fin
- `sortBy`: ordenar por (date, amount, description)
- `sortOrder`: orden (ASC, DESC)

#### POST /api/expenses
Crear un nuevo gasto.

**Body:**
```json
{
  "category_id": 1,
  "amount": 25.50,
  "description": "Almuerzo en restaurante",
  "date": "2023-12-01"
}
```

#### PUT /api/expenses/:id
Actualizar un gasto.

#### DELETE /api/expenses/:id
Eliminar un gasto.

#### GET /api/expenses/stats/summary
Obtener estadísticas generales de gastos.

#### GET /api/expenses/stats/period
Obtener gastos agrupados por período.

**Query params:**
- `period`: daily, weekly, monthly, yearly (default: monthly)
- `startDate`: fecha de inicio
- `endDate`: fecha de fin

## 🔒 Autenticación

Todas las rutas excepto `/api/auth/register` y `/api/auth/login` requieren autenticación JWT.

Incluir en el header de las requests:
```
Authorization: Bearer tu_token_jwt
```

## 🗄️ Base de Datos

El sistema utiliza SQLite con las siguientes tablas:

- `users`: información de usuarios
- `categories`: categorías de gastos
- `expenses`: registro de gastos

## 📊 Ejemplos de Uso

### 1. Registrar usuario
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "email": "john@email.com",
    "password": "password123"
  }'
```

### 2. Iniciar sesión
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "password": "password123"
  }'
```

### 3. Crear un gasto
```bash
curl -X POST http://localhost:3000/api/expenses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer tu_token" \
  -d '{
    "category_id": 1,
    "amount": 15.99,
    "description": "Café con amigos",
    "date": "2023-12-01"
  }'
```

### 4. Obtener estadísticas
```bash
curl -X GET "http://localhost:3000/api/expenses/stats/summary" \
  -H "Authorization: Bearer tu_token"
```

## 🏗️ Estructura del Proyecto

```
iwallet-backend/
├── config/
│   └── database.js          # Configuración de SQLite
├── middleware/
│   └── auth.js              # Middleware de autenticación JWT
├── routes/
│   ├── auth.js              # Rutas de autenticación
│   ├── categories.js        # Rutas de categorías
│   └── expenses.js          # Rutas de gastos
├── .env                     # Variables de entorno
├── package.json             # Dependencias y scripts
├── server.js                # Servidor principal
└── README.md                # Documentación
```

## 🔧 Tecnologías Utilizadas

- **Node.js**: Runtime de JavaScript
- **Express.js**: Framework web
- **SQLite3**: Base de datos
- **JWT**: Autenticación
- **bcryptjs**: Encriptación de contraseñas
- **CORS**: Cross-Origin Resource Sharing
- **dotenv**: Variables de entorno

## 📝 Notas de Desarrollo

- El sistema incluye categorías por defecto al registrar un usuario
- Las contraseñas se encriptan usando bcrypt
- Los tokens JWT tienen una expiración de 24 horas
- La paginación está implementada en los gastos
- Se incluyen validaciones en todos los endpoints
- Las relaciones en la base de datos están configuradas con CASCADE DELETE

## 🚀 Próximas Características

- [ ] Exportar gastos a CSV/PDF
- [ ] Límites de gasto por categoría
- [ ] Notificaciones por email
- [ ] Importar gastos desde archivos
- [ ] Dashboard con gráficos
- [ ] API de presupuestos

---

¡El backend está listo para funcionar! Solo necesitas instalar las dependencias y ejecutar el servidor.