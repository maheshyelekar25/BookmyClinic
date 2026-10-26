# BookMyClinic

BookMyClinic is a full-stack clinic discovery and appointment booking application built for local development. Patients can search clinics, view doctors, check available appointment slots, and book or manage appointments. Administrators can create clinics, add doctors, generate schedules, and review appointments.

## Tech Stack

| Area | Stack |
|---|---|
| Frontend | React 18, Vite, React Router, Axios, Tailwind CSS, Leaflet |
| Backend | Python, FastAPI, Pydantic, Beanie, Motor |
| Database | MongoDB |
| Authentication | JWT access/refresh tokens, bcrypt |
| Testing | pytest, pytest-asyncio |
| CI | GitHub Actions |

## Project Overview

This repository contains both application layers:
- `backend/` hosts the FastAPI server, MongoDB models, routes, and scripts
- `frontend/` hosts the React + Vite client app

The app is designed to run locally with a MongoDB instance and environment variables defined in each app's `.env` file.

## Project Structure

```text
BookMyClinic/
├── .github/
│   └── workflows/
│       └── ci.yml
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── dependencies.py
│   │   │   ├── rate_limit.py
│   │   │   └── security.py
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── database.py
│   │   └── main.py
│   ├── data/
│   ├── scripts/
│   ├── tests/
│   ├── .env.example
│   ├── requirements.txt
│   ├── requirements-dev.txt
│   ├── pytest.ini
│   └── start.py
├── frontend/
│   ├── public/
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── .gitignore
├── README.md
├── PROJECT_REPORT.md
└── .vscode/
```

## Features

### Patient Features
- Register and log in
- Refresh tokens securely
- Search clinics by city, specialty, and nearby location
- Browse doctor profiles and availability
- Book appointments from available slots
- View, cancel, and reschedule own appointments

### Admin Features
- Add clinics
- Add doctors to clinics
- Generate appointment slots for a doctor
- Review all appointments

## Prerequisites

Before running the project locally, install:
- Python 3.11 or newer
- Node.js 20 or newer
- npm
- MongoDB running locally on `mongodb://localhost:27017`

> The project is designed for local development and does not require Vercel, Railway, or other cloud deployment configuration to run.

## Backend Setup

Open a terminal and run:

```powershell
cd D:\BookmyClinic\backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements-dev.txt
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
```

Edit `backend/.env` and set your local configuration:

```env
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=bookmyclinic
SECRET_KEY=replace-with-a-long-random-secret
ALGORITHM=HS256
ENV=development
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=7
CORS_ORIGINS=["http://localhost:5173","http://127.0.0.1:5173"]
```

Important notes:
- `SECRET_KEY` must be a long random value.
- `CORS_ORIGINS` should contain your exact local frontend origin(s).
- Keep the file local and do not commit it to source control.

Initialize sample data and create an admin user:

```powershell
python -m scripts.seed
$env:ADMIN_EMAIL = "admin@example.com"
$env:ADMIN_PASSWORD = "use-a-strong-password"
python -m scripts.create_admin
```

Import the bundled Nagpur clinic dataset (safe to rerun):

```powershell
python -m scripts.import_nagpur_clinics --dry-run
python -m scripts.import_nagpur_clinics
```

Start the backend API:

```powershell
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Useful URLs:
- Health check: `http://localhost:8000/health`
- Swagger docs: `http://localhost:8000/docs`
- OpenAPI schema: `http://localhost:8000/openapi.json`

## Frontend Setup

Open a second terminal and run:

```powershell
cd D:\BookmyClinic\frontend
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
npm ci
npm run dev
```

Set the API URL in `frontend/.env` if needed:

```env
VITE_API_URL=http://localhost:8000
```

Then open:
- Frontend UI: `http://localhost:5173`

## API Overview

All API routes use the `/api` prefix. Authenticated routes require a valid JWT token in the `Authorization` header.

| Method | Path | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a patient |
| POST | `/api/auth/login` | Public | Authenticate and receive tokens |
| POST | `/api/auth/refresh` | Public | Refresh using a JSON `refresh_token` |
| GET | `/api/auth/me` | Authenticated | Return the current user |
| POST | `/api/clinics/` | Admin | Create a clinic |
| GET | `/api/clinics/nearby` | Public | Search nearby clinics |
| GET | `/api/clinics/search` | Public | Search and paginate clinics |
| GET | `/api/clinics/specialties` | Public | List available specialties |
| GET | `/api/clinics/{clinic_id}` | Public | Return clinic details and doctors |
| POST | `/api/doctors/` | Admin | Add a doctor |
| POST | `/api/doctors/{doctor_id}/slots/generate` | Admin | Generate appointment slots |
| GET | `/api/doctors/{doctor_id}/slots` | Public | List available slots |
| POST | `/api/appointments` | Authenticated | Book a slot |
| GET | `/api/appointments/me` | Authenticated | List current user's appointments |
| GET | `/api/appointments` | Admin | List all appointments |
| PATCH | `/api/appointments/{appointment_id}/cancel` | Owner or admin | Cancel an appointment |
| PATCH | `/api/appointments/{appointment_id}/reschedule` | Owner or admin | Reschedule an appointment |

## Testing

The backend tests use a dedicated MongoDB database named `bookmyclinic_test` and do not use the default development database.

```powershell
cd D:\BookmyClinic\backend
.\.venv\Scripts\Activate.ps1
python -m pytest
```

Frontend production build verification:

```powershell
cd D:\BookmyClinic\frontend
npm ci
npm run build
```

## Data and Seed Files

The repo includes data files in `backend/data/` for imports and validation:
- `nagpur_clinics.csv`
- `nagpur_clinics.json`
- `pincode_coverage_report.json`
- `research_summary.md`

These are used to validate and import the clinic dataset into MongoDB.

## Local Development Notes

- The project is intended for local development.
- Cloud deployment files are not needed to run the app locally.
- Keep `.env` files local and never commit real credentials.
- MongoDB must be running before starting the API.

## Quick Start

```powershell
# Terminal 1 - backend
cd D:\BookmyClinic\backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements-dev.txt
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
python -m scripts.seed
$env:ADMIN_EMAIL = "admin@example.com"
$env:ADMIN_PASSWORD = "use-a-strong-password"
python -m scripts.create_admin
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

# Terminal 2 - frontend
cd D:\BookmyClinic\frontend
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
npm ci
npm run dev
```

After both services start, open `http://localhost:5173` in your browser.
