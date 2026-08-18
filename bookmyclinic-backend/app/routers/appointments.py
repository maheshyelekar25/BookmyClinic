from datetime import date

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.dependencies import get_current_user
from app.database import get_db
from app.models.appointment import Appointment
from app.models.appointment_slot import AppointmentSlot
from app.models.user import User
from app.schemas.appointment import AppointmentCreate, AppointmentOut, SlotOut
from app.services.booking import BookingError, book_slot, cancel_appointment, reschedule_appointment

router = APIRouter()


async def get_appointment_or_404(db: AsyncSession, appointment_id: int) -> Appointment:
    appointment = await db.scalar(
        select(Appointment)
        .options(selectinload(Appointment.slot))
        .where(Appointment.id == appointment_id)
    )
    if appointment is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found")
    return appointment


@router.get("/doctors/{doctor_id}/slots", response_model=list[SlotOut])
async def list_available_slots(
    doctor_id: int,
    date: date,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> list[AppointmentSlot]:
    result = await db.scalars(
        select(AppointmentSlot)
        .where(
            AppointmentSlot.doctor_id == doctor_id,
            AppointmentSlot.date == date,
            AppointmentSlot.is_booked.is_(False),
        )
        .order_by(AppointmentSlot.start_time)
    )
    return list(result)


@router.post("/appointments", response_model=AppointmentOut, status_code=status.HTTP_201_CREATED)
async def create_appointment(
    appointment_in: AppointmentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Appointment:
    try:
        appointment_id = await book_slot(db, current_user.id, appointment_in.slot_id)
    except BookingError as error:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(error)) from error
    return await get_appointment_or_404(db, appointment_id)


@router.get("/appointments/user/{user_id}", response_model=list[AppointmentOut])
async def appointment_history(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[Appointment]:
    if user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    result = await db.scalars(
        select(Appointment)
        .options(selectinload(Appointment.slot))
        .where(Appointment.user_id == user_id)
        .order_by(Appointment.created_at.desc())
    )
    return list(result)


@router.patch("/appointments/{appointment_id}/cancel", response_model=AppointmentOut)
async def cancel(
    appointment_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Appointment:
    try:
        await cancel_appointment(db, appointment_id, current_user.id)
    except BookingError as error:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(error)) from error
    return await get_appointment_or_404(db, appointment_id)


@router.patch("/appointments/{appointment_id}/reschedule", response_model=AppointmentOut)
async def reschedule(
    appointment_id: int,
    appointment_in: AppointmentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Appointment:
    try:
        await reschedule_appointment(db, appointment_id, current_user.id, appointment_in.slot_id)
    except BookingError as error:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(error)) from error
    return await get_appointment_or_404(db, appointment_id)
