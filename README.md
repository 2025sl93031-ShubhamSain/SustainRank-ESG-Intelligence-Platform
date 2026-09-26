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

SustainRank lets organisations measure, benchmark and improve their ESG (Environmental, Social, Governance) performance. It provides five science-backed calculators, a live competitive leaderboard, and a radar-chart dashboard — all aligned to internationally recognised frameworks.

| Framework | Coverage |
|-----------|----------|
| GHG Protocol | Carbon emission calculations (Scope 1, 2, 3) |
| ISO 50001 | Energy management benchmarking |
| GRI 306 | Waste diversion & circular economy scoring |
| UN SDG 8 | Workforce development & social scoring |

---

## Features

- **Carbon Calculator** — Grid, gas, petrol, diesel, LPG, flight and rail emission factors
- **Energy Calculator** — Electricity and fuel consumption benchmarked by sector
- **Waste Calculator** — Total waste, recycled, composted, landfill diversion rate
- **Workforce (EEVTA) Calculator** — Training, retention, benefits, gender equity, disability inclusion
- **Sustainability Score** — ESG composite (Environmental 50% · Social 30% · Governance 20%) with blended ROI
- **ESG Dashboard** — Live peer rankings, radar chart, change-vs-last-run metrics
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
| Styling | Inline styles (zero CSS-class dependencies) |

---

## Project Structure

```
SustainRank-ESG-Intelligence-Platform/
├── backend/                          # Spring Boot REST API
│   ├── pom.xml
│   └── src/main/java/com/sustainability/
│       ├── config/                   # SecurityConfig, JwtConfig
│       ├── controller/               # AuthController, CalculatorController, DashboardController, …
│       ├── dto/                      # Request/Response DTOs
│       ├── entity/                   # AppUser, SustainabilityProfile, CalculationHistory
│       ├── repository/               # Spring Data JPA repositories
│       ├── security/                 # JwtUtil, JwtAuthFilter, UserDetailsServiceImpl
│       ├── service/                  # Business logic (carbon, energy, waste, eevta, score, dashboard, …)
│       └── util/                     # CalcUtils (emission factors, benchmarks), SdgConstants
│   └── src/main/resources/
│       ├── application.properties.example   # ← copy to application.properties
│       └── application.properties           # ← gitignored, your local config
│
├── frontend/                         # React SPA
│   ├── vite.config.js                # Vite dev proxy → localhost:8000
│   ├── .env.example                  # ← copy to .env
│   └── src/
│       ├── api/                      # axiosInstance, auth.js, dashboard.js
│       ├── components/               # Header, Footer
│       ├── context/                  # AuthContext (JWT localStorage)
│       └── pages/                    # IndexPage, LoginPage, RegisterPage, DashboardPage, …
│
├── .gitignore
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

# Create the database
createdb sustainability_db
```

On Linux:
```bash
sudo apt install postgresql
sudo systemctl start postgresql
sudo -u postgres createdb sustainability_db
```

---

### 3. Configure the backend

```bash
cp backend/src/main/resources/application.properties.example \
   backend/src/main/resources/application.properties
```

Edit `application.properties` and set:

```properties
spring.datasource.username=YOUR_POSTGRES_USER
spring.datasource.password=YOUR_POSTGRES_PASSWORD
jwt.secret=REPLACE_WITH_A_64_CHAR_HEX_STRING
```

> **Tip:** Generate a JWT secret with `openssl rand -hex 32`

---

### 4. Start the backend

```bash
cd backend
mvn spring-boot:run
```

The API will be available at `http://localhost:8000/api/`.  
Hibernate will auto-create all tables on first run (`ddl-auto=update`).

---

### 5. Configure the frontend

```bash
cd frontend
cp .env.example .env
npm install
```

---

### 6. Start the frontend

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

### 7. Load demo data (optional)

Seed the database with 11 demo companies and two history entries each:

```bash
psql -U <your_user> -d sustainability_db -f seed.sql
```

Demo accounts after seeding:

| Username | Password | Company |
|----------|----------|---------|
| `testuser` | `test123` | Shubham Industries |


### 8. Register your own account

Go to `http://localhost:5173/register` and create your organisation account, then explore all calculators.

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/register/` | Public | Register new organisation |
| POST | `/api/login/` | Public | Login, returns JWT token |
| POST | `/api/logout/` | Public | Logout (client removes token) |
| GET | `/api/me/` | JWT | Current user info |
| GET | `/api/index/` | JWT | SDG data for home page |
| POST | `/api/carbon/` | JWT | Carbon emission calculation |
| POST | `/api/energy/` | JWT | Energy consumption calculation |
| POST | `/api/waste/` | JWT | Waste management calculation |
| POST | `/api/eevta/` | JWT | Workforce development scoring |
| POST | `/api/sustainability/` | JWT | Full ESG composite score |
| GET | `/api/dashboard/` | JWT | Rankings, radar data, change metrics |
| GET | `/api/history/` | JWT | Last 20 calculation history entries |

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

### Backend (`application.properties`)

| Key | Description |
|-----|-------------|
| `spring.datasource.url` | JDBC URL for PostgreSQL |
| `spring.datasource.username` | Database user |
| `spring.datasource.password` | Database password |
| `jwt.secret` | HS256 signing key (min 64 hex chars) |
| `jwt.expiration-ms` | Token TTL in ms (default: 86400000 = 24h) |
| `cors.allowed-origins` | Comma-separated allowed origins |

### Frontend (`.env`)

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

# 2. (Optional) Set a strong JWT secret
export JWT_SECRET=$(openssl rand -hex 32)

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

## Author

**Shubham Sain**  
[![GitHub](https://img.shields.io/badge/GitHub-2025sl93031--ShubhamSain-black?logo=github)](https://github.com/2025sl93031-ShubhamSain)  
