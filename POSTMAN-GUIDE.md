# 🚀 Guía de Postman para iWallet API

## 📥 Importar la Colección

1. **Abrir Postman**
2. **Hacer clic en "Import"** (botón en la esquina superior izquierda)
3. **Seleccionar los archivos:**
   - `iWallet-API-Collection.postman_collection.json` (La colección)
   - `iWallet-Environment.postman_environment.json` (El entorno)
4. **Hacer clic en "Import"**

## ⚙️ Configurar el Entorno

1. **Seleccionar el entorno** "iWallet - Development" (esquina superior derecha)
2. **Verificar que el servidor esté ejecutándose** en `http://localhost:3000`

## 🧪 Flujo de Pruebas Recomendado

### Paso 1: Verificar que la API esté funcionando
```
GET 🏠 Home - Test API
```
- Debería devolver un mensaje de bienvenida
- Estado: 200 OK

### Paso 2: Registrar un nuevo usuario
```
POST 🔐 Autenticación → Registrar Usuario
```
- Body (JSON):
```json
{
  "username": "testuser",
  "email": "test@example.com", 
  "password": "password123"
}
```
- Estado esperado: 201 Created
- **Automáticamente guarda el userId**

### Paso 3: Iniciar sesión
```
POST 🔐 Autenticación → Iniciar Sesión
```
- Body (JSON):
```json
{
  "username": "testuser",
  "password": "password123"
}
```
- Estado esperado: 200 OK
- **Automáticamente guarda el token JWT**

### Paso 4: Verificar información del usuario
```
GET 🔐 Autenticación → Obtener Info Usuario
```
- Headers: `Authorization: Bearer {{authToken}}`
- Estado esperado: 200 OK

### Paso 5: Obtener categorías por defecto
```
GET 🏷️ Categorías → Listar Categorías
```
- Estado esperado: 200 OK
- **Automáticamente guarda el ID de la primera categoría**

### Paso 6: Crear gastos de ejemplo
```
POST 💰 Gastos → Crear Gasto
```
- Body (JSON):
```json
{
  "category_id": {{categoryId}},
  "amount": 25.50,
  "description": "Almuerzo en restaurante",
  "date": "2023-12-01"
}
```
- Estado esperado: 201 Created
- **Automáticamente guarda el expenseId**

### Paso 7: Explorar todas las funcionalidades

#### Gestión de Gastos:
- ✅ **Crear Gasto** - POST /expenses
- ✅ **Listar Gastos** - GET /expenses (con paginación)
- ✅ **Filtrar por Categoría** - GET /expenses?category=ID
- ✅ **Filtrar por Fecha** - GET /expenses?startDate&endDate
- ✅ **Actualizar Gasto** - PUT /expenses/:id
- ✅ **Eliminar Gasto** - DELETE /expenses/:id

#### Gestión de Categorías:
- ✅ **Listar Categorías** - GET /categories
- ✅ **Crear Categoría** - POST /categories
- ✅ **Actualizar Categoría** - PUT /categories/:id
- ✅ **Eliminar Categoría** - DELETE /categories/:id
- ✅ **Estadísticas por Categoría** - GET /categories/stats

#### Estadísticas y Reportes:
- ✅ **Resumen General** - GET /expenses/stats/summary
- ✅ **Gastos por Período** - GET /expenses/stats/period
- ✅ **Filtros por Fecha** - Cualquier endpoint + parámetros de fecha

## 🎯 Características Destacadas de la Colección

### 🤖 Scripts Automáticos
- **Auto-extracción de tokens JWT** después del login
- **Auto-guardado de IDs** (usuario, categoría, gasto)
- **Variables dinámicas** para facilitar las pruebas

### 📁 Organización por Carpetas
- 🏠 **Home** - Endpoint básico
- 🔐 **Autenticación** - Registro, login, info usuario
- 🏷️ **Categorías** - CRUD completo + estadísticas
- 💰 **Gastos** - CRUD completo + filtros
- 📊 **Estadísticas** - Reportes y análisis

### 🔧 Variables de Entorno
```
baseUrl = http://localhost:3000/api
authToken = (se llena automáticamente)
userId = (se llena automáticamente)
categoryId = (se llena automáticamente)
expenseId = (se llena automáticamente)
```

## 📊 Ejemplos de Respuestas

### Registro de Usuario (201)
```json
{
  "message": "Usuario creado exitosamente",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

### Login (200)
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

### Lista de Gastos (200)
```json
{
  "expenses": [
    {
      "id": 1,
      "user_id": 1,
      "category_id": 1,
      "amount": "25.50",
      "description": "Almuerzo en restaurante",
      "date": "2023-12-01",
      "category_name": "Alimentación",
      "category_color": "#e74c3c"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 1,
    "itemsPerPage": 10
  }
}
```

### Estadísticas Generales (200)
```json
{
  "totalExpenses": 3,
  "totalAmount": 89.99,
  "averageExpense": 29.99,
  "maxExpense": 45.00,
  "minExpense": 15.99
}
```

## 🚨 Posibles Errores y Soluciones

### Error 401: Unauthorized
- **Causa**: Token JWT inválido o expirado
- **Solución**: Hacer login nuevamente

### Error 404: Not Found
- **Causa**: ID incorrecto en la URL
- **Solución**: Verificar que las variables estén configuradas

### Error 409: Conflict
- **Causa**: Usuario o categoría ya existe
- **Solución**: Usar diferentes nombres

### Error 400: Bad Request
- **Causa**: Datos faltantes en el body
- **Solución**: Verificar que todos los campos requeridos estén presentes

## 🎉 ¡Listo para Probar!

1. ✅ Servidor corriendo en `http://localhost:3000`
2. ✅ Colección importada en Postman
3. ✅ Entorno configurado
4. ✅ Variables dinámicas listas

**¡Ahora puedes probar toda la funcionalidad de la API de manera fácil y automatizada!** 🚀