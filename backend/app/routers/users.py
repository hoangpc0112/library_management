from .. import schemas, models, utils, oauth2
from fastapi import Depends, HTTPException, status, APIRouter
from sqlalchemy.orm import Session
from ..database import get_db

router = APIRouter(prefix="/user")


@router.get("/me")
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

@router.get("/")
def get_users(
    db: Session = Depends(get_db),
    current_user=Depends(oauth2.get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=403,
            detail="Permission denied"
        )

    users = db.query(models.User).all()
    return users

@router.put("/{id}")
def update_user(
    id: int,
    user: schemas.UserUpdate,  # You'll need to define this schema
    db: Session = Depends(get_db),
    current_user=Depends(oauth2.get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền sửa thông tin người dùng."
        )

    db_user = db.query(models.User).filter(models.User.id == id).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy người dùng."
        )

    # Update only the fields that are provided
    update_data = user.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_user, key, value)

    db.commit()
    db.refresh(db_user)
    return db_user

@router.delete("/{id}")
def delete_user(
    id: int,
    db: Session = Depends(get_db),
    current_user=Depends(oauth2.get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền xóa người dùng."
        )

    db_user = db.query(models.User).filter(models.User.id == id).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy người dùng."
        )

    db.delete(db_user)
    db.commit()
    return {"message": "Người dùng đã được xóa thành công."}