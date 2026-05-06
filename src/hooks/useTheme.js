import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setThemeState] = useState(() => {
    return (
      localStorage.getItem("theme") ||
      document.documentElement.getAttribute("data-theme") ||
      "light"
    );
  });

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    setThemeState(theme);
  }

  function toggleTheme() {
    const current =
      document.documentElement.getAttribute("data-theme") ||
      localStorage.getItem("theme") ||
      "light";

    setTheme(current === "dark" ? "light" : "dark");
  }

  function initTheme() {
    const saved = localStorage.getItem("theme");

    if (saved) {
      setTheme(saved);
      return;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    if (!current) initTheme();
  }, []);

  return {
    theme,
    isDark: theme === "dark",
    setTheme,
    toggleTheme,
    initTheme,
  };
}