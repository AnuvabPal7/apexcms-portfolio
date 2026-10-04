# ApexCMS Portfolio Suite

```
frontend/   React + Vite + Tailwind (portfolio + CMS admin UI) -> builds, talks to the real API
backend/    Spring Boot 3 REST API (JWT auth, CRUD, uploads, contact) -> runs against Supabase
```

## Run against Supabase (recommended)
1. Host, port and user are already set in `backend/src/main/resources/application.yml`.
2. Set the secrets as Windows user-level variables (PowerShell, then reopen your terminal/IDE):
   `setx CM_PASSWORD "<supabase db password>"` and `JWT_SECRET` (32+ chars; reuse your existing one if you already have it)
3. `cd backend && mvn spring-boot:run`
4. Create your admin ONCE (before deploying anywhere public), e.g. in PowerShell:
```
Invoke-RestMethod -Method Post -Uri http://localhost:8080/api/auth/setup -ContentType application/json `
  -Body '{"name":"Your Name","email":"you@example.com","password":"at-least-10-chars"}'
```
   After that, `/api/auth/setup` returns 409 forever. `GET /api/auth/setup-status` tells the frontend whether setup is still needed.
5. In Supabase SQL Editor enable row level security on all tables (see chat notes / SQL in the guide).

## Run the backend with in-memory H2 (needs JDK 21 + Maven)
```
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev     # in-memory H2, admin: admin@portfolio.cms / admin123 (dev only)
```
Swagger UI: http://localhost:8080/swagger-ui.html

## Run with Postgres + Docker
```
cp .env.example .env   # edit values
docker compose up --build
```

## Endpoints
| Method | Path | Access |
|---|---|---|
| POST | /api/auth/login, /api/auth/refresh | public |
| GET, POST | /api/auth/setup-status, /api/auth/setup | public, but setup only works while there are zero users |
| GET | /api/about, /api/skills, /api/projects, /api/blogs, /api/experience, /api/testimonials, /api/services (+ /{id}) | public (published only; admin sees drafts) |
| PUT | /api/about | admin |
| POST, PUT, DELETE | /api/{skills,projects,blogs,experience,testimonials,services}[/{id}] | admin |
| POST | /api/upload/image | admin |
| GET, DELETE | /api/media, /api/media/{id} | admin |
| POST | /api/contact | public |
| GET, PATCH, DELETE | /api/messages, /api/messages/{id}/read, /api/messages/{id} | admin |

Env vars: CM_PASSWORD + JWT_SECRET (required, secret; JWT 32+ chars). Optional: DB_URL/DB_USERNAME (override application.yml), ADMIN_EMAIL/ADMIN_PASSWORD (optional seed),
CORS_ORIGINS, UPLOAD_DIR, CONTACT_MAIL_TO + SPRING_MAIL_* (optional email).
