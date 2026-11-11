// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const booksRouter = require('./routes/books');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Root route – health check
app.get('/', (req, res) => {
  res.json({ message: 'Lab 03 Books API is running. Use /books to access the API.' });
});

app.use('/books', booksRouter);

// Start server only when running locally (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });

  // Graceful handling of port conflicts (EADDRINUSE)
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Please free the port or change the PORT env variable.`);
    } else {
      console.error('Server error:', err);
    }
  });
}

// Export for Vercel serverless
module.exports = app;
