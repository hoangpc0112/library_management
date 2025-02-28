from .. import schemas, models, oauth2
from fastapi import Depends, HTTPException, status, APIRouter
from sqlalchemy.orm import Session
from ..database import get_db

router = APIRouter(prefix="/items", tags=["Items"])


@router.get("/", response_model=list[schemas.Item])
def get_all(db: Session = Depends(get_db), sub=Depends(oauth2.get_current_user)):
    return db.query(models.Item).all()


@router.get("/{id}", response_model=schemas.Item)
def get_one(id: int, db: Session = Depends(get_db), sub=Depends(oauth2.get_current_user)):
    item = db.query(models.Item).filter(models.Item.id == id).first()

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item with id {id} not found."
        )

    return item


@router.post("/", status_code=status.HTTP_201_CREATED)
def add(item: schemas.CreateItem, db: Session = Depends(get_db), sub=Depends(oauth2.get_current_user)):
    db.add(models.Item(**item.dict()))
    db.commit()
    return {"message": "Item added successfully."}


@router.put("/{id}")
def update(id: int, item: schemas.UpdateItem, db: Session = Depends(get_db), sub=Depends(oauth2.get_current_user)):
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
def delete(id: int, db: Session = Depends(get_db), sub=Depends(oauth2.get_current_user)):
    query = db.query(models.Item).filter(models.Item.id == id)

    if not query.first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item with id = {id} not found."
        )

    query.delete(synchronize_session=False)
    db.commit()
    return {"message": f"Item with id = {id} deleted successfully."}
