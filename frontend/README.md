# ApexCMS Portfolio — Frontend (React + Vite + Tailwind)

Talks to the Spring Boot backend in `../backend` (default `http://localhost:8080/api`).

```
npm install
npm run dev      # http://localhost:3000  (backend must be running)
npm run build    # type-check + production build
```

To use another API address (e.g. your deployed backend), create `.env.local`:
```
VITE_API_BASE_URL=https://your-backend.example.com/api
```
and add the frontend's URL to the backend's `CORS_ORIGINS`.

## How it works
- First visit: open the CMS view. If no admin exists, the login window becomes **Create Admin Account**
  (calls `POST /api/auth/setup`, works only once). After that it is a normal login.
- Public visitors see only *published* content. Drafts are visible when logged in.
- Owner access: the Portfolio/CMS switcher only appears after login. Open the site with `#admin` at the end (e.g. http://localhost:3000/#admin) or use the small "CMS Admin" link in the footer.
- Change your display name, email or password under CMS → Account Settings (needs your current password).
- Tokens are kept in localStorage (simple, but exposed to XSS; fine for a portfolio admin, not for sensitive apps).
- Uploaded images are stored on the backend's disk and served from `/uploads/...`.
