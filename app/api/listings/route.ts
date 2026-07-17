import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { opportunities } from "@/lib/data/opportunities";

/**
 * GET /api/listings
 * Fetch listings with optional filters. Falls back to static data if Supabase is not configured.
 * Query params: search, work_type, level, salary_min, salary_max
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const workType = searchParams.get("work_type") || "";
  const level = searchParams.get("level") || "";
  const salaryMin = searchParams.get("salary_min")
    ? Number(searchParams.get("salary_min"))
    : null;
  const salaryMax = searchParams.get("salary_max")
    ? Number(searchParams.get("salary_max"))
    : null;

  const supabase = createServerClient();

  if (supabase) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query = (supabase as any).from("listings").select("*").eq("is_active", true);

      if (search) {
        query = query.or(
          `title.ilike.%${search}%,description.ilike.%${search}%`
        );
      }
      if (workType) {
        query = query.eq("work_type", workType);
      }
      if (level) {
        query = query.eq("level", level);
      }
      if (salaryMin !== null) {
        query = query.gte("salary_min", salaryMin);
      }
      if (salaryMax !== null) {
        query = query.lte("salary_max", salaryMax);
      }

      query = query.order("created_at", { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error("[API/listings] Supabase error:", (error as { message: string }).message);
        return NextResponse.json(
          { error: "Failed to fetch listings" },
          { status: 500 }
        );
      }

      return NextResponse.json({ listings: data, source: "supabase" });
    } catch (err) {
      console.error("[API/listings] Unexpected error:", err);
      // Fall through to static data
    }
  }

  // Fallback to static data
  let filtered = [...opportunities];

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (opp) =>
        opp.title.toLowerCase().includes(q) ||
        opp.company.toLowerCase().includes(q) ||
        opp.skills.some((s) => s.toLowerCase().includes(q))
    );
  }
  if (workType) {
    const typeMap: Record<string, string> = {
      remote: "Remote",
      onsite: "In person",
      hybrid: "Hybrid",
    };
    const mappedType = typeMap[workType] || workType;
    filtered = filtered.filter((opp) => opp.type === mappedType);
  }
  if (level) {
    const levelMap: Record<string, string> = {
      internship: "Internship",
      entry: "Entry level",
    };
    const mappedLevel = levelMap[level] || level;
    filtered = filtered.filter((opp) => opp.level === mappedLevel);
  }

  return NextResponse.json({ listings: filtered, source: "static" });
}

/**
 * POST /api/listings
 * Create a new listing. Requires authentication (handled by middleware).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, company, location, work_type, level, pay, skills, description } = body;

    if (!title || !company) {
      return NextResponse.json(
        { error: "Title and company are required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    if (supabase) {
      const insertData = {
        employer_id: body.employer_id || "anonymous",
        title,
        description: description || "",
        location_city: location || null,
        work_type: work_type || "remote",
        level: level || "internship",
        salary_min: pay ? parseInt(pay) : null,
        salary_max: null,
        salary_currency: "USD",
        salary_period: "hourly",
        skills_required: skills
          ? skills.split(",").map((s: string) => s.trim())
          : null,
        is_active: true,
        scope: "full-time",
        requirements: null,
        benefits: null,
        location_state: null,
        location_country: null,
        duration: null,
        industry: null,
        application_deadline: null,
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("listings")
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error("[API/listings] Insert error:", error.message);
        return NextResponse.json(
          { error: "Failed to create listing" },
          { status: 500 }
        );
      }

      return NextResponse.json({ listing: data, source: "supabase" }, { status: 201 });
    }

    // Fallback: mock success when Supabase is not configured
    return NextResponse.json(
      {
        listing: {
          id: `mock-${Date.now()}`,
          title,
          company,
          location,
          work_type,
          level,
          pay,
          skills,
          description,
          created_at: new Date().toISOString(),
        },
        source: "mock",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[API/listings] POST error:", err);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
