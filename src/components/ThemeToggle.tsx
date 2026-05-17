"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "@/lib/theme-context";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <button
      onClick={toggleTheme}
      aria-label="Сменить тему"
      className={`flex h-11 w-11 items-center justify-center rounded-xl border transition hover:text-[#00FF99] ${className}`}
      style={{
        borderColor: "var(--border)",
        background: "var(--surface)",
      }}
    >
      {mounted ? (
        theme === "dark" ? <Sun size={18} /> : <Moon size={18} />
      ) : (
        <Sun size={18} />
      )}
    </button>
  );
}