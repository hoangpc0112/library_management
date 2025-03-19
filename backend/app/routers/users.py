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