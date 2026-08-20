import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import AsyncSessionLocal
from app.models.user import User
from app.core.security import hash_password

async def create_admin():
    async with AsyncSessionLocal() as db:
        admin_email = "admin@bookmyclinic.com"
        from sqlalchemy import select
        existing = await db.scalar(select(User).where(User.email == admin_email))
        if existing:
            existing.role = "admin"
            await db.commit()
            print("Admin user already existed, updated role to admin.")
            return

        user = User(
            name="System Admin",
            email=admin_email,
            phone="0000000000",
            password_hash=hash_password("Admin@12345"),
            role="admin"
        )
        db.add(user)
        await db.commit()
        print(f"Created admin user: {admin_email} / Admin@12345")
        
if __name__ == "__main__":
    asyncio.run(create_admin())
