# Tech-Assessment – Book Reviews Platform

**Goal**  
Build a small “Book Reviews” platform (CRUD books + reviews, plus an endpoint that returns the top-rated books).

| Stack (mandatory) | Why |
|-------------------|-----|
| NestJS + MongoDB  | API, data layer & aggregation |
| Next.js (App Router) | UI & SSR |
| React Query       | Data fetching / cache |
| Tailwind CSS      | Styling |

> **Time-box:** aim for **4-8 h** of focused work.  
> When time is up, push what you have — unfinished is OK, but document what’s missing.

---

## 1. What you must deliver

| Area | Minimum requirements |
|------|----------------------|
| **Backend** | *Connect to MongoDB* via env var<br>*Models*: `Book`, `Review` (rating 1-5)<br>*CRUD* endpoints for both entities (`/books`, `/books/:id/reviews`)<br>*Aggregation*: `GET /books/top?limit=10` returns avgRating + reviewCount, sorted desc<br>*Tests*: at least **one** e2e test hitting `/books/top` |
| **Frontend** | `/books` page listing the top books (uses React Query)<br>Book detail page showing reviews and a form to add a review (optimistic update welcome)<br>Responsive UI with Tailwind |
| **DX / Ops** | Clear local-dev instructions (README or Makefile)<br>`.env.example` with all needed vars<br>Lint + format commands<br>(Optional) Docker setup |

---

## 2. Local setup expected by reviewers

```bash
pnpm install          # monorepo or multiple projects — you choose
pnpm dev              # should start both backend and frontend
# backend on :3001, frontend on :3000 is a common pattern
```

If you rely on Docker (e.g. docker compose up mongo), document it.

⸻

## 3. Submission guidelines
1.	Fork this repo, build on main.
2.	Open a pull request to your own fork when finished. In the PR description include:
  - (i) What is done / not done,
  - (ii)	How to run tests and
  - (iii)	Any trade-offs or shortcuts
3.	Do not open a PR against the original repo.

⸻

## 4. Evaluation rubric

Criterion	Weight

- Correctness & tests	30 %
- Code quality / structure	20 %
- Data modelling & validation	15 %
- Aggregation query efficiency	10 %
- Frontend UX & accessibility	15 %
- Documentation	10 %


⸻

## 5. Constraints & tips

-	TypeScript everywhere.
-	Keep third-party libs minimal (testing & dev-tools are fine).
-	Commit early & often — we read history.
-	Feel free to use dev-containers / Codespaces; just explain how.

⸻

Good luck 🚀
