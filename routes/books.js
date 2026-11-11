// routes/books.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Utility to send consistent JSON error responses
function sendError(res, status, message) {
  return res.status(status).json({ message });
}

// GET /books - list with search, sorting, pagination, price range
router.get('/', (req, res) => {
  const {
    search_q = '',
    order_by = 'id',
    order = 'ASC',
    limit = '10',
    offset = '0',
    min_price,
    max_price,
  } = req.query;

  // Validate order_by and order to avoid SQL injection
  const validOrderBy = ['id', 'title', 'author', 'price'];
  const validOrder = ['ASC', 'DESC'];
  const orderBy = validOrderBy.includes(order_by) ? order_by : 'id';
  const orderDir = validOrder.includes(order.toUpperCase()) ? order.toUpperCase() : 'ASC';

  const params = [];
  let whereClauses = [];

  if (search_q) {
    whereClauses.push('title LIKE ?');
    params.push(`%${search_q}%`);
  }

  if (min_price !== undefined) {
    whereClauses.push('price >= ?');
    params.push(min_price);
  }
  if (max_price !== undefined) {
    whereClauses.push('price <= ?');
    params.push(max_price);
  }

  const where = whereClauses.length ? 'WHERE ' + whereClauses.join(' AND ') : '';
  const sql = `SELECT * FROM books ${where} ORDER BY ${orderBy} ${orderDir} LIMIT ? OFFSET ?`;
  params.push(parseInt(limit, 10));
  params.push(parseInt(offset, 10));

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error(err);
      return sendError(res, 500, 'Internal server error');
    }
    res.json(rows);
  });
});

// GET /books/:id - retrieve a single book
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM books WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error(err);
      return sendError(res, 500, 'Internal server error');
    }
    if (!row) {
      return sendError(res, 404, `Book with id ${id} not found`);
    }
    res.json(row);
  });
});

// POST /books - create a new book
router.post('/', (req, res) => {
  const { title, author, price } = req.body;
  if (!title || !author || price === undefined) {
    return sendError(res, 400, 'Missing required fields: title, author, price');
  }
  if (typeof price !== 'number' || isNaN(price)) {
    return sendError(res, 400, 'Price must be a numeric value');
  }

  const sql = 'INSERT INTO books (title, author, price) VALUES (?, ?, ?)';
  db.run(sql, [title, author, price], function (err) {
    if (err) {
      console.error(err);
      return sendError(res, 500, 'Failed to create book');
    }
    // Return the newly created record
    db.get('SELECT * FROM books WHERE id = ?', [this.lastID], (err2, row) => {
      if (err2) {
        console.error(err2);
        return sendError(res, 500, 'Failed to retrieve created book');
      }
      res.status(201).json(row);
    });
  });
});

// PUT /books/:id - update an existing book
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, author, price } = req.body;
  if (!title || !author || price === undefined) {
    return sendError(res, 400, 'Missing required fields: title, author, price');
  }
  if (typeof price !== 'number' || isNaN(price)) {
    return sendError(res, 400, 'Price must be a numeric value');
  }

  // Check existence first
  db.get('SELECT * FROM books WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error(err);
      return sendError(res, 500, 'Internal server error');
    }
    if (!row) {
      return sendError(res, 404, `Book with id ${id} not found`);
    }
    const sql = 'UPDATE books SET title = ?, author = ?, price = ? WHERE id = ?';
    db.run(sql, [title, author, price, id], function (err2) {
      if (err2) {
        console.error(err2);
        return sendError(res, 500, 'Failed to update book');
      }
      // Return the updated record
      db.get('SELECT * FROM books WHERE id = ?', [id], (err3, updated) => {
        if (err3) {
          console.error(err3);
          return sendError(res, 500, 'Failed to retrieve updated book');
        }
        res.status(200).json(updated);
      });
    });
  });
});

// DELETE /books/:id - remove a book
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  // Verify existence
  db.get('SELECT * FROM books WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error(err);
      return sendError(res, 500, 'Internal server error');
    }
    if (!row) {
      return sendError(res, 404, `Book with id ${id} not found`);
    }
    db.run('DELETE FROM books WHERE id = ?', [id], function (err2) {
      if (err2) {
        console.error(err2);
        return sendError(res, 500, 'Failed to delete book');
      }
      res.status(200).json({ message: `Book with id ${id} deleted` });
    });
  });
});

module.exports = router;
