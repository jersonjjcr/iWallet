const { Pool } = require('pg');

// Configuración de PostgreSQL para Railway
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Función para inicializar las tablas en PostgreSQL
const initDatabase = async () => {
  try {
    const client = await pool.connect();
    
    console.log('Conectado a la base de datos PostgreSQL');
    
    // Tabla de usuarios
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de configuraciones de usuario
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_settings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        theme VARCHAR(10) DEFAULT 'system',
        language VARCHAR(5) DEFAULT 'es',
        currency VARCHAR(5) DEFAULT 'USD',
        date_format VARCHAR(20) DEFAULT 'DD/MM/YYYY',
        notifications TEXT DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        UNIQUE(user_id)
      )
    `);

    // Tabla de categorías
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        name VARCHAR(50) NOT NULL,
        description TEXT,
        color VARCHAR(7) DEFAULT '#3498db',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    // Tabla de gastos
    await client.query(`
      CREATE TABLE IF NOT EXISTS expenses (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        category_id INTEGER NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        description TEXT NOT NULL,
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
      )
    `);

    client.release();
    console.log('Base de datos PostgreSQL inicializada correctamente');
    
  } catch (error) {
    console.error('Error al inicializar la base de datos PostgreSQL:', error);
    throw error;
  }
};

// Función para ejecutar queries
const query = (text, params) => {
  return pool.query(text, params);
};

module.exports = {
  pool,
  query,
  initDatabase
};