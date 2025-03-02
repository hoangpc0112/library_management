import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import logo from "../assets/images/logo.png";

function Header() {
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
          <div className="dropdown text-end d-flex align-items-center justify-content-center">
            <a
              href="#"
              className="d-block link-body-emphasis text-decoration-none dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src="https://cdn4.iconfinder.com/data/icons/instagram-ui-twotone/48/Paul-18-512.png"
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
              <li>
                <Link className="dropdown-item" to="/logout">
                  Đăng xuất
                </Link>
              </li>
            </ul>
          </div>
        </ul>
      </div>
    </nav>
  );
}

export default Header;
