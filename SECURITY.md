# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| latest (master) | ✅ |

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

## Security Best Practices for Deployers

- Always generate a unique `jwt.secret` (min 64 hex chars): `openssl rand -hex 32`
- Never commit `application.properties` or `.env` files with real credentials
- Use environment variables or a secrets manager in production
- Run the backend behind a reverse proxy (Nginx/Caddy) with HTTPS in production
- Set `spring.jpa.hibernate.ddl-auto=validate` (not `update`) in production
- Restrict PostgreSQL access to localhost or a private network
