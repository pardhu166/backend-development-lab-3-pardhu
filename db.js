// db.js
const sqlite3 = require('sqlite3').verbose();

// Use in-memory database (works on Vercel serverless).
// For local persistence use: new sqlite3.Database('./books.db')
const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.error('Failed to open database:', err.message);
  } else {
    console.log('Connected to in-memory SQLite database');
  }
});

// Initialize the books table
const initSql = `
CREATE TABLE IF NOT EXISTS books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  price REAL NOT NULL
);
`;

db.exec(initSql, (err) => {
  if (err) {
    console.error('Failed to create books table:', err.message);
  } else {
    console.log('Books table is ready');
  }
});

module.exports = db;
