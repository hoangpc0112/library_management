import { Link } from "react-router-dom";

function Pagination({ currentPage, totalPages }) {
  return (
    <div className="d-flex justify-content-center mt-4">
      <nav>
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <Link to="?page=1" className="page-link">
              {"<<"}
            </Link>
          </li>
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <Link to={`?page=${currentPage - 1}`} className="page-link">
              {"<"}
            </Link>
          </li>
          <li className="page-item active">
            <span className="page-link">{currentPage}</span>
          </li>
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <Link to={`?page=${currentPage + 1}`} className="page-link">
              {">"}
            </Link>
          </li>
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <Link to={`?page=${totalPages}`} className="page-link">
              {">>"}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Pagination;
