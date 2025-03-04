from .. import schemas, models, utils
from fastapi import Depends, HTTPException, status, APIRouter
from sqlalchemy.orm import Session
from ..database import get_db

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/", response_model=list[schemas.User])
def get_all(db: Session = Depends(get_db)):
    return db.query(models.User).all()


@router.get("/{id}", response_model=schemas.User)
def get_one(id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id = {id} not found.",
        )

    return user


@router.post("/", status_code=status.HTTP_201_CREATED)
def add(user: schemas.UserCreate, db: Session = Depends(get_db)):
    pwd_hash = utils.hash_password(user.password)
    user.password = pwd_hash

    db.add(models.User(**user.dict()))
    db.commit()
    return {"message": "User created successfully."}
