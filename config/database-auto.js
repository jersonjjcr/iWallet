// Configuración automática de base de datos
// Usa PostgreSQL en producción (Railway) y SQLite en desarrollo

let dbConfig;

if (process.env.DATABASE_URL) {
  // PostgreSQL en producción (Railway)
  dbConfig = require('./database-postgres');
} else {
  // SQLite en desarrollo
  dbConfig = require('./database');
}

module.exports = dbConfig;