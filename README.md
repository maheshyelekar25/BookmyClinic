# BookMyClinic

Find a clinic, compare doctors, and request or book an appointment. BookMyClinic is a full-stack clinic discovery and appointment management app built with React, FastAPI, and MongoDB.

<p align="center">
  <a href="#-get-started">Get started</a> ·
  <a href="#-what-you-can-do">Explore features</a> ·
  <a href="#-api-at-a-glance">Explore the API</a> ·
  <a href="#-project-layout">Project layout</a>
</p>

<p align="center">
  <strong>React + Vite</strong> · <strong>FastAPI</strong> · <strong>MongoDB</strong> · <strong>Beanie</strong>
</p>

> [!NOTE]
> This guide is focused on running and developing BookMyClinic locally. It does not require a hosting provider.

<details>
<summary><strong>Contents</strong></summary>

- [What you can do](#-what-you-can-do)
- [Get started](#-get-started)
  - [Prerequisites](#prerequisites)
  - [1. Start MongoDB](#1-start-mongodb)
  - [2. Configure and run the backend](#2-configure-and-run-the-backend)
  - [3. Configure and run the frontend](#3-configure-and-run-the-frontend)
  - [4. Add local sample data](#4-add-local-sample-data-optional)
- [Useful local commands](#-useful-local-commands)
- [API at a glance](#-api-at-a-glance)
- [Project layout](#-project-layout)
- [Configuration reference](#-configuration-reference)
- [Troubleshooting](#-troubleshooting)

</details>

## ✨ What you can do

<details open>
<summary><strong>For patients</strong></summary>

- Create an account, sign in, and securely refresh an expired session.
- Discover clinics by city, locality, PIN code, name, or specialty.
- Find nearby clinics and browse clinic details, doctors, and available slots.
- Request or book appointments, then review, cancel, or reschedule them.
- View updates when an administrator confirms or rejects an appointment request.

</details>

<details>
<summary><strong>For administrators</strong></summary>

- Add clinics and doctors.
- Generate doctor appointment slots over a date range.
- Review pending appointment requests and confirm or reject them.
- View the appointment list.

</details>

## 🚀 Get started

Use two PowerShell terminals: one for the API and one for the web app. Run backend commands from `backend\` and frontend commands from `frontend\`; each application loads its `.env` file from its current working directory.

### Prerequisites

- Python 3.11 or newer
- Node.js 20 or newer, with npm
- MongoDB running locally, or access to a MongoDB connection string

### 1. Start MongoDB

Make sure your local MongoDB server is running and reachable at `mongodb://localhost:27017`, or note the connection string for your MongoDB instance.

On Windows, if MongoDB is installed as a service, you can check/start it from an elevated PowerShell window:

```powershell
Get-Service MongoDB
Start-Service MongoDB
```

### 2. Configure and run the backend

In the first PowerShell terminal:

```powershell
cd D:\BookmyClinic\backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements-dev.txt

if (-not (Test-Path .env)) { Copy-Item .env.example .env }
```

Open `backend\.env` and set `SECRET_KEY` to a long, random value. For example, generate one with:

```powershell
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

Copy the generated value into `.env`. Check that `MONGODB_URL` points to your MongoDB server and `MONGODB_DB_NAME` is the local database you intend to use. The supplied example defaults to `bookmyclinic` and allows the local Vite origins in `CORS_ORIGINS`.

Start the API:

```powershell
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

<p>
  <a href="http://localhost:8000/docs">Open interactive API docs</a> ·
  <a href="http://localhost:8000/health">Check API health</a>
</p>

### 3. Configure and run the frontend

In the second PowerShell terminal:

```powershell
cd D:\BookmyClinic\frontend
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
npm ci
npm run dev
```

The frontend uses `VITE_API_URL` from `frontend\.env`; the example points to `http://localhost:8000`. Open **http://localhost:5173**.

### 4. Add local sample data (optional)

To populate sample clinics, doctors, a demo patient, and upcoming appointment slots:

```powershell
cd D:\BookmyClinic\backend
.\.venv\Scripts\Activate.ps1
python -m scripts.seed
```

> [!WARNING]
> The seed script creates a demo patient using credentials defined in the source code. Use seeded data only in a local development database; never expose a database initialized with demo credentials.

To create or promote a local administrator, set credentials in the current PowerShell session and run the script:

```powershell
$env:ADMIN_EMAIL = "admin@example.com"
$env:ADMIN_PASSWORD = Read-Host "Enter a strong local admin password"
python -m scripts.create_admin
Remove-Item Env:ADMIN_EMAIL
Remove-Item Env:ADMIN_PASSWORD
```

To validate and optionally import the supplied Nagpur clinic dataset:

```powershell
python -m scripts.import_nagpur_clinics --dry-run
python -m scripts.import_nagpur_clinics
```

The import is keyed by the dataset's `clinic_id` and is designed to be rerun safely. The records, CSV cross-check, PIN-code coverage report, and research notes are in `backend\data\`.

## 🧰 Useful local commands

<details>
<summary><strong>Run the backend tests</strong></summary>

The backend tests use a dedicated database named `bookmyclinic_test`. The fixtures clear collections in that database. Ensure it is disposable and does not contain data you need before running the suite.

```powershell
cd D:\BookmyClinic\backend
.\.venv\Scripts\Activate.ps1
python -m pytest
```

</details>

<details>
<summary><strong>Build the frontend</strong></summary>

```powershell
cd D:\BookmyClinic\frontend
npm ci
npm run build
```

Vite writes the generated site to `frontend\dist\`.

</details>

<details>
<summary><strong>Preview the production build locally</strong></summary>

Build first, then run:

```powershell
cd D:\BookmyClinic\frontend
npm run preview
```

</details>

## 🔌 API at a glance

All API routes are under `/api`. Authenticated endpoints use a bearer access token; administrative endpoints also require an admin account. See the interactive [Swagger UI](http://localhost:8000/docs) or [ReDoc](http://localhost:8000/redoc) while the backend is running for request schemas and response details.

<details open>
<summary><strong>Authentication and profiles</strong></summary>

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Register a patient |
| `POST` | `/api/auth/login` | Public | Sign in and receive tokens |
| `POST` | `/api/auth/refresh` | Public | Refresh an access token |
| `GET` | `/api/auth/me` | Signed in | Get the current profile |

</details>

<details>
<summary><strong>Clinics and doctors</strong></summary>

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/clinics/search` | Public | Search, filter, sort, and paginate clinics |
| `GET` | `/api/clinics/nearby` | Public | Find clinics near coordinates |
| `GET` | `/api/clinics/specialties` | Public | List available specialties |
| `GET` | `/api/clinics/{clinic_id}` | Public | Get clinic details and doctors |
| `POST` | `/api/clinics/` | Admin | Create a clinic |
| `GET` | `/api/doctors/{doctor_id}` | Public | Get doctor details |
| `POST` | `/api/doctors/` | Admin | Add a doctor |
| `GET` | `/api/doctors/{doctor_id}/slots?date=YYYY-MM-DD` | Public | List available slots for a date |
| `POST` | `/api/doctors/{doctor_id}/slots/generate` | Admin | Generate appointment slots |

</details>

<details>
<summary><strong>Appointments</strong></summary>

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/appointments` | Signed in | Request an appointment in an available slot |
| `POST` | `/api/clinics/{clinic_id}/appointments` | Signed in | Request a clinic appointment by preferred date and time |
| `GET` | `/api/appointments/me` | Signed in | List your appointments |
| `GET` | `/api/appointments` | Admin | List all appointments |
| `GET` | `/api/appointments/pending` | Admin | List pending requests |
| `PATCH` | `/api/appointments/{appointment_id}/confirm` | Admin | Confirm a pending request |
| `PATCH` | `/api/appointments/{appointment_id}/reject` | Admin | Reject a pending request |
| `PATCH` | `/api/appointments/{appointment_id}/cancel` | Owner or admin | Cancel an appointment |
| `PATCH` | `/api/appointments/{appointment_id}/reschedule` | Owner or admin | Reschedule to another slot |

</details>

## 🗂️ Project layout

```text
BookmyClinic/
├── backend/
│   ├── app/
│   │   ├── core/          # Settings, authentication, dependencies, rate limiting
│   │   ├── models/        # MongoDB/Beanie documents
│   │   ├── routers/       # FastAPI route handlers
│   │   ├── schemas/       # Request and response validation
│   │   └── services/      # Booking and clinic search logic
│   ├── data/              # Clinic dataset and supporting reports
│   ├── scripts/           # Seed, admin, and data-import commands
│   ├── tests/             # Backend test suite
│   ├── .env.example       # Safe local configuration template
│   └── requirements.txt
├── frontend/
│   ├── public/            # Static assets and location data
│   ├── src/
│   │   ├── api/           # API client and endpoint wrappers
│   │   ├── components/    # Shared UI components
│   │   ├── context/       # Authentication state
│   │   ├── pages/         # Application screens
│   │   └── routes/        # Route guards
│   ├── .env.example
│   └── package.json
└── .github/workflows/     # Continuous integration checks
```

## ⚙️ Configuration reference

| Variable | Used by | Purpose | Example/default |
| --- | --- | --- | --- |
| `MONGODB_URL` | Backend | MongoDB connection string | `mongodb://localhost:27017` |
| `MONGODB_DB_NAME` | Backend | Application database name | `bookmyclinic` |
| `SECRET_KEY` | Backend | Signs access and refresh tokens | Set a unique random value |
| `ALGORITHM` | Backend | JWT signing algorithm | `HS256` |
| `ENV` | Backend | Runtime environment | `development` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Backend | Access-token lifetime | `60` |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Backend | Refresh-token lifetime | `7` |
| `CORS_ORIGINS` | Backend | Allowed browser origins (JSON array) | Local Vite origins |
| `VITE_API_URL` | Frontend | Backend origin used by the browser | `http://localhost:8000` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Admin script | Credentials for creating/promoting a local admin | Set only for the script |

The backend reads `.env` from its working directory (`backend\`); Vite reads `frontend\.env`. The checked-in `.env.example` files contain templates, not production credentials. Keep `.env` files and real secrets out of commits.

## 🛠️ Troubleshooting

<details>
<summary><strong>Backend says MongoDB is unavailable</strong></summary>

Confirm the MongoDB service is running, check `MONGODB_URL` in `backend\.env`, and verify that the host and port are reachable.

</details>

<details>
<summary><strong>Frontend requests fail or show a CORS error</strong></summary>

Confirm the backend is running at the `VITE_API_URL` origin. Check that `CORS_ORIGINS` in `backend\.env` includes the exact frontend origin, typically `http://localhost:5173`. Restart the backend after changing its environment.

</details>

<details>
<summary><strong>Python environment activation is blocked</strong></summary>

In PowerShell, you may need to allow locally created scripts for the current user:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

Alternatively, call the environment's Python directly, for example `.\.venv\Scripts\python.exe -m pip install -r requirements-dev.txt`.

</details>

---

<p align="center">
  Built for local development · API powered by FastAPI · UI powered by React and Vite
</p>
#   B o o k m y C l i n i c  
 