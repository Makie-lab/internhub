export type Opportunity = {
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

export const opportunities: Opportunity[] = [
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

/**
 * Parses a pay string and returns the hourly equivalent.
 * Handles both "/hr" and "/yr" formats (e.g., "$32-$38/hr", "$64k-$76k/yr").
 * For annual salaries, converts to hourly assuming 2080 working hours per year.
 */
export function parsePayToHourly(pay: string): number {
  const isAnnual = pay.includes("/yr");
  // Extract the first number from the pay string
  const match = pay.match(/[\d.]+/);
  if (!match) return 0;
  let num = parseFloat(match[0]);

  // If the string contains "k" after the number, multiply by 1000
  const kMatch = pay.match(/[\d.]+(k)/i);
  if (kMatch) {
    num = num * 1000;
  }

  // Convert annual to hourly (2080 hours/year)
  if (isAnnual) {
    num = num / 2080;
  }

  return num;
}
