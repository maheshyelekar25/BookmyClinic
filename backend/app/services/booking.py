from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.appointment import Appointment
from app.models.appointment_slot import AppointmentSlot


class BookingError(Exception):
    pass


async def book_slot(db: AsyncSession, user_id: int, slot_id: int) -> int:
    """Book one slot while holding its database row lock."""
    async with db.begin():
        slot = await db.scalar(
            select(AppointmentSlot)
            .where(AppointmentSlot.id == slot_id)
            .with_for_update()
        )
        if slot is None:
            raise BookingError("Slot not found")
        if slot.is_booked:
            raise BookingError("Slot already booked")

        slot.is_booked = True
        appointment = Appointment(user_id=user_id, slot_id=slot.id, status="booked")
        db.add(appointment)
        await db.flush()
        return appointment.id


async def cancel_appointment(db: AsyncSession, appointment_id: int, user_id: int) -> None:
    async with db.begin():
        appointment = await db.scalar(
            select(Appointment)
            .where(Appointment.id == appointment_id, Appointment.user_id == user_id)
            .with_for_update()
        )
        if appointment is None:
            raise BookingError("Appointment not found")
        if appointment.status == "cancelled":
            raise BookingError("Appointment is already cancelled")

        slot = await db.scalar(
            select(AppointmentSlot)
            .where(AppointmentSlot.id == appointment.slot_id)
            .with_for_update()
        )
        if slot is None:
            raise BookingError("Appointment slot not found")
        appointment.status = "cancelled"
        slot.is_booked = False


async def reschedule_appointment(
    db: AsyncSession, appointment_id: int, user_id: int, new_slot_id: int
) -> None:
    async with db.begin():
        appointment = await db.scalar(
            select(Appointment)
            .where(Appointment.id == appointment_id, Appointment.user_id == user_id)
            .with_for_update()
        )
        if appointment is None:
            raise BookingError("Appointment not found")
        if appointment.status == "cancelled":
            raise BookingError("Cancelled appointments cannot be rescheduled")
        if appointment.slot_id == new_slot_id:
            return

        slots = (
            await db.scalars(
                select(AppointmentSlot)
                .where(AppointmentSlot.id.in_([appointment.slot_id, new_slot_id]))
                .order_by(AppointmentSlot.id)
                .with_for_update()
            )
        ).all()
        slots_by_id = {slot.id: slot for slot in slots}
        old_slot = slots_by_id.get(appointment.slot_id)
        new_slot = slots_by_id.get(new_slot_id)
        if old_slot is None or new_slot is None:
            raise BookingError("Slot not found")
        if new_slot.is_booked:
            raise BookingError("Slot already booked")

        old_slot.is_booked = False
        new_slot.is_booked = True
        appointment.slot_id = new_slot.id
