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

// Función para insertar datos de prueba
async function insertTestData() {
    try {
        // Primero verificar si ya hay datos
        const userCount = await new Promise((resolve, reject) => {
            db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
                if (err) reject(err);
                else resolve(row.count);
            });
        });

        if (userCount === 0) {
            console.log('Insertando usuario de prueba...');
            // Insertar usuario de prueba (password: "password123" hasheado)
            await new Promise((resolve, reject) => {
                db.run(`INSERT INTO users (username, email, password_hash) 
                       VALUES (?, ?, ?)`, 
                       ['testuser', 'test@example.com', '$2a$10$7xJxCRvFE5K7/XbkQ/x4EeSZxJ6MjYQ7.ZKkOjpFhCBmfb.LhFHYi'],
                       function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                });
            });
        }

        // Obtener el ID del usuario
        const user = await new Promise((resolve, reject) => {
            db.get("SELECT id FROM users WHERE email = ?", ['test@example.com'], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });

        const userId = user.id;

        // Verificar si ya hay categorías
        const categoryCount = await new Promise((resolve, reject) => {
            db.get("SELECT COUNT(*) as count FROM categories WHERE user_id = ?", [userId], (err, row) => {
                if (err) reject(err);
                else resolve(row.count);
            });
        });

        let categoryIds = [];
        
        if (categoryCount === 0) {
            console.log('Insertando categorías de prueba...');
            // Insertar categorías de prueba
            const categories = [
                { name: 'Comida', color: '#F87171', icon: 'UtensilsCrossed' },
                { name: 'Transporte', color: '#60A5FA', icon: 'Car' },
                { name: 'Entretenimiento', color: '#34D399', icon: 'Gamepad2' },
                { name: 'Salud', color: '#F472B6', icon: 'Heart' },
                { name: 'Compras', color: '#FBBF24', icon: 'ShoppingBag' }
            ];

            for (const category of categories) {
                const categoryId = await new Promise((resolve, reject) => {
                    db.run(`INSERT INTO categories (user_id, name, color, icon) 
                           VALUES (?, ?, ?, ?)`, 
                           [userId, category.name, category.color, category.icon],
                           function(err) {
                        if (err) reject(err);
                        else resolve(this.lastID);
                    });
                });
                categoryIds.push(categoryId);
            }
        } else {
            // Obtener categorías existentes
            categoryIds = await new Promise((resolve, reject) => {
                db.all("SELECT id FROM categories WHERE user_id = ?", [userId], (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows.map(row => row.id));
                });
            });
        }

        // Verificar si ya hay gastos
        const expenseCount = await new Promise((resolve, reject) => {
            db.get("SELECT COUNT(*) as count FROM expenses WHERE user_id = ?", [userId], (err, row) => {
                if (err) reject(err);
                else resolve(row.count);
            });
        });

        if (expenseCount === 0) {
            console.log('Insertando gastos de prueba...');
            // Insertar gastos de prueba de los últimos 3 meses
            const expenses = [];
            const today = new Date();
            
            // Generar gastos para los últimos 3 meses
            for (let month = 0; month < 3; month++) {
                for (let day = 0; day < 30; day++) {
                    if (Math.random() > 0.7) continue; // Solo crear algunos gastos por día
                    
                    const date = new Date(today.getFullYear(), today.getMonth() - month, day + 1);
                    const categoryId = categoryIds[Math.floor(Math.random() * categoryIds.length)];
                    const amount = Math.floor(Math.random() * 100) + 10; // Entre 10 y 110
                    
                    const descriptions = [
                        'Supermercado', 'Restaurante', 'Gasolina', 'Metro', 'Cinema', 
                        'Farmacia', 'Ropa', 'Libros', 'Café', 'Taxi'
                    ];
                    const description = descriptions[Math.floor(Math.random() * descriptions.length)];
                    
                    expenses.push({
                        userId,
                        categoryId,
                        amount,
                        description,
                        date: date.toISOString().split('T')[0]
                    });
                }
            }

            // Insertar todos los gastos
            for (const expense of expenses) {
                await new Promise((resolve, reject) => {
                    db.run(`INSERT INTO expenses (user_id, category_id, amount, description, date) 
                           VALUES (?, ?, ?, ?, ?)`, 
                           [expense.userId, expense.categoryId, expense.amount, expense.description, expense.date],
                           function(err) {
                        if (err) reject(err);
                        else resolve(this.lastID);
                    });
                });
            }
            
            console.log(`Insertados ${expenses.length} gastos de prueba`);
        } else {
            console.log(`Ya existen ${expenseCount} gastos en la base de datos`);
        }

        console.log('✅ Datos de prueba insertados correctamente');
        console.log('👤 Usuario: test@example.com / password123');
        
    } catch (error) {
        console.error('Error insertando datos de prueba:', error);
    } finally {
        db.close();
    }
}

// Ejecutar la inserción
insertTestData();