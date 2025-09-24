const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');
const categoryRoutes = require('./routes/categories');
const { initDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Inicializar base de datos
const startServer = async () => {
    try {
        await initDatabase();
        app.listen(PORT, () => {
            console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
        process.exit(1);
    }
};

startServer();

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/categories', categoryRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ 
        message: 'API del Gestor de Gastos Personales funcionando correctamente',
        version: '1.0.0'
    });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Algo salió mal!',
        message: err.message 
    });
});

// Ruta 404
app.use('*', (req, res) => {
    res.status(404).json({ 
        error: 'Ruta no encontrada' 
    });
});

module.exports = app;