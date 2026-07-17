"use client";

import {
  ArrowRight,
  Award,
  BadgeCheck,
  Bookmark,
  BriefcaseBusiness,
  Calendar,
  Check,
  ChevronDown,
  Clock3,
  Code2,
  Compass,
  Globe,
  GraduationCap,
  MapPin,
  Play,
  Search,
  SlidersHorizontal,
  TrendingUp,
  Users,
  Video,
  X,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { opportunities, parsePayToHourly } from "@/lib/data/opportunities";

export default function Home() {
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"Newest" | "Highest pay">("Newest");
  const [includeRemote, setIncludeRemote] = useState(true);
  const [levels, setLevels] = useState<string[]>(["Internship"]);
  const [showHybrid, setShowHybrid] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showCertOnly, setShowCertOnly] = useState(false);
  const [showWebinarOnly, setShowWebinarOnly] = useState(false);
  const [salaryRange, setSalaryRange] = useState<string[]>([]);
  const [workingHours, setWorkingHours] = useState<string[]>([]);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const visibleOpportunities = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const filtered = opportunities.filter((job) => {
      const searchable = [job.title, job.company, job.location, job.type, job.level, ...job.skills]
        .join(" ")
        .toLowerCase();
      const isRemoteAllowed = includeRemote || job.type !== "Remote";
      const isHybridAllowed = showHybrid || job.type !== "Hybrid";
      const levelMatches = levels.length === 0 || levels.includes(job.level);
      const certMatches = !showCertOnly || job.hasCertification === true;
      const webinarMatches = !showWebinarOnly || job.hasWebinar === true;
      // When both filters are active, use OR logic (show roles with either attribute)
      const learningMatches = (showCertOnly && showWebinarOnly)
        ? (job.hasCertification === true || job.hasWebinar === true)
        : (certMatches && webinarMatches);

      // Salary range filter
      let salaryMatches = true;
      if (salaryRange.length > 0) {
        const hourlyRate = parsePayToHourly(job.pay);
        salaryMatches = salaryRange.some((range) => {
          if (range === "$0-20/hr") return hourlyRate >= 0 && hourlyRate <= 20;
          if (range === "$20-40/hr") return hourlyRate > 20 && hourlyRate <= 40;
          if (range === "$40-60/hr") return hourlyRate > 40 && hourlyRate <= 60;
          if (range === "$60+/hr") return hourlyRate > 60;
          return true;
        });
      }

      // Work arrangement filter
      let hoursMatches = true;
      if (workingHours.length > 0) {
        hoursMatches = workingHours.some((hours) => {
          if (hours === "On-site only") return job.type === "In person";
          if (hours === "Remote") return job.type === "Remote";
          if (hours === "Hybrid") return job.type === "Hybrid";
          return true;
        });
      }

      return searchable.includes(query) && isRemoteAllowed && isHybridAllowed && levelMatches && learningMatches && salaryMatches && hoursMatches;
    });

    return [...filtered].sort((first, second) =>
      sortOrder === "Highest pay" ? parsePayToHourly(second.pay) - parsePayToHourly(first.pay) : 0,
    );
  }, [includeRemote, levels, searchQuery, showCertOnly, showWebinarOnly, showHybrid, sortOrder, salaryRange, workingHours]);

  const homepageOpportunities = visibleOpportunities.slice(0, 6);

  function toggleSave(title: string) {
    setSavedJobs((current) =>
      current.includes(title)
        ? current.filter((savedTitle) => savedTitle !== title)
        : [...current, title],
    );
  }

  function toggleLevel(level: string) {
    setLevels((current) =>
      current.includes(level) ? current.filter((item) => item !== level) : [...current, level],
    );
  }

  function clearFilters() {
    setSearchQuery("");
    setIncludeRemote(true);
    setShowHybrid(true);
    setShowCertOnly(false);
    setShowWebinarOnly(false);
    setLevels(["Internship"]);
    setSortOrder("Newest");
    setSalaryRange([]);
    setWorkingHours([]);
  }

  function toggleSalaryRange(range: string) {
    setSalaryRange((current) =>
      current.includes(range) ? current.filter((r) => r !== range) : [...current, range],
    );
  }

  function toggleWorkingHours(hours: string) {
    setWorkingHours((current) =>
      current.includes(hours) ? current.filter((h) => h !== hours) : [...current, hours],
    );
  }

  function openContactModal() {
    setContactSubmitted(false);
    setContactEmail("");
    setContactPhone("");
    setContactMessage("");
    setContactModalOpen(true);
  }

  function submitContactForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!contactEmail.trim()) return;
    // Persist submission to localStorage
    const submission = {
      email: contactEmail.trim(),
      phone: contactPhone.trim(),
      message: contactMessage.trim(),
      submittedAt: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem("internhub_contact_submissions") || "[]");
    existing.push(submission);
    localStorage.setItem("internhub_contact_submissions", JSON.stringify(existing));

    // Send registration email via API (fire-and-forget)
    fetch("/api/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: contactEmail.trim(),
        name: contactEmail.trim().split("@")[0],
        type: "registration",
        data: { event_name: "InternHub Program" },
      }),
    }).catch(() => {
      // Silently ignore email errors
    });

    setContactSubmitted(true);
  }

  return (
    <main className="min-h-[100dvh] overflow-hidden bg-background text-foreground">
      {/* Hero */}
      <section id="top" className="relative border-b border-border bg-surface">
        <div className="pointer-events-none absolute -left-40 -top-40 size-[480px] rounded-full bg-accent/5 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-10 size-[320px] rounded-full bg-accent/3 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-20">
          <motion.div
            className="max-w-xl self-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]">
              Opportunities that meet you where you are.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted">
              Find internships and early-career roles with transparent pay, flexible setups, and location-aware details.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/get-started"
                className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-accent px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-hover active:scale-[0.98]"
              >
                Find my matches <ArrowRight size={16} />
              </Link>
              <a
                href="#opportunities"
                className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground transition hover:border-border-hover hover:bg-accent-light"
              >
                Browse all roles
              </a>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-sm text-muted">
              <span className="inline-flex items-center gap-2"><BadgeCheck size={16} className="text-accent" /> Verified employers</span>
              <span className="inline-flex items-center gap-2"><BadgeCheck size={16} className="text-accent" /> Salary transparency</span>
              <span className="inline-flex items-center gap-2"><BadgeCheck size={16} className="text-accent" /> Venue-aware</span>
            </div>
          </motion.div>

          {/* Feature Highlights Card */}
          <motion.div
            className="rounded-[var(--radius)] border border-border bg-surface-elevated p-5 shadow-[var(--card-shadow)] sm:p-7"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-xl font-bold tracking-tight text-foreground">Why InternHub?</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">Everything you need to land your first role.</p>

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3 rounded-[var(--radius-sm)] border border-border bg-background p-4">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-accent-light text-accent">
                  <TrendingUp size={17} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">13+ Active Opportunities</p>
                  <p className="mt-0.5 text-xs text-muted">From top companies like Vercel, OpenAI, Stripe, and more</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-[var(--radius-sm)] border border-border bg-background p-4">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-accent-light text-accent">
                  <Zap size={17} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Location-Aware Matching</p>
                  <p className="mt-0.5 text-xs text-muted">Set your location once and get distance-based results</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-[var(--radius-sm)] border border-border bg-background p-4">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-accent-light text-accent">
                  <GraduationCap size={17} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Free Certifications</p>
                  <p className="mt-0.5 text-xs text-muted">Skill up with webinars and courses tied to real roles</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-[var(--radius-sm)] border border-border bg-background p-4">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-accent-light text-accent">
                  <Globe size={17} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Local to Global</p>
                  <p className="mt-0.5 text-xs text-muted">Start nearby and expand your search when you are ready</p>
                </div>
              </div>
            </div>

            <Link
              href="/get-started"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover active:scale-[0.98]"
            >
              Create your profile <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>

      </section>

      {/* Opportunities */}
      <section id="opportunities" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Opportunities that fit your life
            </h2>
            <p className="mt-1.5 text-muted">Clear pay, clear expectations, location-aware details.</p>
          </div>
        </div>

        <AnimatePresence>
          {selectedRole && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-5 overflow-hidden"
            >
              <div className="flex items-center justify-between gap-4 rounded-[var(--radius-sm)] border border-accent/20 bg-accent-light px-4 py-3 text-sm text-foreground">
                <span><strong>{selectedRole}</strong> is ready for your application.</span>
                <button onClick={() => setSelectedRole(null)} aria-label="Dismiss" className="rounded-[var(--radius-xs)] p-1 hover:bg-accent/10"><X size={15} /></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          {/* Sidebar Filters */}
          <aside className="h-fit rounded-[var(--radius)] border border-border bg-surface p-5 shadow-[var(--card-shadow)]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">Filters</h3>
              <SlidersHorizontal size={15} className="text-muted" />
            </div>

            <div className="mt-5 space-y-5">
              <div className="border-t border-border pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">Location</p>
                <label className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <input checked={includeRemote} onChange={(e) => setIncludeRemote(e.target.checked)} type="checkbox" className="size-3.5 accent-accent" />
                  Include remote
                </label>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">Level</p>
                <div className="mt-2.5 space-y-2 text-sm text-muted-foreground">
                  <label className="flex items-center gap-2">
                    <input checked={levels.includes("Internship")} onChange={() => toggleLevel("Internship")} type="checkbox" className="size-3.5 accent-accent" /> Internship
                  </label>
                  <label className="flex items-center gap-2">
                    <input checked={levels.includes("Entry level")} onChange={() => toggleLevel("Entry level")} type="checkbox" className="size-3.5 accent-accent" /> Entry level
                  </label>
                  <label className="flex items-center gap-2">
                    <input checked={showHybrid} onChange={(e) => setShowHybrid(e.target.checked)} type="checkbox" className="size-3.5 accent-accent" /> Hybrid roles
                  </label>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">Learning</p>
                <div className="mt-2.5 space-y-2 text-sm text-muted-foreground">
                  <label className="flex items-center gap-2">
                    <input checked={showCertOnly} onChange={(e) => setShowCertOnly(e.target.checked)} type="checkbox" className="size-3.5 accent-accent" /> Certifications
                  </label>
                  <p className="pl-[22px] text-xs text-muted">Show roles with certifications available</p>
                  <label className="flex items-center gap-2">
                    <input checked={showWebinarOnly} onChange={(e) => setShowWebinarOnly(e.target.checked)} type="checkbox" className="size-3.5 accent-accent" /> Webinars
                  </label>
                  <p className="pl-[22px] text-xs text-muted">Show roles with webinar access</p>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">Salary Range</p>
                <div className="mt-2.5 space-y-2 text-sm text-muted-foreground">
                  {["$0-20/hr", "$20-40/hr", "$40-60/hr", "$60+/hr"].map((range) => (
                    <label key={range} className="flex items-center gap-2">
                      <input checked={salaryRange.includes(range)} onChange={() => toggleSalaryRange(range)} type="checkbox" className="size-3.5 accent-accent" /> {range}
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">Work Arrangement</p>
                <div className="mt-2.5 space-y-2 text-sm text-muted-foreground">
                  {["On-site only", "Remote", "Hybrid"].map((hours) => (
                    <label key={hours} className="flex items-center gap-2">
                      <input checked={workingHours.includes(hours)} onChange={() => toggleWorkingHours(hours)} type="checkbox" className="size-3.5 accent-accent" /> {hours}
                    </label>
                  ))}
                </div>
              </div>

              <button onClick={clearFilters} className="w-full border-t border-border pt-4 text-left text-sm font-semibold text-accent hover:text-accent-hover">
                Clear all
              </button>
            </div>
          </aside>

          {/* Job Listings */}
          <div>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row">
              <label className="relative flex-1">
                <Search size={16} className="pointer-events-none absolute left-3.5 top-3 text-muted" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search jobs"
                  placeholder="Search roles, skills, or companies"
                  className="w-full rounded-[var(--radius-sm)] border border-border bg-surface py-2.5 pl-10 pr-4 text-sm text-foreground transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </label>
              <button
                onClick={() => setSortOrder((current) => current === "Newest" ? "Highest pay" : "Newest")}
                className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-border bg-surface px-3.5 py-2.5 text-sm font-medium text-foreground transition hover:border-border-hover"
              >
                {sortOrder} <ChevronDown size={14} />
              </button>
            </div>

            <div className="mb-4 flex items-center justify-between px-0.5 text-sm text-muted">
              <p><strong className="text-foreground">{visibleOpportunities.length}</strong> matches {visibleOpportunities.length > 6 && <span>(showing 6)</span>}</p>
            </div>

            <div className="space-y-3">
              {homepageOpportunities.length > 0 ? (
                <>
                  {homepageOpportunities.map((job, index) => {
                  const isSaved = savedJobs.includes(job.title);
                  const typeColors: Record<string, string> = {
                    Remote: "bg-violet-100 text-black dark:bg-violet-900/40 dark:text-violet-100",
                    "In person": "bg-blue-100 text-black dark:bg-blue-900/40 dark:text-blue-100",
                    Hybrid: "bg-teal-100 text-black dark:bg-teal-900/40 dark:text-teal-100",
                  };
                  const scopeColors: Record<string, string> = {
                    Local: "text-emerald-600 dark:text-emerald-400",
                    National: "text-amber-600 dark:text-amber-400",
                    Global: "text-violet-600 dark:text-violet-400",
                  };
                  return (
                    <motion.article
                      key={job.title}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
                      className="group rounded-[var(--radius)] border border-border bg-surface p-5 transition hover:border-border-hover hover:shadow-[var(--card-shadow-hover)]"
                    >
                      <div className="flex gap-4">
                        <div className={`flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-sm)] text-base font-bold ${job.iconBg}`}>
                          {job.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-base font-bold tracking-tight text-foreground">{job.title}</h3>
                                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${typeColors[job.type]}`}>{job.type}</span>
                              </div>
                              <p className="mt-0.5 text-sm text-muted">{job.company}</p>
                            </div>
                            <button
                              onClick={() => toggleSave(job.title)}
                              aria-label={`Save ${job.title}`}
                              className={`shrink-0 rounded-[var(--radius-xs)] p-1.5 transition ${isSaved ? "bg-accent-light text-accent" : "text-muted hover:bg-accent-light hover:text-accent"}`}
                            >
                              <Bookmark size={17} fill={isSaved ? "currentColor" : "none"} />
                            </button>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted">
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin size={14} className="text-accent" /> {job.location}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <BriefcaseBusiness size={14} /> {job.pay}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <Clock3 size={14} /> {job.posted}
                            </span>
                          </div>

                          <div className="mt-3.5 flex flex-wrap items-center gap-2">
                            {job.skills.map((skill) => (
                              <span key={skill} className="rounded-[var(--radius-xs)] bg-accent-light px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                {skill}
                              </span>
                            ))}
                            <span className={`inline-flex items-center gap-1 text-xs font-semibold ${scopeColors[job.scope]}`}>
                              <Globe size={12} /> {job.scope}
                            </span>
                            {job.hasCertification && (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                <GraduationCap size={12} /> Cert available
                              </span>
                            )}
                            {job.hasWebinar && (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                                <Video size={12} /> Webinar
                              </span>
                            )}
                            <button
                              onClick={() => setSelectedRole(job.title)}
                              className="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-accent transition hover:text-accent-hover"
                            >
                              View <ArrowRight size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
                  {visibleOpportunities.length > 6 && (
                    <div className="mt-4 text-center">
                      <Link
                        href="/opportunities"
                        className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover active:scale-[0.98]"
                      >
                        View all opportunities <ArrowRight size={15} />
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-[var(--radius)] border border-dashed border-border bg-surface px-6 py-14 text-center">
                  <Search size={20} className="mx-auto text-muted" />
                  <h3 className="mt-3 font-bold text-foreground">No matches found</h3>
                  <p className="mt-1 text-sm text-muted">Try adjusting your filters or search terms.</p>
                  <button onClick={clearFilters} className="mt-4 text-sm font-semibold text-accent hover:text-accent-hover">
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            A clearer path from local to global
          </h2>
          <p className="mt-2 max-w-lg text-muted">
            Set your preferences once, then let the platform work for you.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-[5px]">
            {[
              {
                icon: MapPin,
                title: "Set your location",
                description: "Your city, commute range, and scope keep venue distances practical and results relevant.",
              },
              {
                icon: SlidersHorizontal,
                title: "Refine what matters",
                description: "Filter by work setup, level, pay, skills, and online certifications or webinars available to surface the right opportunities.",
              },
              {
                icon: Compass,
                title: "Expand with confidence",
                description: "Start local, then widen to national or global when you are ready for more.",
              },
              {
                icon: Bookmark,
                title: "Stay organized",
                description: "Save roles and track applications as you explore your next step.",
              },
              {
                icon: GraduationCap,
                title: "Learn as you go",
                description: "Access online certifications and webinars tied to roles so you can skill up while you search.",
              },
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="w-[calc(50%-3px)] rounded-[var(--radius)] border border-border bg-surface p-7 sm:p-8 md:w-[calc(50%-3px)]"
                >
                  <div className="flex size-10 items-center justify-center rounded-[var(--radius-sm)] bg-accent-light text-accent">
                    <Icon size={19} />
                  </div>
                  <h3 className="mt-5 text-base font-bold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Webinars & Certifications */}
      <section id="learn" className="border-t border-border">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Level up with webinars and certifications
              </h2>
              <p className="mt-2 max-w-lg text-muted">
                Free and paid programs to sharpen your dev skills and stand out to employers.
              </p>
            </div>
            <a href="#learn" className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition hover:text-accent-hover">
              View all programs <ArrowRight size={15} />
            </a>
          </div>

          {/* Upcoming Webinars */}
          <div className="mt-10">
            <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Video size={16} className="text-accent" /> Upcoming webinars
            </h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Building Production APIs with Node.js",
                  speaker: "Aisha Patel, Staff Engineer at Vercel",
                  date: "Jul 22, 2026",
                  time: "2:00 PM EST",
                  attendees: 342,
                  tag: "Backend",
                  live: true,
                },
                {
                  title: "React Server Components Deep Dive",
                  speaker: "Marcus Chen, Core Team at Next.js",
                  date: "Jul 25, 2026",
                  time: "11:00 AM EST",
                  attendees: 518,
                  tag: "Frontend",
                  live: false,
                },
                {
                  title: "System Design for Early-Career Engineers",
                  speaker: "Fatima Al-Rashid, Principal Eng at Stripe",
                  date: "Jul 29, 2026",
                  time: "3:00 PM EST",
                  attendees: 276,
                  tag: "Architecture",
                  live: false,
                },
              ].map((webinar, i) => (
                <motion.article
                  key={webinar.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="group flex flex-col rounded-[var(--radius)] border border-border bg-surface p-5 transition hover:border-border-hover hover:shadow-[var(--card-shadow-hover)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-[var(--radius-xs)] bg-accent-light px-2 py-0.5 text-xs font-semibold text-accent">
                      {webinar.tag}
                    </span>
                    {webinar.live && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                        Filling fast
                      </span>
                    )}
                  </div>
                  <h4 className="mt-3 text-base font-bold tracking-tight text-foreground">{webinar.title}</h4>
                  <p className="mt-1.5 text-sm text-muted">{webinar.speaker}</p>
                  <div className="mt-auto pt-4">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar size={13} /> {webinar.date}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 size={13} /> {webinar.time}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs text-muted">
                        <Users size={13} /> {webinar.attendees} registered
                      </span>
                      <button onClick={openContactModal} className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition hover:text-accent-hover">
                        Register <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="mt-14">
            <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Award size={16} className="text-accent" /> Certifications for developers
            </h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {[
                {
                  title: "Full-Stack Web Development",
                  provider: "InternHub Academy",
                  modules: 12,
                  hours: 48,
                  level: "Beginner to Intermediate",
                  skills: ["React", "Node.js", "PostgreSQL", "TypeScript"],
                  price: "Free",
                  enrolled: 2847,
                  icon: Code2,
                },
                {
                  title: "Cloud Infrastructure Fundamentals",
                  provider: "InternHub Academy",
                  modules: 8,
                  hours: 32,
                  level: "Intermediate",
                  skills: ["AWS", "Docker", "CI/CD", "Terraform"],
                  price: "$49",
                  enrolled: 1523,
                  icon: Globe,
                },
                {
                  title: "Frontend Engineering Professional",
                  provider: "InternHub Academy",
                  modules: 10,
                  hours: 40,
                  level: "Intermediate to Advanced",
                  skills: ["React", "Performance", "Accessibility", "Testing"],
                  price: "Free",
                  enrolled: 3124,
                  icon: Play,
                },
                {
                  title: "Data Engineering with Python",
                  provider: "InternHub Academy",
                  modules: 9,
                  hours: 36,
                  level: "Beginner to Intermediate",
                  skills: ["Python", "Pandas", "SQL", "ETL Pipelines"],
                  price: "$39",
                  enrolled: 1891,
                  icon: GraduationCap,
                },
              ].map((cert, i) => {
                const CertIcon = cert.icon;
                return (
                  <motion.article
                    key={cert.title}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className="group flex gap-4 rounded-[var(--radius)] border border-border bg-surface p-5 transition hover:border-border-hover hover:shadow-[var(--card-shadow-hover)]"
                  >
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-accent-light text-accent">
                      <CertIcon size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-base font-bold tracking-tight text-foreground">{cert.title}</h4>
                          <p className="mt-0.5 text-sm text-muted">{cert.provider}</p>
                        </div>
                        <span className={`shrink-0 rounded-[var(--radius-xs)] px-2 py-0.5 text-xs font-bold ${
                          cert.price === "Free"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                        }`}>
                          {cert.price}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted">
                        <span>{cert.modules} modules</span>
                        <span>{cert.hours} hours</span>
                        <span>{cert.level}</span>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {cert.skills.map((skill) => (
                          <span key={skill} className="rounded-[var(--radius-xs)] bg-accent-light px-2 py-0.5 text-xs font-medium text-muted-foreground">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="mt-3.5 flex items-center justify-between">
                        <span className="text-xs text-muted">{cert.enrolled.toLocaleString()} enrolled</span>
                        <button onClick={openContactModal} className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition hover:text-accent-hover">
                          Enroll <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Modal */}
      <AnimatePresence>
        {contactModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={() => setContactModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md rounded-[var(--radius)] border border-border bg-surface-elevated p-6 shadow-xl sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-foreground">Contact Information</h2>
                  <p className="mt-1.5 text-sm text-muted">Fill in your details to register or enroll.</p>
                </div>
                <button onClick={() => setContactModalOpen(false)} aria-label="Close" className="rounded-[var(--radius-xs)] p-1.5 text-muted transition hover:bg-accent-light hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              {contactSubmitted ? (
                <div className="mt-6 rounded-[var(--radius-sm)] border border-emerald-200 bg-emerald-50 p-5 text-center dark:border-emerald-800 dark:bg-emerald-900/20">
                  <Check size={24} className="mx-auto text-emerald-600 dark:text-emerald-400" />
                  <h3 className="mt-3 font-bold text-foreground">Submitted successfully!</h3>
                  <p className="mt-1 text-sm text-muted">Our team will contact you at the provided email/phone.</p>
                  <button onClick={() => setContactModalOpen(false)} className="mt-4 text-sm font-semibold text-accent hover:text-accent-hover">
                    Close
                  </button>
                </div>
              ) : (
                <form className="mt-6 space-y-4" onSubmit={submitContactForm}>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-foreground">Email / Gmail</span>
                    <input
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      required
                      type="email"
                      placeholder="you@example.com"
                      className="w-full rounded-[var(--radius-sm)] border border-border bg-background px-3.5 py-2.5 text-sm text-foreground transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-foreground">Phone number</span>
                    <input
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className="w-full rounded-[var(--radius-sm)] border border-border bg-background px-3.5 py-2.5 text-sm text-foreground transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-foreground">Additional information</span>
                    <textarea
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      rows={3}
                      placeholder="Any additional details or questions..."
                      className="w-full rounded-[var(--radius-sm)] border border-border bg-background px-3.5 py-2.5 text-sm text-foreground transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
                    />
                  </label>
                  <button className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover active:scale-[0.98]" type="submit">
                    <Check size={16} /> Submit
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
