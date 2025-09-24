const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');
const categoryRoutes = require('./routes/categories');
const settingsRoutes = require('./routes/settings');
const { initDatabase } = require('./config/database-auto');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos del frontend si existe la carpeta dist
const frontendPath = path.join(__dirname, 'front', 'dist');
try {
  app.use(express.static(frontendPath));
  console.log(`Sirviendo frontend desde: ${frontendPath}`);
} catch (error) {
  console.log('No se encontró carpeta dist del frontend');
}

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/settings', settingsRoutes);

// Ruta de prueba de la API
app.get('/api', (req, res) => {
    res.json({
        message: 'API del Gestor de Gastos Personales funcionando correctamente',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        database: process.env.DATABASE_URL ? 'PostgreSQL' : 'SQLite'
    });
});

// Servir el frontend para todas las rutas que no sean API
app.get('*', (req, res) => {
  try {
    res.sendFile(path.join(frontendPath, 'index.html'));
  } catch (error) {
    res.json({
      message: 'API del Gestor de Gastos Personales',
      frontend: 'No disponible'
    });
  }
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Algo salió mal!',
        message: err.message
    });
});

// Inicializar base de datos y servidor
const startServer = async () => {
    try {
        await initDatabase();
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Servidor ejecutándose en puerto ${PORT}`);
            console.log(`Base de datos: ${process.env.DATABASE_URL ? 'PostgreSQL' : 'SQLite'}`);
        });
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;