from typing import Optional
from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    is_admin: int = 0
    msv: str


class UserOut(BaseModel):
    email: EmailStr
    full_name: str
    msv: str

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    msv: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    msv: Optional[str] = None


class BookCreate(BaseModel):
    title: str
    author: str
    publisher: str
    image_url: str
    published_year: int
    average_rating: float
    ratings_count: int
    num_pages: int


class BookOut(BaseModel):
    title: str
    author: str
    publisher: str
    image_url: str
    published_year: int
    average_rating: float
    ratings_count: int
    num_pages: int

    class Config:
        from_attributes = True
