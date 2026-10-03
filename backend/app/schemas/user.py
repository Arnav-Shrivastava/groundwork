from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime
from app.models.user import UserRole

class UserCreate(BaseModel):
    email: EmailStr
    password: str
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
