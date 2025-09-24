const express = require('express');
const { db } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Aplicar autenticación a todas las rutas
router.use(authenticateToken);

// Obtener todas las categorías del usuario
router.get('/', (req, res) => {
    const userId = req.user.id;
    
    db.all('SELECT * FROM categories WHERE user_id = ? ORDER BY name', [userId], (err, categories) => {
        if (err) {
            return res.status(500).json({
                error: 'Error al obtener las categorías'
            });
        }
        
        res.json(categories);
    });
});

// Crear una nueva categoría
router.post('/', (req, res) => {
    const { name, description, color } = req.body;
    const userId = req.user.id;
    
    if (!name) {
        return res.status(400).json({
            error: 'El nombre de la categoría es requerido'
        });
    }
    
    // Verificar que no exista una categoría con el mismo nombre para este usuario
    db.get('SELECT id FROM categories WHERE user_id = ? AND name = ?', [userId, name], (err, existingCategory) => {
        if (err) {
            return res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
        
        if (existingCategory) {
            return res.status(409).json({
                error: 'Ya existe una categoría con ese nombre'
            });
        }
        
        db.run('INSERT INTO categories (user_id, name, description, color) VALUES (?, ?, ?, ?)',
            [userId, name, description || '', color || '#3498db'],
            function(err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Error al crear la categoría'
                    });
                }
                
                // Obtener la categoría recién creada
                db.get('SELECT * FROM categories WHERE id = ?', [this.lastID], (err, category) => {
                    if (err) {
                        return res.status(500).json({
                            error: 'Error al obtener la categoría creada'
                        });
                    }
                    
                    res.status(201).json({
                        message: 'Categoría creada exitosamente',
                        category
                    });
                });
            }
        );
    });
});

// Actualizar una categoría
router.put('/:id', (req, res) => {
    const categoryId = req.params.id;
    const { name, description, color } = req.body;
    const userId = req.user.id;
    
    if (!name) {
        return res.status(400).json({
            error: 'El nombre de la categoría es requerido'
        });
    }
    
    // Verificar que la categoría pertenece al usuario
    db.get('SELECT * FROM categories WHERE id = ? AND user_id = ?', [categoryId, userId], (err, category) => {
        if (err) {
            return res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
        
        if (!category) {
            return res.status(404).json({
                error: 'Categoría no encontrada'
            });
        }
        
        // Verificar que no exista otra categoría con el mismo nombre
        db.get('SELECT id FROM categories WHERE user_id = ? AND name = ? AND id != ?', [userId, name, categoryId], (err, existingCategory) => {
            if (err) {
                return res.status(500).json({
                    error: 'Error interno del servidor'
                });
            }
            
            if (existingCategory) {
                return res.status(409).json({
                    error: 'Ya existe otra categoría con ese nombre'
                });
            }
            
            db.run('UPDATE categories SET name = ?, description = ?, color = ? WHERE id = ? AND user_id = ?',
                [name, description || category.description, color || category.color, categoryId, userId],
                function(err) {
                    if (err) {
                        return res.status(500).json({
                            error: 'Error al actualizar la categoría'
                        });
                    }
                    
                    // Obtener la categoría actualizada
                    db.get('SELECT * FROM categories WHERE id = ?', [categoryId], (err, updatedCategory) => {
                        if (err) {
                            return res.status(500).json({
                                error: 'Error al obtener la categoría actualizada'
                            });
                        }
                        
                        res.json({
                            message: 'Categoría actualizada exitosamente',
                            category: updatedCategory
                        });
                    });
                }
            );
        });
    });
});

// Eliminar una categoría
router.delete('/:id', (req, res) => {
    const categoryId = req.params.id;
    const userId = req.user.id;
    
    // Verificar que la categoría pertenece al usuario
    db.get('SELECT * FROM categories WHERE id = ? AND user_id = ?', [categoryId, userId], (err, category) => {
        if (err) {
            return res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
        
        if (!category) {
            return res.status(404).json({
                error: 'Categoría no encontrada'
            });
        }
        
        // Verificar si hay gastos asociados a esta categoría
        db.get('SELECT COUNT(*) as count FROM expenses WHERE category_id = ?', [categoryId], (err, result) => {
            if (err) {
                return res.status(500).json({
                    error: 'Error interno del servidor'
                });
            }
            
            if (result.count > 0) {
                return res.status(400).json({
                    error: 'No se puede eliminar la categoría porque tiene gastos asociados'
                });
            }
            
            db.run('DELETE FROM categories WHERE id = ? AND user_id = ?', [categoryId, userId], function(err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Error al eliminar la categoría'
                    });
                }
                
                res.json({
                    message: 'Categoría eliminada exitosamente'
                });
            });
        });
    });
});

// Obtener estadísticas de gastos por categoría
router.get('/stats', (req, res) => {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;
    
    let query = `
        SELECT 
            c.id, 
            c.name, 
            c.color,
            COALESCE(SUM(e.amount), 0) as total_spent,
            COUNT(e.id) as expense_count
        FROM categories c
        LEFT JOIN expenses e ON c.id = e.category_id
    `;
    
    const params = [userId];
    
    if (startDate && endDate) {
        query += ` AND e.date BETWEEN ? AND ?`;
        params.push(startDate, endDate);
    }
    
    query += ` WHERE c.user_id = ? GROUP BY c.id, c.name, c.color ORDER BY total_spent DESC`;
    
    db.all(query, params, (err, stats) => {
        if (err) {
            return res.status(500).json({
                error: 'Error al obtener las estadísticas'
            });
        }
        
        res.json(stats);
    });
});

module.exports = router;