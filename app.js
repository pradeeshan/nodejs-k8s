const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;

// PostgreSQL client
const pool = new Pool({
  user: 'user',
  host: 'postgres', // Kubernetes service name
  database: 'testdb',
  password: 'password',
  port: 5432,
});

app.get('/', (req, res) => {
  res.send('Hello from Node.js running in KinD Kubernetes Cluster!');
});

app.get('/db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.send(`DB Time: ${result.rows[0].now}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database connection failed');
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});
