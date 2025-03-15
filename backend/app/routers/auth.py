from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import utils, database, models, oauth2, schemas
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import Response
from sqlalchemy import func

router = APIRouter()


@router.post("/login", response_model=schemas.Token)
def login(
    user_credentials: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(database.get_db),
):
    user = (
        db.query(models.User)
        .filter(func.lower(models.User.msv) == func.lower(user_credentials.username))
        .first()
    )

    if not user or not utils.verify_password(user_credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Thông tin đăng nhập không chính xác."
        )

    access_token = oauth2.create_access_token(data={"user_id": user.id})

    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(
    user: schemas.UserCreate,
    db: Session = Depends(database.get_db)
):
    if db.query(models.User).filter(models.User.email == user.email).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email đã được sử dụng."
        )

    if db.query(models.User).filter(models.User.email == user.email).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="MSV đã được sử dụng."
        )

    user.msv = user.msv.lower()
    user.password = utils.hash_password(user.password)

    new_user = models.User(**user.dict())

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return Response(status_code=status.HTTP_201_CREATED)