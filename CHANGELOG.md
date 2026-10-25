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

## [1.1.0] — 2026-10-20

### Added — AI-Powered ESG Recommendations
- Provider-agnostic AI layer: `AiProvider` interface with `OpenAiProvider`, `GeminiProvider`, `AnthropicProvider` implementations
- `AiProviderFactory` selects the correct impl from `ai.provider` config key — swap providers by changing one property, no code changes needed
- Supports OpenAI, Google Gemini, Anthropic Claude, Ollama (local), and any OpenAI-compatible proxy (e.g. OpenRouter)
- `POST /api/ai/result` — context-aware recommendations for each calculator result (score + type + industry)
- `POST /api/ai/dashboard` — recommendations based on rank + all three ESG pillar scores
- `AiRecommendations` reusable React component with loading spinner, graceful empty state, and bullet list
- GitHub issue template for AI recommendations bug reports (`.github/ISSUE_TEMPLATE/ai_recommendations.yml`)

### Changed
- `ResultCard`, `AggResultPage`, `DashboardPage` wired to AI endpoints — old hardcoded suggestions removed
- All Dashboard inline styles migrated to BEM CSS classes in `main.css`
- `application.properties.example` updated with `ai.*` config block

---

## [1.0.0] — 2026-09-22

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

