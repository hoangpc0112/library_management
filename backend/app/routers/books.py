from .. import schemas, models, oauth2
from fastapi import Depends, HTTPException, status, APIRouter
from sqlalchemy.orm import Session
from ..database import get_db

router = APIRouter(prefix="/book")


@router.get("/")
def get_all(db: Session = Depends(get_db), page: int = 1):
    total_books = db.query(models.Book).count()
    total_pages = (total_books + 24 - 1) // 24
    books = db.query(models.Book).offset((page - 1) * 24).limit(24).all()

    return {
        "total_books": total_books,
        "total_pages": total_pages,
        "current_page": page,
        "books": books
    }


@router.get("/{id}", response_model=schemas.BookOut)
def get_one(id: int, db: Session = Depends(get_db)):
    book = db.query(models.Book).filter(models.Book.id == id).first()

    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy sách được yêu cầu."
        )

    return book


# @router.post("/", status_code=status.HTTP_201_CREATED)
# def add(book: schemas.BookCreate, db: Session = Depends(get_db)):
#     db.add(models.Book(**book.dict()))
#     db.commit()
#     return Response(status_code=status.HTTP_201_CREATED)


# @router.put("/{id}")
# def update(id: int, item: schemas.UpdateItem, db: Session = Depends(get_db)):
#     query = db.query(models.Item).filter(models.Item.id == id)

#     if not query.first():
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail=f"Item with id = {id} not found."
#         )

#     query.update(item.dict(), synchronize_session=False)
#     db.commit()

#     return {"message": f"Item with id = {id} updated successfully."}


# @router.delete("/{id}")
# def delete(id: int, db: Session = Depends(get_db)):
#     query = db.query(models.Item).filter(models.Item.id == id)

#     if not query.first():
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail=f"Item with id = {id} not found."
#         )

#     query.delete(synchronize_session=False)
#     db.commit()
#     return {"message": f"Item with id = {id} deleted successfully."}
