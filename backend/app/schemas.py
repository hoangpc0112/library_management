from typing import Optional
from unittest.mock import Base
from pydantic import BaseModel, EmailStr


class ItemBase(BaseModel):
    name: str
    price: float


class Item(ItemBase):
    id: int

    class Config:
        from_attributes = True


class CreateItem(ItemBase):
    pass


class UpdateItem(ItemBase):
    name: Optional[str] = None
    price: Optional[float] = None


class UserBase(BaseModel):
    email: EmailStr
    password: str


class UserCreate(UserBase):
    pass


class UpdatePassword(UserBase):
    password: str


class User(BaseModel):
    email: EmailStr
    id: int

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None
