from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.auth import router as auth_router
from app.routers.appointments import router as appointments_router
from app.routers.clinics import router as clinics_router
from app.routers.doctors import router as doctors_router

app = FastAPI(title="BookMyClinic API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(appointments_router, prefix="/api", tags=["appointments"])
app.include_router(clinics_router, prefix="/api/clinics", tags=["clinics"])
app.include_router(doctors_router, prefix="/api/doctors", tags=["doctors"])


@app.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "ok"}
