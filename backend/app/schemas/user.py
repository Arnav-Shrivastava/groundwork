from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field

from app.models.user import UserRole


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(
        ..., min_length=8, description="Password must be at least 8 characters long"
    )
    company_name: str
    role: UserRole


class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    company_name: str
    role: UserRole
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
