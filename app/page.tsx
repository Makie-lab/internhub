"use client";

import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  Globe,
  GraduationCap,
  MapPin,
  Rocket,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import TernLogo from "./components/TernLogo";

export default function Home() {
  return (
    <main className="min-h-[100dvh] overflow-hidden bg-background text-foreground">
      {/* Hero */}
      <section className="relative border-b border-border bg-surface">
        <div className="pointer-events-none absolute -left-40 -top-40 size-[480px] rounded-full bg-accent/5 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-10 size-[320px] rounded-full bg-accent/3 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-accent text-white shadow-lg">
              <TernLogo size={32} />
            </div>
            <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Your career takes flight here.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              Grow Tern is the platform that connects students and early-career professionals with meaningful opportunities — internships, certifications, webinars, and more.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/sign-in"
                className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-hover active:scale-[0.98]"
              >
                Get started <ArrowRight size={16} />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-border bg-surface px-6 py-3.5 text-sm font-semibold text-foreground transition hover:border-border-hover hover:bg-accent-light"
              >
                Learn more
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What Grow Tern Offers */}
      <section id="features" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to grow
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            From finding your first role to building real skills, Grow Tern supports every step of your early career journey.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: BriefcaseBusiness,
              title: "Curated Opportunities",
              description: "Access internships and entry-level roles from verified companies — with transparent pay, location details, and flexible work setups.",
            },
            {
              icon: MapPin,
              title: "Location-Aware Matching",
              description: "Set your city once and find roles nearby. Expand to national or global when you're ready.",
            },
            {
              icon: GraduationCap,
              title: "Free Certifications",
              description: "Earn credentials in web development, cloud, data engineering, and more through Grow Tern Academy.",
            },
            {
              icon: BookOpen,
              title: "Live Webinars",
              description: "Learn from engineers at top companies like Vercel, Stripe, and OpenAI through live sessions and Q&A.",
            },
            {
              icon: TrendingUp,
              title: "Career Growth Tracking",
              description: "Track applications, saved roles, and learning progress all in one place.",
            },
            {
              icon: Shield,
              title: "Verified Employers",
              description: "Every listing is reviewed. You'll only see real opportunities from companies that care about transparency.",
            },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-[var(--radius)] border border-border bg-surface p-6 transition hover:border-border-hover hover:shadow-[var(--card-shadow-hover)]"
              >
                <div className="flex size-11 items-center justify-center rounded-[var(--radius-sm)] bg-accent-light text-accent">
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 text-base font-bold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              How it works
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-muted">
              Three steps to start your journey.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                icon: Sparkles,
                title: "Create your account",
                description: "Sign up in seconds. Set your preferences, location, and career interests.",
              },
              {
                step: "02",
                icon: Zap,
                title: "Explore tailored matches",
                description: "Browse opportunities matched to your skills, location, and goals. Filter by pay, setup, and more.",
              },
              {
                step: "03",
                icon: Rocket,
                title: "Apply and grow",
                description: "Submit applications, join webinars, earn certifications, and track your progress — all in one place.",
              },
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="text-center"
                >
                  <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-accent-light text-accent">
                    <Icon size={24} />
                  </div>
                  <span className="mt-4 block text-xs font-bold uppercase tracking-widest text-accent">Step {step.step}</span>
                  <h3 className="mt-2 text-lg font-bold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Social proof / stats */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Trusted by ambitious learners
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-muted">
              Join thousands of students and early-career professionals already growing with us.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: "13+", label: "Active opportunities", icon: BriefcaseBusiness },
              { value: "4", label: "Free certifications", icon: GraduationCap },
              { value: "3", label: "Upcoming webinars", icon: Users },
              { value: "100%", label: "Verified employers", icon: BadgeCheck },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-[var(--radius)] border border-border bg-surface p-6 text-center"
                >
                  <div className="mx-auto flex size-10 items-center justify-center rounded-[var(--radius-sm)] bg-accent-light text-accent">
                    <Icon size={18} />
                  </div>
                  <p className="mt-3 text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="mt-1 text-sm text-muted">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Ready to take flight?
            </h2>
            <p className="mt-4 text-muted">
              Create your free account and start discovering opportunities matched to your goals, skills, and location.
            </p>
            <Link
              href="/sign-in"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-hover active:scale-[0.98]"
            >
              Sign in to explore <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
