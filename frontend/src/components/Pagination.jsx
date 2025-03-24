import { Link, useLocation } from "react-router-dom";

function Pagination({ currentPage, totalPages }) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search") || "";

  const generatePageLink = (page) => {
    const params = new URLSearchParams();
    params.set("page", page);
    if (searchQuery) params.set("search", searchQuery);
    return `?${params.toString()}`;
  };

  const getPageNumbers = () => {
    if (totalPages <= 1) return [1];

    const pages = [currentPage];

    if (currentPage > 1) {
      pages.unshift(currentPage - 1);
    }

    if (currentPage < totalPages) {
      pages.push(currentPage + 1);
    }

    return pages;
  };

  return (
    <div className="d-flex justify-content-center mt-4">
      <nav aria-label="Page navigation">
        <ul className="pagination shadow-sm">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <Link
              to={generatePageLink(1)}
              className="page-link rounded-start"
              aria-label="First"
            >
              <i className="bi bi-chevron-double-left"></i>
            </Link>
          </li>

          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <Link
              to={generatePageLink(currentPage - 1)}
              className="page-link"
              aria-label="Previous"
            >
              <i className="bi bi-chevron-left"></i>
            </Link>
          </li>

          {totalPages > 1 && currentPage > 2 && (
            <li className="page-item disabled">
              <span className="page-link">...</span>
            </li>
          )}

          {getPageNumbers().map((page) => (
            <li
              key={`page-${page}`}
              className={`page-item ${currentPage === page ? "active" : ""}`}
            >
              {currentPage === page ? (
                <span className="page-link">{page}</span>
              ) : (
                <Link to={generatePageLink(page)} className="page-link">
                  {page}
                </Link>
              )}
            </li>
          ))}

          {totalPages > 1 && currentPage < totalPages - 1 && (
            <li className="page-item disabled">
              <span className="page-link">...</span>
            </li>
          )}

          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <Link
              to={generatePageLink(currentPage + 1)}
              className="page-link"
              aria-label="Next"
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
              to={generatePageLink(totalPages)}
              className="page-link rounded-end"
              aria-label="Last"
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
