<div align="center">

# 🌍 SustainRank — ESG Intelligence Platform

**A full-stack sustainability ranking system for organisations, aligned to all 17 UN Sustainable Development Goals.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Java](https://img.shields.io/badge/Java-21-orange?logo=openjdk)](https://openjdk.org/projects/jdk/21/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.5-brightgreen?logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite)](https://vite.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://www.postgresql.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

</div>

---

## Overview

SustainRank lets organisations measure, benchmark and improve their ESG (Environmental, Social, Governance) performance. It provides a unified multi-step assessment wizard, a live competitive leaderboard, and a radar-chart dashboard — all aligned to internationally recognised frameworks.

| Framework | Coverage |
|-----------|----------|
| GHG Protocol | Carbon emission calculations (Scope 1, 2, 3) |
| ISO 50001 | Energy management benchmarking |
| GRI 306 | Waste diversion & circular economy scoring |
| UN SDG 8 | Workforce development & social scoring |

---

## Screenshots

<div align="center">

**Home — Hero**
<img src="./App%20images/Screenshot%202026-11-22%20at%208.45.00%E2%80%AFPM.png" alt="SustainRank Home" width="800" />

**Home — Platform Overview**
<img src="./App%20images/Screenshot%202026-11-22%20at%208.45.09%E2%80%AFPM.png" alt="Platform Overview" width="800" />

**Full ESG Assessment Wizard**
<img src="./App images/Screenshot 2026-11-22 at 8.45.17 PM.png" alt="Assessment Wizard" width="800" />

**Performance Dashboard**
<img src="./App images/Screenshot 2026-11-22 at 8.45.50 PM.png" alt="Performance Dashboard" width="800" />

**17 UN SDG Goals Index**
<img src="./App images/Screenshot 2026-11-22 at 8.46.06 PM.png" alt="SDG Goals Index" width="800" />

**ESG Report Analysis — Completeness & Metrics**
<img src="./App images/Screenshot 2026-11-22 at 8.46.42 PM.png" alt="ESG Report Analysis" width="800" />

**ESG Report Analysis — Benchmarking Chart**
<img src="./App images/Screenshot 2026-11-22 at 8.46.49 PM.png" alt="Benchmarking Chart" width="800" />

</div>

---

## Features

- **Full ESG Assessment Wizard** — Unified 6-step flow (Organisation → Carbon → Energy → Waste → Social → Financial) replacing five separate calculators; jump between steps freely, visual completion indicators per step
- **ESG Report Analysis** — Upload any PDF annual/sustainability/BRSR report to automatically extract ESG metrics, benchmark against IT/Tech sector averages, score report completeness (X/15 standard indicators), and get AI-powered insights
- **ESG Dashboard** — Live peer rankings, radar chart, change-vs-last-run metrics
- **AI Recommendations** — Context-aware ESG improvement suggestions on every result page and the dashboard; provider-agnostic (OpenAI, Gemini, Anthropic, Ollama, OpenRouter)
- **Company Profile** — Edit company name, industry, employee count; change password
- **History** — Last 20 calculation runs per organisation
- **JWT Authentication** — Stateless, secure, no cookies required
- **17 SDG Goal Index** — Interactive cards linking to UN documentation

---

## Tech Stack

### Backend
| Layer | Technology |
|-------|-----------|
| Language | Java 21 |
| Framework | Spring Boot 3.3.5 |
| Security | Spring Security + JWT (jjwt 0.12.6, HS256) |
| Database | PostgreSQL 16 (Hibernate / JPA) |
| Build | Maven |

### Frontend
| Layer | Technology |
|-------|-----------|
| Framework | React 19 + Vite 8 |
| Routing | React Router v7 |
| HTTP | Axios (JWT Bearer interceptor) |
| Charts | Chart.js 4 + react-chartjs-2 |
| Icons | Bootstrap Icons 1.13 |
| Styling | BEM CSS classes in `main.css` |

---

## Project Structure

```
SustainRank-ESG-Intelligence-Platform/
├── backend/                          # Spring Boot REST API
│   ├── pom.xml
│   └── src/main/java/com/sustainability/
│       ├── ai/                       # AI recommendations (provider-agnostic)
│       ├── config/                   # SecurityConfig, JwtConfig
│       ├── controller/               # AuthController, CalculatorController, DashboardController, ProfileController, …
│       ├── dto/                      # Request/Response DTOs (with Bean Validation)
│       ├── entity/                   # AppUser, SustainabilityProfile, CalculationHistory
│       ├── exception/                # GlobalExceptionHandler
│       ├── repository/               # Spring Data JPA repositories
│       ├── security/                 # JwtUtil, JwtAuthFilter, UserDetailsServiceImpl
│       ├── service/                  # Business logic (carbon, energy, waste, eevta, score, dashboard, profile, …)
│       ├── report/                   # ReportController, ReportService, ReportAnalysisResult (PDF analysis)
│       └── util/                     # CalcUtils (emission factors, benchmarks), SdgConstants
│   └── src/main/resources/
│       ├── application.properties.example   # ← copy to application.properties
│       └── application.properties           # ← gitignored, your local config
│
├── frontend/                         # React SPA
│   ├── vite.config.js                # Vite dev proxy → localhost:8000
│   ├── .env.example                  # ← copy to .env
│   └── src/
│       ├── api/                      # axiosInstance, auth.js, calculators.js, dashboard.js, ai.js
│       ├── components/               # Header, Footer, AiRecommendations
│       ├── context/                  # AuthContext (JWT localStorage)
│       └── pages/                    # AssessmentWizard, AggResultPage, DashboardPage, ProfilePage, ReportAnalysisPage, …
│
├── .gitignore
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

---

## Getting Started

### Prerequisites

| Tool | Version |
|------|---------|
| Java (JDK) | 21+ |
| Maven | 3.9+ |
| Node.js | 20+ |
| PostgreSQL | 14+ |

---

### 1. Clone the repository

```bash
git clone https://github.com/2025sl93031-ShubhamSain/SustainRank-ESG-Intelligence-Platform.git
cd SustainRank-ESG-Intelligence-Platform
```

---

### 2. Set up PostgreSQL

```bash
# macOS (Homebrew)
brew install postgresql@16
brew services start postgresql@16

# Create the database and set a password for your user
createdb sustainability_db
psql -c "ALTER USER $(whoami) WITH PASSWORD 'your_password';"
```

On Linux:
```bash
sudo apt install postgresql
sudo systemctl start postgresql
sudo -u postgres createdb sustainability_db
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'your_password';"
```

---

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and set your values:

```env
POSTGRES_DB=sustainability_db
POSTGRES_USER=your_postgres_user
POSTGRES_PASSWORD=your_postgres_password

SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/sustainability_db
SPRING_DATASOURCE_USERNAME=your_postgres_user
SPRING_DATASOURCE_PASSWORD=your_postgres_password

JWT_SECRET=your_jwt_secret        # generate with: openssl rand -hex 32
JWT_EXPIRATION_MS=86400000

CORS_ALLOWED_ORIGINS=http://localhost:5173
```

> **Tip:** Generate a JWT secret with `openssl rand -hex 32`

---

### 4. Configure the backend

```bash
cp backend/src/main/resources/application.properties.example \
   backend/src/main/resources/application.properties
```

Edit `application.properties` and set:

```properties
spring.datasource.username=your_postgres_user
spring.datasource.password=your_postgres_password
jwt.secret=your_jwt_secret
```

**Optional — enable AI recommendations:**

```properties
ai.provider=openai          # openai | gemini | anthropic | ollama
ai.api-key=sk-...           # omit for Ollama
ai.model=gpt-4o-mini
ai.base-url=                # optional, e.g. https://openrouter.ai/api for OpenRouter
```

> If `ai.api-key` is not set or the provider is unreachable, the UI shows "Recommendations unavailable" instead of crashing.

---

### 5. Start the backend

```bash
cd backend
mvn spring-boot:run
```

The API will be available at `http://localhost:8000/api/`.  
Hibernate will auto-create all tables on first run (`ddl-auto=update`).

---

### 6. Configure the frontend

```bash
cd frontend
cp .env.example .env
npm install
```

---

### 7. Start the frontend

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

### 8. Load demo data (optional)

Seed the database with 11 demo companies and two history entries each:

```bash
psql -U <your_user> -d sustainability_db -f seed.sql
```

Demo accounts after seeding:

| Username | Password | Company |
|----------|----------|---------|
| `testuser` | `test123` | A-Company |


### 9. Register your own account

Go to `http://localhost:5173/register` and create your organisation account, then run the Full ESG Assessment at `/assessment`.

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/register/` | Public | Register new organisation |
| POST | `/api/login/` | Public | Login, returns JWT token |
| POST | `/api/logout/` | Public | Logout (client removes token) |
| GET | `/api/me/` | JWT | Current user info |
| GET | `/api/index/` | JWT | SDG data for home page |
| POST | `/api/carbon_calculator/` | JWT | Carbon emission calculation |
| POST | `/api/energy_calculator/` | JWT | Energy consumption calculation |
| POST | `/api/waste_calculator/` | JWT | Waste management calculation |
| POST | `/api/calculate_eevta_score/` | JWT | Workforce development scoring |
| POST | `/api/sustainability_calculator/` | JWT | Full ESG composite score |
| GET | `/api/dashboard/` | JWT | Rankings, radar data, change metrics |
| GET | `/api/history/` | JWT | Last 20 calculation history entries |
| GET | `/api/profile/` | JWT | Get company profile |
| PUT | `/api/profile/` | JWT | Update company profile |
| POST | `/api/profile/change-password/` | JWT | Change account password |
| POST | `/api/ai/result` | JWT | AI recommendations for a calculator result |
| POST | `/api/ai/dashboard` | JWT | AI recommendations based on rank + ESG scores |
| POST | `/api/reports/analyse` | JWT | Upload PDF report, extract ESG metrics, benchmark against industry, AI insights |

---

## Calculation Methodology

### Emission Factors (GHG Protocol)

| Source | Factor |
|--------|--------|
| Grid electricity (India) | 0.82 kgCO₂e/kWh |
| Natural gas | 2.204 kgCO₂e/kg |
| Petrol | 2.31 kgCO₂e/litre |
| Diesel | 2.68 kgCO₂e/litre |
| LPG | 1.51 kgCO₂e/kg |
| Short-haul flights | 0.255 kgCO₂e/km |
| Long-haul flights | 0.195 kgCO₂e/km |
| Train | 0.041 kgCO₂e/km |

### Scoring Function

All metrics use an exponential decay / growth function to produce a 0–100 score:

```
score = 100 × e^(−0.693 × value/benchmark)   # lower-is-better metrics (carbon, waste)
score = 100 × (1 − e^(−0.693 × value/benchmark))  # higher-is-better metrics (renewable %)
```

### ESG Composite

```
Composite = Environmental × 0.50 + Social × 0.30 + Governance × 0.20
```

---

## Environment Variables Reference

Copy `.env.example` to `.env` and fill in your values — this file is used by both Docker Compose and local development.

| Key | Description |
|-----|-------------|
| `POSTGRES_DB` | PostgreSQL database name |
| `POSTGRES_USER` | PostgreSQL username |
| `POSTGRES_PASSWORD` | PostgreSQL password |
| `SPRING_DATASOURCE_URL` | JDBC URL (use `localhost:5432` for local, `db:5432` for Docker) |
| `SPRING_DATASOURCE_USERNAME` | Database username |
| `SPRING_DATASOURCE_PASSWORD` | Database password |
| `JWT_SECRET` | HS256 signing key — generate with `openssl rand -hex 32` |
| `JWT_EXPIRATION_MS` | Token TTL in ms (default: 86400000 = 24h) |
| `CORS_ALLOWED_ORIGINS` | Comma-separated allowed origins |
| `AI_PROVIDER` | AI provider: `openai` \| `gemini` \| `anthropic` \| `ollama` |
| `AI_API_KEY` | API key for the chosen provider (omit for Ollama) |
| `AI_MODEL` | Model name e.g. `gpt-4o-mini`, `gemini-1.5-flash`, `claude-haiku-4-5` |
| `AI_BASE_URL` | Optional base URL override (e.g. `http://localhost:11434` for Ollama or an OpenRouter endpoint) |

### Frontend (`frontend/.env`)

| Key | Description |
|-----|-------------|
| `VITE_PORT` | Dev server port (default: 5173) |
| `VITE_API_BASE_URL` | Backend URL for production builds |

---

## Docker (Quickstart)

The easiest way to run the full stack locally or in production is with Docker Compose.

```bash
# 1. Clone the repo
git clone https://github.com/2025sl93031-ShubhamSain/SustainRank-ESG-Intelligence-Platform.git
cd SustainRank-ESG-Intelligence-Platform

# 2. Set up environment variables
cp .env.example .env
# Edit .env and fill in your values (DB password, JWT secret, etc.)

# 3. Start all services (PostgreSQL + backend + frontend)
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:80 |
| Backend API | http://localhost:8000/api/ |
| PostgreSQL | localhost:5432 |

To stop: `docker compose down`  
To wipe data: `docker compose down -v`

---

## Production Deployment

### Backend
```bash
cd backend
mvn clean package -DskipTests
java -jar target/sustainability-backend-1.0.0.jar
```

Set production environment variables via system env or a secrets manager — never hardcode credentials.

### Frontend
```bash
cd frontend
npm run build      # outputs to frontend/dist/
```

Serve the `dist/` directory with Nginx, Caddy, or any static host. Configure the web server to proxy `/api/*` to your Spring Boot instance.

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a pull request.

1. Fork the repo
2. Create a branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push: `git push origin feat/your-feature`
5. Open a Pull Request

---

## License

This project is licensed under the [MIT License](./LICENSE).

---

## Authors

**Shubham Sain**  
[![GitHub](https://img.shields.io/badge/GitHub-2025sl93031--ShubhamSain-black?logo=github)](https://github.com/2025sl93031-ShubhamSain)  

**Shatakshi**  
[![GitHub](https://img.shields.io/badge/GitHub-2025sl93003--shatakshi-black?logo=github)](https://github.com/2025sl93003-shatakshi)  

**Shubham Maurya**  
[![GitHub](https://img.shields.io/badge/GitHub-2025sl93001bits-black?logo=github)](https://github.com/2025sl93001bits)  
