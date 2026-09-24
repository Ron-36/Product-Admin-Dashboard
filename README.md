# Product Admin Dashboard

A small admin dashboard built with **Next.js (App Router)**, **React**, **Tailwind CSS**, **Axios**, and **lucide-react** icons, backed by the free [DummyJSON](https://dummyjson.com) API.

## Tech stack

- Next.js 14 (App Router, JavaScript)
- Tailwind CSS (custom blue/white theme)
- Axios (one shared instance, see `lib/axios.js`)
- lucide-react for icons
- No React Query / SWR / table libraries — all data fetching and pagination logic is hand-written

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You'll be redirected to `/login`.

**Demo login:** `emilys` / `emilyspass`

To build and run a production build locally:

```bash
npm run build
npm run start
```

## Project structure

```
app/
  login/page.js            Login screen
  products/page.js         Product list (table/cards, search, filter, sort, pagination)
  products/[id]/page.js    Product details + reviews
  products/add/page.js     Add product form
  products/[id]/edit/page.js  Edit product form
components/                Reusable UI pieces (table/cards, form, modal, states, nav)
context/AuthContext.js     Auth state, login/logout, session persistence
lib/axios.js               Shared Axios instance (auth header + error handling)
lib/api/                   API call functions, kept out of the UI
```

## What's finished

- [x] Login with DummyJSON `/auth/login`, error message on bad credentials, logout button
- [x] Route protection — `/products/*` redirects to `/login` if not authenticated
- [x] Product list: image, title, category, price, rating, stock — table on desktop, cards on mobile
- [x] Pagination: page numbers, Previous/Next, page size (10/20/50), "Showing X–Y of Z" text
- [x] Debounced search (`/products/search`), resets to page 1 on change
- [x] Category filter (`/products/categories`) and sort by price/rating/title, asc/desc
- [x] Product details page at `/products/[id]` with images, description, price, reviews; "not found" state for bad ids
- [x] Add / edit product form with validation; delete with a confirm dialog
- [x] Loading, empty, and error (with Retry) states throughout
- [x] One shared Axios instance that attaches the token and centralises error handling
- [x] Page, search, filter, and sort state all live in the URL (shareable, survives refresh)
- [x] Search race conditions handled — stale/slow responses are aborted and ignored
- [x] Invalid URL values (`?page=abc`, `?page=999`) are clamped instead of breaking the page
- [x] Login and Save buttons are guarded against double/rapid submits

## Notes on the tricky bits

**Category filter vs. search.** DummyJSON can't filter by category and search by text at the same time. When a search term is active, the category dropdown is disabled (with a tooltip explaining why) and the search takes priority. Clearing the search re-enables the category filter.

**Add / edit / delete aren't really persisted.** DummyJSON's `/products/add`, `PUT /products/:id`, and `DELETE /products/:id` all return a valid-looking response but don't actually change the underlying data set. So:
- **Delete** removes the item from local component state immediately after a successful API call, so it disappears from the list right away (but reappears if you refresh, since the API forgot about it).
- **Add / edit** show a success message and then return you to the product list. A banner on those pages explains that the change won't survive a refresh, since there's no real backend to persist it to.

**Fast typing in search.** Every search request carries an `AbortController` signal, and a new keystroke aborts whatever request is still in flight before firing the next one. A request id counter is also checked before applying a response, so even a slow response that manages to resolve can never overwrite a newer one. This was tested by appending `&delay=2000` to the search URL.

**Double-submit protection.** The login and save buttons disable themselves while a request is in flight, and the login handler also uses a ref-based guard so a burst of clicks before React re-renders can't slip a second request through.

## Where AI helped

This project was scaffolded and written with AI assistance (Claude), covering the overall file structure, the Axios setup with interceptors, the URL-driven pagination/search/filter state, and the Tailwind styling. Every part of the code was reviewed and is understood — happy to walk through any of it and make live changes.
