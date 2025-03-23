from .. import schemas, models, oauth2
from fastapi import Depends, HTTPException, status, APIRouter
from sqlalchemy.orm import Session
from ..database import get_db
from typing import List, Optional
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sqlalchemy import func

router = APIRouter(prefix="/recommendation")

def create_book_profile(book):
    profile = f"{book.title} {book.author} {book.publisher} {str(book.published_year)}"
    return profile

def compute_similarity_matrix(books):
    book_profiles = [create_book_profile(book) for book in books]
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(book_profiles)
    similarity_matrix = cosine_similarity(tfidf_matrix)
    return similarity_matrix

@router.get("/{book_id:int}", response_model=List[schemas.BookOut])
def get_similar_books(
    book_id: int,
    limit: Optional[int] = 10,
    db: Session = Depends(get_db),
):
    target_book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not target_book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy sách được yêu cầu."
        )
    all_books = db.query(models.Book).all()
    similarity_matrix = compute_similarity_matrix(all_books)
    target_index = next(i for i, book in enumerate(all_books) if book.id == book_id)
    similarity_scores = list(enumerate(similarity_matrix[target_index]))
    similarity_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)
    similar_book_indices = [i for i, _ in similarity_scores[1:limit+1]]
    similar_books = [all_books[i] for i in similar_book_indices]
    return similar_books

@router.get("/user", response_model=List[schemas.BookOut])
def get_user_recommendations(
    limit: Optional[int] = 24,
    db: Session = Depends(get_db),
    current_user = Depends(oauth2.get_current_user)
):
    user_borrows = (
        db.query(models.BorrowRequest)
        .filter(
            models.BorrowRequest.user_id == current_user.id,
            models.BorrowRequest.status.in_(["approved", "returned"])
        )
        .all()
    )
    if not user_borrows:
        popular_books = (
            db.query(models.Book)
            .order_by(models.Book.average_rating.desc())
            .limit(limit)
            .all()
        )
        return popular_books
    all_books = db.query(models.Book).all()
    similarity_matrix = compute_similarity_matrix(all_books)
    borrowed_book_ids = [borrow.book_id for borrow in user_borrows]
    borrowed_indices = [next((i for i, book in enumerate(all_books) if book.id == book_id), None)
                        for book_id in borrowed_book_ids]
    borrowed_indices = [i for i in borrowed_indices if i is not None]
    recommendation_scores = np.zeros(len(all_books))
    for idx in borrowed_indices:
        recommendation_scores += similarity_matrix[idx]
    book_scores = list(enumerate(recommendation_scores))
    book_scores = sorted(book_scores, key=lambda x: x[1], reverse=True)
    recommended_indices = [i for i, _ in book_scores if all_books[i].id not in borrowed_book_ids]
    recommended_indices = recommended_indices[:limit]
    recommended_books = [all_books[i] for i in recommended_indices]
    return recommended_books

@router.get("/trending", response_model=List[schemas.BookOut])
def get_trending_books(
    days: Optional[int] = 30,
    limit: Optional[int] = 10,
    db: Session = Depends(get_db)
):
    from datetime import datetime, timedelta
    threshold_date = datetime.now() - timedelta(days=days)
    recent_borrows = (
        db.query(models.BorrowRequest.book_id,
                 func.count(models.BorrowRequest.book_id).label("borrow_count"))
        .filter(models.BorrowRequest.created_at >= threshold_date)
        .group_by(models.BorrowRequest.book_id)
        .order_by(func.count(models.BorrowRequest.book_id).desc())
        .limit(limit)
        .all()
    )
    book_ids = [book_id for book_id, _ in recent_borrows]
    if not book_ids:
        return []
    trending_books = (
        db.query(models.Book)
        .filter(models.Book.id.in_(book_ids))
        .all()
    )
    sorted_books = sorted(trending_books, key=lambda book: book_ids.index(book.id))
    return sorted_books