# Book Reviews Platform — Solution README

> **Assessment:** CRUD for Books & Reviews, Top-rated endpoint, NestJS + MongoDB, Next.js UI, 8h time-box.
> **This Submission:** A complete, self-contained implementation that runs the entire stack (API, UI, and local MongoDB) with a single Docker command.

---

## 0. TL;DR - Feature Status

| Feature | Status | Notes |
|---|---|---|
| Full CRUD for Books & Reviews | ✅ | Implemented with nested routes for reviews. |
| Top-Rated Books Endpoint | ✅ | Aggregation pipeline for `averageRating`. |
| Automated Database Seeding | ✅ | The local database is seeded automatically when the Docker container is first built. |
| E2E & Unit Testing (Backend) | ✅ | ~84% coverage, using Jest & Supertest. |
| Component Testing (Frontend) | ✅ | Using Jest & React Testing Library. |
| API Documentation | ✅ | Interactive UI via Swagger at `/api-docs`. |
| Docker Compose Environment | ✅ | **One-command (`docker-compose up`) startup for UI, API & local DB.** |
| CI/CD Pipeline | ✅ | GitHub Actions workflow runs lint & tests on push/PR to `main`. |
| Advanced Frontend UX | ✅ | Optimistic Updates, Skeletons, Error States with Retry. |
| SSR for Initial Load | 🟡 | Chose Client-Side Rendering with React Query for simplicity. |

---

## 1. Project layout

```
book-reviews-api   # NestJS 10 + Mongoose schemas, tests, seeds
book-reviews-ui    # Next.js (App Router) + React-Query + Tailwind
data/              # books_reviews_dataset.json (seed)
docker-compose.yml # Orchestrator for all services
```

---

## 1.1 · Seed data source

The file **`data/books_reviews_dataset.json`** was produced from
[Kaggle – “Top 200 Trending Books With Reviews”](https://www.kaggle.com/datasets/anshtanwar/top-200-trending-books-with-reviews).

A small Python script trims the CSV, normalises ISBNs and exports to JSON (see `book-reviews-api/notebooks/books_reviews.ipynb`).

## 2. Getting Started

### Prerequisites
* **pnpm ≥ 9**
* Node.js v20+
* Docker & Docker Compose

### With Docker (Recommended Method)

This is the simplest way to run the entire stack. The database will be created, and the data will be seeded automatically on the first run.

```bash
# From the root of the repository
docker-compose up --build
# API on http://localhost:3122, UI on http://localhost:3123
# Swagger: http://localhost:3122/docs
```

### Without Docker

> This setup is more complex as it requires running a local MongoDB instance manually and managing environment variables. The Docker approach is strongly recommended.

```bash
# 1. Start a local MongoDB instance.

# 2. Copy environment samples and configure them
cp book-reviews-api/.env.example book-reviews-api/.env
# (Edit .env to point to your local MongoDB instance)

cp book-reviews-ui/.env.example book-reviews-ui/.env.local
# (Edit .env.local to point to the correct API port)

# 3. Install dependencies in both projects
pnpm install --dir ./book-reviews-api
pnpm install --dir ./book-reviews-ui

# 4. Run the seed script for the API (in a separate terminal)
pnpm --dir ./book-reviews-api run seed

# 5. Run both apps in dev mode (in separate terminals)
pnpm --dir ./book-reviews-api run start:dev
pnpm --dir ./book-reviews-ui run dev
```

> Heads-up: running pnpm dev starts the API on :**3001** (Nest CLI) and the UI on :**3000** (`next dev`), while Docker Compose maps them to :**3122** (API) and :**3123** (UI).

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

Environment variables are primarily managed by the `docker-compose.yml` file for a containerized setup. The `.env` files are mainly for local, non-Docker development.

| File | Purpose |
|------|---------|
| `book-reviews-api/.env` | Contains `MONGO_URI` for a local database and `CORS_ALLOWED_ORIGINS`. |
| `book-reviews-ui/.env.local`  | Contains `NEXT_PUBLIC_API_URL` pointing to the API's address. |

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
* **Home page (`/`) serves as the required “/books” list**, showing the top-rated section followed by the full paginated catalogue.
* **React-Query** handles fetching / cache / optimistic update.
* **Tailwind CSS** for UI.
* Skeletons, error states and basic a11y (`aria-live`, `aria-invalid`, no layout shift).

---

## 6. Testing

* **Unit** – Services are tested in isolation with mocked Mongoose models.
* **E2E** – Supertest runs against an in-memory Nest app hitting a dedicated test database (`test-e2e`) to cover the full API lifecycle.
* **Frontend** - React Testing Library and Jest are used to test component behavior and user interactions.

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
