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


class AppointmentCreate(BaseModel):
    slot_id: int = Field(gt=0)


class AppointmentOut(BaseModel):
    id: int
    user_id: int
    slot_id: int
    status: str
    created_at: datetime
    slot: SlotOut

    model_config = ConfigDict(from_attributes=True)
