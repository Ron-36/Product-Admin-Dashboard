"use client";

import { useEffect, useState } from "react";

// Generic debounce hook: only returns the latest value after
// `delay` ms of no further changes. Used for the search box so
// we don't fire a request on every keystroke.
export default function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
