from .. import schemas, models, oauth2
from fastapi import Depends, HTTPException, status, APIRouter
from sqlalchemy.orm import Session
from ..database import get_db
from sqlalchemy import desc, func
from datetime import datetime, timedelta
from fastapi import Body
from ..schemas import BorrowRequestCreate

router = APIRouter(prefix="/borrow")

@router.post("/{id}")
def create_borrow_request(
    id: int,
    request_data: BorrowRequestCreate = Body(None),
    db: Session = Depends(get_db),
    current_user = Depends(oauth2.get_current_user)
):
    book = (
        db
        .query(models.Book)
        .filter(models.Book.id == id)
        .first()
    )

    if not book:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = f"Không tìm thấy sách được yêu cầu."
        )

    existing_request = (
        db
        .query(models.BorrowRequest)
        .filter(
            models.BorrowRequest.user_id == current_user.id,
            models.BorrowRequest.book_id == id,
            models.BorrowRequest.status == "pending"
        )
        .first()
    )

    if existing_request:
        raise HTTPException(
            status_code = status.HTTP_400_BAD_REQUEST,
            detail = "Bạn đã có một yêu cầu mượn sách này đang chờ xử lý."
        )

    borrow_date = request_data.borrow_date if request_data and request_data.borrow_date else datetime.now()
    return_date = request_data.return_date if request_data and request_data.return_date else (datetime.now() + timedelta(days=14))

    borrow_request = models.BorrowRequest(
        user_id = current_user.id,
        book_id = id,
        status = "pending",
        borrow_date = borrow_date,
        return_date = return_date
    )

    db.add(borrow_request)
    db.commit()
    db.refresh(borrow_request)
    return borrow_request

@router.get("/")
def get_all_borrow_requests(
    db: Session = Depends(get_db),
    current_user = Depends(oauth2.get_current_user)
):
    borrows = (
        db
        .query(models.BorrowRequest)
        .filter(models.BorrowRequest.user_id == current_user.id)
        .order_by(desc(models.BorrowRequest.created_at))
        .all()
    )

    return borrows

@router.get("/requests")
def get_all_borrow_requests(
    db: Session = Depends(get_db),
    current_user = Depends(oauth2.get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền xem danh sách yêu cầu mượn sách."
        )

    borrows = (
        db
        .query(models.BorrowRequest)
        .filter(models.BorrowRequest.status == "pending")
        .order_by(models.BorrowRequest.created_at)
        .all()
    )

    return borrows

@router.put("/{id}/approve")
def approve_borrow_request(
    id: int,
    db: Session = Depends(get_db),
    current_user = Depends(oauth2.get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền duyệt yêu cầu mượn sách."
        )

    borrow_request = (
        db
        .query(models.BorrowRequest)
        .filter(models.BorrowRequest.id == id)
        .first()
    )

    if not borrow_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy yêu cầu mượn sách."
        )

    borrow_request.status = "approved"
    borrow_request.borrow_date = datetime.now()
    db.commit()
    db.refresh(borrow_request)

    return borrow_request

@router.put("/{id}/reject")
def reject_borrow_request(
    id: int,
    db: Session = Depends(get_db),
    current_user = Depends(oauth2.get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền từ chối yêu cầu mượn sách."
        )

    borrow_request = (
        db
        .query(models.BorrowRequest)
        .filter(models.BorrowRequest.id == id)
        .first()
    )

    if not borrow_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy yêu cầu mượn sách."
        )

    borrow_request.status = "rejected"
    db.commit()
    db.refresh(borrow_request)

    return borrow_request

@router.put("/{id}/return")
def return_borrow_request(
    id: int,
    db: Session = Depends(get_db),
    current_user = Depends(oauth2.get_current_user)
):
    borrow_request = (
        db
        .query(models.BorrowRequest)
        .filter(models.BorrowRequest.id == id)
        .first()
    )

    if not borrow_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy yêu cầu mượn sách."
        )

    if borrow_request.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền trả sách này."
        )

    borrow_request.status = "returned"
    borrow_request.actual_return_date = datetime.now()
    db.commit()
    db.refresh(borrow_request)

    return borrow_request