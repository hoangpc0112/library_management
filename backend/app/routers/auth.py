from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import utils, database, models, oauth2, schemas
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(tags=["Auth"])


@router.post("/login", response_model=schemas.Token)
def login(
    user_credentials: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(database.get_db),
):
    user = (
        db.query(models.User)
        .filter(models.User.email == user_credentials.username)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Invalid credentials."
        )

    if not utils.verify_password(user_credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Invalid credentials."
        )

    access_token = oauth2.create_access_token(data={"sub": user.email})

    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=schemas.User)
def register(
    user: schemas.UserCreate,
    db: Session = Depends(database.get_db)
):
    user_exists = db.query(models.User).filter(models.User.email == user.email).first()
    if user_exists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email đã được sử dụng."
        )

    hashed_password = utils.hash_password(user.password)
    user.password = hashed_password

    new_user = models.User(
        email=user.email,
        password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user