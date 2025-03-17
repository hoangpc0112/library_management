import { useEffect, useState } from "react";
import Carousel from "../components/Carousel";
import "../css/HomePage.css";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Trang chủ - Thư viện PTIT";
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    navigate(`book/?search=${searchTerm}`);
  };

  return (
    <div>
      <div className="py-5 text-center bg-body-secondary bg-custom">
        <div className="content">
          <img
            className="d-block mx-auto mb-4"
            src="https://cdn-icons-png.flaticon.com/512/5402/5402751.png"
            alt="Book icon"
            width="72"
            height="57"
          />
          <h1 className="display-5 fw-bold">Chào mừng đến với Thư viện PTIT</h1>
          <div className="col-lg-6 mx-auto">
            <p className="lead">
              Thư viện của Học viện Công nghệ Bưu chính Viễn thông (PTIT) là một
              trung tâm thông tin và tài liệu quan trọng, phục vụ nhu cầu học
              tập, nghiên cứu và giảng dạy của sinh viên, giảng viên và cán bộ
              của Học viện. Thư viện cung cấp một kho tài liệu phong phú, bao
              gồm sách, tạp chí, luận văn, và các tài liệu điện tử. Ngoài ra,
              thư viện còn có các dịch vụ hỗ trợ như tra cứu tài liệu trực
              tuyến, mượn tài liệu, và không gian học tập hiện đại.
            </p>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center mt-5 mb-5">
        <form className="d-flex w-50" onSubmit={handleSearch}>
          <input
            type="text"
            className="form-control me-2 shadow-sm border-2"
            placeholder="Tìm kiếm sách..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">
            Tìm kiếm
          </button>
        </form>
      </div>

      <Carousel
        title="Top 10 cuốn sách được yêu thích nhất"
        endpoint={`http://localhost:8000/book/?page=1&size=10&sort=average_rating&order=desc`}
      />
    </div>
  );
};

export default HomePage;
