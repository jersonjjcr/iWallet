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

// Servir archivos estáticos del frontend con MIME types correctos
const frontendPath = path.join(__dirname, 'front', 'dist');
app.use(express.static(frontendPath, {
  setHeaders: (res, path, stat) => {
    // Configurar MIME types correctos
    if (path.endsWith('.js')) {
      res.set('Content-Type', 'application/javascript');
    }
    if (path.endsWith('.css')) {
      res.set('Content-Type', 'text/css');
    }
    if (path.endsWith('.html')) {
      res.set('Content-Type', 'text/html');
    }
  }
}));
console.log(`Sirviendo frontend desde: ${frontendPath}`);

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

// Servir el frontend para rutas que no sean archivos estáticos ni API
app.get('*', (req, res) => {
  // Solo servir index.html para rutas que no tengan extensión de archivo
  if (!req.path.includes('.')) {
    try {
      res.sendFile(path.join(frontendPath, 'index.html'));
    } catch (error) {
      res.status(404).json({
        message: 'Frontend no disponible',
        error: error.message
      });
    }
  } else {
    // Para archivos con extensión, devolver 404
    res.status(404).send('Archivo no encontrado');
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