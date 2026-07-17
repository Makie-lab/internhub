import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

/**
 * GET /api/profiles
 * Get a profile by clerk_id.
 * Query param: clerk_id
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const clerkId = searchParams.get("clerk_id");

  if (!clerkId) {
    return NextResponse.json(
      { error: "clerk_id query parameter is required" },
      { status: 400 }
    );
  }

  const supabase = createServerClient();

  if (supabase) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("profiles")
        .select("*")
        .eq("clerk_id", clerkId)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows returned, which is fine
        console.error("[API/profiles] Supabase error:", error.message);
        return NextResponse.json(
          { error: "Failed to fetch profile" },
          { status: 500 }
        );
      }

      return NextResponse.json({ profile: data || null, source: "supabase" });
    } catch (err) {
      console.error("[API/profiles] Unexpected error:", err);
    }
  }

  // Fallback
  return NextResponse.json({ profile: null, source: "mock" });
}

/**
 * POST /api/profiles
 * Create a new profile.
 * Body: { clerk_id, full_name, email, location_city?, location_state?, location_country?, ... }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clerk_id, full_name, email, location_city, location_state, location_country, bio, skills } = body;

    if (!clerk_id || !full_name || !email) {
      return NextResponse.json(
        { error: "clerk_id, full_name, and email are required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    if (supabase) {
      const insertData = {
        clerk_id,
        full_name,
        email,
        bio: bio || null,
        skills: skills || null,
        location_city: location_city || null,
        location_state: location_state || null,
        location_country: location_country || null,
        education: null,
        resume_url: null,
        pref_salary_min: null,
        pref_salary_max: null,
        pref_scope: null,
        pref_work_type: null,
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("profiles")
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error("[API/profiles] Insert error:", error.message);
        return NextResponse.json(
          { error: "Failed to create profile" },
          { status: 500 }
        );
      }

      return NextResponse.json({ profile: data, source: "supabase" }, { status: 201 });
    }

    // Fallback: mock success
    return NextResponse.json(
      {
        profile: {
          id: `mock-${Date.now()}`,
          clerk_id,
          full_name,
          email,
          location_city,
          location_state,
          location_country,
          created_at: new Date().toISOString(),
        },
        source: "mock",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[API/profiles] POST error:", err);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

/**
 * PUT /api/profiles
 * Update an existing profile.
 * Body: { clerk_id, ...fields_to_update }
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { clerk_id, ...updates } = body;

    if (!clerk_id) {
      return NextResponse.json(
        { error: "clerk_id is required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    if (supabase) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("profiles")
        .update(updates)
        .eq("clerk_id", clerk_id)
        .select()
        .single();

      if (error) {
        console.error("[API/profiles] Update error:", error.message);
        return NextResponse.json(
          { error: "Failed to update profile" },
          { status: 500 }
        );
      }

      return NextResponse.json({ profile: data, source: "supabase" });
    }

    // Fallback: mock success
    return NextResponse.json({
      profile: { clerk_id, ...updates, updated_at: new Date().toISOString() },
      source: "mock",
    });
  } catch (err) {
    console.error("[API/profiles] PUT error:", err);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
