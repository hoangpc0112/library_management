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
