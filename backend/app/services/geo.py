from sqlalchemy import Float, func
from sqlalchemy.sql.elements import ColumnElement

from app.models.clinic import Clinic

EARTH_RADIUS_KM = 6371.0


def haversine_distance_km(lat: float, lng: float) -> ColumnElement[float]:
    """Return a PostgreSQL Haversine distance expression in kilometers."""
    cosine_angle = (
        func.sin(func.radians(lat)) * func.sin(func.radians(Clinic.lat))
        + func.cos(func.radians(lat))
        * func.cos(func.radians(Clinic.lat))
        * func.cos(func.radians(Clinic.lng) - func.radians(lng))
    )
    return (
        EARTH_RADIUS_KM
        * func.acos(func.least(1.0, func.greatest(-1.0, cosine_angle)))
    ).cast(Float)
