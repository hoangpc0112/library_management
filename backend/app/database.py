from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings
import os

<<<<<<< HEAD
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL") or f"postgresql://{os.getenv('DATABASE_USERNAME', settings.database_username)}:{os.getenv('DATABASE_PASSWORD', settings.database_password)}@{os.getenv('DATABASE_HOSTNAME', settings.database_hostname)}:{os.getenv('DATABASE_PORT', settings.database_port)}/{os.getenv('DATABASE_NAME') or settings.database_name}"
=======
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL") or f"postgresql://{os.getenv('DATABASE_USERNAME')}:{os.getenv('DATABASE_PASSWORD')}@{os.getenv('DATABASE_HOSTNAME')}:{os.getenv('DATABASE_PORT')}/{os.getenv('DATABASE_NAME')}"
>>>>>>> 3bdc8437e2f07731b21f590929843999707bb584
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
