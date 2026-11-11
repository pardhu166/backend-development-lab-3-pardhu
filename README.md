# Lab 3: REST API, query parameters, validation, debugging

**Name:** Your Name
**Registration Number:** 12345678
**Section:** A

---

## Live link
_Not applicable (run locally) – you can deploy to Render/Railway and paste the URL here._

---

## How to run
```bash
# Clone the repository (replace <repo-url> with your GitHub repo)
git clone <repo-url>
cd lab-03

# Install dependencies
npm install

# Create a .env file (see .env.example for required variables)
cp .env.example .env
# Optionally edit .env to set a custom PORT

# Start the server
npm run dev   # uses nodemon for hot‑reloading
# or
npm start     # runs with node
```

The server will listen on `http://localhost:3000` (or the `PORT` you set).

---

## Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | `/books` | List books with optional search, sorting, pagination, and price‑range filtering.
| GET | `/books/:id` | Retrieve a single book by ID.
| POST | `/books` | Create a new book. Requires `title`, `author`, `price` in JSON body.
| PUT | `/books/:id` | Update an existing book. Requires all fields.
| DELETE | `/books/:id` | Delete a book.

### Query parameters for **GET /books**
- `search_q` – partial title match (LIKE).
- `order_by` – one of `id`, `title`, `author`, `price` (default `id`).
- `order` – `ASC` or `DESC` (default `ASC`).
- `limit` – number of records returned (default `10`).
- `offset` – pagination offset (default `0`).
- `min_price` – minimum price filter.
- `max_price` – maximum price filter.

---

## Screenshots
Place screenshots of successful requests, validation errors, and database view in the `screenshots/` folder and reference them here, e.g.:

![GET books success](screenshots/get_books_success.png)

---

## Notes & Challenges
- Handled `EADDRINUSE` (port already in use) with a clear console message.
- Fixed a typo in the table name (`books` vs. `book`).
- Added missing `await` equivalents by using callbacks correctly.
- Used parameterised queries throughout to prevent SQL injection.

---

## Postman Collection
A ready‑to‑import Postman collection is provided in `postman_collection.json`.

---

## .gitignore
```
node_modules/
.env
.DS_Store
```
