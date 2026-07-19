"use client";

import { Menu, Moon, Sun, X } from "lucide-react";
import TernLogo from "./TernLogo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useSyncExternalStore, useState } from "react";
import {
  Show,
  UserButton,
} from "@clerk/nextjs";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/sign-in", label: "Sign in" },
];

const authenticatedLinks = [
  { href: "/", label: "Home" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/post", label: "Post" },
  { href: "/mail", label: "Mail" },
];

function subscribeDarkMode(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getDarkModeSnapshot(): boolean {
  const stored = localStorage.getItem("growtern-dark");
  if (stored !== null) return stored === "true";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function getDarkModeServerSnapshot(): boolean {
  return false;
}

const isClerkConfigured = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function Navbar() {
  const pathname = usePathname();
  const darkMode = useSyncExternalStore(subscribeDarkMode, getDarkModeSnapshot, getDarkModeServerSnapshot);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", darkMode);
  }

  const toggleDarkMode = useCallback(() => {
    const next = !getDarkModeSnapshot();
    localStorage.setItem("growtern-dark", String(next));
    document.documentElement.classList.toggle("dark", next);
    window.dispatchEvent(new StorageEvent("storage", { key: "growtern-dark" }));
  }, []);

  function handleNavClick() {
    setMobileOpen(false);
  }

  // Navigation links component that adapts based on auth state
  function NavLinks({ links }: { links: typeof publicLinks }) {
    return (
      <>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={handleNavClick}
            className={`transition hover:text-foreground ${
              pathname === link.href ? "text-foreground" : ""
            }`}
          >
            {link.label}
          </Link>
        ))}
      </>
    );
  }

  function MobileNavLinks({ links }: { links: typeof publicLinks }) {
    return (
      <>
        {links.map((link) => (
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
      </>
    );
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link className="flex shrink-0 items-center gap-2.5" href="/" aria-label="Grow Tern home">
          <span className="flex size-9 items-center justify-center rounded-[var(--radius-sm)] bg-accent text-white">
            <TernLogo size={18} />
          </span>
          <span className="text-base font-bold tracking-tight text-foreground">Grow Tern</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted md:flex">
          {isClerkConfigured ? (
            <Show
              when="signed-in"
              fallback={<NavLinks links={publicLinks} />}
            >
              <NavLinks links={authenticatedLinks} />
            </Show>
          ) : (
            <NavLinks links={authenticatedLinks} />
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleDarkMode}
            className="rounded-[var(--radius-sm)] p-2 text-muted transition hover:bg-accent-light hover:text-foreground"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Auth buttons */}
          {isClerkConfigured ? (
            <Show
              when="signed-in"
              fallback={
                <Link
                  href="/sign-in"
                  className="hidden rounded-[var(--radius-sm)] bg-accent px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover sm:inline-flex"
                >
                  Sign in
                </Link>
              }
            >
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "size-8",
                  },
                }}
              />
            </Show>
          ) : (
            <Link
              href="/sign-in"
              className="hidden rounded-[var(--radius-sm)] bg-accent px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover sm:inline-flex"
            >
              Sign in
            </Link>
          )}

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
            {isClerkConfigured ? (
              <Show
                when="signed-in"
                fallback={<MobileNavLinks links={publicLinks} />}
              >
                <MobileNavLinks links={authenticatedLinks} />
              </Show>
            ) : (
              <MobileNavLinks links={authenticatedLinks} />
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
