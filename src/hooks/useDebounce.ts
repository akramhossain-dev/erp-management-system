import { useState, useEffect } from "react";

/**
 * useDebounce — delays updating a value by the specified delay.
 * Useful for search inputs to avoid firing requests on every keystroke.
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 *
 * @example
 * const debouncedSearch = useDebounce(searchQuery, 300);
 * // Use debouncedSearch in your query instead of searchQuery
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
