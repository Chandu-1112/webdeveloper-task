# OpportunityHub API

FastAPI service backed by PostgreSQL. It provides account registration and login, event listing and creation, and per-user event bookmarks.

## Run locally

1. Create a PostgreSQL database named `opportunityhub`.
2. From this directory, copy `.env.example` to `.env` and set `DATABASE_URL` and a long random `JWT_SECRET_KEY`.
3. Create and activate a virtual environment, then install dependencies:

   ```powershell
   py -m venv .venv
   .venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   ```

4. Start the API:

   ```powershell
   uvicorn app.main:app --reload
   ```

The API is available at `http://localhost:8000`; interactive documentation is at `http://localhost:8000/docs`. Tables are created at startup for a new database. Never use a development JWT secret in production.

For a database created by an earlier version of this API, apply the schema update once before starting the new code:

```powershell
psql $env:DATABASE_URL -f migrations/001_add_names_and_demo_bookmarks.sql
```

In another terminal, run the frontend from the repository root with `npm install` and `npm run dev`. The frontend defaults to `http://localhost:8000`; set `VITE_API_URL` in the root `.env` file if the API uses a different address. Add the frontend origin to `CORS_ORIGINS` when it differs from `http://localhost:5173`.

## Deploy API to Vercel with Neon

This repository keeps the API under `backend/`. Create a separate Vercel project for it; do not use the repository root as the Vercel project root.

1. Import the Git repository into Vercel and set **Root Directory** to `backend`.
2. Leave the framework preset on **FastAPI** (or allow Vercel to detect it). Vercel uses `app/main.py` as the FastAPI entrypoint, reads `requirements.txt` from this project root, and applies the function settings in `vercel.json`.
3. Add these environment variables to the Vercel project. Set them for Production, and for Preview if you deploy preview builds:

   ```env
   DATABASE_URL=postgresql+psycopg://USER:PASSWORD@YOUR-NEON-POOLER-HOST/DB_NAME?sslmode=require
   JWT_SECRET_KEY=your-long-random-secret
   ACCESS_TOKEN_EXPIRE_MINUTES=60
   CORS_ORIGINS=https://YOUR-RENDER-FRONTEND.onrender.com
   ```

   Use Neon's **pooled** connection string for serverless deployments, preserve its real username, password, host, and database name, and ensure the scheme is `postgresql+psycopg://`. Keep the database URL and JWT secret in Vercel's environment settings, not in Git. Generate a unique production JWT secret.
4. Deploy the Vercel project. Check `https://YOUR-VERCEL-API.vercel.app/health` for `{"status":"ok"}` and `/docs` for the interactive API documentation.
5. In the Render frontend service, set the build-time variable `VITE_API_URL` to `https://YOUR-VERCEL-API.vercel.app` and redeploy the frontend. Set `CORS_ORIGINS` to the exact public Render origin, including `https://` and without a trailing slash. If you use a custom domain, use that origin instead.

For a new Neon database, the API creates its tables at startup. If the Neon database already contains the earlier OpportunityHub schema, run `migrations/001_add_names_and_demo_bookmarks.sql` against it before deploying the new backend.

The frontend and API are separate deployments: keep the frontend on Render, and use the Vercel project only for `backend/`.

## API

- `POST /auth/register` accepts `{ "fullName", "email", "password" }`; names are required and passwords must be at least 8 characters.
- `POST /auth/login` accepts the same fields and returns a bearer access token and user.
- `GET /auth/me` returns the authenticated user.
- `GET /events` and `GET /events/{id}` list or retrieve events.
- `POST /events` creates an event for the authenticated user. Required fields: `title`, `organization`, `category`, `description`, `fullDescription`, `eligibility`, `location`, `deadline`, and `instructions`. `skills` is optional.
- `GET /events/mine` lists the authenticated user's own events. `PUT /events/{id}` edits an event and `DELETE /events/{id}` deletes it; both operations are limited to the event's creator.
- `GET /bookmarks` lists the authenticated user's bookmarked events.
- `PUT /events/{id}/bookmark` and `DELETE /events/{id}/bookmark` add or remove a bookmark. Both are idempotent.

The frontend sends camelCase event fields, including `fullDescription`. Event creation is available to authenticated accounts only. Bookmarking an event already in the database needs no request body. For a sample event that is not yet in the database, `PUT /events/{id}/bookmark` accepts the event fields as JSON and stores that sample snapshot before creating the bookmark. All bookmarks and their event data are stored in PostgreSQL.

Send the login token on protected routes as `Authorization: Bearer <access_token>`. User responses include `fullName`; event responses include `creatorName` and `isDemo`. Event response keys match the frontend opportunity contract; `deadline` uses `YYYY-MM-DD`.