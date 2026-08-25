// ==========================================
// CUSTOM HOOK: useDebounce
// Interview favorite - shows you understand custom hooks & performance
// ==========================================

import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timer to update debounced value after delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: clear timer if value changes before delay completes
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
