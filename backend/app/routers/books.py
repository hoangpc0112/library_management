from .. import schemas, models, oauth2
from fastapi import Depends, HTTPException, status, APIRouter
from sqlalchemy.orm import Session
from ..database import get_db
from sqlalchemy import desc, func

router = APIRouter(prefix="/book")


@router.get("/")
def get_all(
    db: Session = Depends(get_db),
    page: int = 1,
    size: int = 24,
    search: str = "",
    sort: str = "id",
    order: str = "asc"
):
    query = db.query(models.Book)

    if search:
        query = query.filter(func.lower(models.Book.title).like(f"%{search.lower()}%"))

    if order.lower() == "desc":
        query = query.order_by(desc(getattr(models.Book, sort)))
    else:
        query = query.order_by(getattr(models.Book, sort))

    total_books = query.count()
    total_pages = (total_books + size - 1) // size

    books = query.offset((page - 1) * size).limit(size).all()

    return {
        "total_pages": total_pages,
        "current_page": page,
        "books": books,
        "total_books": total_books
    }


@router.get("/{id}", response_model=schemas.BookOut)
def get_one(
    id: int,
    db: Session = Depends(get_db)
):
    book = (
        db
        .query(models.Book)
        .filter(models.Book.id == id)
        .first()
    )

    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy sách được yêu cầu."
        )

    return book


@router.put("/{id}")
def update(
    id: int,
    book: schemas.BookUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(oauth2.get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền sửa thông tin sách."
        )

    query = db.query(models.Book).filter(models.Book.id == id)
    existing_book = query.first()

    if not existing_book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy sách được yêu cầu."
        )

    query.update(book.dict(exclude_unset=True), synchronize_session=False)
    db.commit()
    db.refresh(existing_book)

    return existing_book

@router.delete("/{id}")
def delete(
    id: int,
    db: Session = Depends(get_db),
    current_user = Depends(oauth2.get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền xóa sách."
        )

    query = db.query(models.Book).filter(models.Book.id == id)

    if not query.first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy sách được yêu cầu."
        )

    query.delete(synchronize_session=False)
    db.commit()

    return {"message": f"Sách đã được xóa thành công."}
