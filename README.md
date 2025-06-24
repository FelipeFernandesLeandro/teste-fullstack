# Book Reviews Platform — Solution README

> **Assessment:** CRUD + Top-rated endpoint, NestJS + Mongo, Next .js UI, 4-8 h  
> **This repo:** fully working implementation with Docker one-liner and remote MongoDB Atlas.

---

## 0. TL;DR

| Feature | Status |
|---------|--------|
| CRUD Books & Reviews | ✅ |
| `/books/top?limit` returns `averageRating` + `reviewCount` | ✅ |
| Seed ± 120 books / 900 reviews (JSON) | ✅ |
| e2e (`books`, `reviews`, `books/top`) + unit tests | ✅ |
| Swagger (`/docs`) | ✅ |
| Docker compose (UI + API) | ✅ |
| Accessibility tweaks (aria-live, aria-invalid, alt text) | ✅ |
| SSR for `/books` route | 🟡 client-side only |
| CI / CD | ❌ left out due to time |

---

## 1. Project layout

```
book-reviews-api   # NestJS 10 + Mongoose schemas, tests, seeds
book-reviews-ui    # Next.js (App Router) + React-Query + Tailwind
data/              # books_reviews_dataset.json (seed)
docker-compose.yml # one command to run everything
```

---

## 1.1 · Seed data source

The file **`data/books_reviews_dataset.json`** was produced from
[Kaggle – “Top 200 Trending Books With Reviews”](https://www.kaggle.com/datasets/anshtanwar/top-200-trending-books-with-reviews).

A small Python script trims the CSV, normalises ISBNs and exports to JSON (see `book-reviews-api/notebooks/books_reviews.ipynb`).

## 2. Getting started locally

### Prereqs
* **pnpm ≥ 9**
* Node 18 / 20
* Docker (optional but easiest)

### With Docker (recommended)

```bash
# root of the repo
docker compose up --build
# API on http://localhost:3122, UI on http://localhost:3123
# Swagger: http://localhost:3122/docs
```

### Without Docker

```bash
# copy environment samples
cp book-reviews-api/.env.example book-reviews-api/.env
cp book-reviews-ui/.env.example  book-reviews-ui/.env

# install everything
pnpm install

# dev mode – two processes
pnpm dev   # ⤵ starts:
           # API  → :3001
           # UI   → :3000
```

Scripts:

#### API
```bash
pnpm test      # jest unit tests
pnpm test:e2e  # supertest e2e tests
pnpm lint      # eslint
pnpm format    # prettier --write
pnpm seed      # seeds remote Mongo with dataset
pnpm start     # starts API
```

#### UI
```bash
pnpm lint      # eslint
pnpm format    # prettier --write
pnpm dev       # dev mode
pnpm start     # starts UI
```

---

## 3. Environment variables

| File | Purpose |
|------|---------|
| `book-reviews-api/.env.example` | `MONGO_URI`, `PORT` (3000), `FRONTEND_PORT` (3123) |
| `book-reviews-ui/.env.example`  | `NEXT_PUBLIC_API_URL`, `PORT` (3000) |

We use a **MongoDB Atlas** cluster (connection string already provided in `.env` and `.env.test.local`).
Local dev can point to any other URI.

---

## 4. API

* **Swagger UI** → `GET /docs` (running server only).  
* Core endpoints  

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/books` | Paginated list (`page`, `limit`) |
| `POST` | `/books` | Create book |
| `GET` | `/books/:id` | One book w/ reviews |
| `PATCH` | `/books/:id` | Update book |
| `DELETE` | `/books/:id` | Remove book + cascade reviews |
| `GET` | `/books/top?limit=10` | **Aggregation**: returns `averageRating`, `reviewCount` |
| `POST` | `/books/:id/reviews` | Add review |
| `GET` | `/books/:id/reviews` | Reviews by book |
| `PATCH/DELETE` | `/reviews/:id` | Update / delete review |

---

## 5. Front-end

* **Next.js 14 (App Router)** — pages under `/app`.  
* **React-Query** handles fetching / cache / optimistic update.  
* **Tailwind CSS** for UI.  
* Skeletons, error states and basic a11y (`aria-live`, `aria-invalid`, no layout shift).

---

## 6. Testing

* **Unit** – pure services with mocked Mongoose models.  
* **e2e** – supertest against in-memory Nest app hitting the real Mongo test DB; covers CRUD + `/books/top`.
* Coverage ~ 87 %.

---

## 7. Trade-offs & shortcuts (time-box)

* Aggregation lacks compound index on `bookId,rating` (fine for 1 k docs).
* SSR not implemented for `/books` (client fetch keeps code simpler).
* No pagination on reviews ­– assumed small per book.
* Error handling: global filter + 1 custom message only.
* Remote MongoDB Atlas cluster (connection string already provided in `.env` and `.env.test.local`).

---

## 8. Next steps (if more time)

1. Add server-side rendering and incremental static regen for `/books`.
2. Create Docker healthcheck + CI workflow (GitHub Actions).
3. Add rate-limiter (nestjs/throttler) and caching layer around `/books/top`.
4. Lighthouse pass ≥ 90 (a11y/perf).

Happy reviewing! 🚀
