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

  const [currentBorrows] = useState([
    {
      id: 1,
      title: "Lập trình Python cơ bản",
      borrowDate: "12/02/2025",
      dueDate: "26/02/2025",
    },
    {
      id: 2,
      title: "Cấu trúc dữ liệu và giải thuật",
      borrowDate: "05/03/2025",
      dueDate: "19/03/2025",
    },
    {
      id: 3,
      title: "Mạng máy tính",
      borrowDate: "10/03/2025",
      dueDate: "24/03/2025",
    },
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Hồ sơ sinh viên";

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const response = await axios.get("http://localhost:8000/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData({
          ...response.data,
          avatar:
            "https://i.pinimg.com/736x/21/91/6e/21916e491ef0d796398f5724c313bbe7.jpg",
          borrowedBooks: 3,
          returnedBooks: 8,
          createdAt: formatCreatedAt(response.data.created_at),
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user profile:", err);
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

  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
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

  return (
    <div className="min-vh-100 py-5">
      <div className="container">
        <div className="row mb-5">
          <div className="col-12">
            <div className="bg-primary text-white rounded-3 p-4 shadow">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h1 className="display-5 fw-bold">Hồ sơ sinh viên</h1>
                  <p className="lead mb-0">
                    Quản lý thông tin cá nhân và theo dõi hoạt động mượn trả
                    sách tại thư viện PTIT
                  </p>
                </div>
                <div className="col-md-4 text-md-end mt-3 mt-md-0">
                  <button className="btn btn-outline-light me-2">
                    <i className="bi bi-pencil-square me-1"></i> Cập nhật thông
                    tin
                  </button>
                  {userData.is_admin ? (
                    <Link to="/admin" className="btn btn-outline-light me-2">
                      <i className="bi bi-pencil-square me-1"></i> Quản lý
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>

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
                    <h3 className="text-success fw-bold mb-0">
                      <i className="bi bi-check-circle me-2"></i>
                      Tốt
                    </h3>
                    <p className="text-muted mt-2 mb-0">
                      Không có sách quá hạn
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
                <div className="table-responsive">
                  <table className="table mb-0 table-hover">
                    <thead className="table">
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Tên sách</th>
                        <th scope="col">Ngày mượn</th>
                        <th scope="col">Hạn trả</th>
                        <th scope="col">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentBorrows.map((book, index) => {
                        const dueDate = new Date(
                          book.dueDate.split("/").reverse().join("-")
                        );
                        const today = new Date();
                        const daysLeft = Math.ceil(
                          (dueDate - today) / (1000 * 60 * 60 * 24)
                        );

                        let statusClass = "bg-success";
                        let statusText = "Còn hạn";

                        if (daysLeft <= 3) {
                          statusClass = "bg-warning";
                          statusText = "Sắp hết hạn";
                        }

                        if (daysLeft <= 0) {
                          statusClass = "bg-danger";
                          statusText = "Quá hạn";
                        }

                        return (
                          <tr key={book.id}>
                            <th scope="row">{index + 1}</th>
                            <td>{book.title}</td>
                            <td>{book.borrowDate}</td>
                            <td>{book.dueDate}</td>
                            <td>
                              <span className={`badge ${statusClass}`}>
                                {statusText}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="card-footer border-0 py-3">
                <button className="btn btn-outline-primary">
                  <i className="bi bi-list me-1"></i> Xem lịch sử mượn sách
                </button>
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
