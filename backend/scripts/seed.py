import asyncio
from datetime import date, time, timedelta

from sqlalchemy import select

from app.database import AsyncSessionLocal
from app.core.security import hash_password
from app.models.clinic import Clinic
from app.models.doctor import Doctor
from app.models.appointment_slot import AppointmentSlot
from app.models.user import User

DEMO_USER_EMAIL = "demo@bookmyclinic.com"
DEMO_USER_PASSWORD = "Demo@12345"

CLINICS = [
    ("CareFirst Clinic Bandra", "Hill Road, Bandra West", "Mumbai", "Maharashtra", "400050", 19.0596, 72.8295, "022-41010001", ["General Medicine", "Dermatology"], 4.7, [("Dr. Ananya Mehta", "General Medicine", 12), ("Dr. Rohan Shah", "Dermatology", 9)]),
    ("Harbour Health Andheri", "Link Road, Andheri West", "Mumbai", "Maharashtra", "400053", 19.1364, 72.8296, "022-41010002", ["Orthopedics", "Physiotherapy"], 4.4, [("Dr. Vikram Nair", "Orthopedics", 15)]),
    ("Swasthya Clinic Powai", "Hiranandani Gardens, Powai", "Mumbai", "Maharashtra", "400076", 19.1176, 72.9060, "022-41010003", ["Pediatrics", "General Medicine"], 4.6, [("Dr. Priya Iyer", "Pediatrics", 11), ("Dr. Kunal Deshmukh", "General Medicine", 8)]),
    ("Bengaluru Family Care", "100 Feet Road, Indiranagar", "Bengaluru", "Karnataka", "560038", 12.9784, 77.6408, "080-41010001", ["General Medicine", "Gynecology"], 4.8, [("Dr. Kavya Rao", "Gynecology", 14), ("Dr. Arjun Menon", "General Medicine", 10)]),
    ("Whitefield Specialty Centre", "ITPL Main Road, Whitefield", "Bengaluru", "Karnataka", "560066", 12.9698, 77.7500, "080-41010002", ["Cardiology", "Diabetology"], 4.5, [("Dr. Suresh Bhat", "Cardiology", 17)]),
    ("Koramangala Wellness Clinic", "80 Feet Road, Koramangala", "Bengaluru", "Karnataka", "560034", 12.9352, 77.6245, "080-41010003", ["Mental Health", "Nutrition"], 4.3, [("Dr. Neha Kapoor", "Mental Health", 9), ("Dr. Amit Jain", "Nutrition", 7)]),
    ("Delhi Central Medical", "Rajiv Chowk, Connaught Place", "New Delhi", "Delhi", "110001", 28.6315, 77.2167, "011-41010001", ["ENT", "Ophthalmology"], 4.6, [("Dr. Nikhil Verma", "ENT", 13), ("Dr. Meera Sethi", "Ophthalmology", 12)]),
    ("Saket Health Point", "Select Citywalk Road, Saket", "New Delhi", "Delhi", "110017", 28.5245, 77.2066, "011-41010002", ["Dermatology", "Pediatrics"], 4.4, [("Dr. Sonia Gupta", "Dermatology", 10)]),
]


async def seed() -> None:
    async with AsyncSessionLocal() as session:
        demo_user = await session.scalar(select(User).where(User.email == DEMO_USER_EMAIL))
        if not demo_user:
            session.add(
                User(
                    name="Demo Patient",
                    email=DEMO_USER_EMAIL,
                    phone="9999999999",
                    password_hash=hash_password(DEMO_USER_PASSWORD),
                )
            )

        if not await session.scalar(select(Clinic.id).limit(1)):
            for data in CLINICS:
                *clinic_fields, doctors = data
                clinic = Clinic(
                    name=clinic_fields[0], address=clinic_fields[1], city=clinic_fields[2],
                    state=clinic_fields[3], pincode=clinic_fields[4], lat=clinic_fields[5],
                    lng=clinic_fields[6], phone=clinic_fields[7], specialties=clinic_fields[8],
                    rating=clinic_fields[9],
                )
                clinic.doctors = [
                    Doctor(name=name, specialization=specialization, experience_years=experience)
                    for name, specialization, experience in doctors
                ]
                session.add(clinic)
            await session.flush()

        doctors = list(await session.scalars(select(Doctor)))
        existing_slot = await session.scalar(select(AppointmentSlot.id).limit(1))
        if not existing_slot:
            for doctor in doctors:
                for offset in range(1, 8):
                    slot_date = date.today() + timedelta(days=offset)
                    for start_time, end_time in (
                        (time(9, 0), time(9, 30)),
                        (time(10, 0), time(10, 30)),
                        (time(11, 0), time(11, 30)),
                    ):
                        session.add(
                            AppointmentSlot(
                                doctor_id=doctor.id,
                                date=slot_date,
                                start_time=start_time,
                                end_time=end_time,
                            )
                        )
        await session.commit()
    print("Seeded demo user, clinics, doctors, and the next 7 days of appointment slots.")


if __name__ == "__main__":
    asyncio.run(seed())
