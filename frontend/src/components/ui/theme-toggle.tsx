// components/ui/ThemeToggle.tsx
import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "../../assets"; // swap with your icon imports

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = saved === "dark" || (!saved && prefersDark);
    setIsDark(dark);
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "");
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "");
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      className="h-9 w-9 flex items-center justify-center rounded-md border cursor-pointer transition-colors"
      style={{
        background: "transparent",
        borderColor: "var(--border-border)",
        color: "var(--icon-icon)",
      }}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <SunIcon className="h-4 w-4 text-white" />
      ) : (
        <MoonIcon className="h-4 w-4 text-red-500" />
      )}
    </button>
  );
}