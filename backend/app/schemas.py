from typing import Optional, List
from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    is_admin: int = 0
    msv: str
    faculty: Optional[str] = None
    major: Optional[str] = None
    birth_year: Optional[int] = None

class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    msv: str
    faculty: Optional[str] = None
    major: Optional[str] = None
    birth_year: Optional[int] = None
    created_at: Optional[datetime] = None
    is_admin: int

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    msv: Optional[str] = None
    faculty: Optional[str] = None
    major: Optional[str] = None
    birth_year: Optional[int] = None
    is_admin: Optional[int] = None

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    msv: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: Optional[str] = None

class BookCreate(BaseModel):
    title: str
    author: str
    publisher: str
    image_url: str
    published_year: int
    average_rating: float
    ratings_count: int
    num_pages: int
    gg_drive_link: Optional[str] = None

class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    image_url: Optional[str] = None
    publisher: Optional[str] = None
    published_year: Optional[int] = None
    num_pages: Optional[int] = None
    gg_drive_link: Optional[str] = None

    class Config:
        from_attributes = True

class BookOut(BaseModel):
    id: int
    title: str
    author: str
    publisher: str
    image_url: str
    published_year: int
    average_rating: float
    ratings_count: int
    num_pages: int
    gg_drive_link: Optional[str] = None

    class Config:
        from_attributes = True

class BorrowRequestCreate(BaseModel):
    borrow_date: Optional[datetime] = None
    return_date: Optional[datetime] = None

class BorrowRequestOut(BaseModel):
    id: int
    user_id: int
    book_id: int
    status: str
    created_at: datetime
    borrow_date: Optional[datetime] = None
    return_date: Optional[datetime] = None
    actual_return_date: Optional[datetime] = None
    book: BookOut
    user: UserOut

    class Config:
        from_attributes = True

class AdminStats(BaseModel):
    total_books: int
    total_users: int
    active_loans: int
    pending_requests: int

class TopBook(BaseModel):
    title: str
    count: int

class TopBorrower(BaseModel):
    name: str
    count: int

class LibraryStats(BaseModel):
    total_books: int
    total_users: int
    overdue_books: int
    most_borrowed_books: List[TopBook]
    top_borrowers: List[TopBorrower]

class UserProfileOut(BaseModel):
    user: UserOut
    current_borrows: List[BorrowRequestOut]
    borrowed_books_count: int
    returned_books_count: int

    class Config:
        from_attributes = True