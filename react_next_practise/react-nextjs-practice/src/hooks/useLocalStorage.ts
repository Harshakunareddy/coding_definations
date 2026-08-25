// ==========================================
// CUSTOM HOOK: useLocalStorage
// Shows persistence knowledge & SSR awareness
// ==========================================

import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Use initialValue for SSR (window not available on server)
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Load from localStorage after mount (client-side only)
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) setStoredValue(JSON.parse(item));
    } catch (error) {
      console.error("Error reading localStorage:", error);
    }
  }, [key]);

  // Save to localStorage whenever value changes
  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    try {
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error("Error writing localStorage:", error);
    }
  };

  return [storedValue, setValue] as const;
}
