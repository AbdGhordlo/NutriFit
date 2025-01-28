const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// PostgreSQL connection pool
const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Example route to interact with PostgreSQL
app.get('/api/data', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM your_table_name');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error querying the database');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
