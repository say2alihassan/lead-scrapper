"use client";

import { useState, useEffect } from "react";

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) setValue(JSON.parse(stored));
    } catch {}
    setHydrated(true);
  }, [key]);

  function set(newValue) {
    const resolved = typeof newValue === "function" ? newValue(value) : newValue;
    setValue(resolved);
    try {
      localStorage.setItem(key, JSON.stringify(resolved));
    } catch {}
  }

  return [value, set, hydrated];
}
