from datetime import date, datetime, time

from pydantic import BaseModel, ConfigDict, Field


class SlotOut(BaseModel):
    id: int
    doctor_id: int
    date: date
    start_time: time
    end_time: time
    is_booked: bool

    model_config = ConfigDict(from_attributes=True)


class AppointmentClinicOut(BaseModel):
    id: int
    name: str
    address: str
    city: str
    state: str
    pincode: str

    model_config = ConfigDict(from_attributes=True)


class AppointmentDoctorOut(BaseModel):
    id: int
    name: str
    specialization: str
    clinic: AppointmentClinicOut

    model_config = ConfigDict(from_attributes=True)


class AppointmentSlotOut(SlotOut):
    doctor: AppointmentDoctorOut


class AppointmentCreate(BaseModel):
    slot_id: int = Field(gt=0)


class AppointmentOut(BaseModel):
    id: int
    user_id: int
    slot_id: int
    status: str
    created_at: datetime
    slot: AppointmentSlotOut

    model_config = ConfigDict(from_attributes=True)
