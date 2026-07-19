"use client";

import { SignIn } from "@clerk/nextjs";
import { motion } from "motion/react";
import TernLogo from "@/app/components/TernLogo";
import Link from "next/link";

const isClerkConfigured = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function SignInPage() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-5 py-16 text-foreground">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Brand header */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="flex size-10 items-center justify-center rounded-[var(--radius-sm)] bg-accent text-white">
              <TernLogo size={20} />
            </span>
            <span className="text-xl font-bold tracking-tight text-foreground">Grow Tern</span>
          </Link>
          <p className="mt-3 text-sm text-muted">
            Sign in to access opportunities, certifications, and more.
          </p>
        </div>

        {/* Clerk Sign In component */}
        {isClerkConfigured ? (
          <div className="flex justify-center">
            <SignIn
              appearance={{
                elements: {
                  rootBox: "w-full",
                  cardBox: "w-full shadow-none",
                  card: "w-full border border-border bg-surface shadow-[var(--card-shadow)]",
                },
              }}
              fallbackRedirectUrl="/opportunities"
            />
          </div>
        ) : (
          <div className="rounded-[var(--radius)] border border-border bg-surface p-8 text-center shadow-[var(--card-shadow)]">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent-light text-accent">
              <TernLogo size={22} />
            </div>
            <h2 className="mt-4 text-lg font-bold text-foreground">Authentication not configured</h2>
            <p className="mt-2 text-sm text-muted">
              Clerk is not set up yet. Add your Clerk API keys to <code className="rounded bg-accent-light px-1.5 py-0.5 text-xs font-mono">.env.local</code> to enable sign in.
            </p>
            <Link
              href="/opportunities"
              className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover active:scale-[0.98]"
            >
              Continue without signing in
            </Link>
          </div>
        )}
      </motion.div>
    </main>
  );
}
