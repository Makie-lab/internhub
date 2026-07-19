"use client";

import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  Loader2,
  Navigation,
  Pencil,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { FormEvent, useState } from "react";

const radiusOptions = ["10", "25", "50", "100"];

export default function GetStartedPage() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [country, setCountry] = useState("");
  const [radius, setRadius] = useState("25");
  const [scope, setScope] = useState("Local first");
  const [profileCreated, setProfileCreated] = useState(false);
  const [editingLocation, setEditingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formattedLocation = [city, region, country].filter(Boolean).join(", ") || "Your location";
  const profileIsEditing = !profileCreated || editingLocation;

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !city.trim() || !country) return;

    setError(null);
    setIsSubmitting(true);

    try {
      // Save profile via API
      const profileRes = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerk_id: `local-${Date.now()}`,
          full_name: name.trim(),
          email: `${name.trim().toLowerCase().replace(/\s+/g, ".")}@placeholder.com`,
          location_city: city.trim(),
          location_state: region.trim() || null,
          location_country: country,
        }),
      });

      if (!profileRes.ok) {
        const data = await profileRes.json();
        throw new Error(data.error || "Failed to save profile");
      }

      // Send welcome email via API (fire-and-forget, don't block on result)
      fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: `${name.trim().toLowerCase().replace(/\s+/g, ".")}@placeholder.com`,
          name: name.trim(),
          type: "welcome",
        }),
      }).catch(() => {
        // Silently ignore email errors
      });

      setProfileCreated(true);
      setEditingLocation(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-[100dvh] overflow-hidden bg-background text-foreground">
      {/* Hero */}
      <section className="relative border-b border-border bg-surface">
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
              Get started with Grow Tern
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted">
              Create your profile to unlock location-aware matches, personalized recommendations, and distance-based filtering for opportunities near you.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/opportunities"
                className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground transition hover:border-border-hover hover:bg-accent-light"
              >
                Browse opportunities
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground transition hover:border-border-hover hover:bg-accent-light"
              >
                Back to home
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-sm text-muted">
              <span className="inline-flex items-center gap-2"><BadgeCheck size={16} className="text-accent" /> Personalized matches</span>
              <span className="inline-flex items-center gap-2"><BadgeCheck size={16} className="text-accent" /> Distance-aware</span>
              <span className="inline-flex items-center gap-2"><BadgeCheck size={16} className="text-accent" /> Free to use</span>
            </div>
          </motion.div>

          {/* Profile / Location Card */}
          <motion.section
            id="profile-form"
            className="rounded-[var(--radius)] border border-border bg-surface-elevated p-5 shadow-[var(--card-shadow)] sm:p-7"
            aria-labelledby="profile-title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {profileIsEditing ? (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 id="profile-title" className="text-xl font-bold tracking-tight">
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

                {error && (
                  <div className="mt-4 rounded-[var(--radius-sm)] border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
                    {error}
                  </div>
                )}

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
                        <option>Afghanistan</option>
                        <option>Albania</option>
                        <option>Algeria</option>
                        <option>Andorra</option>
                        <option>Angola</option>
                        <option>Antigua and Barbuda</option>
                        <option>Argentina</option>
                        <option>Armenia</option>
                        <option>Australia</option>
                        <option>Austria</option>
                        <option>Azerbaijan</option>
                        <option>Bahamas</option>
                        <option>Bahrain</option>
                        <option>Bangladesh</option>
                        <option>Barbados</option>
                        <option>Belarus</option>
                        <option>Belgium</option>
                        <option>Belize</option>
                        <option>Benin</option>
                        <option>Bhutan</option>
                        <option>Bolivia</option>
                        <option>Bosnia and Herzegovina</option>
                        <option>Botswana</option>
                        <option>Brazil</option>
                        <option>Brunei</option>
                        <option>Bulgaria</option>
                        <option>Burkina Faso</option>
                        <option>Burundi</option>
                        <option>Cabo Verde</option>
                        <option>Cambodia</option>
                        <option>Cameroon</option>
                        <option>Canada</option>
                        <option>Central African Republic</option>
                        <option>Chad</option>
                        <option>Chile</option>
                        <option>China</option>
                        <option>Colombia</option>
                        <option>Comoros</option>
                        <option>Congo (Democratic Republic)</option>
                        <option>Congo (Republic)</option>
                        <option>Costa Rica</option>
                        <option>Croatia</option>
                        <option>Cuba</option>
                        <option>Cyprus</option>
                        <option>Czech Republic</option>
                        <option>Denmark</option>
                        <option>Djibouti</option>
                        <option>Dominica</option>
                        <option>Dominican Republic</option>
                        <option>East Timor</option>
                        <option>Ecuador</option>
                        <option>Egypt</option>
                        <option>El Salvador</option>
                        <option>Equatorial Guinea</option>
                        <option>Eritrea</option>
                        <option>Estonia</option>
                        <option>Eswatini</option>
                        <option>Ethiopia</option>
                        <option>Fiji</option>
                        <option>Finland</option>
                        <option>France</option>
                        <option>Gabon</option>
                        <option>Gambia</option>
                        <option>Georgia</option>
                        <option>Germany</option>
                        <option>Ghana</option>
                        <option>Greece</option>
                        <option>Grenada</option>
                        <option>Guatemala</option>
                        <option>Guinea</option>
                        <option>Guinea-Bissau</option>
                        <option>Guyana</option>
                        <option>Haiti</option>
                        <option>Honduras</option>
                        <option>Hungary</option>
                        <option>Iceland</option>
                        <option>India</option>
                        <option>Indonesia</option>
                        <option>Iran</option>
                        <option>Iraq</option>
                        <option>Ireland</option>
                        <option>Israel</option>
                        <option>Italy</option>
                        <option>Ivory Coast</option>
                        <option>Jamaica</option>
                        <option>Japan</option>
                        <option>Jordan</option>
                        <option>Kazakhstan</option>
                        <option>Kenya</option>
                        <option>Kiribati</option>
                        <option>Kosovo</option>
                        <option>Kuwait</option>
                        <option>Kyrgyzstan</option>
                        <option>Laos</option>
                        <option>Latvia</option>
                        <option>Lebanon</option>
                        <option>Lesotho</option>
                        <option>Liberia</option>
                        <option>Libya</option>
                        <option>Liechtenstein</option>
                        <option>Lithuania</option>
                        <option>Luxembourg</option>
                        <option>Madagascar</option>
                        <option>Malawi</option>
                        <option>Malaysia</option>
                        <option>Maldives</option>
                        <option>Mali</option>
                        <option>Malta</option>
                        <option>Marshall Islands</option>
                        <option>Mauritania</option>
                        <option>Mauritius</option>
                        <option>Mexico</option>
                        <option>Micronesia</option>
                        <option>Moldova</option>
                        <option>Monaco</option>
                        <option>Mongolia</option>
                        <option>Montenegro</option>
                        <option>Morocco</option>
                        <option>Mozambique</option>
                        <option>Myanmar</option>
                        <option>Namibia</option>
                        <option>Nauru</option>
                        <option>Nepal</option>
                        <option>Netherlands</option>
                        <option>New Zealand</option>
                        <option>Nicaragua</option>
                        <option>Niger</option>
                        <option>Nigeria</option>
                        <option>North Korea</option>
                        <option>North Macedonia</option>
                        <option>Norway</option>
                        <option>Oman</option>
                        <option>Pakistan</option>
                        <option>Palau</option>
                        <option>Palestine</option>
                        <option>Panama</option>
                        <option>Papua New Guinea</option>
                        <option>Paraguay</option>
                        <option>Peru</option>
                        <option>Philippines</option>
                        <option>Poland</option>
                        <option>Portugal</option>
                        <option>Qatar</option>
                        <option>Romania</option>
                        <option>Russia</option>
                        <option>Rwanda</option>
                        <option>Saint Kitts and Nevis</option>
                        <option>Saint Lucia</option>
                        <option>Saint Vincent and the Grenadines</option>
                        <option>Samoa</option>
                        <option>San Marino</option>
                        <option>Sao Tome and Principe</option>
                        <option>Saudi Arabia</option>
                        <option>Senegal</option>
                        <option>Serbia</option>
                        <option>Seychelles</option>
                        <option>Sierra Leone</option>
                        <option>Singapore</option>
                        <option>Slovakia</option>
                        <option>Slovenia</option>
                        <option>Solomon Islands</option>
                        <option>Somalia</option>
                        <option>South Africa</option>
                        <option>South Korea</option>
                        <option>South Sudan</option>
                        <option>Spain</option>
                        <option>Sri Lanka</option>
                        <option>Sudan</option>
                        <option>Suriname</option>
                        <option>Sweden</option>
                        <option>Switzerland</option>
                        <option>Syria</option>
                        <option>Taiwan</option>
                        <option>Tajikistan</option>
                        <option>Tanzania</option>
                        <option>Thailand</option>
                        <option>Togo</option>
                        <option>Tonga</option>
                        <option>Trinidad and Tobago</option>
                        <option>Tunisia</option>
                        <option>Turkey</option>
                        <option>Turkmenistan</option>
                        <option>Tuvalu</option>
                        <option>Uganda</option>
                        <option>Ukraine</option>
                        <option>United Arab Emirates</option>
                        <option>United Kingdom</option>
                        <option>United States</option>
                        <option>Uruguay</option>
                        <option>Uzbekistan</option>
                        <option>Vanuatu</option>
                        <option>Vatican City</option>
                        <option>Venezuela</option>
                        <option>Vietnam</option>
                        <option>Yemen</option>
                        <option>Zambia</option>
                        <option>Zimbabwe</option>
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
                  <button
                    className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover active:scale-[0.98] disabled:opacity-60"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Check size={16} /> {profileCreated ? "Save preferences" : "Save and continue"}
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="flex min-h-[420px] flex-col justify-between">
                <div>
                  <div className="flex size-11 items-center justify-center rounded-[var(--radius-sm)] bg-accent-light text-accent">
                    <BadgeCheck size={22} />
                  </div>
                  <h2 id="profile-title" className="mt-5 text-2xl font-bold tracking-tight">Welcome, {name}.</h2>
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
                  <button onClick={() => setEditingLocation(true)} className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-accent-light">
                    <Pencil size={15} /> Edit preferences
                  </button>
                  <Link href="/opportunities" className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover active:scale-[0.98]">
                    View matches <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            )}
          </motion.section>
        </div>
      </section>
    </main>
  );
}
