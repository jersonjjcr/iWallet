const express = require("express");
const router = express.Router();
const { db } = require("../config/database");
const { authenticateToken } = require("../middleware/auth");

// Obtener configuraciones del usuario
router.get("/", authenticateToken, (req, res) => {
    const userId = req.user.id;
    
    db.get("SELECT * FROM user_settings WHERE user_id = ?", [userId], (err, row) => {
        if (err) {
            console.error("Error al obtener configuraciones:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }
        
        // Si no existe configuración, devolver valores por defecto
        if (!row) {
            return res.json({
                theme: "system",
                language: "es",
                currency: "USD",
                dateFormat: "DD/MM/YYYY",
                notifications: {
                    expenses: true,
                    budgets: true,
                    reports: false,
                    marketing: false
                }
            });
        }
        
        // Parsear las notificaciones JSON
        const settings = {
            theme: row.theme,
            language: row.language,
            currency: row.currency,
            dateFormat: row.date_format,
            notifications: JSON.parse(row.notifications || "{}")
        };
        
        res.json(settings);
    });
});

// Actualizar configuraciones del usuario
router.put("/", authenticateToken, (req, res) => {
    const userId = req.user.id;
    const { theme, language, currency, dateFormat, notifications } = req.body;
    
    // Validaciones
    const validThemes = ["light", "dark", "system"];
    const validLanguages = ["es", "en", "pt"];
    const validCurrencies = ["USD", "EUR", "COP", "MXN", "ARS"];
    const validDateFormats = ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD", "DD-MM-YYYY"];
    
    if (theme && !validThemes.includes(theme)) {
        return res.status(400).json({ error: "Tema inválido" });
    }
    if (language && !validLanguages.includes(language)) {
        return res.status(400).json({ error: "Idioma inválido" });
    }
    if (currency && !validCurrencies.includes(currency)) {
        return res.status(400).json({ error: "Moneda inválida" });
    }
    if (dateFormat && !validDateFormats.includes(dateFormat)) {
        return res.status(400).json({ error: "Formato de fecha inválido" });
    }
    
    // Verificar si ya existe configuración para este usuario
    db.get("SELECT id FROM user_settings WHERE user_id = ?", [userId], (err, row) => {
        if (err) {
            console.error("Error al verificar configuraciones:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }
        
        const notificationsJson = JSON.stringify(notifications || {});
        
        if (row) {
            // Actualizar configuración existente
            const query = `UPDATE user_settings SET 
                theme = COALESCE(?, theme),
                language = COALESCE(?, language),
                currency = COALESCE(?, currency),
                date_format = COALESCE(?, date_format),
                notifications = COALESCE(?, notifications),
                updated_at = CURRENT_TIMESTAMP
                WHERE user_id = ?`;
            
            db.run(query, [theme, language, currency, dateFormat, notificationsJson, userId], function(err) {
                if (err) {
                    console.error("Error al actualizar configuraciones:", err);
                    return res.status(500).json({ error: "Error interno del servidor" });
                }
                
                res.json({ message: "Configuraciones actualizadas exitosamente" });
            });
        } else {
            // Crear nueva configuración
            const query = `INSERT INTO user_settings (user_id, theme, language, currency, date_format, notifications)
                VALUES (?, ?, ?, ?, ?, ?)`;
            
            db.run(query, [
                userId,
                theme || "system",
                language || "es", 
                currency || "USD",
                dateFormat || "DD/MM/YYYY",
                notificationsJson
            ], function(err) {
                if (err) {
                    console.error("Error al crear configuraciones:", err);
                    return res.status(500).json({ error: "Error interno del servidor" });
                }
                
                res.json({ message: "Configuraciones creadas exitosamente" });
            });
        }
    });
});

// Actualizar perfil del usuario
router.put("/profile", authenticateToken, (req, res) => {
    const userId = req.user.id;
    const { name, email } = req.body;
    
    // Validaciones
    if (name && name.trim().length < 2) {
        return res.status(400).json({ error: "El nombre debe tener al menos 2 caracteres" });
    }
    
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: "Email inválido" });
    }
    
    // Verificar si el email ya está en uso por otro usuario
    if (email) {
        db.get("SELECT id FROM users WHERE email = ? AND id != ?", [email, userId], (err, row) => {
            if (err) {
                console.error("Error al verificar email:", err);
                return res.status(500).json({ error: "Error interno del servidor" });
            }
            
            if (row) {
                return res.status(400).json({ error: "El email ya está en uso" });
            }
            
            // Proceder con la actualización
            updateUserProfile();
        });
    } else {
        updateUserProfile();
    }
    
    function updateUserProfile() {
        const query = `UPDATE users SET 
            username = COALESCE(?, username),
            email = COALESCE(?, email),
            updated_at = CURRENT_TIMESTAMP
            WHERE id = ?`;
        
        db.run(query, [name, email, userId], function(err) {
            if (err) {
                console.error("Error al actualizar perfil:", err);
                return res.status(500).json({ error: "Error interno del servidor" });
            }
            
            // Obtener datos actualizados del usuario
            db.get("SELECT id, username, email, created_at FROM users WHERE id = ?", [userId], (err, user) => {
                if (err) {
                    console.error("Error al obtener usuario actualizado:", err);
                    return res.status(500).json({ error: "Error interno del servidor" });
                }
                
                res.json({ 
                    message: "Perfil actualizado exitosamente",
                    user: {
                        id: user.id,
                        name: user.username,
                        email: user.email,
                        created_at: user.created_at
                    }
                });
            });
        });
    }
});

// Cambiar contraseña
router.put("/password", authenticateToken, (req, res) => {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Contraseña actual y nueva contraseña son requeridas" });
    }
    
    if (newPassword.length < 6) {
        return res.status(400).json({ error: "La nueva contraseña debe tener al menos 6 caracteres" });
    }
    
    // Verificar contraseña actual
    db.get("SELECT password FROM users WHERE id = ?", [userId], (err, row) => {
        if (err) {
            console.error("Error al verificar contraseña:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }
        
        const bcrypt = require("bcryptjs");
        
        bcrypt.compare(currentPassword, row.password, (err, isMatch) => {
            if (err) {
                console.error("Error al comparar contraseñas:", err);
                return res.status(500).json({ error: "Error interno del servidor" });
            }
            
            if (!isMatch) {
                return res.status(400).json({ error: "Contraseña actual incorrecta" });
            }
            
            // Encriptar nueva contraseña
            bcrypt.hash(newPassword, 10, (err, hash) => {
                if (err) {
                    console.error("Error al encriptar contraseña:", err);
                    return res.status(500).json({ error: "Error interno del servidor" });
                }
                
                // Actualizar contraseña
                db.run("UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", 
                    [hash, userId], function(err) {
                    if (err) {
                        console.error("Error al actualizar contraseña:", err);
                        return res.status(500).json({ error: "Error interno del servidor" });
                    }
                    
                    res.json({ message: "Contraseña actualizada exitosamente" });
                });
            });
        });
    });
});

module.exports = router;
