# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- Unit & integration tests for backend services
- Dark/light mode toggle on dashboard
- Export ESG report as PDF
- Email notifications for score changes

---

## [2.0.0] — 2026-09-22

### Changed — Backend Migration (Django → Spring Boot)
- Replaced Django REST Framework backend with Spring Boot 3.3.5 + Java 21
- Replaced Django session/CSRF authentication with stateless JWT (HS256, jjwt 0.12.6)
- Migrated database from SQLite to PostgreSQL 16 with Hibernate JPA
- All Django API endpoints replicated exactly (same URL paths, same JSON response shapes)
- Frontend updated: CSRF cookie logic removed, `Authorization: Bearer` header added via Axios interceptor

### Added
- Spring Security filter chain with `JwtAuthFilter`
- BCrypt password hashing
- `CalculationHistory` — stores last 20 runs per organisation
- Dashboard change-vs-last-run metrics (sustainability, energy, waste, cost-benefit deltas)
- 10 fictional dummy companies for demo rankings

### Changed — Frontend Redesign
- Login page: new two-panel full-screen layout (dark gradient left + clean white right)
- Register page: matching two-panel layout, show/hide password toggles
- Index/Home page: fully rewritten — modern hero, about section, service cards, feature tabs, SDG goal grid, contact section
- Dashboard: light mode, full-width layout, trophy badges for top 3, INDUSTRY in uppercase, change badges with real deltas, formatted date
- Navbar: scroll-aware frosted glass, active state highlighting, user chip, mobile drawer

---

## [1.0.0] — 2025-04-05

### Added
- Initial release with Django REST Framework backend
- React + Vite frontend with Bootstrap template styling
- Carbon emission calculator (GHG Protocol)
- Energy consumption calculator (ISO 50001)
- Waste management calculator (GRI 306)
- Workforce development scorer (SDG 8 / EEVTA)
- Sustainability composite score (ESG weighted average)
- Dashboard with radar chart and peer rankings
- History page (last 20 calculations)
- Session-based authentication with CSRF protection
- 17 SDG goal index page
