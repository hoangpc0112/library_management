import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import EditBook from "../components/EditBook";
import BorrowRequest from "../components/BorrowRequest";
import Carousel from "../components/Carousel";

const SingleBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isBorrowing, setIsBorrowing] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { isAdmin, currentUser } = useAuth();
  const [borrowStatus, setBorrowStatus] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // Create a memoized axios instance
  const createAxiosInstance = useCallback(() => {
    const token = localStorage.getItem("token");
    return token
      ? axios.create({
          headers: { Authorization: `Bearer ${token}` },
        })
      : null;
  }, []);

  // Optimize book fetching
  const fetchBook = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/book/${id}`);
      setBook(response.data);
      setError(false);
    } catch (err) {
      setError(true);
      console.error("Lỗi khi lấy thông tin sách:", err);
    } finally {
      setLoading(false);
    }
  }, [API_URL, id]);

  // Optimize borrow status checking
  const checkBorrowStatus = useCallback(async () => {
    if (!currentUser) return;

    try {
      const axiosInstance = createAxiosInstance();
      if (!axiosInstance) return;

      const response = await axiosInstance.get(`${API_URL}/borrow/all`);
      const allRequests = response.data;

      const userBookRequests = allRequests.filter(
        (request) =>
          request.book_id === parseInt(id) && request.user_id === currentUser.id
      );

      const pendingRequest = userBookRequests.find(
        (request) => request.status === "pending"
      );
      const approvedRequest = userBookRequests.find(
        (request) => request.status === "approved"
      );

      const isBookBorrowedByOthers = allRequests.some(
        (request) =>
          request.book_id === parseInt(id) &&
          request.status === "approved" &&
          request.user_id !== currentUser.id &&
          ((request.actual_return_date === null &&
            new Date(request.return_date) > new Date()) ||
            (request.actual_return_date !== null &&
              new Date(request.actual_return_date) > new Date()))
      );

      if (pendingRequest) return "pending";
      if (approvedRequest) return "approved";
      if (isBookBorrowedByOthers) return "unavailable";
      return null;
    } catch (error) {
      console.error("Lỗi khi kiểm tra trạng thái mượn sách:", error);
      return null;
    }
  }, [API_URL, currentUser, id]);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch book data
  useEffect(() => {
    fetchBook();
  }, [fetchBook]);

  // Check borrow status
  useEffect(() => {
    if (currentUser) {
      checkBorrowStatus().then(setBorrowStatus);
    }
  }, [currentUser, checkBorrowStatus]);

  // Update document title
  useEffect(() => {
    document.title = book?.title || "Loading...";
  }, [book?.title]);

  // Memoize book description
  const bookDescription = useMemo(() => {
    if (!book) return null;
    return `${book.title} là một cuốn sách dài ${book.num_pages} trang được xuất bản bởi ${book.publisher} vào năm ${book.published_year}. Nó được viết bởi ${book.author} và đã nhận được đánh giá trung bình là ${book.average_rating}/5 từ ${book.ratings_count} độc giả.`;
  }, [book]);

  // Handle book deletion
  const handleDelete = useCallback(async () => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sách này không?")) return;

    try {
      setDeleteLoading(true);
      const axiosInstance = createAxiosInstance();
      if (!axiosInstance) throw new Error("Không tìm thấy token xác thực");

      await axiosInstance.delete(`${API_URL}/book/${id}`);
      navigate(-1);
    } catch (err) {
      console.error("Lỗi khi xóa sách:", err);
      alert(
        err.response?.data?.detail ||
          "Có lỗi xảy ra khi xóa sách. Vui lòng thử lại sau."
      );
      setDeleteLoading(false);
    }
  }, [API_URL, id, navigate, createAxiosInstance]);

  // Event handlers
  const handleEditSuccess = useCallback(() => {
    setIsEditing(false);
    fetchBook();
  }, [fetchBook]);

  const handleBorrow = useCallback(() => {
    if (!currentUser) {
      navigate("/login", { state: { from: `/book/${id}` } });
      return;
    }
    setIsBorrowing(true);
  }, [currentUser, navigate, id]);

  const handleBorrowSuccess = useCallback(() => {
    setIsBorrowing(false);
    setBorrowStatus("pending");
    alert("Yêu cầu mượn sách đã được gửi thành công! Chờ quản lý phê duyệt.");
  }, []);

  // Render loading state
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger p-4 shadow-sm">
          <h4 className="alert-heading">Lỗi khi tải sách</h4>
          <p>
            Chúng tôi không thể lấy thông tin sách vào lúc này. Vui lòng thử lại
            sau.
          </p>
        </div>
      </div>
    );
  }

  // Render edit mode
  if (isEditing) {
    return (
      <div className="container my-4">
        <EditBook
          book={book}
          onCancel={() => setIsEditing(false)}
          onSuccess={handleEditSuccess}
        />
      </div>
    );
  }

  // Render borrow mode
  if (isBorrowing) {
    return (
      <div className="container my-4">
        <BorrowRequest
          bookId={id}
          onCancel={() => setIsBorrowing(false)}
          onSuccess={handleBorrowSuccess}
        />
      </div>
    );
  }

  // Render book details
  return (
    <div className="container my-4">
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="row g-4">
            <div className="col-lg-4 col-md-5">
              <div className="position-relative">
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
              <hr className="mt-0" />
              <p className="mb-2">{bookDescription}</p>
              <p>
                Cuốn sách này hoàn hảo cho những độc giả yêu thích các tác phẩm
                của {book.author} và đang tìm kiếm một cuốn sách chất lượng được
                đánh giá cao bởi độc giả.
              </p>
              <div className="d-flex justify-content-between gap-3">
                {borrowStatus === "pending" ? (
                  <button className="btn btn-secondary flex-grow-1" disabled>
                    Yêu cầu mượn đang chờ phê duyệt
                  </button>
                ) : borrowStatus === "approved" ? (
                  <button className="btn btn-success flex-grow-1" disabled>
                    Bạn đang mượn cuốn sách này
                  </button>
                ) : borrowStatus === "unavailable" ? (
                  <button
                    onClick={handleBorrow}
                    className="btn btn-secondary flex-grow-1 disabled"
                  >
                    Sách đang được mượn bởi người khác
                  </button>
                ) : (
                  <button
                    onClick={handleBorrow}
                    className="btn btn-primary flex-grow-1"
                  >
                    Mượn sách
                  </button>
                )}
                {book.gg_drive_link && (
                  <button
                    className="btn btn-secondary flex-grow-1"
                    onClick={() => window.open(book.gg_drive_link, "_blank")}
                  >
                    Xem trước
                  </button>
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
            <hr className="container border-2 mt-5" />
            <Carousel
              title="Có thể bạn cũng thích"
              endpoint={`${API_URL}/recommendation/${id}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(SingleBook);
