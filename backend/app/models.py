from sqlalchemy import DOUBLE_PRECISION, Column, Integer, String, ForeignKey, TIMESTAMP, text
from .database import Base
from sqlalchemy.orm import relationship


class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String, nullable=False)
    author = Column(String, nullable=False)
    publisher = Column(String, nullable=False)
    image_url = Column(String, nullable=False)
    published_year = Column(Integer, nullable=False)
    average_rating = Column(DOUBLE_PRECISION, nullable=False)
    ratings_count = Column(Integer, nullable=False)
    num_pages = Column(Integer, nullable=False)

    borrow_requests = relationship("BorrowRequest", back_populates="book")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    is_admin = Column(Integer, nullable=False)
    msv = Column(String, nullable=False, unique=True, index=True)
    faculty = Column(String, nullable=False)   # Khoa
    major = Column(String, nullable=False)     # Ngành
    birth_year = Column(Integer, nullable=False)
    created_at = Column(String, nullable=False)

    borrow_requests = relationship("BorrowRequest", back_populates="user")

class BorrowRequest(Base):
    __tablename__ = "borrow_requests"

    id = Column(Integer, primary_key=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    book_id = Column(Integer, ForeignKey("books.id", ondelete="CASCADE"), nullable=False)
    status = Column(String, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    borrow_date = Column(TIMESTAMP(timezone=True), nullable=True)  # Date when book was actually borrowed
    return_date = Column(TIMESTAMP(timezone=True), nullable=True)   # Expected return date
    actual_return_date = Column(TIMESTAMP(timezone=True), nullable=True)  # Date when book was actually returned

    user = relationship("User")
    book = relationship("Book")