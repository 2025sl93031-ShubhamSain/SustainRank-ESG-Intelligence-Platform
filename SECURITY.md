# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.1.x (latest) | ✅ |
| 1.0.x | ✅ |
| older | ❌ |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

If you discover a security vulnerability, please email:

📧 **2025sl93031@wilp.bits-pilani.ac.in**

Include in your report:
- A description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fix (optional)

You will receive a response within **48 hours**. We ask that you:
- Give us reasonable time to fix the issue before public disclosure
- Not access or modify other users' data during testing
- Not perform denial-of-service attacks

We appreciate responsible disclosure and will credit you in the fix if you wish.

---

## Security Best Practices for Deployers

### Authentication & JWT
- Always generate a unique `jwt.secret` (min 64 hex chars): `openssl rand -hex 32`
- Never commit `application.properties` or `.env` files with real credentials
- Use environment variables or a secrets manager in production
- Default token TTL is 24 h (`jwt.expiration-ms=86400000`) — reduce for higher-security environments

### AI API Keys
- Store your AI provider key **only** in `application.properties` (server-side) — never in frontend code or environment variables exposed to the browser
- `application.properties` is gitignored; never commit it with a real key
- Rotate your AI API key immediately if it is accidentally exposed in logs, chat, or version control
- Scope API keys to the minimum permissions required by your provider (e.g. inference-only, no billing access)
- Set spend limits on your AI provider account to cap unintended usage if a key leaks
- The backend proxies all AI calls — the key is never sent to or visible from the frontend

### API Endpoint Protection
- All `/api/ai/**`, `/api/carbon/`, `/api/energy/`, `/api/waste/`, `/api/eevta/`, `/api/sustainability/`, `/api/dashboard/`, and `/api/history/` endpoints require a valid JWT — unauthenticated requests are rejected with `401`
- Only `/api/register/` and `/api/login/` are public
- CORS is restricted to `cors.allowed-origins` — set this to your frontend's exact origin in production (never `*`)
- The AI endpoints (`POST /api/ai/result`, `POST /api/ai/dashboard`) are rate-limited only by your provider's quota; consider adding Spring rate-limiting middleware if exposing publicly

### Infrastructure
- Run the backend behind a reverse proxy (Nginx/Caddy) with HTTPS in production
- Set `spring.jpa.hibernate.ddl-auto=validate` (not `update`) in production
- Restrict PostgreSQL access to localhost or a private network
- Never log the full AI request/response body — it may contain proprietary business data
