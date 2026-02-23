import { useEffect, useState } from "react";

const STORAGE_KEY = "theme";

export default function useTheme() {
  const [theme, setThemeState] = useState(() => {
    if (typeof window === "undefined") return "light";

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;

    // Default to light theme specifically as requested by user
    return "light";
  });

  // Keep all hook instances in sync when theme changes anywhere
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handler = (event) => {
      const next = event.detail;
      if (next === "light" || next === "dark") {
        setThemeState(next);
      }
    };

    window.addEventListener("theme-change", handler);
    return () => window.removeEventListener("theme-change", handler);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = (value) => {
    setThemeState(value);

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("theme-change", {
          detail: value,
        })
      );
    }
  };

  return { theme, setTheme };
}


