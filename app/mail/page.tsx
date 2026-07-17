"use client";

import { ArrowRight, Mail } from "lucide-react";
import { motion } from "motion/react";

const mailApps = [
  { name: "Gmail", url: "https://mail.google.com", color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" },
  { name: "Outlook", url: "https://outlook.live.com", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
  { name: "Yahoo Mail", url: "https://mail.yahoo.com", color: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400" },
  { name: "ProtonMail", url: "https://mail.proton.me", color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" },
  { name: "iCloud Mail", url: "https://www.icloud.com/mail", color: "bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400" },
  { name: "Zoho Mail", url: "https://mail.zoho.com", color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" },
];

export default function MailPage() {
  return (
    <main className="min-h-[100dvh] bg-background text-foreground">
      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-[var(--radius-sm)] bg-accent-light text-accent">
              <Mail size={22} />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Mail
              </h1>
              <p className="mt-1 text-muted">Open your preferred mail app to manage communications.</p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {mailApps.map((app, i) => (
              <motion.a
                key={app.name}
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="group flex items-center gap-4 rounded-[var(--radius)] border border-border bg-surface p-5 transition hover:border-border-hover hover:shadow-[var(--card-shadow-hover)]"
              >
                <div className={`flex size-10 items-center justify-center rounded-[var(--radius-sm)] ${app.color}`}>
                  <Mail size={18} />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-foreground">{app.name}</h3>
                  <p className="text-sm text-muted">Open in new tab</p>
                </div>
                <ArrowRight size={16} className="text-muted transition group-hover:text-accent" />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </section>
    </main>
  );
}
