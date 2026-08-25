import { useState, useMemo } from 'react';
import './Pagination.css';

const allItems = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  title: `Item ${i + 1}`,
  description: `This is a description for item number ${i + 1}. It contains some sample text.`,
}));

const ITEMS_PER_PAGE = 10;

export default function Pagination() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(allItems.length / ITEMS_PER_PAGE);

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return allItems.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="page">
      <h1 className="page-title">Pagination</h1>
      <p className="page-subtitle">Paginated list with page numbers & navigation</p>

      <div className="pagination-container">
        <div className="pagination-info">
          Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
          {Math.min(currentPage * ITEMS_PER_PAGE, allItems.length)} of {allItems.length} items
        </div>

        <div className="pagination-list">
          {currentItems.map((item) => (
            <div key={item.id} className="pagination-item">
              <div className="pagination-item-number">#{item.id}</div>
              <div>
                <h3 className="pagination-item-title">{item.title}</h3>
                <p className="pagination-item-desc">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pagination-controls">
          <button
            className="pagination-btn"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &larr; Prev
          </button>

          <div className="pagination-numbers">
            {getPageNumbers().map((page, i) =>
              page === '...' ? (
                <span key={`dots-${i}`} className="pagination-dots">...</span>
              ) : (
                <button
                  key={page}
                  className={`pagination-num ${currentPage === page ? 'pagination-num--active' : ''}`}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </button>
              )
            )}
          </div>

          <button
            className="pagination-btn"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
