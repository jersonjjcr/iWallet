const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Conectar a la base de datos
const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'), (err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err.message);
        return;
    }
    console.log('Conectado a la base de datos SQLite');
});

// Función para limpiar categorías y cargar las del perfil
async function cleanAndLoadUserCategories() {
    try {
        // Obtener el ID del usuario de prueba
        const user = await new Promise((resolve, reject) => {
            db.get("SELECT id FROM users WHERE email = ?", ['test@example.com'], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });

        if (!user) {
            console.log('❌ Usuario de prueba no encontrado');
            return;
        }

        const userId = user.id;
        console.log(`📋 Limpiando categorías para usuario ID: ${userId}`);

        // Primero, eliminar todos los gastos para evitar problemas de foreign key
        const expenseCount = await new Promise((resolve, reject) => {
            db.get("SELECT COUNT(*) as count FROM expenses WHERE user_id = ?", [userId], (err, row) => {
                if (err) reject(err);
                else resolve(row.count);
            });
        });

        if (expenseCount > 0) {
            await new Promise((resolve, reject) => {
                db.run("DELETE FROM expenses WHERE user_id = ?", [userId], (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
            console.log(`🗑️  Eliminados ${expenseCount} gastos existentes`);
        }

        // Eliminar todas las categorías del usuario
        const categoryCount = await new Promise((resolve, reject) => {
            db.get("SELECT COUNT(*) as count FROM categories WHERE user_id = ?", [userId], (err, row) => {
                if (err) reject(err);
                else resolve(row.count);
            });
        });

        if (categoryCount > 0) {
            await new Promise((resolve, reject) => {
                db.run("DELETE FROM categories WHERE user_id = ?", [userId], (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
            console.log(`🗑️  Eliminadas ${categoryCount} categorías existentes`);
        }

        // Crear categorías específicas del perfil del usuario
        console.log('🎯 Creando categorías específicas del perfil...');
        
        const profileCategories = [
            { name: 'Comida', color: '#F87171', description: 'Restaurantes, supermercado, delivery' },
            { name: 'Transporte', color: '#60A5FA', description: 'Metro, taxi, gasolina, estacionamiento' },
            { name: 'Entretenimiento', color: '#34D399', description: 'Cinema, conciertos, streaming, juegos' },
            { name: 'Salud', color: '#F472B6', description: 'Médico, farmacia, seguros de salud' },
            { name: 'Compras', color: '#FBBF24', description: 'Ropa, electrónicos, artículos personales' },
            { name: 'Educación', color: '#A78BFA', description: 'Cursos, libros, material de estudio' },
            { name: 'Servicios', color: '#6B7280', description: 'Internet, teléfono, electricidad, agua' }
        ];

        let categoryIds = [];
        for (const category of profileCategories) {
            const categoryId = await new Promise((resolve, reject) => {
                db.run(`INSERT INTO categories (user_id, name, color, description) 
                       VALUES (?, ?, ?, ?)`, 
                       [userId, category.name, category.color, category.description],
                       function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                });
            });
            categoryIds.push({ id: categoryId, name: category.name });
        }

        console.log(`✅ Creadas ${profileCategories.length} categorías del perfil`);

        // Crear algunos gastos de ejemplo con las nuevas categorías
        console.log('💰 Creando gastos de ejemplo...');
        
        const sampleExpenses = [
            { category: 'Comida', amount: 45.50, description: 'Supermercado Mercadona', date: '2025-09-20' },
            { category: 'Comida', amount: 28.75, description: 'Almuerzo restaurante', date: '2025-09-19' },
            { category: 'Transporte', amount: 15.20, description: 'Metro Madrid', date: '2025-09-18' },
            { category: 'Entretenimiento', amount: 12.99, description: 'Netflix suscripción', date: '2025-09-17' },
            { category: 'Salud', amount: 85.00, description: 'Consulta médico', date: '2025-09-16' },
            { category: 'Compras', amount: 125.00, description: 'Zapatos nuevos', date: '2025-09-15' },
            { category: 'Servicios', amount: 65.30, description: 'Factura electricidad', date: '2025-09-14' },
            { category: 'Educación', amount: 49.99, description: 'Curso online Udemy', date: '2025-09-13' }
        ];

        for (const expense of sampleExpenses) {
            const categoryObj = categoryIds.find(cat => cat.name === expense.category);
            if (categoryObj) {
                await new Promise((resolve, reject) => {
                    db.run(`INSERT INTO expenses (user_id, category_id, amount, description, date) 
                           VALUES (?, ?, ?, ?, ?)`, 
                           [userId, categoryObj.id, expense.amount, expense.description, expense.date],
                           function(err) {
                        if (err) reject(err);
                        else resolve(this.lastID);
                    });
                });
            }
        }

        console.log(`✅ Creados ${sampleExpenses.length} gastos de ejemplo`);

        // Mostrar resumen final
        const finalStats = await new Promise((resolve, reject) => {
            db.all(`
                SELECT 
                    c.name as category_name,
                    c.color as category_color,
                    COUNT(e.id) as expense_count,
                    COALESCE(SUM(e.amount), 0) as total_amount
                FROM categories c
                LEFT JOIN expenses e ON c.id = e.category_id
                WHERE c.user_id = ?
                GROUP BY c.id, c.name, c.color
                ORDER BY total_amount DESC
            `, [userId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });

        console.log('\n📊 RESUMEN FINAL:');
        console.log('=================');
        let totalGastos = 0;
        finalStats.forEach(stat => {
            console.log(`${stat.category_name}: ${stat.expense_count} gastos, €${stat.total_amount.toFixed(2)}`);
            totalGastos += stat.total_amount;
        });
        console.log(`\n💰 Total gastado: €${totalGastos.toFixed(2)}`);
        console.log(`📋 Total categorías: ${finalStats.length}`);
        console.log('\n✅ Limpieza y carga completada exitosamente');
        console.log('👤 Usuario: test@example.com / password123');

    } catch (error) {
        console.error('❌ Error en limpieza y carga:', error);
    } finally {
        db.close();
    }
}

// Ejecutar la limpieza
cleanAndLoadUserCategories();