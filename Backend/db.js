// D:/Git-project/Recipe-Explorer/Backend/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // ⚠️ For development with services like Neon or Render. Remove for local.
  }
});

module.exports = pool;
