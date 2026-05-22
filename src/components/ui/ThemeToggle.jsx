import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./button";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const root = window.document.documentElement;
    const initialTheme = root.classList.contains("dark") ? "dark" : "light";
    setIsDark(initialTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.remove("dark");
      setIsDark(false);
      localStorage.setItem("theme", "light");
    } else {
      root.classList.add("dark");
      setIsDark(true);
      localStorage.setItem("theme", "dark");
    }
  };

  // Ensure initial theme is loaded from local storage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const root = window.document.documentElement;
    if (savedTheme === "light") {
      root.classList.remove("dark");
      setIsDark(false);
    } else {
      // Default to dark mode for the dashboard aesthetic
      root.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="bg-transparent border-border text-foreground hover:bg-card transition-colors"
      title="Toggle theme"
    >
      {isDark ? (
        <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
