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

## [2.0.0] — 2026-11-13

### Added — Multi-Step Assessment Wizard
- New unified **Full ESG Assessment** wizard at `/assessment` replacing five separate calculator pages
- 6-step flow: Organisation → Carbon → Energy → Waste → Social → Financial
- Step indicator with three visual states: green tick (complete), amber `!` (required field missing), blue (active)
- Click any step circle to jump directly to that step and edit values
- All steps pre-filled with realistic default values for quick testing
- On final step, fires all 5 API calls in sequence then navigates to `/result/sustainability`
- Progress bar showing percentage completion across all steps
- Error clears automatically as the user types

### Added — Company Profile Settings
- `GET /api/profile/` and `PUT /api/profile/` endpoints — edit company name, industry, employee count
- `POST /api/profile/change-password/` — change password with current password verification and ≥8 char enforcement
- `ProfilePage.jsx` — company info form, read-only account info, change password section with show/hide toggles
- User chip in header links to `/profile`; "Company Profile" link in mobile drawer

### Added — Security Hardening
- Jakarta Bean Validation on all DTOs (`RegisterRequest`, `LoginRequest`, `ProfileRequest`, `ChangePasswordRequest`)
- `GlobalExceptionHandler` returns `{ success: false, error: "..." }` for all validation failures — same shape as existing error responses
- Password strength enforcement: minimum 8 characters on both register and change-password flows
- `ProfileServiceTest` — 12 unit tests covering all profile and password change scenarios

### Added — Navigation
- Dashboard link added to navbar — direct access from any page
- Assessment link added to desktop nav and mobile drawer

### Removed — Individual Calculator Pages
- Deleted `CarbonCalculatorPage.jsx`, `EnergyCalculatorPage.jsx`, `WasteCalculatorPage.jsx`, `EevtaCalculatorPage.jsx`, `SustainabilityPage.jsx`, `FormResultPage.jsx`
- Removed routes `/carbon`, `/energy`, `/waste`, `/eevta`, `/sustainability`, `/result`
- All calculator service cards on the home page now route to `/assessment`
- `calculators.js` API functions retained — still used by the wizard

### Changed
- Home page hero stat updated from "6 Calculators" to "6 Metrics Assessed"
- Chevron-down arrow removed from header user chip

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

