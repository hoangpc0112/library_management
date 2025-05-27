from .. import schemas, models, oauth2
from fastapi import Depends, HTTPException, status, APIRouter
from sqlalchemy.orm import Session
from ..database import get_db
from typing import List, Optional
import numpy as np
from sqlalchemy import func
from datetime import datetime, timedelta
from scipy.sparse import csr_matrix
from sklearn.neighbors import NearestNeighbors
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler

router = APIRouter(prefix="/recommendation")


def create_user_item_matrix(db: Session):
    users = db.query(models.User).all()
    books = db.query(models.Book).all()

    user_ids = [user.id for user in users]
    book_ids = [book.id for book in books]

    user_map = {id: idx for idx, id in enumerate(user_ids)}
    book_map = {id: idx for idx, id in enumerate(book_ids)}

    borrows = (
        db.query(models.BorrowRequest)
        .filter(models.BorrowRequest.status.in_(["approved", "returned"]))
        .all()
    )

    rows = []
    cols = []
    data = []

    for borrow in borrows:
        if borrow.user_id in user_map and borrow.book_id in book_map:
            rows.append(user_map[borrow.user_id])
            cols.append(book_map[borrow.book_id])
            data.append(1)

    user_item_matrix = csr_matrix(
        (data, (rows, cols)), shape=(len(user_ids), len(book_ids))
    )

    return user_item_matrix, user_map, book_map, user_ids, book_ids


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
            detail=f"Không tìm thấy sách được yêu cầu.",
        )

    user_item_matrix, user_map, book_map, user_ids, book_ids = create_user_item_matrix(
        db
    )

    if book_id not in book_map:
        popular_books = (
            db.query(models.Book)
            .filter(models.Book.id != book_id)
            .order_by(models.Book.average_rating.desc())
            .limit(limit)
            .all()
        )
        return popular_books

    item_item_matrix = user_item_matrix.transpose().dot(user_item_matrix)

    for i in range(item_item_matrix.shape[0]):
        item_item_matrix[i, i] = 0

    book_idx = book_map[book_id]
    similarities = item_item_matrix[book_idx].toarray().flatten()
    similar_indices = np.argsort(similarities)[::-1][:limit]
    similar_book_ids = [book_ids[idx] for idx in similar_indices]
    similar_books = []

    for similar_id in similar_book_ids:
        book = db.query(models.Book).filter(models.Book.id == similar_id).first()

        if book:
            similar_books.append(book)

    return similar_books


@router.get("/user", response_model=List[schemas.BookOut])
def get_user_recommendations(
    limit: Optional[int] = 24,
    db: Session = Depends(get_db),
    current_user=Depends(oauth2.get_current_user),
):
    user_borrows = (
        db.query(models.BorrowRequest)
        .filter(
            models.BorrowRequest.user_id == current_user.id,
            models.BorrowRequest.status.in_(["approved", "returned"]),
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

    user_item_matrix, user_map, book_map, user_ids, book_ids = create_user_item_matrix(
        db
    )

    if current_user.id not in user_map:
        popular_books = (
            db.query(models.Book)
            .order_by(models.Book.average_rating.desc())
            .limit(limit)
            .all()
        )
        return popular_books

    model = NearestNeighbors(metric="cosine", algorithm="brute")
    model.fit(user_item_matrix)
    user_idx = user_map[current_user.id]
    distances, indices = model.kneighbors(
        user_item_matrix[user_idx].reshape(1, -1), n_neighbors=6
    )
    print("Khoảng cách cosine:", distances)
    print("user_id:", indices)
    similar_user_indices = indices.flatten()[1:]
    borrowed_book_ids = [borrow.book_id for borrow in user_borrows]
    recommendation_scores = {}

    for idx in similar_user_indices:
        similar_user_id = user_ids[idx]
        similar_user_borrows = (
            db.query(models.BorrowRequest)
            .filter(
                models.BorrowRequest.user_id == similar_user_id,
                models.BorrowRequest.status.in_(["approved", "returned"]),
            )
            .all()
        )

        for borrow in similar_user_borrows:
            if borrow.book_id not in borrowed_book_ids:
                if borrow.book_id in recommendation_scores:
                    recommendation_scores[borrow.book_id] += 1
                else:
                    recommendation_scores[borrow.book_id] = 1

    print("Số điểm gợi ý:", recommendation_scores)

    recommended_book_ids = sorted(
        recommendation_scores.keys(),
        key=lambda x: recommendation_scores[x],
        reverse=True,
    )[:limit]

    if len(recommended_book_ids) < limit:
        popular_books = (
            db.query(models.Book)
            .filter(~models.Book.id.in_(borrowed_book_ids + recommended_book_ids))
            .order_by(models.Book.average_rating.desc())
            .limit(limit - len(recommended_book_ids))
            .all()
        )
        popular_book_ids = [book.id for book in popular_books]
        recommended_book_ids.extend(popular_book_ids)

    recommended_books = (
        db.query(models.Book).filter(models.Book.id.in_(recommended_book_ids)).all()
    )
    sorted_books = sorted(
        recommended_books, key=lambda book: recommended_book_ids.index(book.id)
    )

    if len(sorted_books) > 1:
        authors = [book.author or "unknown" for book in sorted_books]
        published_years = [book.published_year or 0 for book in sorted_books]

        vectorizer = TfidfVectorizer()
        author_vectors = vectorizer.fit_transform(authors)

        scaler = MinMaxScaler()
        year_vectors = scaler.fit_transform(np.array(published_years).reshape(-1, 1))

        feature_vectors = np.hstack((author_vectors.toarray(), year_vectors))
        diversity_scores = []

        for i in range(len(sorted_books)):
            for j in range(i + 1, len(sorted_books)):
                sim = cosine_similarity(
                    feature_vectors[i].reshape(1, -1), feature_vectors[j].reshape(1, -1)
                )[0][0]
                diversity = 1 - sim
                diversity_scores.append(diversity)

        intra_list_diversity = np.mean(diversity_scores) if diversity_scores else 0
        print(f"Intra-List Diversity (ILD): {intra_list_diversity:.4f}")

    print("Các sách gợi ý:", [book.id for book in sorted_books])

    return sorted_books


@router.get("/trending", response_model=List[schemas.BookOut])
def get_trending_books(
    days: Optional[int] = 30, limit: Optional[int] = 10, db: Session = Depends(get_db)
):
    threshold_date = datetime.now() - timedelta(days=days)

    recent_borrows = (
        db.query(
            models.BorrowRequest.book_id,
            func.count(models.BorrowRequest.book_id).label("borrow_count"),
        )
        .filter(models.BorrowRequest.created_at >= threshold_date)
        .group_by(models.BorrowRequest.book_id)
        .order_by(func.count(models.BorrowRequest.book_id).desc())
        .limit(limit)
        .all()
    )

    book_ids = [book_id for book_id, _ in recent_borrows]

    if not book_ids:
        res = db.query(models.Book).order_by(models.Book.id).limit(limit).all()
        return res

    trending_books = db.query(models.Book).filter(models.Book.id.in_(book_ids)).all()
    sorted_books = sorted(trending_books, key=lambda book: book_ids.index(book.id))

    return sorted_books
