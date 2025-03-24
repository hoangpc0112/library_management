import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import "../css/BookCard.css";
import Pagination from "./Pagination";

function BookList({ apiEndpoint = "book" }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPageState, setCurrentPageState] = useState(1);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentPage = parseInt(queryParams.get("page")) || 1;
  const search = queryParams.get("search") || "";
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchBooks = async () => {
      try {
        setLoading(true);

        let config = {};
        if (apiEndpoint.includes("recommendation/user")) {
          const token = localStorage.getItem("token");
          if (!token) {
            setError("Bạn cần đăng nhập để xem đề xuất.");
            setLoading(false);
            return;
          }
          config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        }

        let url = `${API_URL}/${apiEndpoint}`;

        if (apiEndpoint === "book") {
          url += `/?page=${currentPage}&search=${search}`;
        }

        const response = await axios.get(url, config);

        if (apiEndpoint === "book") {
          setBooks(response.data.books || []);
          setTotalPages(response.data.total_pages || 1);
          setCurrentPageState(response.data.current_page || 1);
        } else {
          setBooks(Array.isArray(response.data) ? response.data : []);
          setTotalPages(1);
          setCurrentPageState(1);
        }

        setLoading(false);
      } catch (error) {
        console.error(`Error fetching from ${apiEndpoint}:`, error);

        if (error.response && error.response.status === 401) {
          setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        } else {
          setError("Không thể tải dữ liệu sách. Vui lòng thử lại sau.");
        }

        setLoading(false);
      }
    };

    fetchBooks();
  }, [currentPage, search, apiEndpoint]);

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

  const booksToRender = Array.isArray(books) ? books : [];

  return (
    <div className="container">
      <div className="row g-4">
        {booksToRender.length === 0 ? (
          <p className="text-center fs-5">Không có sách nào được tìm thấy.</p>
        ) : (
          booksToRender.map((book) => {
            if (!book) return null;

            return (
              <div
                className="book-card col-6 col-md-4 col-xl-3 col-xxl-2"
                key={book.id || Math.random()}
              >
                <Link to={`/book/${book.id}`} className="text-decoration-none">
                  <div className="book-cover-container">
                    <div className="book-cover">
                      <img
                        src={book.image_url || ""}
                        alt={book.title || "Book cover"}
                        loading="lazy"
                        className="book-image"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/150x200?text=No+Image";
                        }}
                      />
                    </div>
                  </div>

                  <div className="book-info text-center mt-2">
                    <h6 className="book-title m-0" title={book.title || ""}>
                      {book.title
                        ? book.title.length > 20
                          ? book.title.slice(0, 20) + "..."
                          : book.title
                        : "Untitled"}
                    </h6>
                    <p
                      className="book-author text-muted small m-0"
                      title={book.author || ""}
                    >
                      {book.author
                        ? book.author.length > 30
                          ? book.author.slice(0, 30) + "..."
                          : book.author
                        : "Unknown author"}
                    </p>
                  </div>
                </Link>
              </div>
            );
          })
        )}
      </div>
      {apiEndpoint === "book" && totalPages > 1 ? (
        <Pagination currentPage={currentPageState} totalPages={totalPages} />
      ) : null}
    </div>
  );
}

export default BookList;
