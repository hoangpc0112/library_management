function Footer() {
  return (
    <footer
      className="py-5 mt-5 border-top"
      style={{
        paddingLeft: "15%",
        paddingRight: "15%",
        marginTop: "auto",
        width: "100%",
      }}
    >
      <div className="row">
        <div className="col-12 col-md">
          <h3>Thư viện PTIT</h3>
          <small className="d-block mb-3 text-body-secondary">
            Học viện Công nghệ Bưu chính Viễn thông (PTIT)
          </small>
        </div>
        <div className="col-6 col-md">
          <h5>Danh mục sách</h5>
          <ul className="list-unstyled text-small">
            <li>
              <a className="link-secondary text-decoration-none" href="#">
                Giáo trình
              </a>
            </li>
            <li>
              <a className="link-secondary text-decoration-none" href="#">
                Sách chuyên ngành
              </a>
            </li>
            <li>
              <a className="link-secondary text-decoration-none" href="#">
                Tài liệu nghiên cứu
              </a>
            </li>
            <li>
              <a className="link-secondary text-decoration-none" href="#">
                Sách kỹ năng mềm
              </a>
            </li>
            <li>
              <a className="link-secondary text-decoration-none" href="#">
                Tạp chí khoa học
              </a>
            </li>
          </ul>
        </div>
        <div className="col-6 col-md">
          <h5>Tài nguyên</h5>
          <ul className="list-unstyled text-small">
            <li>
              <a className="link-secondary text-decoration-none" href="#">
                Cơ sở dữ liệu trực tuyến
              </a>
            </li>
            <li>
              <a className="link-secondary text-decoration-none" href="#">
                Thư viện số
              </a>
            </li>
            <li>
              <a className="link-secondary text-decoration-none" href="#">
                Hướng dẫn tra cứu
              </a>
            </li>
            <li>
              <a className="link-secondary text-decoration-none" href="#">
                Câu hỏi thường gặp
              </a>
            </li>
          </ul>
        </div>
        <div className="col-6 col-md">
          <h5>Dịch vụ</h5>
          <ul className="list-unstyled text-small">
            <li>
              <a className="link-secondary text-decoration-none" href="#">
                Mượn - trả sách
              </a>
            </li>
            <li>
              <a className="link-secondary text-decoration-none" href="#">
                Đăng ký phòng học nhóm
              </a>
            </li>
            <li>
              <a className="link-secondary text-decoration-none" href="#">
                In ấn tài liệu
              </a>
            </li>
            <li>
              <a className="link-secondary text-decoration-none" href="#">
                Hỗ trợ nghiên cứu
              </a>
            </li>
          </ul>
        </div>
        <div className="col-6 col-md">
          <h5>Thông tin</h5>
          <ul className="list-unstyled text-small">
            <li>
              <a className="link-secondary text-decoration-none" href="#">
                Giới thiệu
              </a>
            </li>
            <li>
              <a className="link-secondary text-decoration-none" href="#">
                Giờ mở cửa
              </a>
            </li>
            <li>
              <a className="link-secondary text-decoration-none" href="#">
                Nội quy thư viện
              </a>
            </li>
            <li>
              <a className="link-secondary text-decoration-none" href="#">
                Liên hệ
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
