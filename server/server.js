const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// Connect to SQLite database
const db = new sqlite3.Database('./mydb.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  }
  console.log('Connected to the SQLite database.');
});

// Middleware to parse request body
app.use(express.json());

// Route to add a new entry
app.post('/entries', (req, res) => {
  const { title, description, datetime, done } = req.body;
  const sql = `INSERT INTO Entries (title, description, datetime, done) VALUES (?, ?, ?, ?)`;
  db.run(sql, [title, description, datetime, done], function(err) {
    if (err) {
      console.error(err.message);
      res.status(500).send('Failed to add entry to the database');
      return;
    }
    res.status(201).send(`Entry added with ID ${this.lastID}`);
  });
});

// Route to get all entries
app.get('/entries', (req, res) => {
  const sql = `SELECT * FROM Entries`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Failed to retrieve entries from the database');
      return;
    }
    res.status(200).json(rows);
  });
});

// Default test route
app.get('/test', (req, res) => {
  res.send('Hello World!');
});

// Start server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// Close the database connection when the application terminates
process.on('exit', () => {
  db.close();
});
