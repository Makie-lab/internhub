"use client";

import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Globe,
  Search,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

const benefits = [
  {
    icon: Search,
    title: "Find top talent",
    description:
      "Access a pool of motivated students and early-career professionals eager to contribute to your team.",
  },
  {
    icon: Globe,
    title: "Reach local and global candidates",
    description:
      "Post opportunities visible to candidates in your area or expand your reach nationally and globally.",
  },
  {
    icon: BadgeCheck,
    title: "Verified profiles",
    description:
      "Every candidate profile includes verified skills, certifications, and educational background.",
  },
  {
    icon: Users,
    title: "Build your pipeline",
    description:
      "Connect with interns today who become your full-time hires tomorrow. Build relationships early.",
  },
];

export default function ForEmployeesPage() {
  return (
    <main className="min-h-[100dvh] bg-background text-foreground">
      {/* Hero */}
      <section className="relative border-b border-border bg-surface">
        <div className="pointer-events-none absolute -left-40 -top-40 size-[480px] rounded-full bg-accent/5 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]">
              Hire the next generation of talent.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted">
              InternHub connects you with motivated students and early-career professionals.
              Post roles, review verified profiles, and build your talent pipeline.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/post"
                className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-accent px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-hover active:scale-[0.98]"
              >
                Post an opportunity <ArrowRight size={16} />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground transition hover:border-border-hover hover:bg-accent-light"
              >
                Browse candidates
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Why employers choose InternHub
        </h2>
        <p className="mt-2 max-w-lg text-muted">
          Everything you need to find, evaluate, and hire early-career talent.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {benefits.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-[var(--radius)] border border-border bg-surface p-6 transition hover:border-border-hover hover:shadow-[var(--card-shadow-hover)]"
              >
                <div className="flex size-10 items-center justify-center rounded-[var(--radius-sm)] bg-accent-light text-accent">
                  <Icon size={19} />
                </div>
                <h3 className="mt-4 text-base font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl px-5 py-16 text-center sm:px-8">
          <div className="mx-auto flex size-12 items-center justify-center rounded-[var(--radius-sm)] bg-accent-light text-accent">
            <BriefcaseBusiness size={22} />
          </div>
          <h2 className="font-display mt-5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Ready to find your next hire?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-muted">
            Join thousands of employers already using InternHub to build their teams.
          </p>
          <Link
            href="/post"
            className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-accent px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-hover active:scale-[0.98]"
          >
            Get started <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
