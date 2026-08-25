// ==========================================
// ERROR BOUNDARY (Next.js App Router feature)
// Automatically catches errors in this route segment
// Must be a Client Component
// ==========================================

"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-red-500 mb-4">Something went wrong!</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{error.message}</p>
      <button
        onClick={reset}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Try Again
      </button>
    </div>
  );
}
