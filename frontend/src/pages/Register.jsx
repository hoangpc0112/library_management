import { useState } from "react";
import logo from "../assets/images/logo.png";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in with", { username, password });
  };

  return (
    <div className="mt-5 d-flex justify-content-center align-items-center">
      <div className="p-4 shadow-sm" style={{ width: "350px" }}>
        <img
          src={logo}
          alt="Logo"
          width={90}
          height={90}
          className="justify-content-center d-block mx-auto"
        />
        <h5 className="text-center fw-light mb-0">Đăng nhập</h5>
        <h3 className="text-center mb-4">PTIT Library</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Tài khoản</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Mật khẩu</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="rememberMe"
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="rememberMe">
                Ghi nhớ
              </label>
            </div>
            <a href="#" className="text-primary text-decoration-none">
              Quên mật khẩu ?
            </a>
          </div>
          <button type="submit" className="btn btn-primary w-100 mb-2">
            Đăng nhập
          </button>
          <div className="text-center">
            <span>Chưa có tài khoản? </span>
            <a href="#" className="text-primary text-decoration-none">
              Đăng ký
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
