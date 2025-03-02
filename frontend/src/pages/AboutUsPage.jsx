import { Link } from "react-router-dom";

const AboutUsPage = () => {
  return (
    <div>
      <section className="py-3 py-md-5 py-xl-8">
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="col-12 col-md-10 col-lg-8 col-xl-7 col-xxl-6">
              <h2 className="mb-4 display-5 text-center">
                Giới Thiệu Thư Viện PTIT
              </h2>
              <p className="text-secondary mb-5 text-center lead fs-4">
                Thư viện Học viện Công nghệ Bưu chính Viễn thông (PTIT) là trung
                tâm tài nguyên học thuật, cung cấp hàng nghìn đầu sách và tài
                liệu phục vụ sinh viên trong quá trình học tập và nghiên cứu.
              </p>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row gy-4 gy-lg-0 align-items-lg-center">
            <div className="col-12 col-lg-6">
              <img
                className="img-fluid rounded border border-dark"
                loading="lazy"
                src="https://ptit.edu.vn/wp-content/uploads/2024/09/banner-mobile.webp"
                alt="Thư Viện PTIT"
              />
            </div>
            <div className="col-12 col-lg-6 col-xxl-6">
              <div className="row justify-content-lg-end">
                <div className="col-12 col-lg-11">
                  <div className="about-wrapper">
                    <p className="lead mb-4 mb-md-5">
                      Với không gian hiện đại và hệ thống tài nguyên phong phú,
                      thư viện PTIT là nơi lý tưởng để sinh viên tiếp cận kiến
                      thức, mở rộng tư duy và thực hiện các dự án nghiên cứu.
                    </p>
                    <div className="row gy-4 mb-4 mb-md-5">
                      <div className="col-12 col-md-6">
                        <div className="card border-3">
                          <div className="card-body p-4">
                            <h3 className="display-5 fw-bold text-primary text-center mb-2">
                              500+
                            </h3>
                            <p className="fw-bold text-center m-0">
                              Tài liệu & Cuốn sách
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <div className="card border-3">
                          <div className="card-body p-4">
                            <h3 className="display-5 fw-bold text-primary text-center mb-2">
                              1000+
                            </h3>
                            <p className="fw-bold text-center m-0">
                              Sinh viên sử dụng mỗi năm
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Link to="/book" className="btn btn-primary bsb-btn-2xl">
                      Khám Phá Ngay
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        className="bi bi-arrow-right-short"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
