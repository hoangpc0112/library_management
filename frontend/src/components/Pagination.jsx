import { Link } from "react-router-dom";

function Pagination({ currentPage, totalPages }) {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);

      let start = Math.max(currentPage - 1, 2);
      let end = Math.min(start + 2, totalPages - 1);

      if (end === totalPages - 1) {
        start = Math.max(end - 2, 2);
      }

      if (start > 2) {
        pageNumbers.push("...");
      }

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      if (end < totalPages - 1) {
        pageNumbers.push("...");
      }

      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="d-flex justify-content-center mt-4">
      <nav aria-label="Điều hướng trang">
        <ul className="pagination shadow-sm">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <Link
              to="?page=1"
              className="page-link rounded-start"
              aria-label="Trang đầu"
            >
              <i className="bi bi-chevron-double-left"></i>
            </Link>
          </li>

          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <Link
              to={`?page=${currentPage - 1}`}
              className="page-link"
              aria-label="Trang trước"
            >
              <i className="bi bi-chevron-left"></i>
            </Link>
          </li>

          {getPageNumbers().map((page, index) => {
            if (page === "...") {
              return (
                <li key={`ellipsis-${index}`} className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              );
            }

            return (
              <li
                key={`page-${page}`}
                className={`page-item ${currentPage === page ? "active" : ""}`}
              >
                {currentPage === page ? (
                  <span className="page-link">{page}</span>
                ) : (
                  <Link to={`?page=${page}`} className="page-link">
                    {page}
                  </Link>
                )}
              </li>
            );
          })}

          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <Link
              to={`?page=${currentPage + 1}`}
              className="page-link"
              aria-label="Trang tiếp"
            >
              <i className="bi bi-chevron-right"></i>
            </Link>
          </li>

          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <Link
              to={`?page=${totalPages}`}
              className="page-link rounded-end"
              aria-label="Trang cuối"
            >
              <i className="bi bi-chevron-double-right"></i>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Pagination;
