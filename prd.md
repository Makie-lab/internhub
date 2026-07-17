# Product Requirements Document (PRD)

## InternHub — National Internship & Job Application Platform

---

## 1. Overview

**Product Name:** InternHub  
**Version:** 1.0  
**Date:** July 17, 2026  
**Author:** Project Team  

### 1.1 Purpose

InternHub is a web application designed for job seekers focused on finding national internships — both face-to-face and work-from-home opportunities. The platform aggregates local to global internship and job listings, allowing users to filter by salary range, job specifications, location type (remote/on-site/hybrid), and geographic scope.

### 1.2 Target Audience

- University students seeking internships
- Recent graduates looking for entry-level positions
- Career changers exploring new industries through internships
- Employers posting internship and junior-level positions

---

## 2. Problem Statement

Job seekers, especially those targeting internships, struggle to find a centralized platform that:

- Differentiates between face-to-face and work-from-home opportunities
- Provides transparent salary/stipend ranges
- Covers local, regional, national, and global opportunities in one place
- Offers advanced filtering by job specifications, industry, and work arrangement
- Tracks application status in a streamlined way

---

## 3. Goals & Objectives

| Goal | Metric | Target |
|------|--------|--------|
| User acquisition | Monthly active users | 10,000 within 6 months |
| Job listing coverage | Total active listings | 5,000+ listings at launch |
| Application completion rate | % of started applications completed | > 70% |
| User satisfaction | NPS score | > 50 |
| Employer engagement | Listings posted per employer/month | > 5 |

---

## 4. Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | Next.js (v16+) / React 19 |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Authentication | Clerk |
| Database | Supabase (PostgreSQL) |
| File Storage | Vercel Blob |
| Email Service | Resend |
| Deployment | Vercel |
| Flow Diagrams/UI | React Flow |
| Language | TypeScript |

---

## 5. Core Features

### 5.1 User Authentication & Profiles

**Description:** Secure authentication powered by Clerk with role-based access (Job Seeker, Employer, Admin).

**Requirements:**
- Sign up / Sign in via email, Google, GitHub (Clerk)
- Job Seeker profile: name, bio, skills, education, resume upload (Vercel Blob), preferred work type, preferred salary range, location
- Employer profile: company name, logo, description, website, industry, verified status
- Profile completion progress indicator
- Account settings and notification preferences

### 5.2 Job & Internship Listings

**Description:** Browse and search internship/job listings with comprehensive filtering.

**Requirements:**
- Listing card display with: title, company, location, salary range, work type badge, posted date
- Listing detail page with full description, requirements, benefits, application deadline
- Badges/tags indicating:
  - **Scope:** Local | Regional | National | Global
  - **Work Type:** Face-to-Face | Work From Home | Hybrid
  - **Level:** Internship | Entry-Level | Junior
  - **Duration:** Part-time | Full-time | Contract | Seasonal

**Data Model (Supabase):**

```sql
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID REFERENCES employers(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT[],
  benefits TEXT[],
  location_city TEXT,
  location_state TEXT,
  location_country TEXT,
  scope TEXT CHECK (scope IN ('local', 'regional', 'national', 'global')),
  work_type TEXT CHECK (work_type IN ('face-to-face', 'work-from-home', 'hybrid')),
  level TEXT CHECK (level IN ('internship', 'entry-level', 'junior')),
  duration TEXT CHECK (duration IN ('part-time', 'full-time', 'contract', 'seasonal')),
  salary_min NUMERIC,
  salary_max NUMERIC,
  salary_currency TEXT DEFAULT 'USD',
  salary_period TEXT CHECK (salary_period IN ('hourly', 'monthly', 'annually', 'stipend')),
  industry TEXT,
  skills_required TEXT[],
  application_deadline TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 5.3 Advanced Search & Filtering

**Description:** Powerful search and filter system to help users find the perfect opportunity.

**Requirements:**
- **Full-text search** across title, description, company name, skills
- **Salary Range Filter:** Adjustable min/max slider with currency selection
- **Geographic Scope Filter:** Local (within city) → Regional (within state) → National (within country) → Global (international)
- **Distance/Range Modifier:** Configurable radius (5mi, 10mi, 25mi, 50mi, 100mi) for face-to-face roles
- **Work Type Filter:** Face-to-Face | Work From Home | Hybrid
- **Industry Filter:** Multi-select dropdown (Tech, Finance, Healthcare, Education, etc.)
- **Skills Filter:** Tag-based multi-select
- **Duration Filter:** Part-time, Full-time, Contract, Seasonal
- **Sort Options:** Relevance, Newest, Salary (High to Low), Salary (Low to High), Deadline
- **Saved Searches:** Users can save filter combinations and receive email alerts (via Resend)

### 5.4 Application Management

**Description:** Streamlined application submission and tracking system.

**Requirements:**
- One-click apply with saved profile data
- Custom application forms per listing (optional employer configuration)
- Resume/cover letter upload (Vercel Blob storage)
- Application status tracking:
  - **Applied** → **Under Review** → **Interview** → **Offer** → **Accepted/Rejected**
- Application history dashboard with status indicators
- Visual application pipeline using React Flow

**Data Model (Supabase):**

```sql
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id),
  applicant_id UUID NOT NULL,
  status TEXT CHECK (status IN ('applied', 'under_review', 'interview', 'offer', 'accepted', 'rejected', 'withdrawn')) DEFAULT 'applied',
  resume_url TEXT,
  cover_letter_url TEXT,
  custom_answers JSONB,
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 5.5 Scope Indicator System

**Description:** Visual system indicating the geographic reach of each listing.

**Requirements:**
- Color-coded scope badges:
  - 🟢 **Local** — Same city/metro area
  - 🔵 **Regional** — Same state/province
  - 🟡 **National** — Same country
  - 🟣 **Global** — International opportunities
- Map view (optional) showing listing locations
- Scope-based recommendation engine: prioritize local first, then expand outward
- User-configurable "opportunity radius" in settings

### 5.6 Salary Transparency & Range Filtering

**Description:** Transparent salary/stipend information with powerful range-based filtering.

**Requirements:**
- All listings must display salary/stipend range (required field for employers)
- Salary displayed in user's preferred currency with conversion
- Filter by:
  - Minimum salary threshold
  - Maximum salary threshold
  - Pay period (hourly, monthly, annually, stipend)
- Salary comparison indicator (above/below market average for role type)
- "Meets my range" indicator based on user's profile preferences

### 5.7 Email Notifications

**Description:** Automated email communications powered by Resend.

**Requirements:**
- Welcome email on registration
- Application status change notifications
- New listing alerts matching saved searches
- Application deadline reminders (3 days, 1 day before)
- Weekly digest of recommended opportunities
- Employer notification when receiving new applications
- Unsubscribe/preference management

### 5.8 Employer Dashboard

**Description:** Tools for employers to post and manage listings.

**Requirements:**
- Create/edit/archive job listings
- Manage incoming applications
- Applicant review interface with notes
- Application pipeline visualization (React Flow)
- Analytics: views, applications received, acceptance rate
- Bulk actions: archive expired listings, export applicant data

### 5.9 Admin Panel

**Description:** Administrative tools for platform management.

**Requirements:**
- User management (suspend, verify employers)
- Listing moderation (approve, flag, remove)
- Platform analytics dashboard
- Report management (flagged content)
- System configuration

---

## 6. Information Architecture

### 6.1 Page Structure

```
/                           → Landing page / Marketing
/sign-in                    → Clerk sign-in
/sign-up                    → Clerk sign-up
/dashboard                  → User dashboard (role-based)
/jobs                       → Listings browse & search
/jobs/[id]                  → Listing detail page
/jobs/[id]/apply            → Application form
/applications               → My applications (job seeker)
/applications/[id]          → Application detail & status
/profile                    → User profile management
/profile/settings           → Account settings
/employer/dashboard         → Employer overview
/employer/listings          → Manage listings
/employer/listings/new      → Create new listing
/employer/listings/[id]     → Edit listing
/employer/applications      → Incoming applications
/admin                      → Admin panel
```

### 6.2 Database Schema (Supabase)

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│   profiles   │     │  employers   │     │     listings     │
├──────────────┤     ├──────────────┤     ├──────────────────┤
│ id (PK)      │     │ id (PK)      │────▶│ employer_id (FK) │
│ clerk_id     │     │ clerk_id     │     │ title            │
│ full_name    │     │ company_name │     │ description      │
│ email        │     │ logo_url     │     │ scope            │
│ bio          │     │ description  │     │ work_type        │
│ skills[]     │     │ industry     │     │ salary_min/max   │
│ education    │     │ website      │     │ location_*       │
│ resume_url   │     │ verified     │     │ skills_required[]│
│ pref_salary  │     │ created_at   │     │ is_active        │
│ pref_scope   │     └──────────────┘     │ created_at       │
│ pref_worktype│                           └──────────────────┘
│ location     │                                    │
│ created_at   │                                    │
└──────────────┘                                    ▼
       │                                   ┌──────────────────┐
       │                                   │  applications    │
       └──────────────────────────────────▶├──────────────────┤
                                           │ id (PK)          │
                                           │ listing_id (FK)  │
                                           │ applicant_id(FK) │
                                           │ status           │
                                           │ resume_url       │
                                           │ cover_letter_url │
                                           │ custom_answers   │
                                           │ applied_at       │
                                           └──────────────────┘

┌──────────────────┐     ┌──────────────────┐
│  saved_searches  │     │  notifications   │
├──────────────────┤     ├──────────────────┤
│ id (PK)          │     │ id (PK)          │
│ user_id (FK)     │     │ user_id (FK)     │
│ filters (JSONB)  │     │ type             │
│ name             │     │ title            │
│ alert_enabled    │     │ message          │
│ created_at       │     │ read             │
└──────────────────┘     │ created_at       │
                         └──────────────────┘
```

---

## 7. Non-Functional Requirements

### 7.1 Performance

- Page load time: < 2 seconds (LCP)
- Search results: < 500ms response time
- Support 10,000 concurrent users
- Image/file uploads: < 5 seconds for files up to 10MB

### 7.2 Security

- Authentication via Clerk (OAuth 2.0, MFA support)
- Row-level security (RLS) in Supabase
- Input sanitization and validation
- Rate limiting on API endpoints
- HTTPS everywhere
- GDPR-compliant data handling

### 7.3 Scalability

- Serverless architecture via Vercel
- Supabase auto-scaling
- CDN for static assets
- Efficient pagination (cursor-based)
- Database indexing on frequently queried columns

### 7.4 Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- Color contrast ratios meeting standards
- Responsive design (mobile-first)

### 7.5 Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

---

## 8. User Flows

### 8.1 Job Seeker Flow

```
Sign Up → Complete Profile → Browse Listings → Apply Filters →
View Listing → Apply → Track Application → Receive Notifications
```

### 8.2 Employer Flow

```
Sign Up → Complete Company Profile → Verification →
Create Listing → Receive Applications → Review & Respond →
Update Application Status
```

### 8.3 Application Status Flow (React Flow Visualization)

```
[Applied] → [Under Review] → [Interview] → [Offer] → [Accepted]
                                    ↓                      ↓
                              [Rejected]              [Rejected]
                                    ↓
                              [Withdrawn]
```

---

## 9. API Design

### 9.1 Listings API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/listings` | Get listings with filters |
| GET | `/api/listings/[id]` | Get single listing |
| POST | `/api/listings` | Create listing (employer) |
| PUT | `/api/listings/[id]` | Update listing (employer) |
| DELETE | `/api/listings/[id]` | Archive listing (employer) |

**Query Parameters for GET `/api/listings`:**
```
?search=frontend+developer
&scope=national,global
&work_type=work-from-home
&salary_min=1000
&salary_max=5000
&salary_period=monthly
&industry=technology
&skills=react,typescript
&duration=full-time
&sort=newest
&page=1
&limit=20
```

### 9.2 Applications API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/applications` | Get user's applications |
| GET | `/api/applications/[id]` | Get application detail |
| POST | `/api/applications` | Submit application |
| PATCH | `/api/applications/[id]` | Update status (employer) |
| DELETE | `/api/applications/[id]` | Withdraw application |

### 9.3 Saved Searches API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/saved-searches` | Get saved searches |
| POST | `/api/saved-searches` | Save a search |
| DELETE | `/api/saved-searches/[id]` | Remove saved search |

---

## 10. UI/UX Design Principles

### 10.1 Design System

- **Colors:** Professional palette with scope-indicator accent colors
- **Typography:** Inter font family, clear hierarchy
- **Components:** Consistent card-based layout for listings
- **Icons:** Lucide React for all iconography
- **Spacing:** 4px grid system via Tailwind
- **Dark Mode:** Full dark mode support via Tailwind

### 10.2 Key UI Components

- **ListingCard** — Compact card with badges, salary, scope indicator
- **FilterSidebar** — Collapsible sidebar with all filter options
- **SalaryRangeSlider** — Dual-handle range slider
- **ScopeIndicator** — Color-coded geographic scope badge
- **ApplicationPipeline** — React Flow visualization of application stages
- **SearchBar** — Full-text search with auto-suggestions
- **WorkTypeBadge** — Visual indicator for remote/on-site/hybrid

---

## 11. MVP Scope (Phase 1)

### Included in MVP:
- [x] User authentication (Clerk)
- [x] Job seeker profile creation
- [x] Listing browse with basic search
- [x] Scope filtering (Local → Global)
- [x] Work type filtering (Face-to-Face / WFH / Hybrid)
- [x] Salary range filtering
- [x] Listing detail page
- [x] One-click apply
- [x] Application status tracking
- [x] Basic email notifications (Resend)
- [x] Responsive design

### Phase 2 (Post-MVP):
- [ ] Employer dashboard & listing creation
- [ ] Advanced analytics
- [ ] Map view for listings
- [ ] AI-powered job matching
- [ ] Saved searches with email alerts
- [ ] Application pipeline visualization (React Flow)
- [ ] Admin panel

### Phase 3 (Future):
- [ ] Mobile app (React Native)
- [ ] Interview scheduling integration
- [ ] Skills assessments
- [ ] Company reviews
- [ ] Salary insights & market data
- [ ] API for third-party integrations

---

## 12. Success Metrics

| Metric | Measurement | Goal |
|--------|-------------|------|
| User Registration | Sign-ups per week | 500+ |
| Listing Quality | % with salary ranges | 100% |
| Application Rate | Applications per listing | 15+ |
| Filter Usage | % of sessions using filters | > 60% |
| Return Rate | Weekly active / Monthly active | > 40% |
| Time to Apply | Average time from browse to apply | < 5 min |
| Email Open Rate | Notification emails opened | > 30% |

---

## 13. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Low initial listing volume | Users leave due to no content | Seed with aggregated listings; partner with universities |
| Employer adoption | Platform lacks fresh content | Free tier for employers; outreach to HR departments |
| Data accuracy | Stale/misleading listings | Auto-archive after deadline; report system |
| Performance at scale | Slow search/filter | Supabase indexes; caching layer; pagination |
| Competition | Users choose established platforms | Focus on internship niche; superior UX; scope system |

---

## 14. Timeline

| Phase | Duration | Deliverables |
|-------|----------|-------------|
| Design & Planning | 2 weeks | Wireframes, DB schema, component library |
| Phase 1 (MVP) | 6 weeks | Core features, auth, listings, search, apply |
| Testing & QA | 2 weeks | Bug fixes, performance optimization |
| Beta Launch | 2 weeks | Limited release, feedback collection |
| Phase 2 | 4 weeks | Employer tools, analytics, React Flow |
| Phase 3 | Ongoing | Mobile, AI features, integrations |

---

## 15. Appendix

### 15.1 Environment Variables Required

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Vercel Blob
BLOB_READ_WRITE_TOKEN=

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=

# App
NEXT_PUBLIC_APP_URL=
```

### 15.2 Dependencies to Install

```json
{
  "dependencies": {
    "@clerk/nextjs": "latest",
    "@supabase/supabase-js": "latest",
    "@vercel/blob": "latest",
    "resend": "latest",
    "lucide-react": "latest",
    "@xyflow/react": "latest"
  }
}
```

### 15.3 Supabase Row-Level Security (RLS) Policies

```sql
-- Listings: Anyone can read active listings
CREATE POLICY "Public read active listings"
  ON listings FOR SELECT
  USING (is_active = true);

-- Listings: Only employers can insert/update their own
CREATE POLICY "Employers manage own listings"
  ON listings FOR ALL
  USING (employer_id = auth.uid());

-- Applications: Users can only see their own
CREATE POLICY "Users view own applications"
  ON applications FOR SELECT
  USING (applicant_id = auth.uid());

-- Applications: Users can create applications
CREATE POLICY "Users create applications"
  ON applications FOR INSERT
  WITH CHECK (applicant_id = auth.uid());

-- Applications: Employers can view applications for their listings
CREATE POLICY "Employers view listing applications"
  ON applications FOR SELECT
  USING (
    listing_id IN (
      SELECT id FROM listings WHERE employer_id = auth.uid()
    )
  );
```

---

*This PRD is a living document and will be updated as requirements evolve.*
