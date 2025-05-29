const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.on('connect', () => {
  console.log('✅ Database connected successfully');
});

module.exports = pool;
