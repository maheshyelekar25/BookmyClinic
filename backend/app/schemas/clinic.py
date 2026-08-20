from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.schemas.doctor import DoctorOut


class ClinicCreate(BaseModel):
    name: str
    address: str
    city: str
    state: str
    pincode: str
    lat: float
    lng: float
    phone: str
    specialties: list[str]
    rating: float = 0.0

class ClinicOut(BaseModel):
    id: int
    name: str
    address: str
    city: str
    state: str
    pincode: str
    lat: float
    lng: float
    phone: str
    specialties: list[str]
    rating: float
    created_at: datetime
    distance_km: float | None = None

    model_config = ConfigDict(from_attributes=True)


class ClinicDetailOut(ClinicOut):
    doctors: list[DoctorOut]
