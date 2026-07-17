"use client";

import {
  Bookmark,
  BriefcaseBusiness,
  Clock3,
  Globe,
  GraduationCap,
  MapPin,
  Search,
  Video,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useMemo, useState } from "react";

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
  {
    title: "Machine Learning Intern",
    company: "OpenAI",
    location: "San Francisco, CA",
    nearby: "15.3 mi away",
    pay: "$50-$60/hr",
    type: "In person",
    level: "Internship",
    scope: "National",
    icon: "O",
    iconBg: "bg-emerald-600 text-white",
    posted: "Posted 4h ago",
    skills: ["Python", "PyTorch", "ML"],
    hasCertification: true,
    hasWebinar: true,
  },
  {
    title: "DevOps Engineering Intern",
    company: "GitLab",
    location: "Remote, Global",
    nearby: "Remote-friendly",
    pay: "$35-$42/hr",
    type: "Remote",
    level: "Internship",
    scope: "Global",
    icon: "G",
    iconBg: "bg-orange-600 text-white",
    posted: "Posted 6h ago",
    skills: ["Docker", "Kubernetes", "CI/CD"],
    hasCertification: true,
  },
  {
    title: "UX Research Intern",
    company: "Figma",
    location: "New York, NY",
    nearby: "Hybrid venue",
    pay: "$34-$40/hr",
    type: "Hybrid",
    level: "Internship",
    scope: "National",
    icon: "F",
    iconBg: "bg-pink-600 text-white",
    posted: "Posted 8h ago",
    skills: ["User research", "Prototyping"],
    hasWebinar: true,
  },
  {
    title: "Junior Backend Developer",
    company: "Supabase",
    location: "Remote, United States",
    nearby: "Remote-friendly",
    pay: "$55k-$70k/yr",
    type: "Remote",
    level: "Entry level",
    scope: "National",
    icon: "S",
    iconBg: "bg-green-600 text-white",
    posted: "Posted 1d ago",
    skills: ["PostgreSQL", "Node.js", "TypeScript"],
    hasCertification: true,
  },
  {
    title: "Content Writing Intern",
    company: "HubSpot",
    location: "Cambridge, MA",
    nearby: "5.2 mi away",
    pay: "$22-$28/hr",
    type: "In person",
    level: "Internship",
    scope: "Local",
    icon: "H",
    iconBg: "bg-orange-500 text-white",
    posted: "Posted 2d ago",
    skills: ["SEO", "Copywriting", "CMS"],
    hasWebinar: true,
  },
  {
    title: "Mobile Development Intern",
    company: "Spotify",
    location: "Stockholm, Sweden",
    nearby: "Remote-friendly",
    pay: "$38-$45/hr",
    type: "Remote",
    level: "Internship",
    scope: "Global",
    icon: "S",
    iconBg: "bg-green-500 text-white",
    posted: "Posted 12h ago",
    skills: ["React Native", "Swift", "Kotlin"],
    hasCertification: true,
    hasWebinar: true,
  },
  {
    title: "Cybersecurity Analyst Intern",
    company: "CrowdStrike",
    location: "Austin, TX",
    nearby: "Hybrid venue",
    pay: "$36-$44/hr",
    type: "Hybrid",
    level: "Internship",
    scope: "National",
    icon: "C",
    iconBg: "bg-red-600 text-white",
    posted: "Posted 1d ago",
    skills: ["Network security", "SIEM", "Python"],
    hasCertification: true,
  },
];

export default function OpportunitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [savedJobs, setSavedJobs] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return opportunities;
    return opportunities.filter((job) => {
      const searchable = [job.title, job.company, job.location, job.type, job.level, ...job.skills]
        .join(" ")
        .toLowerCase();
      return searchable.includes(query);
    });
  }, [searchQuery]);

  function toggleSave(title: string) {
    setSavedJobs((current) =>
      current.includes(title)
        ? current.filter((savedTitle) => savedTitle !== title)
        : [...current, title],
    );
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
          <p className="mt-2 text-muted">Browse all available internships and entry-level roles.</p>
        </div>

        <div className="mb-6">
          <label className="relative block max-w-md">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-3 text-muted" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search opportunities"
              placeholder="Search roles, skills, or companies"
              className="w-full rounded-[var(--radius-sm)] border border-border bg-surface py-2.5 pl-10 pr-4 text-sm text-foreground transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </label>
        </div>

        <p className="mb-4 text-sm text-muted">
          <strong className="text-foreground">{filtered.length}</strong> opportunities available
        </p>

        <div className="space-y-3">
          {filtered.map((job, index) => {
            const isSaved = savedJobs.includes(job.title);
            const typeColors: Record<string, string> = {
              Remote: "bg-violet-100 text-black dark:bg-violet-900/40 dark:text-black",
              "In person": "bg-blue-100 text-black dark:bg-blue-900/40 dark:text-black",
              Hybrid: "bg-teal-100 text-black dark:bg-teal-900/40 dark:text-black",
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
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
