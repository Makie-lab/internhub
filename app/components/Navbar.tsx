"use client";

import { BriefcaseBusiness, Menu, Moon, Sun, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useSyncExternalStore, useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/for-employees", label: "For Employees" },
  { href: "/for-students", label: "For Students" },
  { href: "/post", label: "Post" },
];

function subscribeDarkMode(callback: () => void) {
  // Listen for storage changes from other tabs
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getDarkModeSnapshot(): boolean {
  const stored = localStorage.getItem("internhub-dark");
  if (stored !== null) return stored === "true";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function getDarkModeServerSnapshot(): boolean {
  return false;
}

export default function Navbar() {
  const pathname = usePathname();
  const darkMode = useSyncExternalStore(subscribeDarkMode, getDarkModeSnapshot, getDarkModeServerSnapshot);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Keep the DOM class in sync
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", darkMode);
  }

  const toggleDarkMode = useCallback(() => {
    const next = !getDarkModeSnapshot();
    localStorage.setItem("internhub-dark", String(next));
    document.documentElement.classList.toggle("dark", next);
    // Trigger re-render by dispatching a storage event on same window
    window.dispatchEvent(new StorageEvent("storage", { key: "internhub-dark" }));
  }, []);

  function handleNavClick() {
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link className="flex shrink-0 items-center gap-2.5" href="/" aria-label="InternHub home">
          <span className="flex size-9 items-center justify-center rounded-[var(--radius-sm)] bg-accent text-white">
            <BriefcaseBusiness size={18} strokeWidth={2.2} />
          </span>
          <span className="text-base font-bold tracking-tight text-foreground">internhub</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition hover:text-foreground ${
                pathname === link.href ? "text-foreground" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleDarkMode}
            className="rounded-[var(--radius-sm)] p-2 text-muted transition hover:bg-accent-light hover:text-foreground"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-[var(--radius-sm)] p-2 text-muted transition hover:bg-accent-light hover:text-foreground md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="border-t border-border bg-surface px-5 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleNavClick}
                className={`rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium transition hover:bg-accent-light ${
                  pathname === link.href
                    ? "bg-accent-light text-foreground"
                    : "text-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
