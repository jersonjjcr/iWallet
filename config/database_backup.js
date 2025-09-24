const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = process.env.DB_PATH || './database.sqlite';

// Crear conexión a la base de datos
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite');
    }
});

// Función para inicializar las tablas
const initDatabase = () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Tabla de usuarios
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`, (err) => {
                if (err) {
                    console.error('Error creating users table:', err);
                }
            });

            // Tabla de categorías
            db.run(`CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                name VARCHAR(50) NOT NULL,
                description TEXT,
                color VARCHAR(7) DEFAULT '#3498db',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )`, (err) => {
                if (err) {
                    console.error('Error creating categories table:', err);
                }
            });

            // Tabla de gastos
            db.run(`CREATE TABLE IF NOT EXISTS expenses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                category_id INTEGER NOT NULL,
                amount DECIMAL(10,2) NOT NULL,
                description TEXT NOT NULL,
                date DATE NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
                FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
            )`, (err) => {
                if (err) {
                    console.error('Error creating expenses table:', err);
                    reject(err);
                } else {
                    console.log('Base de datos inicializada correctamente');
                    resolve();
                }
            });
        });
    });
};

module.exports = {
    db,
    initDatabase
};