from .. import schemas, models, utils, oauth2
from fastapi import Depends, HTTPException, status, APIRouter
from sqlalchemy.orm import Session
from ..database import get_db

router = APIRouter(prefix="/profile")


@router.get("/")
def profile(
    db: Session = Depends(get_db),
    current_user=Depends(oauth2.get_current_user)
):
    return current_user

@router.get("/{id}")
def get_user(
    id: int,
    db: Session = Depends(get_db),
    current_user=Depends(oauth2.get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=403,
            detail="Permission denied"
        )

    user = (
        db
        .query(models.User)
        .filter(models.User.id == id)
        .first()
    )
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user