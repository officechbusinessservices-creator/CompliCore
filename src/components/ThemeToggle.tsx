"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { useEffect, useState } from "react";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;

  const options = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Monitor, label: "System" },
  ] as const;

  const current = options.find((o) => o.value === theme) ?? options[2];
  const Icon = current.icon;

  function cycle() {
    const idx = options.findIndex((o) => o.value === theme);
    const next = options[(idx + 1) % options.length];
    setTheme(next.value);
  }

  return (
    <button
      onClick={cycle}
      aria-label={`Switch theme (current: ${current.label})`}
      title={`Theme: ${current.label} — click to cycle`}
      className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

export { ThemeToggle };
export default ThemeToggle;
