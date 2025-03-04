import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import "../css/BookCard.css";
import Pagination from "./Pagination";

function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentPage = parseInt(queryParams.get("page")) || 1;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8000/book/?page=${currentPage}`
        );
        setBooks(response.data.books);
        setTotalPages(response.data.total_pages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching books:", error);
        setError("Không thể tải dữ liệu sách. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchBooks();
  }, [currentPage]);

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row g-4">
        {books.length === 0 ? (
          <p className="text-center fs-5">Không có sách nào trong thư viện.</p>
        ) : (
          books.map((book) => {
            return (
              <div
                key={book.id}
                className="book-card col-6 col-md-4 col-xl-3 col-xxl-2"
              >
                <Link to={`/book/${book.id}`} className="text-decoration-none">
                  <div className="book-cover-container">
                    <div className="book-cover">
                      <img
                        src={book.image_url}
                        alt={book.title}
                        loading="lazy"
                        className="book-image"
                      />
                    </div>

                    <div className="book-overlay">
                      <div className="book-info">
                        <h3 className="book-title">{book.title}</h3>
                        <div className="book-author">{book.author}</div>

                        <div className="book-details">
                          <div className="book-year">
                            <span className="detail-label">Năm xuất bản:</span>{" "}
                            {book.published_year}
                          </div>

                          <div className="book-rating">
                            <span className="detail-label">Đánh giá:</span>
                            <div className="stars-container">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  className={`star ${
                                    star <= book.average_rating ? "filled" : ""
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                              <span className="rating-number">
                                ({book.average_rating})
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="view-details">Xem chi tiết</div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })
        )}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}

export default BookList;
