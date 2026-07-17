"use client";

import {
  ArrowRight,
  Bookmark,
  BriefcaseBusiness,
  ChevronDown,
  Clock3,
  Globe,
  GraduationCap,
  MapPin,
  Search,
  SlidersHorizontal,
  Video,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { opportunities, parsePayToHourly } from "@/lib/data/opportunities";

export default function OpportunitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"Newest" | "Highest pay">("Newest");
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [includeRemote, setIncludeRemote] = useState(true);
  const [levels, setLevels] = useState<string[]>(["Internship", "Entry level"]);
  const [showHybrid, setShowHybrid] = useState(true);
  const [showCertOnly, setShowCertOnly] = useState(false);
  const [showWebinarOnly, setShowWebinarOnly] = useState(false);
  const [salaryRange, setSalaryRange] = useState<string[]>([]);
  const [workingHours, setWorkingHours] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const result = opportunities.filter((job) => {
      const searchable = [job.title, job.company, job.location, job.type, job.level, ...job.skills]
        .join(" ")
        .toLowerCase();
      const matchesQuery = !query || searchable.includes(query);
      const isRemoteAllowed = includeRemote || job.type !== "Remote";
      const isHybridAllowed = showHybrid || job.type !== "Hybrid";
      const levelMatches = levels.length === 0 || levels.includes(job.level);
      const certMatches = !showCertOnly || job.hasCertification === true;
      const webinarMatches = !showWebinarOnly || job.hasWebinar === true;
      const learningMatches = (showCertOnly && showWebinarOnly)
        ? (job.hasCertification === true || job.hasWebinar === true)
        : (certMatches && webinarMatches);

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

      let hoursMatches = true;
      if (workingHours.length > 0) {
        hoursMatches = workingHours.some((hours) => {
          if (hours === "Full-time") return job.type === "In person";
          if (hours === "Part-time") return job.level === "Internship";
          if (hours === "Flexible") return job.type === "Remote" || job.type === "Hybrid";
          return true;
        });
      }

      return matchesQuery && isRemoteAllowed && isHybridAllowed && levelMatches && learningMatches && salaryMatches && hoursMatches;
    });

    return [...result].sort((first, second) =>
      sortOrder === "Highest pay" ? second.pay.localeCompare(first.pay) : 0,
    );
  }, [searchQuery, includeRemote, showHybrid, levels, showCertOnly, showWebinarOnly, sortOrder, salaryRange, workingHours]);

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

  function clearFilters() {
    setSearchQuery("");
    setIncludeRemote(true);
    setShowHybrid(true);
    setShowCertOnly(false);
    setShowWebinarOnly(false);
    setLevels(["Internship", "Entry level"]);
    setSortOrder("Newest");
    setSalaryRange([]);
    setWorkingHours([]);
  }

  return (
    <main className="min-h-[100dvh] bg-background text-foreground">
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
        <div className="mb-8">
          <Link href="/" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition hover:text-accent-hover">
            &larr; Back to home
          </Link>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            All Opportunities
          </h1>
          <p className="mt-2 text-muted">Browse all available internships and entry-level roles with full filtering.</p>
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
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">Working Hours</p>
                <div className="mt-2.5 space-y-2 text-sm text-muted-foreground">
                  {["Full-time", "Part-time", "Flexible"].map((hours) => (
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
                  aria-label="Search opportunities"
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

            <div className="mb-4 px-0.5 text-sm text-muted">
              <p><strong className="text-foreground">{filtered.length}</strong> opportunities available</p>
            </div>

            <div className="space-y-3">
              {filtered.length > 0 ? (
                filtered.map((job, index) => {
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
                      key={`${job.title}-${job.company}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: index * 0.03, ease: [0.16, 1, 0.3, 1] }}
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
                })
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
    </main>
  );
}
