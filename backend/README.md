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

## API

- `POST /auth/register` accepts `{ "fullName", "email", "password" }`; names are required and passwords must be at least 8 characters.
- `POST /auth/login` accepts the same fields and returns a bearer access token and user.
- `GET /auth/me` returns the authenticated user.
- `GET /events` and `GET /events/{id}` list or retrieve events.
- `POST /events` creates an event for the authenticated user. Required fields: `title`, `organization`, `category`, `description`, `fullDescription`, `eligibility`, `location`, `deadline`, and `instructions`. `skills` is optional.
- `GET /bookmarks` lists the authenticated user's bookmarked events.
- `PUT /events/{id}/bookmark` and `DELETE /events/{id}/bookmark` add or remove a bookmark. Both are idempotent.

The frontend sends camelCase event fields, including `fullDescription`. Event creation is available to authenticated accounts only. Bookmarking an event already in the database needs no request body. For a sample event that is not yet in the database, `PUT /events/{id}/bookmark` accepts the event fields as JSON and stores that sample snapshot before creating the bookmark. All bookmarks and their event data are stored in PostgreSQL.

Send the login token on protected routes as `Authorization: Bearer <access_token>`. User responses include `fullName`; event responses include `creatorName` and `isDemo`. Event response keys match the frontend opportunity contract; `deadline` uses `YYYY-MM-DD`.