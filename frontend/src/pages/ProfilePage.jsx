import { useEffect, useState } from "react";
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

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentBorrows, setCurrentBorrows] = useState([]);
  const [booksData, setBooksData] = useState({});
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Hồ sơ sinh viên";

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const borrowResponse = await axios.get(`${API_URL}/borrow/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const activeBorrows = borrowResponse.data.filter(
          (borrow) => borrow.status === "approved"
        );

        const returnedBorrows = borrowResponse.data.filter(
          (borrow) => borrow.status === "returned"
        );

        const bookIds = [...activeBorrows, ...returnedBorrows].map(
          (item) => item.book_id
        );
        const uniqueBookIds = [...new Set(bookIds)];

        const booksInfo = {};

        await Promise.all(
          uniqueBookIds.map(async (bookId) => {
            try {
              const bookResponse = await axios.get(`${API_URL}/book/${bookId}`);
              booksInfo[bookId] = bookResponse.data;
            } catch (err) {
              booksInfo[bookId] = { title: `Sách #${bookId}` };
            }
          })
        );

        setBooksData(booksInfo);

        setUserData({
          ...response.data,
          avatar:
            "https://i.pinimg.com/736x/21/91/6e/21916e491ef0d796398f5724c313bbe7.jpg",
          borrowedBooks: activeBorrows.length,
          returnedBooks: returnedBorrows.length,
          createdAt: formatCreatedAt(response.data.created_at),
        });

        setCurrentBorrows(activeBorrows);
        setLoading(false);
      } catch (err) {
        setError("Không thể tải thông tin người dùng. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const formatCreatedAt = (createdAt) => {
    if (!createdAt) return "";
    const date = new Date(createdAt);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  const getBookStatus = (returnDate) => {
    const dueDate = new Date(returnDate);
    const today = new Date();
    const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

    if (daysLeft <= 0) {
      return {
        class: "bg-danger",
        text: "Quá hạn",
      };
    } else if (daysLeft <= 3) {
      return {
        class: "bg-warning",
        text: "Sắp hết hạn",
      };
    } else {
      return {
        class: "bg-success",
        text: "Còn hạn",
      };
    }
  };

  const getAccountStatus = () => {
    const overdue = currentBorrows.some((book) => {
      const dueDate = new Date(book.return_date);
      const today = new Date();
      return dueDate < today;
    });

    if (overdue) {
      return {
        class: "text-danger",
        text: "Có sách quá hạn",
        icon: "bi bi-exclamation-circle",
      };
    } else {
      return {
        class: "text-success",
        text: "Tốt",
        icon: "bi bi-check-circle",
      };
    }
  };

  const getBookTitle = (bookId) => {
    if (booksData[bookId]) {
      return booksData[bookId].title;
    }
    return `Sách #${bookId}`;
  };

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
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  const accountStatus = getAccountStatus();

  return (
    <div className="min-vh-100 py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 mb-4">
            <div className="card border-0 shadow-sm rounded-3">
              <div className="card-body text-center p-4">
                <div className="mb-4">
                  <img
                    src={userData.avatar}
                    alt="Avatar"
                    className="rounded-circle img-thumbnail shadow"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <h2 className="fw-bold">{userData.full_name}</h2>
                <div className="text-muted">{userData.msv}</div>
              </div>
              <hr className="my-0" />
              <div className="card-body p-4">
                <h5 className="mb-3 fw-bold text-primary">Thông tin cá nhân</h5>
                <div className="mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <FaEnvelope className="text-primary me-2" />
                    <div className="text-muted small">Email</div>
                  </div>
                  <div>{userData.email}</div>
                </div>
                <div className="mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <FaIdCard className="text-primary me-2" />
                    <div className="text-muted small">Mã sinh viên</div>
                  </div>
                  <div>{userData.msv}</div>
                </div>
                <div className="mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <FaBook className="text-primary me-2" />
                    <div className="text-muted small">Khoa</div>
                  </div>
                  <div>{userData.faculty}</div>
                </div>
                <div className="mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <FaGraduationCap className="text-primary me-2" />
                    <div className="text-muted small">Ngành</div>
                  </div>
                  <div>{userData.major}</div>
                </div>
                <div className="mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <FaBirthdayCake className="text-primary me-2" />
                    <div className="text-muted small">Năm sinh</div>
                  </div>
                  <div>{userData.birth_year}</div>
                </div>
                <div>
                  <div className="d-flex align-items-center mb-2">
                    <FaHistory className="text-primary me-2" />
                    <div className="text-muted small">Ngày tham gia</div>
                  </div>
                  <div>{userData.createdAt}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="row mb-4">
              <div className="col-md-4 mb-3 mb-md-0">
                <div className="card border-0 bg-primary bg-opacity-10 h-100">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-primary rounded-3 p-3 me-3">
                        <FaBook className="text-white" />
                      </div>
                      <h5 className="card-title mb-0">Sách đang mượn</h5>
                    </div>
                    <h2 className="display-4 fw-bold mb-0">
                      {userData.borrowedBooks}
                    </h2>
                    <p className="text-muted mt-2 mb-0">
                      Trên tổng 5 quyển tối đa
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-3 mb-md-0">
                <div className="card border-0 bg-success bg-opacity-10 h-100">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-success rounded-3 p-3 me-3">
                        <FaHistory className="text-white" />
                      </div>
                      <h5 className="card-title mb-0">Sách đã trả</h5>
                    </div>
                    <h2 className="display-4 fw-bold mb-0">
                      {userData.returnedBooks}
                    </h2>
                    <p className="text-muted mt-2 mb-0">Trong học kỳ này</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border-0 bg-warning bg-opacity-10 h-100">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-warning rounded-3 p-3 me-3">
                        <FaShieldAlt className="text-white" />
                      </div>
                      <h5 className="card-title mb-0">Trạng thái</h5>
                    </div>
                    <h3 className={`${accountStatus.class} fw-bold mb-0`}>
                      <i className={`${accountStatus.icon} me-2`}></i>
                      {accountStatus.text}
                    </h3>
                    <p className="text-muted mt-2 mb-0">
                      {accountStatus.text === "Tốt"
                        ? "Không có sách quá hạn"
                        : "Vui lòng trả sách đúng hạn"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm rounded-3 mb-4">
              <div className="card-header border-0 pt-4 pb-3">
                <h4 className="mb-0 fw-bold">Sách đang mượn</h4>
              </div>
              <div className="card-body p-0">
                {currentBorrows.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table mb-0 table-hover">
                      <thead className="table">
                        <tr>
                          <th scope="col">#</th>
                          <th
                            scope="col"
                            style={{
                              maxWidth: "200px",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
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
                              <th scope="row">{index + 1}</th>
                              <td
                                style={{
                                  maxWidth: "200px",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {getBookTitle(book.book_id)}
                              </td>
                              <td>{formatDate(book.borrow_date)}</td>
                              <td>{formatDate(book.return_date)}</td>
                              <td>
                                <span className={`badge ${status.class}`}>
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
                    <div className="text-muted">
                      <i className="bi bi-book fs-1 d-block mb-3"></i>
                      <h5>Bạn chưa mượn sách nào</h5>
                      <p>Hãy tìm và mượn sách từ thư viện</p>
                      <Link to="/book" className="btn btn-primary">
                        <i className="bi bi-search me-1"></i> Tìm sách
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              <div className="card-footer border-0 py-3">
                <Link to="/borrowed" className="btn btn-outline-primary">
                  <i className="bi bi-list me-1"></i> Xem lịch sử mượn sách
                </Link>
              </div>
            </div>

            <div className="card border-0 shadow-sm rounded-3">
              <div className="card-header border-0 pt-4 pb-3">
                <h4 className="mb-0 fw-bold">Cài đặt tài khoản</h4>
              </div>
              <div className="card-body">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="emailNotifications"
                        defaultChecked
                      />
                      <label
                        className="form-check-label"
                        htmlFor="emailNotifications"
                      >
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
                <button className="btn btn-primary me-2">
                  <i className="bi bi-lock me-1"></i> Đổi mật khẩu
                </button>
                <button className="btn btn-outline-secondary">
                  <i className="bi bi-sliders me-1"></i> Cài đặt nâng cao
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
