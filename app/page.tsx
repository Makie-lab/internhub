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
  Navigation,
  Pencil,
  Play,
  Search,
  SlidersHorizontal,
  Users,
  Video,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { FormEvent, useMemo, useState } from "react";

type Opportunity = {
  title: string;
  company: string;
  location: string;
  nearby: string;
  pay: string;
  type: "Remote" | "Hybrid" | "In person";
  level: "Internship" | "Entry level";
  scope: "Local" | "National" | "Global";
  icon: string;
  iconBg: string;
  posted: string;
  skills: string[];
  hasCertification?: boolean;
  hasWebinar?: boolean;
};

const opportunities: Opportunity[] = [
  {
    title: "Product Design Intern",
    company: "Vercel",
    location: "Remote, United States",
    nearby: "Remote-friendly",
    pay: "$32-$38/hr",
    type: "Remote",
    level: "Internship",
    scope: "National",
    icon: "V",
    iconBg: "bg-black dark:bg-white dark:text-black text-white",
    posted: "Posted today",
    skills: ["Product design", "Figma"],
    hasCertification: true,
  },
  {
    title: "Data Analytics Intern",
    company: "Capital One",
    location: "Richmond, VA",
    nearby: "8.4 mi away",
    pay: "$28-$34/hr",
    type: "In person",
    level: "Internship",
    scope: "Local",
    icon: "C",
    iconBg: "bg-blue-700 text-white",
    posted: "Posted 2h ago",
    skills: ["SQL", "Tableau"],
    hasWebinar: true,
  },
  {
    title: "Software Engineering Intern",
    company: "Notion",
    location: "New York, NY",
    nearby: "Hybrid venue",
    pay: "$36-$42/hr",
    type: "Hybrid",
    level: "Internship",
    scope: "National",
    icon: "N",
    iconBg: "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900",
    posted: "Posted yesterday",
    skills: ["TypeScript", "React"],
    hasCertification: true,
    hasWebinar: true,
  },
  {
    title: "Junior Customer Success Associate",
    company: "Webflow",
    location: "San Francisco, CA",
    nearby: "Hybrid venue",
    pay: "$64k-$76k/yr",
    type: "Hybrid",
    level: "Entry level",
    scope: "National",
    icon: "W",
    iconBg: "bg-blue-600 text-white",
    posted: "Posted 1d ago",
    skills: ["Customer success", "SaaS"],
    hasWebinar: true,
  },
  {
    title: "Marketing Coordinator Intern",
    company: "Stripe",
    location: "Remote, Global",
    nearby: "Remote-friendly",
    pay: "$30-$36/hr",
    type: "Remote",
    level: "Internship",
    scope: "Global",
    icon: "S",
    iconBg: "bg-indigo-600 text-white",
    posted: "Posted 3h ago",
    skills: ["Content strategy", "Analytics"],
    hasCertification: true,
  },
  {
    title: "Frontend Engineering Intern",
    company: "Linear",
    location: "San Francisco, CA",
    nearby: "12.1 mi away",
    pay: "$40-$48/hr",
    type: "In person",
    level: "Internship",
    scope: "National",
    icon: "L",
    iconBg: "bg-violet-600 text-white",
    posted: "Posted 5h ago",
    skills: ["React", "CSS", "TypeScript"],
    hasCertification: true,
  },
];

const radiusOptions = ["10", "25", "50", "100"];

export default function Home() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [country, setCountry] = useState("");
  const [radius, setRadius] = useState("25");
  const [scope, setScope] = useState("Local first");
  const [profileCreated, setProfileCreated] = useState(false);
  const [editingLocation, setEditingLocation] = useState(false);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"Newest" | "Highest pay">("Newest");
  const [includeRemote, setIncludeRemote] = useState(true);
  const [levels, setLevels] = useState<string[]>(["Internship"]);
  const [showHybrid, setShowHybrid] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showCertOnly, setShowCertOnly] = useState(false);
  const [showWebinarOnly, setShowWebinarOnly] = useState(false);

  const formattedLocation = [city, region, country].filter(Boolean).join(", ") || "Your location";
  const profileIsEditing = !profileCreated || editingLocation;

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
      return searchable.includes(query) && isRemoteAllowed && isHybridAllowed && levelMatches && learningMatches;
    });

    return [...filtered].sort((first, second) =>
      sortOrder === "Highest pay" ? second.pay.localeCompare(first.pay) : 0,
    );
  }, [includeRemote, levels, searchQuery, showCertOnly, showWebinarOnly, showHybrid, sortOrder]);

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !city.trim() || !country) return;
    setProfileCreated(true);
    setEditingLocation(false);
  }

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

  function openLocationEditor() {
    setEditingLocation(true);
    window.setTimeout(() => {
      document.getElementById("location-preferences")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 0);
  }

  function clearFilters() {
    setSearchQuery("");
    setIncludeRemote(true);
    setShowHybrid(true);
    setShowCertOnly(false);
    setShowWebinarOnly(false);
    setLevels(["Internship"]);
    setSortOrder("Newest");
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
              <button
                onClick={openLocationEditor}
                className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-accent px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-hover active:scale-[0.98]"
              >
                {profileCreated ? "Update preferences" : "Find my matches"} <ArrowRight size={16} />
              </button>
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

          {/* Profile / Location Card */}
          <motion.section
            id="location-preferences"
            className="rounded-[var(--radius)] border border-border bg-surface-elevated p-5 shadow-[var(--card-shadow)] sm:p-7"
            aria-labelledby="location-title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {profileIsEditing ? (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 id="location-title" className="text-xl font-bold tracking-tight">
                      {profileCreated ? "Update your location" : "Create your profile"}
                    </h2>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">
                      We use this to rank nearby venues and calculate distances.
                    </p>
                  </div>
                  {profileCreated && (
                    <button onClick={() => setEditingLocation(false)} aria-label="Close" className="rounded-[var(--radius-xs)] p-1.5 text-muted transition hover:bg-accent-light hover:text-foreground">
                      <X size={18} />
                    </button>
                  )}
                </div>
                <form className="mt-6 space-y-4" onSubmit={saveProfile}>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-foreground">Your name</span>
                    <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Jordan Lee" className="w-full rounded-[var(--radius-sm)] border border-border bg-background px-3.5 py-2.5 text-sm text-foreground transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20" />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-foreground">City</span>
                      <input value={city} onChange={(e) => setCity(e.target.value)} required placeholder="e.g. Richmond" className="w-full rounded-[var(--radius-sm)] border border-border bg-background px-3.5 py-2.5 text-sm text-foreground transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20" />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-muted-foreground">State (optional)</span>
                      <input value={region} onChange={(e) => setRegion(e.target.value)} placeholder="e.g. Virginia" className="w-full rounded-[var(--radius-sm)] border border-border bg-background px-3.5 py-2.5 text-sm text-foreground transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20" />
                    </label>
                  </div>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-foreground">Country</span>
                    <span className="relative block">
                      <select value={country} onChange={(e) => setCountry(e.target.value)} required className="w-full appearance-none rounded-[var(--radius-sm)] border border-border bg-background px-3.5 py-2.5 text-sm text-foreground transition focus:border-accent focus:ring-2 focus:ring-accent/20">
                        <option value="" disabled>Select country</option>
                        <option>United States</option>
                        <option>Canada</option>
                        <option>United Kingdom</option>
                        <option>Australia</option>
                        <option>Other</option>
                      </select>
                      <ChevronDown size={15} className="pointer-events-none absolute right-3 top-3 text-muted" />
                    </span>
                  </label>
                  <fieldset>
                    <legend className="mb-2 block text-sm font-medium text-foreground">Commute radius</legend>
                    <div className="grid grid-cols-4 gap-2">
                      {radiusOptions.map((distance) => (
                        <button
                          key={distance}
                          type="button"
                          onClick={() => setRadius(distance)}
                          className={`rounded-[var(--radius-sm)] border px-2 py-2 text-sm font-semibold transition ${
                            radius === distance
                              ? "border-accent bg-accent/10 text-accent"
                              : "border-border bg-background text-muted hover:border-border-hover"
                          }`}
                        >
                          {distance} mi
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-foreground">Search scope</span>
                    <span className="relative block">
                      <select value={scope} onChange={(e) => setScope(e.target.value)} className="w-full appearance-none rounded-[var(--radius-sm)] border border-border bg-background px-3.5 py-2.5 text-sm text-foreground transition focus:border-accent focus:ring-2 focus:ring-accent/20">
                        <option>Local first</option>
                        <option>National opportunities</option>
                        <option>Global opportunities</option>
                      </select>
                      <ChevronDown size={15} className="pointer-events-none absolute right-3 top-3 text-muted" />
                    </span>
                  </label>
                  <button className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover active:scale-[0.98]" type="submit">
                    <Check size={16} /> {profileCreated ? "Save preferences" : "Save and continue"}
                  </button>
                </form>
              </>
            ) : (
              <div className="flex min-h-[420px] flex-col justify-between">
                <div>
                  <div className="flex size-11 items-center justify-center rounded-[var(--radius-sm)] bg-accent-light text-accent">
                    <BadgeCheck size={22} />
                  </div>
                  <h2 id="location-title" className="mt-5 text-2xl font-bold tracking-tight">Welcome, {name}.</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    Matches prioritize venues within {radius} miles of {formattedLocation}, then expand to {scope.toLowerCase()}.
                  </p>
                  <div className="mt-6 rounded-[var(--radius-sm)] border border-border bg-accent-light p-4">
                    <div className="flex items-start gap-3">
                      <Navigation size={17} className="mt-0.5 shrink-0 text-accent" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">Location matching active</p>
                        <p className="mt-0.5 text-sm text-muted">Distance and work setup factored into your results.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 space-y-2.5">
                  <button onClick={openLocationEditor} className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-accent-light">
                    <Pencil size={15} /> Edit preferences
                  </button>
                  <a href="#opportunities" className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover active:scale-[0.98]">
                    View matches <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            )}
          </motion.section>
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
          {profileCreated && (
            <button onClick={openLocationEditor} className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition hover:text-accent-hover">
              <MapPin size={15} /> Matching from {city}
            </button>
          )}
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
                <button onClick={openLocationEditor} className="mt-2.5 flex w-full items-start gap-2 text-left text-sm font-medium text-foreground">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-accent" />
                  <span>{profileCreated ? `${formattedLocation}` : "Set your location"}</span>
                </button>
                {profileCreated && <p className="mt-1 pl-[23px] text-xs text-muted">{radius} mi radius</p>}
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
              <p><strong className="text-foreground">{visibleOpportunities.length}</strong> matches</p>
              {profileCreated && (
                <p className="hidden items-center gap-1.5 text-accent sm:flex">
                  <Navigation size={14} /> Location active
                </p>
              )}
            </div>

            <div className="space-y-3">
              {visibleOpportunities.length > 0 ? (
                visibleOpportunities.map((job, index) => {
                  const isSaved = savedJobs.includes(job.title);
                  const typeColors: Record<string, string> = {
                    Remote: "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
                    "In person": "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
                    Hybrid: "bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
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

      {/* How it works */}
      <section id="how-it-works" className="border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            A clearer path from local to global
          </h2>
          <p className="mt-2 max-w-lg text-muted">
            Set your preferences once, then let the platform work for you.
          </p>

          <div className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius)] border border-border bg-border md:grid-cols-2">
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
                  className="bg-surface p-7 sm:p-8"
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
                      <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition hover:text-accent-hover">
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
                        <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition hover:text-accent-hover">
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

    </main>
  );
}
