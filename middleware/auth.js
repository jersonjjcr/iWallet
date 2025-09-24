const jwt = require('jsonwebtoken');
const { db } = require('../config/database');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ 
            error: 'Token de acceso requerido' 
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ 
                error: 'Token inválido o expirado' 
            });
        }
        
        // Verificar que el usuario existe en la base de datos
        db.get('SELECT id, username, email FROM users WHERE id = ?', [user.id], (err, dbUser) => {
            if (err) {
                return res.status(500).json({ 
                    error: 'Error interno del servidor' 
                });
            }
            
            if (!dbUser) {
                return res.status(403).json({ 
                    error: 'Usuario no encontrado' 
                });
            }
            
            req.user = dbUser;
            next();
        });
    });
};

module.exports = {
    authenticateToken
};