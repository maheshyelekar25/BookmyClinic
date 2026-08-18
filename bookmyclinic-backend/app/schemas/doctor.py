from pydantic import BaseModel, ConfigDict


class DoctorOut(BaseModel):
    id: int
    clinic_id: int
    name: str
    specialization: str
    experience_years: int

    model_config = ConfigDict(from_attributes=True)
