from typing import Optional
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


class BookCreate(BaseModel):
    title: str
    author: str
    publisher: str
    image_url: str
    published_year: int
    average_rating: float
    ratings_count: int
    num_pages: int


class Book(BookCreate):
    id: int

    class Config:
        from_attributes = True
