"use client";

import {
  ArrowRight,
  BriefcaseBusiness,
  ChevronDown,
  Loader2,
  MapPin,
} from "lucide-react";
import { motion } from "motion/react";
import { FormEvent, useState } from "react";

export default function PostPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      title: formData.get("title") as string,
      company: formData.get("company") as string,
      location: formData.get("location") as string,
      work_type: formData.get("work_type") as string,
      level: formData.get("level") as string,
      pay: formData.get("pay") as string,
      skills: formData.get("skills") as string,
      description: formData.get("description") as string,
    };

    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit listing");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-[100dvh] bg-background text-foreground">
      {/* Hero */}
      <section className="relative border-b border-border bg-surface">
        <div className="pointer-events-none absolute -left-40 -top-40 size-[480px] rounded-full bg-accent/5 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl">
              Post an opportunity
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
              Reach thousands of motivated students and early-career professionals.
              Fill out the details below to list your role on Grow Tern.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form */}
      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-[var(--radius)] border border-border bg-surface p-8 text-center shadow-[var(--card-shadow)]"
          >
            <div className="mx-auto flex size-12 items-center justify-center rounded-[var(--radius-sm)] bg-accent-light text-accent">
              <BriefcaseBusiness size={22} />
            </div>
            <h2 className="font-display mt-5 text-2xl font-bold tracking-tight text-foreground">
              Opportunity submitted!
            </h2>
            <p className="mt-2 text-muted">
              Your listing is under review. It will appear on Grow Tern once approved.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover active:scale-[0.98]"
            >
              Post another <ArrowRight size={16} />
            </button>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[var(--radius)] border border-border bg-surface p-6 shadow-[var(--card-shadow)] sm:p-8"
          >
            <h2 className="font-display text-xl font-bold tracking-tight text-foreground">
              Role details
            </h2>
            <p className="mt-1 text-sm text-muted">
              Provide information about the opportunity you are posting.
            </p>

            {error && (
              <div className="mt-4 rounded-[var(--radius-sm)] border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
                {error}
              </div>
            )}

            <div className="mt-6 space-y-5">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-foreground">Job title</span>
                <input
                  name="title"
                  required
                  placeholder="e.g. Software Engineering Intern"
                  className="w-full rounded-[var(--radius-sm)] border border-border bg-background px-3.5 py-2.5 text-sm text-foreground transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-foreground">Company name</span>
                <input
                  name="company"
                  required
                  placeholder="e.g. Acme Inc."
                  className="w-full rounded-[var(--radius-sm)] border border-border bg-background px-3.5 py-2.5 text-sm text-foreground transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-foreground">Location</span>
                  <div className="relative">
                    <MapPin size={15} className="pointer-events-none absolute left-3 top-3 text-muted" />
                    <input
                      name="location"
                      required
                      placeholder="e.g. New York, NY"
                      className="w-full rounded-[var(--radius-sm)] border border-border bg-background py-2.5 pl-9 pr-3.5 text-sm text-foreground transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-foreground">Work setup</span>
                  <span className="relative block">
                    <select
                      name="work_type"
                      required
                      defaultValue=""
                      className="w-full appearance-none rounded-[var(--radius-sm)] border border-border bg-background px-3.5 py-2.5 text-sm text-foreground transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                    >
                      <option value="" disabled>
                        Select type
                      </option>
                      <option value="remote">Remote</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="onsite">In person</option>
                    </select>
                    <ChevronDown size={15} className="pointer-events-none absolute right-3 top-3 text-muted" />
                  </span>
                </label>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-foreground">Level</span>
                  <span className="relative block">
                    <select
                      name="level"
                      required
                      defaultValue=""
                      className="w-full appearance-none rounded-[var(--radius-sm)] border border-border bg-background px-3.5 py-2.5 text-sm text-foreground transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                    >
                      <option value="" disabled>
                        Select level
                      </option>
                      <option value="internship">Internship</option>
                      <option value="entry">Entry level</option>
                    </select>
                    <ChevronDown size={15} className="pointer-events-none absolute right-3 top-3 text-muted" />
                  </span>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-foreground">Pay range</span>
                  <input
                    name="pay"
                    required
                    placeholder="e.g. $30-$40/hr"
                    className="w-full rounded-[var(--radius-sm)] border border-border bg-background px-3.5 py-2.5 text-sm text-foreground transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-foreground">Required skills</span>
                <input
                  name="skills"
                  placeholder="e.g. React, TypeScript, Node.js (comma separated)"
                  className="w-full rounded-[var(--radius-sm)] border border-border bg-background px-3.5 py-2.5 text-sm text-foreground transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-foreground">Description</span>
                <textarea
                  name="description"
                  rows={4}
                  placeholder="Describe the role, responsibilities, and what candidates can expect..."
                  className="w-full rounded-[var(--radius-sm)] border border-border bg-background px-3.5 py-2.5 text-sm text-foreground transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </label>

              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Additional options</p>
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input type="checkbox" name="has_certification" className="size-3.5 accent-accent" />
                  This role offers a certification upon completion
                </label>
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input type="checkbox" name="has_webinar" className="size-3.5 accent-accent" />
                  This role includes webinar access
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover active:scale-[0.98] disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  Submit opportunity <ArrowRight size={16} />
                </>
              )}
            </button>
            <p className="mt-3 text-center text-xs text-muted">
              Your listing will be saved and reviewed.
            </p>
          </motion.form>
        )}
      </section>
    </main>
  );
}
