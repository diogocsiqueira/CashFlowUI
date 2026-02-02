export function useTheme() {
  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "dark" ? "light" : "dark");
  }

  function initTheme() {
    const saved = localStorage.getItem("theme");
    if (saved) {
      setTheme(saved);
    } else {
      // opcional: detectar sistema
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }

  return { toggleTheme, initTheme };
}
