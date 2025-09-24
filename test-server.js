const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ 
        message: 'API del Gestor de Gastos Personales funcionando correctamente',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

app.get('/test', (req, res) => {
    res.json({ 
        message: 'Endpoint de prueba funcionando',
        status: 'OK'
    });
});

app.listen(PORT, () => {
    console.log(`Servidor de prueba ejecutándose en http://localhost:${PORT}`);
});

module.exports = app;