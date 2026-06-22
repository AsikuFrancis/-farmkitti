from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.user import User
from app.schemas.auth import UserCreate
from app.utils.security import get_password_hash

async def get_user_by_phone(db: AsyncSession, phone: str) -> Optional[User]:
    stmt = select(User).where(User.phone == phone)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()

async def create_user(db: AsyncSession, user_in: UserCreate) -> User:
    db_obj = User(
        full_name=user_in.full_name,
        phone=user_in.phone,
        email=user_in.email,
        role=user_in.role.value if hasattr(user_in.role, 'value') else user_in.role,
        password_hash=get_password_hash(user_in.password),
        county=user_in.county,
        payam=user_in.payam,
        boma=user_in.boma,
        latitude=user_in.latitude,
        longitude=user_in.longitude
    )
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

async def authenticate_user(db: AsyncSession, phone: str, password: str) -> Optional[User]:
    from app.utils.security import verify_password
    user = await get_user_by_phone(db, phone)
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user

async def send_mock_otp(phone: str) -> str:
    # In a real app, integrate with Africa's Talking here
    otp = "123456" # Mock OTP
    print(f"Sending Mock OTP {otp} to {phone}")
    return otp
