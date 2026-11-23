# Setup Guide

Full instructions for running SustainRank locally, with Docker, and in production.

---

## Prerequisites

| Tool | Version |
|------|---------|
| Java (JDK) | 21+ |
| Maven | 3.9+ |
| Node.js | 20+ |
| PostgreSQL | 14+ |

---

## 1. Clone the repository

```bash
git clone https://github.com/2025sl93031-ShubhamSain/SustainRank-ESG-Intelligence-Platform.git
cd SustainRank-ESG-Intelligence-Platform
```

---

## 2. Set up PostgreSQL

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

## 3. Configure environment variables

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

## 4. Configure the backend

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

## 5. Start the backend

```bash
cd backend
mvn spring-boot:run
```

The API will be available at `http://localhost:8000/api/`.  
Hibernate will auto-create all tables on first run (`ddl-auto=update`).

---

## 6. Configure the frontend

```bash
cd frontend
cp .env.example .env
npm install
```

---

## 7. Start the frontend

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 8. Load demo data (optional)

Seed the database with 11 demo companies and two history entries each:

```bash
psql -U <your_user> -d sustainability_db -f seed.sql
```

Demo accounts after seeding:

| Username | Password | Company |
|----------|----------|---------|
| `testuser` | `test123` | A-Company |

---

## 9. Register your own account

Go to `http://localhost:5173/register` and create your organisation account, then run the Full ESG Assessment at `/assessment`.

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
