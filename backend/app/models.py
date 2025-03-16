from sqlalchemy import DOUBLE_PRECISION, Column, Integer, String
from .database import Base


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
