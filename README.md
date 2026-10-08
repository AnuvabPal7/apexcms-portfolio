# ApexCMS Portfolio

A full-stack developer portfolio with its own **custom-built CMS**. The portfolio site reads all of its content (profile, projects, skills, experience, blog, services, testimonials) from a REST API, and the owner edits that content from a password-protected admin panel, with no code changes or redeploys.

**Live demo:** https://apexcms-portfolio.vercel.app

## Features

**Public portfolio**
- Sections for hero, about, projects, skills, experience, services, writing (blog) and testimonials, with a contact form
- Shows only *published* content; sections and links that are empty are hidden
- Responsive dark UI

**CMS admin panel** (open `/#admin`, or use the "CMS Admin" link in the footer)
- JWT login with automatic token refresh
- First-run setup: when no admin exists, the login window becomes "Create Admin Account" (works only once)
- Create, edit and delete projects, skills, experience, blog posts, services and testimonials
- Draft / published status and display order for each item
- Image uploads with a media library
- Contact inbox (mark read / unread, delete)
- Account settings: change display name, email or password (current password required)

**Backend**
- REST API for every content type, plus auth, upload and contact endpoints
- Stateless JWT authentication (access token 30 min, refresh token 7 days), BCrypt password hashing
- Public `GET` endpoints return published items only; admins also see drafts
- Upload validation: image types only, 5 MB limit, file signature check, random file names
- Contact messages are saved to the database first, then emailed if mail is configured
- Consistent JSON error responses (RFC 7807) and Swagger UI documentation

## Architecture

```
Visitor / Admin  (React + Vite, Vercel)
        |  REST + JSON, Authorization: Bearer <JWT>
        v
Spring Boot API  (Render, Docker)
  Controllers -> Services -> Spring Data JPA
  Spring Security + JWT filter
        |
        v
PostgreSQL  (Supabase)
```

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS 4, lucide-react |
| Backend | Java 21, Spring Boot 3.3, Spring Web, Spring Security, Spring Data JPA (Hibernate), Bean Validation |
| Auth | JWT (jjwt), BCrypt |
| Database | PostgreSQL (Supabase); H2 in-memory for the `dev` profile |
| API docs | springdoc-openapi (Swagger UI) |
| DevOps | Docker, Render (backend), Vercel (frontend) |

## Project structure

```
apexcms-portfolio/
├── backend/                  Spring Boot API
│   ├── src/main/java/com/apexcms/
│   │   ├── config/           security, CORS, properties, first-run seeding
│   │   ├── controller/       REST endpoints
│   │   ├── service/          auth, media upload, contact logic
│   │   ├── model/            JPA entities
│   │   ├── repository/       Spring Data repositories
│   │   ├── security/         JWT service and request filter
│   │   └── exception/        error handling
│   ├── Dockerfile
│   └── pom.xml
├── frontend/                 React app (public site + CMS admin)
│   └── src/
│       ├── components/       portfolio/ and cms/ components
│       ├── services/api.ts   API client with token handling
│       └── types/
└── docker-compose.yml        optional: local backend + PostgreSQL
```

## API overview

Full interactive docs: `/swagger-ui.html` on the running backend.

| Method | Path | Access |
|---|---|---|
| POST | `/api/auth/login`, `/api/auth/refresh` | public |
| GET | `/api/auth/setup-status` | public |
| POST | `/api/auth/setup` | public, only works while no admin exists |
| PUT | `/api/auth/account` | admin |
| GET | `/api/about`, `/api/skills`, `/api/projects`, `/api/blogs`, `/api/experience`, `/api/testimonials`, `/api/services` (and `/{id}`) | public (published only) |
| PUT | `/api/about` | admin |
| POST, PUT, DELETE | `/api/{skills,projects,blogs,experience,testimonials,services}` (and `/{id}`) | admin |
| POST | `/api/upload/image` | admin |
| GET, DELETE | `/api/media`, `/api/media/{id}` | admin |
| POST | `/api/contact` | public |
| GET, PATCH, DELETE | `/api/messages`, `/api/messages/{id}/read`, `/api/messages/{id}` | admin |

## Run it locally

**Requirements:** JDK 21, Maven, Node.js 18+

### 1. Backend

Quick start with an in-memory database (no setup, data resets on every restart):

```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

The `dev` profile creates a throwaway admin (see `application-dev.yml`). Use it for local testing only.

To run against your own PostgreSQL database, set these environment variables first:

| Variable | Purpose |
|---|---|
| `DB_URL` | JDBC URL, e.g. `jdbc:postgresql://localhost:5432/apexcms` |
| `DB_USERNAME` | database user |
| `CM_PASSWORD` | database password (secret) |
| `JWT_SECRET` | random string of **32+ characters** (secret, required) |
| `CORS_ORIGINS` | allowed frontend origins, comma-separated (default: `http://localhost:3000,http://localhost:5173`) |

Optional: `CONTACT_MAIL_TO` plus `SPRING_MAIL_HOST`, `SPRING_MAIL_PORT`, `SPRING_MAIL_USERNAME` and `SPRING_MAIL_PASSWORD` to get contact-form emails. `UPLOAD_DIR` sets where uploaded images are stored.

Then run `mvn spring-boot:run`. The API listens on http://localhost:8080.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev        # http://localhost:3000
```

The frontend calls `http://localhost:8080/api` by default. To use another API, create `frontend/.env.local`:

```
VITE_API_BASE_URL=https://your-backend.example.com/api
```

### 3. Create your admin account

Open http://localhost:3000/#admin. If no admin exists yet, the login window shows **Create Admin Account**. Fill it in once; after that it becomes a normal login. Then add your content under **Profile**, **Projects**, **Skills** and the other CMS pages.

### Optional: Docker

```bash
cp .env.example .env     # set DB_PASSWORD and JWT_SECRET
docker compose up --build
```

This starts the backend with its own PostgreSQL container. The database starts empty.

## Deployment

- **Backend (Render):** Docker runtime, root directory `backend`. Set `CM_PASSWORD`, `JWT_SECRET` and `CORS_ORIGINS` (the frontend URL, no trailing slash). The app reads Render's `PORT` automatically.
- **Frontend (Vercel):** root directory `frontend`, with `VITE_API_BASE_URL` set to the backend URL ending in `/api`.
- **Database (Supabase):** use the pooler connection and enable row-level security on the tables so Supabase's public API cannot read them. The backend connects directly as the database owner and is unaffected.

## Security notes

- Passwords are stored as BCrypt hashes; JWT secret and database password come from environment variables, never from the repository.
- Admin-only endpoints require a valid access token; the one-time setup endpoint closes as soon as an admin exists.
- Uploads are restricted to images, checked by content signature, and saved under generated names.
- Contact-form input is validated, and header injection is prevented in the notification email.

## Known limitations

- Uploaded images are stored on the server's disk, which resets on free-tier hosts. Moving uploads to object storage (Supabase Storage, S3 or Cloudinary) is the planned fix.
- Tokens are kept in `localStorage`, which is simple but exposed to XSS. Moving to HttpOnly cookies would be stronger.
- No rate limiting on login or the contact form yet.
- The free tiers sleep when idle, so the first request after a pause can take up to a minute.
- Database schema is generated by Hibernate (`ddl-auto: update`); a migration tool such as Flyway would be better for production.

## Roadmap

- Cloud image storage
- Rate limiting and login attempt lockout
- Flyway migrations
- Automated tests (JUnit and MockMvc for the API, Vitest for the frontend)
- CI pipeline with GitHub Actions