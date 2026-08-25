// ==========================================
// PAGINATION PAGE
// Shows: Pagination logic, slice array, page numbers,
//        prev/next buttons, useMemo for computed data
// Very common interview question!
// ==========================================

"use client";

import { useState, useMemo } from "react";

// Generate dummy data
const allPosts = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  title: `Blog Post #${i + 1}`,
  body: `This is the content of blog post number ${i + 1}. It contains some interesting information about React and Next.js development.`,
  author: ["Alice", "Bob", "Charlie", "Diana"][i % 4],
}));

const ITEMS_PER_PAGE = 6;

export default function PaginationPage() {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages
  const totalPages = Math.ceil(allPosts.length / ITEMS_PER_PAGE);

  // Get current page data using useMemo
  const currentPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return allPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [currentPage]);

  // Generate page numbers to show
  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);

    // Adjust start if near the end
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }, [currentPage, totalPages]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2 dark:text-white">Pagination</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
        {Math.min(currentPage * ITEMS_PER_PAGE, allPosts.length)} of {allPosts.length} posts
      </p>

      {/* Posts List */}
      <div className="space-y-4 mb-8">
        {currentPosts.map((post) => (
          <div
            key={post.id}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold dark:text-white">{post.title}</h3>
              <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-400">
                by {post.author}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{post.body}</p>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center gap-2">
        {/* Previous Button */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 rounded border dark:border-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white"
        >
          Prev
        </button>

        {/* First page + ellipsis */}
        {pageNumbers[0] > 1 && (
          <>
            <button
              onClick={() => goToPage(1)}
              className="px-3 py-2 rounded border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white"
            >
              1
            </button>
            {pageNumbers[0] > 2 && (
              <span className="text-gray-400">...</span>
            )}
          </>
        )}

        {/* Page Numbers */}
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={`px-3 py-2 rounded border transition-colors ${
              page === currentPage
                ? "bg-blue-600 text-white border-blue-600"
                : "dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Last page + ellipsis */}
        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <span className="text-gray-400">...</span>
            )}
            <button
              onClick={() => goToPage(totalPages)}
              className="px-3 py-2 rounded border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next Button */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 rounded border dark:border-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white"
        >
          Next
        </button>
      </div>
    </div>
  );
}
