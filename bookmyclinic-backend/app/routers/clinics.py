from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.clinic import Clinic
from app.schemas.clinic import ClinicDetailOut, ClinicOut
from app.services.geo import haversine_distance_km

router = APIRouter()


@router.get("/nearby", response_model=list[ClinicOut])
async def nearby_clinics(
    lat: float = Query(ge=-90, le=90),
    lng: float = Query(ge=-180, le=180),
    radius_km: float = Query(default=5, gt=0, le=500),
    db: AsyncSession = Depends(get_db),
) -> list[ClinicOut]:
    distance = haversine_distance_km(lat, lng).label("distance_km")
    result = await db.execute(
        select(Clinic, distance).where(distance <= radius_km).order_by(distance)
    )
    return [
        ClinicOut.model_validate(clinic, update={"distance_km": round(distance_km, 2)})
        for clinic, distance_km in result.all()
    ]


@router.get("/search", response_model=list[ClinicOut])
async def search_clinics(
    city: str | None = None,
    state: str | None = None,
    pincode: str | None = None,
    specialty: str | None = None,
    sort: Literal["distance", "rating"] = "rating",
    lat: float | None = Query(default=None, ge=-90, le=90),
    lng: float | None = Query(default=None, ge=-180, le=180),
    db: AsyncSession = Depends(get_db),
) -> list[ClinicOut]:
    statement = select(Clinic)
    if city:
        statement = statement.where(Clinic.city.ilike(f"%{city.strip()}%"))
    if state:
        statement = statement.where(Clinic.state.ilike(f"%{state.strip()}%"))
    if pincode:
        statement = statement.where(Clinic.pincode == pincode.strip())
    if specialty:
        statement = statement.where(Clinic.specialties.any(specialty.strip()))

    if sort == "distance" and lat is not None and lng is not None:
        distance = haversine_distance_km(lat, lng).label("distance_km")
        result = await db.execute(statement.add_columns(distance).order_by(distance))
        return [
            ClinicOut.model_validate(clinic, update={"distance_km": round(distance_km, 2)})
            for clinic, distance_km in result.all()
        ]

    result = await db.execute(statement.order_by(Clinic.rating.desc(), Clinic.name))
    return [ClinicOut.model_validate(clinic) for clinic in result.scalars()]


@router.get("/{clinic_id}", response_model=ClinicDetailOut)
async def get_clinic(clinic_id: int, db: AsyncSession = Depends(get_db)) -> Clinic:
    result = await db.execute(
        select(Clinic).options(selectinload(Clinic.doctors)).where(Clinic.id == clinic_id)
    )
    clinic = result.scalar_one_or_none()
    if clinic is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Clinic not found")
    return clinic
