const express = require('express');
const { db } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Aplicar autenticación a todas las rutas
router.use(authenticateToken);

// Obtener todos los gastos del usuario
router.get('/', (req, res) => {
    const userId = req.user.id;
    const { page = 1, limit = 10, category, startDate, endDate, sortBy = 'date', sortOrder = 'DESC' } = req.query;
    
    const offset = (page - 1) * limit;
    
    let query = `
        SELECT 
            e.*, 
            c.name as category_name, 
            c.color as category_color
        FROM expenses e
        JOIN categories c ON e.category_id = c.id
        WHERE e.user_id = ?
    `;
    
    const params = [userId];
    
    // Filtros
    if (category) {
        query += ` AND e.category_id = ?`;
        params.push(category);
    }
    
    if (startDate) {
        query += ` AND e.date >= ?`;
        params.push(startDate);
    }
    
    if (endDate) {
        query += ` AND e.date <= ?`;
        params.push(endDate);
    }
    
    // Ordenamiento
    const validSortColumns = ['date', 'amount', 'description', 'created_at'];
    const validSortOrders = ['ASC', 'DESC'];
    
    if (validSortColumns.includes(sortBy) && validSortOrders.includes(sortOrder.toUpperCase())) {
        query += ` ORDER BY e.${sortBy} ${sortOrder.toUpperCase()}`;
    } else {
        query += ` ORDER BY e.date DESC`;
    }
    
    // Paginación
    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));
    
    db.all(query, params, (err, expenses) => {
        if (err) {
            return res.status(500).json({
                error: 'Error al obtener los gastos'
            });
        }
        
        // Obtener el total de gastos para la paginación
        let countQuery = `SELECT COUNT(*) as total FROM expenses e WHERE e.user_id = ?`;
        const countParams = [userId];
        
        if (category) {
            countQuery += ` AND e.category_id = ?`;
            countParams.push(category);
        }
        
        if (startDate) {
            countQuery += ` AND e.date >= ?`;
            countParams.push(startDate);
        }
        
        if (endDate) {
            countQuery += ` AND e.date <= ?`;
            countParams.push(endDate);
        }
        
        db.get(countQuery, countParams, (err, countResult) => {
            if (err) {
                return res.status(500).json({
                    error: 'Error al contar los gastos'
                });
            }
            
            const totalPages = Math.ceil(countResult.total / limit);
            
            res.json({
                expenses,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalItems: countResult.total,
                    itemsPerPage: parseInt(limit)
                }
            });
        });
    });
});

// Crear un nuevo gasto
router.post('/', (req, res) => {
    const { category_id, amount, description, date } = req.body;
    const userId = req.user.id;
    
    // Validaciones
    if (!category_id || !amount || !description || !date) {
        return res.status(400).json({
            error: 'Todos los campos son requeridos (category_id, amount, description, date)'
        });
    }
    
    if (amount <= 0) {
        return res.status(400).json({
            error: 'El monto debe ser mayor a 0'
        });
    }
    
    // Verificar que la categoría pertenece al usuario
    db.get('SELECT id FROM categories WHERE id = ? AND user_id = ?', [category_id, userId], (err, category) => {
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
        
        db.run('INSERT INTO expenses (user_id, category_id, amount, description, date) VALUES (?, ?, ?, ?, ?)',
            [userId, category_id, amount, description, date],
            function(err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Error al crear el gasto'
                    });
                }
                
                // Obtener el gasto recién creado con información de la categoría
                db.get(`
                    SELECT 
                        e.*, 
                        c.name as category_name, 
                        c.color as category_color
                    FROM expenses e
                    JOIN categories c ON e.category_id = c.id
                    WHERE e.id = ?
                `, [this.lastID], (err, expense) => {
                    if (err) {
                        return res.status(500).json({
                            error: 'Error al obtener el gasto creado'
                        });
                    }
                    
                    res.status(201).json({
                        message: 'Gasto creado exitosamente',
                        expense
                    });
                });
            }
        );
    });
});

// Actualizar un gasto
router.put('/:id', (req, res) => {
    const expenseId = req.params.id;
    const { category_id, amount, description, date } = req.body;
    const userId = req.user.id;
    
    // Validaciones
    if (!category_id || !amount || !description || !date) {
        return res.status(400).json({
            error: 'Todos los campos son requeridos (category_id, amount, description, date)'
        });
    }
    
    if (amount <= 0) {
        return res.status(400).json({
            error: 'El monto debe ser mayor a 0'
        });
    }
    
    // Verificar que el gasto pertenece al usuario
    db.get('SELECT * FROM expenses WHERE id = ? AND user_id = ?', [expenseId, userId], (err, expense) => {
        if (err) {
            return res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
        
        if (!expense) {
            return res.status(404).json({
                error: 'Gasto no encontrado'
            });
        }
        
        // Verificar que la categoría pertenece al usuario
        db.get('SELECT id FROM categories WHERE id = ? AND user_id = ?', [category_id, userId], (err, category) => {
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
            
            db.run('UPDATE expenses SET category_id = ?, amount = ?, description = ?, date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
                [category_id, amount, description, date, expenseId, userId],
                function(err) {
                    if (err) {
                        return res.status(500).json({
                            error: 'Error al actualizar el gasto'
                        });
                    }
                    
                    // Obtener el gasto actualizado
                    db.get(`
                        SELECT 
                            e.*, 
                            c.name as category_name, 
                            c.color as category_color
                        FROM expenses e
                        JOIN categories c ON e.category_id = c.id
                        WHERE e.id = ?
                    `, [expenseId], (err, updatedExpense) => {
                        if (err) {
                            return res.status(500).json({
                                error: 'Error al obtener el gasto actualizado'
                            });
                        }
                        
                        res.json({
                            message: 'Gasto actualizado exitosamente',
                            expense: updatedExpense
                        });
                    });
                }
            );
        });
    });
});

// Eliminar un gasto
router.delete('/:id', (req, res) => {
    const expenseId = req.params.id;
    const userId = req.user.id;
    
    // Verificar que el gasto pertenece al usuario
    db.get('SELECT * FROM expenses WHERE id = ? AND user_id = ?', [expenseId, userId], (err, expense) => {
        if (err) {
            return res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
        
        if (!expense) {
            return res.status(404).json({
                error: 'Gasto no encontrado'
            });
        }
        
        db.run('DELETE FROM expenses WHERE id = ? AND user_id = ?', [expenseId, userId], function(err) {
            if (err) {
                return res.status(500).json({
                    error: 'Error al eliminar el gasto'
                });
            }
            
            res.json({
                message: 'Gasto eliminado exitosamente'
            });
        });
    });
});

// Obtener estadísticas generales
router.get('/stats/summary', (req, res) => {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    let dateFilter = '';
    const params = [userId];

    if (startDate && endDate) {
        dateFilter = ' AND date BETWEEN ? AND ?';
        params.push(startDate, endDate);
    }

    // Obtener estadísticas generales
    const generalStatsQuery = `
        SELECT 
            COUNT(*) as count,
            COALESCE(SUM(amount), 0) as total,
            COALESCE(AVG(amount), 0) as average,
            COALESCE(MAX(amount), 0) as maximum,
            COALESCE(MIN(amount), 0) as minimum
        FROM expenses 
        WHERE user_id = ?${dateFilter}
    `;

    // Obtener gastos del mes actual
    const thisMonthQuery = `
        SELECT COALESCE(SUM(amount), 0) as thisMonth
        FROM expenses 
        WHERE user_id = ? AND strftime('%Y-%m', date) = strftime('%Y-%m', 'now')
    `;

    // Obtener promedio mensual
    const avgPerMonthQuery = `
        SELECT COALESCE(AVG(monthly_total), 0) as avgPerMonth
        FROM (
            SELECT SUM(amount) as monthly_total
            FROM expenses 
            WHERE user_id = ?
            GROUP BY strftime('%Y-%m', date)
        )
    `;

    Promise.all([
        new Promise((resolve, reject) => {
            db.get(generalStatsQuery, params, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        }),
        new Promise((resolve, reject) => {
            db.get(thisMonthQuery, [userId], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        }),
        new Promise((resolve, reject) => {
            db.get(avgPerMonthQuery, [userId], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        })
    ]).then(([generalStats, thisMonthStats, avgMonthStats]) => {
        res.json({
            // Formato esperado por Statistics component
            count: generalStats.count,
            total: parseFloat(generalStats.total || 0),
            average: parseFloat(generalStats.average || 0),
            thisMonth: parseFloat(thisMonthStats.thisMonth || 0),
            avgPerMonth: parseFloat(avgMonthStats.avgPerMonth || 0),
            
            // Formato esperado por Dashboard component
            totalAmount: parseFloat(generalStats.total || 0),
            totalExpenses: generalStats.count,
            averageExpense: parseFloat(generalStats.average || 0),
            maxExpense: parseFloat(generalStats.maximum || 0),
            minExpense: parseFloat(generalStats.minimum || 0)
        });
    }).catch(err => {
        console.error('Error getting summary stats:', err);
        res.status(500).json({
            error: 'Error al obtener las estadísticas generales'
        });
    });
});// Obtener gastos por período (diario, semanal, mensual)
router.get('/stats/period', (req, res) => {
    const userId = req.user.id;
    const { period = 'monthly', startDate, endDate } = req.query;

    let groupBy, dateFormat;
    
    switch (period) {
        case 'daily':
            groupBy = 'date';
            dateFormat = 'date';
            break;
        case 'weekly':
            groupBy = "strftime('%Y-%W', date)";
            dateFormat = "strftime('%Y-%W', date)";
            break;
        case 'monthly':
            groupBy = "strftime('%Y-%m', date)";
            dateFormat = "strftime('%Y-%m', date)";
            break;
        case 'yearly':
            groupBy = "strftime('%Y', date)";
            dateFormat = "strftime('%Y', date)";
            break;
        default:
            groupBy = "strftime('%Y-%m', date)";
            dateFormat = "strftime('%Y-%m', date)";
    }

    let query = `
        SELECT 
            ${dateFormat} as period,
            COUNT(*) as expense_count,
            SUM(amount) as total_amount
        FROM expenses
        WHERE user_id = ?
    `;

    const params = [userId];

    if (startDate) {
        query += ' AND date >= ?';
        params.push(startDate);
    }

    if (endDate) {
        query += ' AND date <= ?';
        params.push(endDate);
    }

    query += ` GROUP BY ${groupBy} ORDER BY period DESC`;

    db.all(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({
                error: 'Error al obtener las estadísticas por período'
            });
        }

        res.json(results);
    });
});

// Obtener estadísticas por categorías
router.get('/stats/categories', (req, res) => {
    const userId = req.user.id;
    const { period = 'month' } = req.query;
    
    let dateFilter = '';
    const params = [userId];
    
    // Filtrar por período
    if (period === 'month') {
        dateFilter = "AND strftime('%Y-%m', e.date) = strftime('%Y-%m', 'now')";
    } else if (period === 'year') {
        dateFilter = "AND strftime('%Y', e.date) = strftime('%Y', 'now')";
    }
    
    const query = `
        SELECT 
            e.category_id,
            c.name as category_name,
            c.color as category_color,
            COUNT(*) as count,
            SUM(e.amount) as total,
            AVG(e.amount) as average,
            MIN(e.amount) as minimum,
            MAX(e.amount) as maximum
        FROM expenses e
        JOIN categories c ON e.category_id = c.id
        WHERE e.user_id = ? ${dateFilter}
        GROUP BY e.category_id, c.name, c.color
        ORDER BY total DESC
    `;
    
    db.all(query, params, (err, results) => {
        if (err) {
            console.error('Error getting category stats:', err);
            return res.status(500).json({
                error: 'Error al obtener estadísticas por categoría'
            });
        }
        
        res.json(results);
    });
});

// Obtener estadísticas mensuales
router.get('/stats/monthly', (req, res) => {
    const userId = req.user.id;
    
    const query = `
        SELECT 
            strftime('%Y-%m', date) as month,
            COUNT(*) as count,
            SUM(amount) as total,
            AVG(amount) as average
        FROM expenses
        WHERE user_id = ?
        GROUP BY strftime('%Y-%m', date)
        ORDER BY month DESC
        LIMIT 12
    `;
    
    db.all(query, [userId], (err, results) => {
        if (err) {
            console.error('Error getting monthly stats:', err);
            return res.status(500).json({
                error: 'Error al obtener estadísticas mensuales'
            });
        }
        
        res.json(results);
    });
});

module.exports = router;