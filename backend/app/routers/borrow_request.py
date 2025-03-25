from .. import models, oauth2
from fastapi import Depends, HTTPException, status, APIRouter, Body
from sqlalchemy.orm import Session
from ..database import get_db
from sqlalchemy import desc, func
from datetime import datetime, timedelta
from typing import List
from sqlalchemy.orm import joinedload
from ..schemas import BorrowRequestCreate, BorrowRequestOut, AdminStats, LibraryStats

router = APIRouter(prefix="/borrow")

@router.post("/{id}", response_model=BorrowRequestOut)
def create_borrow_request(
    id: int,
    request_data: BorrowRequestCreate = Body(None),
    db: Session = Depends(get_db),
    current_user=Depends(oauth2.get_current_user)
):
    book = db.query(models.Book).filter(models.Book.id == id).first()
    if not book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy sách được yêu cầu.")

    existing_request = (
        db.query(models.BorrowRequest)
        .filter(
            models.BorrowRequest.user_id == current_user.id,
            models.BorrowRequest.book_id == id,
            models.BorrowRequest.status == "pending"
        )
        .first()
    )
    if existing_request:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bạn đã có một yêu cầu mượn sách này đang chờ xử lý."
        )

    borrow_date = request_data.borrow_date if request_data and request_data.borrow_date else datetime.now()
    return_date = request_data.return_date if request_data and request_data.return_date else (datetime.now() + timedelta(days=14))

    borrow_request = models.BorrowRequest(
        user_id=current_user.id,
        book_id=id,
        status="pending",
        borrow_date=borrow_date,
        return_date=return_date
    )
    db.add(borrow_request)
    db.commit()
    db.refresh(borrow_request)
    return borrow_request

@router.get("/", response_model=List[BorrowRequestOut])
def get_all_borrow_requests_for_current_user(
    db: Session = Depends(get_db),
    current_user=Depends(oauth2.get_current_user)
):
    borrows = (
        db.query(models.BorrowRequest)
        .options(joinedload(models.BorrowRequest.book))
        .filter(models.BorrowRequest.user_id == current_user.id)
        .order_by(desc(models.BorrowRequest.created_at))
        .all()
    )
    return borrows

@router.get("/all", response_model=List[BorrowRequestOut])
def get_all_borrow_requests_for_all_users(
    db: Session = Depends(get_db),
    current_user=Depends(oauth2.get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Bạn không có quyền truy cập.")
    borrows = (
        db.query(models.BorrowRequest)
        .options(joinedload(models.BorrowRequest.book), joinedload(models.BorrowRequest.user))
        .order_by(desc(models.BorrowRequest.created_at))
        .all()
    )
    return borrows

@router.get("/requests", response_model=List[BorrowRequestOut])
def get_all_borrow_requests(
    db: Session = Depends(get_db),
    current_user=Depends(oauth2.get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Bạn không có quyền xem danh sách yêu cầu mượn sách.")
    borrows = (
        db.query(models.BorrowRequest)
        .options(joinedload(models.BorrowRequest.book), joinedload(models.BorrowRequest.user))
        .filter(models.BorrowRequest.status == "pending")
        .order_by(models.BorrowRequest.created_at)
        .all()
    )
    return borrows

@router.get("/active", response_model=List[BorrowRequestOut])
def get_active_loans(
    db: Session = Depends(get_db),
    current_user=Depends(oauth2.get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Bạn không có quyền xem danh sách sách đang mượn.")
    loans = (
        db.query(models.BorrowRequest)
        .options(joinedload(models.BorrowRequest.book), joinedload(models.BorrowRequest.user))
        .filter(
            models.BorrowRequest.status == "approved",
            models.BorrowRequest.actual_return_date.is_(None)
        )
        .order_by(models.BorrowRequest.borrow_date)
        .all()
    )
    return loans

@router.put("/{id}/approve", response_model=BorrowRequestOut)
def approve_borrow_request(
    id: int,
    db: Session = Depends(get_db),
    current_user=Depends(oauth2.get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Bạn không có quyền duyệt yêu cầu mượn sách.")
    borrow_request = db.query(models.BorrowRequest).filter(models.BorrowRequest.id == id).first()
    if not borrow_request:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy yêu cầu mượn sách.")

    conflicting_requests = (
        db.query(models.BorrowRequest)
        .filter(
            models.BorrowRequest.book_id == borrow_request.book_id,
            models.BorrowRequest.status == "pending",
            models.BorrowRequest.id != id,
            func.DATE(models.BorrowRequest.borrow_date) <= func.DATE(borrow_request.return_date)
        )
        .all()
    )
    for req in conflicting_requests:
        req.status = "rejected"
        db.commit()
        db.refresh(req)

    borrow_request.status = "approved"
    borrow_request.borrow_date = datetime.now()
    db.commit()
    db.refresh(borrow_request)
    return borrow_request

@router.put("/{id}/reject", response_model=BorrowRequestOut)
def reject_borrow_request(
    id: int,
    db: Session = Depends(get_db),
    current_user=Depends(oauth2.get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Bạn không có quyền từ chối yêu cầu mượn sách.")
    borrow_request = db.query(models.BorrowRequest).filter(models.BorrowRequest.id == id).first()
    if not borrow_request:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy yêu cầu mượn sách.")

    borrow_request.status = "rejected"
    db.commit()
    db.refresh(borrow_request)
    return borrow_request

@router.put("/{id}/return", response_model=BorrowRequestOut)
def return_borrow_request(
    id: int,
    db: Session = Depends(get_db),
    current_user=Depends(oauth2.get_current_user)
):
    borrow_request = db.query(models.BorrowRequest).filter(models.BorrowRequest.id == id).first()
    if not borrow_request:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy yêu cầu mượn sách.")
    if borrow_request.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Bạn không có quyền trả sách này.")

    borrow_request.status = "returned"
    borrow_request.actual_return_date = datetime.now()
    db.commit()
    db.refresh(borrow_request)
    return borrow_request

@router.get("/book/{id}", response_model=List[BorrowRequestOut])
def get_all_borrow_requests_for_book(
    id: int,
    db: Session = Depends(get_db),
    current_user=Depends(oauth2.get_current_user)
):
    borrows = (
        db.query(models.BorrowRequest)
        .options(joinedload(models.BorrowRequest.book), joinedload(models.BorrowRequest.user))
        .filter(models.BorrowRequest.book_id == id)
        .all()
    )
    return borrows

@router.get("/stats/counts", response_model=AdminStats)
def get_admin_stats(db: Session = Depends(get_db), current_user=Depends(oauth2.get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Permission denied")
    total_books = db.query(models.Book).count()
    total_users = db.query(models.User).count()
    pending_requests = db.query(models.BorrowRequest).filter(models.BorrowRequest.status == "pending").count()
    active_loans = db.query(models.BorrowRequest).filter(models.BorrowRequest.status == "approved").count()
    return {
        "total_books": total_books,
        "total_users": total_users,
        "active_loans": active_loans,
        "pending_requests": pending_requests,
    }

@router.get("/stats", response_model=LibraryStats)
def get_library_stats(db: Session = Depends(get_db), current_user=Depends(oauth2.get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Permission denied")
    total_books = db.query(models.Book).count()
    total_users = db.query(models.User).count()
    overdue_books = (
        db.query(models.BorrowRequest)
        .filter(
            models.BorrowRequest.status == "approved",
            models.BorrowRequest.actual_return_date.is_(None),
            models.BorrowRequest.return_date < func.now()
        )
        .count()
    )
    most_borrowed = (
        db.query(models.Book.title, func.count(models.BorrowRequest.id).label("count"))
        .join(models.BorrowRequest, models.Book.id == models.BorrowRequest.book_id)
        .group_by(models.Book.id, models.Book.title)
        .order_by(func.count(models.BorrowRequest.id).desc())
        .limit(5)
        .all()
    )
    most_borrowed_books = [{"title": title, "count": count} for title, count in most_borrowed]
    top_borrowers = (
        db.query(models.User.full_name, func.count(models.BorrowRequest.id).label("count"))
        .join(models.BorrowRequest, models.User.id == models.BorrowRequest.user_id)
        .group_by(models.User.id, models.User.full_name)
        .order_by(func.count(models.BorrowRequest.id).desc())
        .limit(5)
        .all()
    )
    top_borrowers_list = [{"name": name, "count": count} for name, count in top_borrowers]
    return {
        "total_books": total_books,
        "total_users": total_users,
        "overdue_books": overdue_books,
        "most_borrowed_books": most_borrowed_books,
        "top_borrowers": top_borrowers_list,
    }