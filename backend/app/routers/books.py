from .. import schemas, models, oauth2
from fastapi import Depends, HTTPException, status, APIRouter
from sqlalchemy.orm import Session
from ..database import get_db

router = APIRouter(prefix="/book", tags=["Book"])


@router.get("/")
def get_all(db: Session = Depends(get_db), page_num: int = 1, page_size: int = 24):
    total_books = db.query(models.Book).count()
    total_pages = (total_books + page_size -
                   1) // page_size
    books = db.query(models.Book).offset(
        (page_num - 1) * page_size).limit(page_size).all()

    return {
        "total_books": total_books,
        "total_pages": total_pages,
        "current_page": page_num,
        "books": books
    }


@router.get("/{id}", response_model=schemas.Book)
def get_one(id: int, db: Session = Depends(get_db)):
    book = db.query(models.Book).filter(models.Book.id == id).first()

    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Book with id {id} not found."
        )

    return book


@router.post("/", status_code=status.HTTP_201_CREATED)
def add(book: schemas.BookCreate, db: Session = Depends(get_db)):
    db.add(models.Book(**book.dict()))
    db.commit()
    return {"message": "Book added successfully."}


@router.put("/{id}")
def update(id: int, item: schemas.UpdateItem, db: Session = Depends(get_db)):
    query = db.query(models.Item).filter(models.Item.id == id)

    if not query.first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item with id = {id} not found."
        )

    query.update(item.dict(), synchronize_session=False)
    db.commit()

    return {"message": f"Item with id = {id} updated successfully."}


@router.delete("/{id}")
def delete(id: int, db: Session = Depends(get_db)):
    query = db.query(models.Item).filter(models.Item.id == id)

    if not query.first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item with id = {id} not found."
        )

    query.delete(synchronize_session=False)
    db.commit()
    return {"message": f"Item with id = {id} deleted successfully."}
