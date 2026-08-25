// ==========================================
// SEARCH BAR COMPONENT
// Shows: Controlled input, debouncing, props callback pattern
// ==========================================

"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = "Search..." }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  // Trigger search when debounced value changes
  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
    />
  );
}
