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
<img src="./App images/Screenshot 2026-11-22 at 8.45.00 PM.png" alt="SustainRank Home" width="800" />

**Home — Platform Overview**
<img src="./App images/Screenshot 2026-11-22 at 8.45.09 PM.png" alt="Platform Overview" width="800" />

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
├── SETUP.md
└── README.md
```

---

## Quick Start

**Fastest way — Docker:**

```bash
cp .env.example .env
# Edit .env with your DB password and JWT secret
docker compose up --build
```

Open `http://localhost:80` in your browser.

**Manual setup:** See [SETUP.md](./SETUP.md) for full step-by-step instructions covering PostgreSQL, backend, frontend, demo data, and production deployment.

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

---

## Contributors

[![Contributors]("https://contrib.rocks/image?repo=2025sl93031-ShubhamSain/SustainRank-ESG-Intelligence-Platform")](https://github.com/2025sl93031-ShubhamSain/SustainRank-ESG-Intelligence-Platform/graphs/contributors)