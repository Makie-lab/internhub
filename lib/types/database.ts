/**
 * Database types for Supabase typed client usage.
 * These types reflect the core schema for InternHub.
 */

export interface Listing {
  id: string;
  employer_id: string;
  title: string;
  description: string;
  requirements: string[] | null;
  benefits: string[] | null;
  location_city: string | null;
  location_state: string | null;
  location_country: string | null;
  scope: "full-time" | "part-time" | "contract" | "freelance";
  work_type: "remote" | "onsite" | "hybrid";
  level: "internship" | "entry" | "junior" | "mid" | "senior";
  duration: string | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  salary_period: "hourly" | "weekly" | "monthly" | "yearly" | null;
  industry: string | null;
  skills_required: string[] | null;
  application_deadline: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  listing_id: string;
  applicant_id: string;
  status: "pending" | "reviewed" | "accepted" | "rejected" | "withdrawn";
  resume_url: string | null;
  cover_letter_url: string | null;
  custom_answers: Record<string, string> | null;
  applied_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  clerk_id: string;
  full_name: string;
  email: string;
  bio: string | null;
  skills: string[] | null;
  education: string | null;
  resume_url: string | null;
  pref_salary_min: number | null;
  pref_salary_max: number | null;
  pref_scope: "full-time" | "part-time" | "contract" | "freelance" | null;
  pref_work_type: "remote" | "onsite" | "hybrid" | null;
  location_city: string | null;
  location_state: string | null;
  location_country: string | null;
  created_at: string;
}

/**
 * Database type for Supabase typed client.
 * Maps table names to their Row, Insert, and Update types.
 */
export interface Database {
  public: {
    Tables: {
      listings: {
        Row: Listing;
        Insert: Omit<Listing, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Listing, "id" | "created_at">>;
      };
      applications: {
        Row: Application;
        Insert: Omit<Application, "id" | "applied_at" | "updated_at"> & {
          id?: string;
          applied_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Application, "id" | "applied_at">>;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Profile, "id" | "created_at">>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
