import { useEffect, useState } from "react";

function ThemeToggle() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const current = document.body.getAttribute("data-theme") || localStorage.getItem("theme") || "dark";
    setTheme(current);
  }, []);

  const toggleTheme = () => {
    const current = document.body.getAttribute("data-theme") || "dark";
    const nextTheme = current === "dark" ? "light" : "dark";
    document.body.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
    setTheme(nextTheme);
  };

  return (
    <button className="theme-toggle-btn" onClick={toggleTheme}>
      {theme === "dark" ? "☀ Light" : "🌙 Dark"}
    </button>
  );
}

export default ThemeToggle;