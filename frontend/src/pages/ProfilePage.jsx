import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import {
  FaEnvelope,
  FaIdCard,
  FaBook,
  FaHistory,
  FaShieldAlt,
  FaGraduationCap,
  FaBirthdayCake,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${date.getFullYear()}`;
};

const getBookStatus = (returnDate) => {
  if (!returnDate) return { class: "bg-secondary", text: "N/A" };
  const dueDate = new Date(returnDate);
  const today = new Date();
  const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

  if (daysLeft <= 0) {
    return { class: "bg-danger", text: `Quá hạn` };
  } else if (daysLeft <= 3) {
    return { class: "bg-warning", text: "Sắp hết hạn" };
  } else {
    return { class: "bg-success", text: "Còn hạn" };
  }
};

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile({
        ...response.data,
        user: {
          ...response.data.user,
          createdAt: formatDate(response.data.user.created_at),
          avatar:
            "https://i.pinimg.com/736x/21/91/6e/21916e491ef0d796398f5724c313bbe7.jpg",
        },
      });
      setError(null);
    } catch (err) {
      setError(
        "Không thể tải thông tin hồ sơ: " +
          (err.response?.data?.detail || err.message || "Lỗi không xác định")
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    document.title = "Hồ sơ sinh viên";
    window.scrollTo(0, 0);
    fetchProfile();
  }, [fetchProfile]);

  const accountStatus = useMemo(() => {
    const overdue = profile?.current_borrows?.some(
      (borrow) => new Date(borrow.return_date) < new Date()
    );
    return overdue
      ? {
          class: "text-danger",
          text: "Có sách quá hạn",
          icon: "bi bi-exclamation-circle",
        }
      : { class: "text-success", text: "Tốt", icon: "bi bi-check-circle" };
  }, [profile]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!profile) return null;

  return (
    <div className="min-vh-100 py-5">
      <div className="container">
        <div className="row g-4">
          <ProfileCard user={profile.user} />
          <div className="col-lg-8">
            <UserStatistics
              borrowedBooks={profile.borrowed_books_count}
              returnedBooks={profile.returned_books_count}
              accountStatus={accountStatus}
            />
            <BorrowedBooksList currentBorrows={profile.current_borrows} />
            <AccountSettings />
          </div>
        </div>
      </div>
    </div>
  );
};

const LoadingSpinner = () => (
  <div
    className="d-flex justify-content-center align-items-center"
    style={{ minHeight: "100vh" }}
  >
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Đang tải...</span>
    </div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="min-vh-100 d-flex justify-content-center align-items-center">
    <div
      className="alert alert-danger alert-dismissible fade show rounded-3"
      style={{ maxWidth: "800px" }}
    >
      {message}
      <button
        type="button"
        className="btn-close"
        onClick={() => window.location.reload()}
      />
    </div>
  </div>
);

const ProfileCard = ({ user }) => (
  <div className="col-lg-4">
    <div className="card border-0 shadow-sm rounded-3">
      <div className="card-body text-center p-4">
        <img
          src={user.avatar}
          alt="Avatar"
          className="rounded-circle img-thumbnail shadow mb-4"
          style={{ width: "150px", height: "150px", objectFit: "cover" }}
        />
        <h2 className="fw-bold">{user.full_name}</h2>
        <div className="text-muted">{user.msv}</div>
      </div>
      <hr className="my-0" />
      <div className="card-body p-4">
        <h5 className="mb-3 fw-bold text-primary">Thông tin cá nhân</h5>
        {[
          { icon: FaEnvelope, label: "Email", value: user.email },
          { icon: FaIdCard, label: "Mã sinh viên", value: user.msv },
          { icon: FaBook, label: "Khoa", value: user.faculty },
          { icon: FaGraduationCap, label: "Ngành", value: user.major },
          { icon: FaBirthdayCake, label: "Năm sinh", value: user.birth_year },
          { icon: FaHistory, label: "Ngày tham gia", value: user.createdAt },
        ].map(({ icon: Icon, label, value }, index) => (
          <div className="mb-3" key={index}>
            <div className="d-flex align-items-center mb-2">
              <Icon className="text-primary me-2" />
              <div className="text-muted small">{label}</div>
            </div>
            <div>{value || "N/A"}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const UserStatistics = ({ borrowedBooks, returnedBooks, accountStatus }) => (
  <div className="row g-4 mb-4">
    {[
      {
        title: "Sách đang mượn",
        value: borrowedBooks,
        icon: FaBook,
        color: "primary",
      },
      {
        title: "Sách đã trả",
        value: returnedBooks,
        icon: FaHistory,
        color: "success",
      },
      {
        title: "Trạng thái",
        value: accountStatus.text,
        icon: FaShieldAlt,
        color: "warning",
        customClass: accountStatus.class,
      },
    ].map(({ title, value, icon: Icon, color, customClass }, index) => (
      <div className="col-md-4" key={index}>
        <div
          className={`card border-0 bg-${color} bg-opacity-10 h-100 shadow-sm rounded-3`}
        >
          <div className="card-body p-4">
            <div className="d-flex align-items-center mb-3">
              <div className={`bg-${color} rounded-3 p-3 me-3`}>
                <Icon className="text-white" />
              </div>
              <h5 className="card-title mb-0">{title}</h5>
            </div>
            <h3 className={`fw-bold mb-0 ${customClass || ""}`}>
              {index === 2 && <i className={`${accountStatus.icon} me-2`}></i>}
              {value}
            </h3>
            <p className="text-muted mt-2 mb-0">
              {index === 0 || index === 1
                ? "Trong học kỳ này"
                : accountStatus.text === "Tốt"
                ? "Không có sách quá hạn"
                : "Vui lòng trả sách đúng hạn"}
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const BorrowedBooksList = ({ currentBorrows }) => (
  <div className="card border-0 shadow-sm rounded-3 mb-4">
    <div className="card-header border-0 pt-4 pb-3">
      <h4 className="mb-0 fw-bold">Sách đang mượn</h4>
    </div>
    <div className="card-body p-0">
      {currentBorrows.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col" style={{ maxWidth: "200px" }}>
                  Tên sách
                </th>
                <th scope="col">Ngày mượn</th>
                <th scope="col">Hạn trả</th>
                <th scope="col">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {currentBorrows.map((book, index) => {
                const status = getBookStatus(book.return_date);
                return (
                  <tr key={book.id}>
                    <td>{index + 1}</td>
                    <td
                      className="text-truncate"
                      style={{ maxWidth: "200px" }}
                      title={book.book.title}
                    >
                      {book.book.title}
                    </td>
                    <td>{formatDate(book.borrow_date)}</td>
                    <td>{formatDate(book.return_date)}</td>
                    <td>
                      <span className={`badge ${status.class} px-3 py-2`}>
                        {status.text}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-5">
          <i className="bi bi-book fs-1 text-muted d-block mb-3"></i>
          <h5 className="text-muted">Bạn chưa mượn sách nào</h5>
          <p className="text-muted">Hãy tìm và mượn sách từ thư viện</p>
          <Link to="/book" className="btn btn-primary px-4">
            <i className="bi bi-search me-2"></i>Tìm sách
          </Link>
        </div>
      )}
    </div>
    <div className="card-footer border-0 py-3">
      <Link to="/borrowed" className="btn btn-outline-primary px-4">
        <i className="bi bi-list me-2"></i>Xem lịch sử mượn sách
      </Link>
    </div>
  </div>
);

const AccountSettings = () => (
  <div className="card border-0 shadow-sm rounded-3">
    <div className="card-header border-0 pt-4 pb-3">
      <h4 className="mb-0 fw-bold">Cài đặt tài khoản</h4>
    </div>
    <div className="card-body p-4">
      <div className="row g-4">
        <div className="col-md-6">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="emailNotifications"
              defaultChecked
            />
            <label className="form-check-label" htmlFor="emailNotifications">
              Thông báo qua email
            </label>
            <div className="text-muted small">
              Nhận email khi sách sắp đến hạn trả
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="newArrivals"
              defaultChecked
            />
            <label className="form-check-label" htmlFor="newArrivals">
              Sách mới
            </label>
            <div className="text-muted small">
              Nhận thông báo về sách mới trong lĩnh vực quan tâm
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="card-footer border-0 py-3">
      <button className="btn btn-primary px-4 me-2">
        <i className="bi bi-lock me-2"></i>Đổi mật khẩu
      </button>
      <button className="btn btn-outline-secondary px-4">
        <i className="bi bi-sliders me-2"></i>Cài đặt nâng cao
      </button>
    </div>
  </div>
);

export default ProfilePage;
