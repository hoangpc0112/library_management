import React from "react";

function Footer() {
  return (
    <footer className="bg-dark py-5 mt-5 border-top">
      <div className="container px-4 px-md-5">
        <div className="row gy-4 gy-md-0">
          <div className="col-12 col-md-3">
            <h3 className="fw-bold mb-3">Thư viện PTIT</h3>
            <p className="text-muted mb-0">
              Học viện Công nghệ Bưu chính Viễn thông (PTIT)
            </p>
            <small className="text-muted d-block mt-2">
              © {new Date().getFullYear()} PTIT Library
            </small>
          </div>

          <div className="col-6 col-md-2">
            <h5 className="fw-semibold mb-3">Danh mục sách</h5>
            <ul className="list-unstyled">
              <li>
                <a
                  className="link-secondary text-decoration-none d-block mb-2"
                  href="#"
                >
                  Giáo trình
                </a>
              </li>
              <li>
                <a
                  className="link-secondary text-decoration-none d-block mb-2"
                  href="#"
                >
                  Sách chuyên ngành
                </a>
              </li>
              <li>
                <a
                  className="link-secondary text-decoration-none d-block mb-2"
                  href="#"
                >
                  Tài liệu nghiên cứu
                </a>
              </li>
              <li>
                <a
                  className="link-secondary text-decoration-none d-block mb-2"
                  href="#"
                >
                  Sách kỹ năng mềm
                </a>
              </li>
              <li>
                <a
                  className="link-secondary text-decoration-none d-block mb-2"
                  href="#"
                >
                  Tạp chí khoa học
                </a>
              </li>
            </ul>
          </div>

          <div className="col-6 col-md-2">
            <h5 className="fw-semibold mb-3">Tài nguyên</h5>
            <ul className="list-unstyled">
              <li>
                <a
                  className="link-secondary text-decoration-none d-block mb-2"
                  href="#"
                >
                  Cơ sở dữ liệu trực tuyến
                </a>
              </li>
              <li>
                <a
                  className="link-secondary text-decoration-none d-block mb-2"
                  href="#"
                >
                  Thư viện số
                </a>
              </li>
              <li>
                <a
                  className="link-secondary text-decoration-none d-block mb-2"
                  href="#"
                >
                  Hướng dẫn tra cứu
                </a>
              </li>
              <li>
                <a
                  className="link-secondary text-decoration-none d-block mb-2"
                  href="#"
                >
                  Câu hỏi thường gặp
                </a>
              </li>
            </ul>
          </div>

          <div className="col-6 col-md-2">
            <h5 className="fw-semibold mb-3">Dịch vụ</h5>
            <ul className="list-unstyled">
              <li>
                <a
                  className="link-secondary text-decoration-none d-block mb-2"
                  href="#"
                >
                  Mượn - trả sách
                </a>
              </li>
              <li>
                <a
                  className="link-secondary text-decoration-none d-block mb-2"
                  href="#"
                >
                  Đăng ký phòng học nhóm
                </a>
              </li>
              <li>
                <a
                  className="link-secondary text-decoration-none d-block mb-2"
                  href="#"
                >
                  In ấn tài liệu
                </a>
              </li>
              <li>
                <a
                  className="link-secondary text-decoration-none d-block mb-2"
                  href="#"
                >
                  Hỗ trợ nghiên cứu
                </a>
              </li>
            </ul>
          </div>

          <div className="col-6 col-md-3">
            <h5 className="fw-semibold mb-3">Thông tin</h5>
            <ul className="list-unstyled">
              <li>
                <a
                  className="link-secondary text-decoration-none d-block mb-2"
                  href="#"
                >
                  Giới thiệu
                </a>
              </li>
              <li>
                <a
                  className="link-secondary text-decoration-none d-block mb-2"
                  href="#"
                >
                  Giờ mở cửa
                </a>
              </li>
              <li>
                <a
                  className="link-secondary text-decoration-none d-block mb-2"
                  href="#"
                >
                  Nội quy thư viện
                </a>
              </li>
              <li>
                <a
                  className="link-secondary text-decoration-none d-block mb-2"
                  href="#"
                >
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-4" />
        <div className="text-center text-muted small">
          Designed with ❤️ by HoangPC, BaoNT, BangNT
        </div>
      </div>
    </footer>
  );
}

export default Footer;
