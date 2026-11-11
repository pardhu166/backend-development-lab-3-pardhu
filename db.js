// db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file in the project root
const dbPath = path.resolve(__dirname, 'books.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to open database:', err.message);
  } else {
    console.log('Connected to SQLite database at', dbPath);
  }
});

// Initialize the books table if it doesn't exist
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
