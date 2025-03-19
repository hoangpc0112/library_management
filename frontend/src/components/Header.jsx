import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import logo from "../assets/images/logo.png";
import { useAuth } from "../contexts/AuthContext";

function Header() {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Đăng xuất khỏi tài khoản hiện tại ?");
    if (confirmLogout) {
      logout();
      navigate("/login");
    }
  };

  return (
    <nav className="navbar navbar-expand-md border-bottom">
      <div className="container">
        <ul className="navbar-nav flex-grow-1 justify-content-between align-items-center">
          <Link className="navbar-brand" to="/">
            <img
              src={logo}
              alt="Logo"
              width="40"
              height="40"
              className="d-inline-block align-top rounded-circle"
            />
          </Link>
          <li className="nav-item">
            <Link className="nav-link" to="/">
              <i className="fas fa-home"></i> Trang chủ
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/book">
              <i className="fas fa-book"></i> Thư viện sách
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/borrowed">
              <i className="fas fa-book-reader"></i> Sách đã mượn
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/about-us">
              <i className="fas fa-envelope"></i> Về chúng tôi
            </Link>
          </li>
          <li className="nav-item">
            <ThemeToggle />
          </li>

          {isAuthenticated ? (
            <div className="dropdown text-end d-flex align-items-center justify-content-center">
              <a
                href="#"
                className="d-block link-body-emphasis text-decoration-none"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src={
                    currentUser?.avatar ||
                    "https://i.pinimg.com/736x/21/91/6e/21916e491ef0d796398f5724c313bbe7.jpg"
                  }
                  alt="avt"
                  width="32"
                  height="32"
                  className="rounded-circle"
                />
              </a>
              <ul className="dropdown-menu text-small">
                <li>
                  <Link className="dropdown-item" to="/profile">
                    Hồ sơ
                  </Link>
                </li>
                {currentUser?.is_admin ? (
                  <li>
                    <Link className="dropdown-item" to="/admin">
                      Quản trị
                    </Link>
                  </li>
                ) : null}
                <li>
                  <button onClick={handleLogout} className="dropdown-item">
                    Đăng xuất
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="d-flex gap-2">
              <Link className="nav-link" to="/login">
                <i className="fas fa-sign-in-alt"></i> Đăng nhập
              </Link>
            </div>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Header;
