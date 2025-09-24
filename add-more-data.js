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

// Función para agregar más gastos de prueba
async function addMoreTestData() {
    try {
        // Obtener el ID del usuario
        const user = await new Promise((resolve, reject) => {
            db.get("SELECT id FROM users WHERE email = ?", ['test@example.com'], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });

        if (!user) {
            console.log('Usuario de prueba no encontrado');
            return;
        }

        const userId = user.id;

        // Obtener categorías existentes
        const categories = await new Promise((resolve, reject) => {
            db.all("SELECT id, name FROM categories WHERE user_id = ?", [userId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });

        console.log(`Encontradas ${categories.length} categorías`);

        // Generar gastos más variados
        const expenses = [];
        const today = new Date();
        
        // Generar gastos para los últimos 6 meses
        for (let month = 0; month < 6; month++) {
            const daysInMonth = new Date(today.getFullYear(), today.getMonth() - month + 1, 0).getDate();
            
            for (let day = 1; day <= daysInMonth; day++) {
                // Más probabilidad de gastos en algunos días
                if (Math.random() > 0.4) continue;
                
                const date = new Date(today.getFullYear(), today.getMonth() - month, day);
                const category = categories[Math.floor(Math.random() * categories.length)];
                
                // Montos más variados según la categoría
                let amount;
                switch (category.name) {
                    case 'Comida':
                        amount = Math.floor(Math.random() * 50) + 15; // 15-65
                        break;
                    case 'Transporte':
                        amount = Math.floor(Math.random() * 30) + 5; // 5-35
                        break;
                    case 'Entretenimiento':
                        amount = Math.floor(Math.random() * 80) + 20; // 20-100
                        break;
                    case 'Salud':
                        amount = Math.floor(Math.random() * 150) + 25; // 25-175
                        break;
                    case 'Compras':
                        amount = Math.floor(Math.random() * 120) + 10; // 10-130
                        break;
                    default:
                        amount = Math.floor(Math.random() * 100) + 10;
                }
                
                const descriptions = {
                    'Comida': ['Supermercado Día', 'Restaurant La Tasca', 'McDonald\'s', 'Pizza Hut', 'Mercadona', 'Almuerzo trabajo', 'Cena con amigos', 'Desayuno café'],
                    'Transporte': ['Metro Madrid', 'Taxi Uber', 'Gasolina Repsol', 'Parking centro', 'Bus urbano', 'Tren Renfe', 'Bici compartida'],
                    'Entretenimiento': ['Cinema Yelmo', 'Netflix', 'Spotify', 'Teatro Real', 'Concierto', 'Museo Prado', 'Parque atracciones', 'Bowling'],
                    'Salud': ['Farmacia Cruz Verde', 'Consulta médico', 'Dentista', 'Análisis clínicos', 'Fisioterapeuta', 'Óptica', 'Vitaminas'],
                    'Compras': ['Zara', 'El Corte Inglés', 'Amazon', 'IKEA', 'Librería Casa del Libro', 'Perfumería', 'Electrónica MediaMarkt', 'Supermercado']
                };
                
                const categoryDescriptions = descriptions[category.name] || ['Gasto varios'];
                const description = categoryDescriptions[Math.floor(Math.random() * categoryDescriptions.length)];
                
                expenses.push({
                    userId,
                    categoryId: category.id,
                    amount,
                    description,
                    date: date.toISOString().split('T')[0]
                });
            }
        }

        console.log(`Insertando ${expenses.length} gastos adicionales...`);

        // Insertar todos los gastos
        let inserted = 0;
        for (const expense of expenses) {
            try {
                await new Promise((resolve, reject) => {
                    db.run(`INSERT INTO expenses (user_id, category_id, amount, description, date) 
                           VALUES (?, ?, ?, ?, ?)`, 
                           [expense.userId, expense.categoryId, expense.amount, expense.description, expense.date],
                           function(err) {
                        if (err) reject(err);
                        else resolve(this.lastID);
                    });
                });
                inserted++;
            } catch (error) {
                // Ignorar duplicados o errores menores
            }
        }
        
        console.log(`✅ Insertados ${inserted} gastos adicionales`);
        
        // Mostrar estadísticas
        const totalExpenses = await new Promise((resolve, reject) => {
            db.get("SELECT COUNT(*) as count, SUM(amount) as total FROM expenses WHERE user_id = ?", [userId], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
        
        console.log(`📊 Total de gastos: ${totalExpenses.count}`);
        console.log(`💰 Total gastado: €${totalExpenses.total.toFixed(2)}`);
        
    } catch (error) {
        console.error('Error agregando datos de prueba:', error);
    } finally {
        db.close();
    }
}

// Ejecutar la inserción
addMoreTestData();