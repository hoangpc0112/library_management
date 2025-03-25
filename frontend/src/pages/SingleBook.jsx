import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import EditBook from "../components/EditBook";
import BorrowRequest from "../components/BorrowRequest";
import Carousel from "../components/Carousel";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const STATUS_MESSAGES = {
  pending: "Yêu cầu mượn đang chờ phê duyệt",
  approved: "Bạn đang mượn cuốn sách này",
  unavailable: "Sách đang được mượn bởi người khác",
  default: "Mượn sách",
};

const SingleBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin, currentUser } = useAuth();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isBorrowing, setIsBorrowing] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [borrowStatus, setBorrowStatus] = useState(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const getAxiosInstance = useCallback(() => {
    const token = localStorage.getItem("token");
    return axios.create({
      baseURL: API_URL,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }, []);

  const fetchBook = useCallback(async () => {
    try {
      setLoading(true);
      const axiosInstance = getAxiosInstance();
      const response = await axiosInstance.get(`/book/${id}`);
      setBook(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || "Lỗi khi lấy thông tin sách");
      console.error("Fetch book error:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const checkBorrowStatus = useCallback(async () => {
    if (!currentUser) return;

    try {
      const axiosInstance = getAxiosInstance();
      const response = await axiosInstance.get("/borrow/all");
      const requests = response.data;

      const userRequests = requests.filter(
        (req) => req.book_id === parseInt(id) && req.user_id === currentUser.id
      );
      const pending = userRequests.find((req) => req.status === "pending");
      const approved = userRequests.find((req) => req.status === "approved");
      const isBorrowedByOthers = requests.some(
        (req) =>
          req.book_id === parseInt(id) &&
          req.status === "approved" &&
          req.user_id !== currentUser.id &&
          ((req.actual_return_date === null &&
            new Date(req.return_date) > new Date()) ||
            (req.actual_return_date &&
              new Date(req.actual_return_date) > new Date()))
      );

      setBorrowStatus(
        pending
          ? "pending"
          : approved
          ? "approved"
          : isBorrowedByOthers
          ? "unavailable"
          : null
      );
    } catch (err) {
      console.error("Borrow status check error:", err);
    }
  }, [currentUser, id]);

  const handleDelete = useCallback(async () => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sách này không?")) return;

    try {
      setDeleteLoading(true);
      const axiosInstance = getAxiosInstance();
      await axiosInstance.delete(`/book/${id}`);
      navigate(-1);
    } catch (err) {
      alert(err.response?.data?.detail || "Lỗi khi xóa sách");
      console.error("Delete book error:", err);
    } finally {
      setDeleteLoading(false);
    }
  }, [id, navigate]);

  const handleBorrow = useCallback(() => {
    if (!currentUser) {
      navigate("/login", { state: { from: `/book/${id}` } });
      return;
    }
    setIsBorrowing(true);
  }, [currentUser, id, navigate]);

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBook();
  }, [fetchBook]);

  useEffect(() => {
    if (currentUser) checkBorrowStatus();
  }, [currentUser, checkBorrowStatus]);

  useEffect(() => {
    document.title = book?.title || "Loading...";
  }, [book?.title]);

  useEffect(() => {
    const handleScreenSize = () => {
      setIsDescriptionExpanded(window.innerWidth >= 992);
    };

    handleScreenSize();
    window.addEventListener("resize", handleScreenSize);
    return () => window.removeEventListener("resize", handleScreenSize);
  }, []);

  const handleEditSuccess = () => {
    setIsEditing(false);
    fetchBook();
  };

  const handleBorrowSuccess = () => {
    setIsBorrowing(false);
    setBorrowStatus("pending");
    alert("Yêu cầu mượn sách đã được gửi thành công!");
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "50vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger p-4 shadow-sm">
          <h4 className="alert-heading">Lỗi</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={fetchBook}>
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (isEditing)
    return (
      <EditBook
        book={book}
        onCancel={() => setIsEditing(false)}
        onSuccess={handleEditSuccess}
      />
    );
  if (isBorrowing)
    return (
      <BorrowRequest
        bookId={id}
        onCancel={() => setIsBorrowing(false)}
        onSuccess={handleBorrowSuccess}
      />
    );

  const fullDescription = (
    <>
      {book.title} là một cuốn sách dài {book.num_pages} trang được xuất bản bởi{" "}
      {book.publisher} vào năm {book.published_year}. Tác phẩm này được sáng tác
      bởi {book.author}, một tác giả nổi tiếng với phong cách viết độc đáo và
      sâu sắc. Cuốn sách không chỉ gây ấn tượng với độ dài mà còn bởi nội dung
      chất lượng, nhận được đánh giá trung bình {book.average_rating}/5 từ{" "}
      {book.ratings_count} độc giả trên toàn thế giới. Đây là minh chứng cho sức
      hút và giá trị mà nó mang lại, khiến {book.title} trở thành lựa chọn không
      thể bỏ qua đối với những ai đam mê khám phá tri thức hoặc đắm mình trong
      những câu chuyện đầy cảm hứng.
    </>
  );

  const shortDescription = `${book.title} là một cuốn sách dài ${book.num_pages} trang của ${book.author}, được xuất bản bởi ${book.publisher} năm ${book.published_year}.`;

  return (
    <div className="container my-4">
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="row g-4">
            <div className="col-lg-4 col-md-5">
              <img
                src={book.image_url}
                alt={book.title}
                className="img-fluid rounded shadow"
                style={{
                  maxHeight: "600px",
                  width: "100%",
                  objectFit: "cover",
                }}
                loading="lazy"
              />
            </div>
            <div className="col-lg-8 col-md-7">
              <h1 className="h2 fw-bold mb-1">{book.title}</h1>
              <p className="text-primary mb-2 h5">{book.author}</p>
              <hr />
              <div className="row">
                <div className="col-md-6">
                  <p>
                    <strong>Nhà xuất bản:</strong> {book.publisher}
                  </p>
                  <p>
                    <strong>Số trang:</strong> {book.num_pages}
                  </p>
                </div>
                <div className="col-md-6">
                  <p>
                    <strong>Năm xuất bản:</strong> {book.published_year}
                  </p>
                  <p>
                    <strong>Đánh giá:</strong> {book.average_rating}/5 (
                    {book.ratings_count} đánh giá)
                  </p>
                </div>
              </div>
              <hr />
              <div className="mb-3">
                <p
                  className={`mb-2 transition-all duration-300 ${
                    isDescriptionExpanded ? "" : "line-clamp-2"
                  }`}
                  style={{
                    maxHeight: isDescriptionExpanded ? "none" : "3em",
                    overflow: "hidden",
                  }}
                >
                  {isDescriptionExpanded ? fullDescription : shortDescription}
                </p>
                <button
                  className="btn btn-link p-0 text-decoration-none d-lg-none"
                  onClick={toggleDescription}
                >
                  {isDescriptionExpanded ? "Thu gọn" : "Xem thêm"}
                </button>
              </div>
              <div className="d-flex flex-wrap gap-3">
                <button
                  onClick={handleBorrow}
                  className={`btn flex-grow-1 ${
                    borrowStatus ? "btn-secondary" : "btn-primary"
                  }`}
                  disabled={!!borrowStatus}
                >
                  {STATUS_MESSAGES[borrowStatus] || STATUS_MESSAGES.default}
                </button>
                {book.gg_drive_link && (
                  <a
                    href={book.gg_drive_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary flex-grow-1"
                  >
                    Xem trước
                  </a>
                )}
                {isAdmin() && (
                  <>
                    <button
                      className="btn btn-warning flex-grow-1"
                      onClick={() => setIsEditing(true)}
                    >
                      Sửa thông tin
                    </button>
                    <button
                      className="btn btn-danger flex-grow-1"
                      onClick={handleDelete}
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? "Đang xóa..." : "Xóa sách"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          <hr className="my-5" />
          <Carousel
            title="Có thể bạn cũng thích"
            endpoint={`${API_URL}/recommendation/${id}`}
          />
        </div>
      </div>
    </div>
  );
};

export default SingleBook;
