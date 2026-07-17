"use client";

import {
  ArrowRight,
  Award,
  BookOpen,
  Compass,
  GraduationCap,
  MapPin,
  Video,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

const benefits = [
  {
    icon: Compass,
    title: "Discover opportunities",
    description:
      "Find internships and entry-level roles that match your skills, interests, and location preferences.",
  },
  {
    icon: MapPin,
    title: "Location-aware matching",
    description:
      "Set your city and commute radius to find roles near you, or explore remote and global options.",
  },
  {
    icon: GraduationCap,
    title: "Earn certifications",
    description:
      "Complete free and paid certification programs to build your skills and stand out to employers.",
  },
  {
    icon: Video,
    title: "Attend webinars",
    description:
      "Join live webinars from industry experts covering topics from system design to frontend engineering.",
  },
  {
    icon: Award,
    title: "Verified skills",
    description:
      "Showcase verified certifications and skills on your profile for employer credibility.",
  },
  {
    icon: BookOpen,
    title: "Learn as you go",
    description:
      "Access educational content tied to specific roles so you can upskill while you search.",
  },
];

export default function ForStudentsPage() {
  return (
    <main className="min-h-[100dvh] bg-background text-foreground">
      {/* Hero */}
      <section className="relative border-b border-border bg-surface">
        <div className="pointer-events-none absolute -right-20 top-10 size-[320px] rounded-full bg-accent/3 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]">
              Launch your career with confidence.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted">
              Find internships that fit your life, build skills through certifications and webinars,
              and connect with verified employers who value your potential.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-accent px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-hover active:scale-[0.98]"
              >
                Browse opportunities <ArrowRight size={16} />
              </Link>
              <Link
                href="/#learn"
                className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground transition hover:border-border-hover hover:bg-accent-light"
              >
                Explore certifications
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Everything you need to get started
        </h2>
        <p className="mt-2 max-w-lg text-muted">
          InternHub is built for students and early-career professionals like you.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
            <GraduationCap size={22} />
          </div>
          <h2 className="font-display mt-5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Your next opportunity is waiting
          </h2>
          <p className="mx-auto mt-2 max-w-md text-muted">
            Join thousands of students already finding internships and building skills on InternHub.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-accent px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-hover active:scale-[0.98]"
          >
            Find my matches <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
