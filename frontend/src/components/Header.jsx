import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import logo from "../assets/images/logo.png";
import { useAuth } from "../contexts/AuthContext";

function Header() {
  const { isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Đăng xuất khỏi tài khoản hiện tại?");
    if (confirmLogout) {
      logout();
      navigate("/login");
    }
  };

  return (
    <nav className="navbar navbar-expand-md border-bottom shadow-sm">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img
            src={logo}
            alt="Logo"
            width="40"
            height="40"
            className="d-inline-block align-top rounded-circle"
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-md-0">
            <li className="nav-item ms-md-4">
              <Link className="nav-link" to="/">
                Trang chủ
              </Link>
            </li>
            <li className="nav-item ms-md-4">
              <Link className="nav-link" to="/book">
                Thư viện sách
              </Link>
            </li>
            <li className="nav-item ms-md-4">
              <Link className="nav-link" to="/borrowed">
                Sách đã mượn
              </Link>
            </li>
            <li className="nav-item ms-md-4">
              <Link className="nav-link" to="/about-us">
                Về chúng tôi
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center justify-content-between gap-4">
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="dropdown">
                <a
                  href="#"
                  className="d-flex align-items-center"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={
                      "https://i.pinimg.com/736x/21/91/6e/21916e491ef0d796398f5724c313bbe7.jpg"
                    }
                    alt="Avatar"
                    width="32"
                    height="32"
                    className="rounded-circle me-2"
                  />
                </a>
                <ul className="dropdown-menu dropdown-menu-end text-small shadow">
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      Hồ sơ
                    </Link>
                  </li>
                  {isAdmin() && (
                    <li>
                      <Link className="dropdown-item" to="/admin">
                        Quản trị
                      </Link>
                    </li>
                  )}
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="dropdown-item text-danger"
                    >
                      Đăng xuất
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link className="nav-link" to="/login">
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
