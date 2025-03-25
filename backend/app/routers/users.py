from fastapi import Depends, HTTPException, status, APIRouter
from sqlalchemy.orm import Session, joinedload
from .. import schemas, models, oauth2
from ..database import get_db
from typing import List

router = APIRouter(prefix="/user", tags=["Users"])

@router.get("/me", response_model=schemas.UserProfileOut)
def get_current_user_profile(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    user = (
        db.query(models.User)
        .filter(models.User.id == current_user.id)
        .first()
    )
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    borrows = (
        db.query(models.BorrowRequest)
        .options(joinedload(models.BorrowRequest.book))
        .filter(models.BorrowRequest.user_id == current_user.id)
        .all()
    )

    current_borrows = [b for b in borrows if b.status == "approved" and b.actual_return_date is None]
    borrowed_books_count = len(current_borrows)
    returned_books_count = len([b for b in borrows if b.status == "returned"])

    return {
        "user": user,
        "current_borrows": current_borrows,
        "borrowed_books_count": borrowed_books_count,
        "returned_books_count": returned_books_count,
    }

@router.get("/{id}", response_model=schemas.UserOut)
def get_user(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Permission denied")

    user = db.query(models.User).filter(models.User.id == id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return user

@router.get("/", response_model=List[schemas.UserOut])
def get_users(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Permission denied")

    return db.query(models.User).all()

@router.put("/{id}", response_model=schemas.UserOut)
def update_user(
    id: int,
    user: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Permission denied")

    db_user = db.query(models.User).filter(models.User.id == id).first()
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    update_data = user.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_user, key, value)

    db.commit()
    db.refresh(db_user)
    return db_user

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Permission denied")

    db_user = db.query(models.User).filter(models.User.id == id).first()
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    db.delete(db_user)
    db.commit()
    return None