import { useState, useMemo } from "react";
import { useTheme } from "../context/ThemeContext";

// Generate sample data
const generateItems = () => {
  return Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    title: `Item #${i + 1}`,
    description: `This is the description for item number ${i + 1}. It contains some sample text to demonstrate the pagination component.`,
  }));
};

const allItems = generateItems();
const ITEMS_PER_PAGE = 10;

export default function Pagination() {
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(allItems.length / ITEMS_PER_PAGE);

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return allItems.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Pagination</h1>

      {/* Items List */}
      <div className="space-y-3 mb-8">
        {currentItems.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-lg border ${
              theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
          >
            <h3 className="font-semibold mb-1">{item.title}</h3>
            <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {/* Previous Button */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentPage === 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-200 dark:hover:bg-gray-700"
          } ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
        >
          Prev
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span
              key={`dots-${index}`}
              className={`px-2 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : theme === "dark"
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              {page}
            </button>
          )
        )}

        {/* Next Button */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentPage === totalPages
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-200 dark:hover:bg-gray-700"
          } ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
        >
          Next
        </button>
      </div>

      {/* Page Info */}
      <p className={`text-center text-sm mt-4 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
        Page {currentPage} of {totalPages} ({allItems.length} total items)
      </p>
    </div>
  );
}
