const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;
require('dotenv').config();
// Configure PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.get('/test-connection-server', async (req, res) => {
  console.log("HELLO WORLD!");
  console.log("testing some variables...", user, host);
  res.send("HELLOW ORDLA?");
});
// Define a route to test database connectivity
app.get('/test-db', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM TABLE ENTRIES');
    client.release();
    res.send(result.rows);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
