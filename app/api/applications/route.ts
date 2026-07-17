import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

/**
 * GET /api/applications
 * Fetch applications for the current user.
 * Query param: user_id (clerk_id)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json(
      { error: "user_id query parameter is required" },
      { status: 400 }
    );
  }

  const supabase = createServerClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .eq("applicant_id", userId)
        .order("applied_at", { ascending: false });

      if (error) {
        console.error("[API/applications] Supabase error:", error.message);
        return NextResponse.json(
          { error: "Failed to fetch applications" },
          { status: 500 }
        );
      }

      return NextResponse.json({ applications: data, source: "supabase" });
    } catch (err) {
      console.error("[API/applications] Unexpected error:", err);
    }
  }

  // Fallback: return empty array
  return NextResponse.json({ applications: [], source: "mock" });
}

/**
 * POST /api/applications
 * Submit a new application.
 * Body: { listing_id, applicant_id, resume_url?, cover_letter? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { listing_id, applicant_id, resume_url, cover_letter } = body;

    if (!listing_id || !applicant_id) {
      return NextResponse.json(
        { error: "listing_id and applicant_id are required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    if (supabase) {
      const insertData = {
        listing_id,
        applicant_id,
        resume_url: resume_url || null,
        cover_letter_url: cover_letter || null,
        status: "pending",
        custom_answers: null,
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("applications")
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error("[API/applications] Insert error:", error.message);
        return NextResponse.json(
          { error: "Failed to submit application" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { application: data, source: "supabase" },
        { status: 201 }
      );
    }

    // Fallback: mock success
    return NextResponse.json(
      {
        application: {
          id: `mock-${Date.now()}`,
          listing_id,
          applicant_id,
          status: "pending",
          resume_url: resume_url || null,
          cover_letter_url: cover_letter || null,
          applied_at: new Date().toISOString(),
        },
        source: "mock",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[API/applications] POST error:", err);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
