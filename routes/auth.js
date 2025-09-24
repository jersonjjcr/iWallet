const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validación básica
        if (!username || !email || !password) {
            return res.status(400).json({
                error: 'Todos los campos son requeridos'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                error: 'La contraseña debe tener al menos 6 caracteres'
            });
        }

        // Verificar si el usuario ya existe
        db.get('SELECT id FROM users WHERE username = ? OR email = ?', [username, email], async (err, existingUser) => {
            if (err) {
                return res.status(500).json({
                    error: 'Error interno del servidor'
                });
            }

            if (existingUser) {
                return res.status(409).json({
                    error: 'El usuario o email ya existe'
                });
            }

            // Encriptar contraseña
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Insertar usuario
            db.run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
                [username, email, hashedPassword], 
                function(err) {
                    if (err) {
                        return res.status(500).json({
                            error: 'Error al crear el usuario'
                        });
                    }

                    // Crear categorías por defecto para el usuario
                    const defaultCategories = [
                        ['Alimentación', 'Gastos en comida y bebidas', '#e74c3c'],
                        ['Transporte', 'Gastos en transporte público, gasolina, etc.', '#f39c12'],
                        ['Entretenimiento', 'Cine, conciertos, salidas', '#9b59b6'],
                        ['Salud', 'Medicamentos, consultas médicas', '#2ecc71'],
                        ['Compras', 'Ropa, accesorios, artículos varios', '#3498db'],
                        ['Servicios', 'Luz, agua, internet, teléfono', '#34495e'],
                        ['Otros', 'Gastos varios no categorizados', '#95a5a6']
                    ];

                    const userId = this.lastID;
                    defaultCategories.forEach(([name, description, color]) => {
                        db.run('INSERT INTO categories (user_id, name, description, color) VALUES (?, ?, ?, ?)',
                            [userId, name, description, color]);
                    });

                    res.status(201).json({
                        message: 'Usuario creado exitosamente',
                        user: {
                            id: userId,
                            username,
                            email
                        }
                    });
                }
            );
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error interno del servidor',
            details: error.message
        });
    }
});

// Login
router.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                error: 'Usuario y contraseña son requeridos'
            });
        }

        // Buscar usuario por username o email
        db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, username], async (err, user) => {
            if (err) {
                return res.status(500).json({
                    error: 'Error interno del servidor'
                });
            }

            if (!user) {
                return res.status(401).json({
                    error: 'Credenciales inválidas'
                });
            }

            // Verificar contraseña
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({
                    error: 'Credenciales inválidas'
                });
            }

            // Generar token JWT
            const token = jwt.sign(
                { 
                    id: user.id, 
                    username: user.username,
                    email: user.email
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                message: 'Login exitoso',
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            });
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error interno del servidor',
            details: error.message
        });
    }
});

// Obtener información del usuario actual
router.get('/me', authenticateToken, (req, res) => {
    res.json({
        user: req.user
    });
});

module.exports = router;