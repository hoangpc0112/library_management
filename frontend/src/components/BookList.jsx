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
  const search = queryParams.get("search") || "";

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8000/book/?page=${currentPage}&search=${search}`
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
  }, [currentPage, search]);

  if (loading) {
    return (
      <div
        className="container text-center py-5"
        style={{ minHeight: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="container text-center py-5"
        style={{ minHeight: "100vh" }}
      >
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
          <p className="text-center fs-5">Không có sách nào được tìm thấy.</p>
        ) : (
          books.map((book) => {
            return (
              <div className="book-card col-6 col-md-4 col-xl-3 col-xxl-2">
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
                  </div>

                  <div className="book-info text-center mt-2">
                    <h6 className="book-title m-0" title={book.title}>
                      {book.title.length > 20
                        ? book.title.slice(0, 20) + "..."
                        : book.title}
                    </h6>
                    <p
                      className="book-author text-muted small m-0"
                      title={book.author}
                    >
                      {book.author.length > 30
                        ? book.author.slice(0, 30) + "..."
                        : book.author}
                    </p>
                  </div>
                </Link>
              </div>
            );
          })
        )}
      </div>
      {totalPages ? (
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      ) : null}
    </div>
  );
}

export default BookList;
