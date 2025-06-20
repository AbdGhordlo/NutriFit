const { Pool } = require("pg");
require("dotenv").config();

let pool;

if (process.env.DATABASE_URL) {
 // ✅ Use for production (e.g. Render + Neon)
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  });
 } else {
  // ✅ Use for local development
  pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
  });
 }

// ✅ Optional: Test the connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ Database connection error:", err.stack);
  } else {
    console.log("✅ Database connected successfully at:", res.rows[0].now);
  }
});

module.exports = pool;
