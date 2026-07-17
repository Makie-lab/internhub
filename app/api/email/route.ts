import { NextRequest, NextResponse } from "next/server";
import { getResendClient, getFromEmail } from "@/lib/resend";

type EmailType = "welcome" | "application" | "registration";

interface EmailRequestBody {
  to: string;
  name: string;
  type: EmailType;
  data?: Record<string, string>;
}

function getEmailContent(type: EmailType, name: string, data?: Record<string, string>) {
  switch (type) {
    case "welcome":
      return {
        subject: `Welcome to InternHub, ${name}!`,
        html: `
          <h1>Welcome to InternHub!</h1>
          <p>Hi ${name},</p>
          <p>Thanks for creating your profile on InternHub. You're now ready to discover opportunities that match your preferences.</p>
          <p>Your location-aware matches are being prepared. Check your dashboard to see personalized recommendations.</p>
          <p>Best of luck,<br/>The InternHub Team</p>
        `,
      };
    case "application":
      return {
        subject: `Application Received - ${data?.listing_title || "New Opportunity"}`,
        html: `
          <h1>Application Submitted!</h1>
          <p>Hi ${name},</p>
          <p>Your application for <strong>${data?.listing_title || "the position"}</strong> has been received.</p>
          <p>The employer will review your application and get back to you. You can check the status in your dashboard.</p>
          <p>Best of luck,<br/>The InternHub Team</p>
        `,
      };
    case "registration":
      return {
        subject: `Registration Confirmed - ${data?.event_name || "InternHub Event"}`,
        html: `
          <h1>Registration Confirmed!</h1>
          <p>Hi ${name},</p>
          <p>You've been registered for <strong>${data?.event_name || "the event"}</strong>.</p>
          ${data?.event_date ? `<p>Date: ${data.event_date}</p>` : ""}
          <p>We'll send you a reminder before the event starts.</p>
          <p>See you there,<br/>The InternHub Team</p>
        `,
      };
    default:
      return {
        subject: "InternHub Notification",
        html: `<p>Hi ${name}, you have a new notification from InternHub.</p>`,
      };
  }
}

/**
 * POST /api/email
 * Send an email via Resend.
 * Body: { to, name, type: 'welcome' | 'application' | 'registration', data? }
 */
export async function POST(request: NextRequest) {
  try {
    const body: EmailRequestBody = await request.json();
    const { to, name, type, data } = body;

    if (!to || !name || !type) {
      return NextResponse.json(
        { error: "to, name, and type are required" },
        { status: 400 }
      );
    }

    const resend = getResendClient();
    const { subject, html } = getEmailContent(type, name, data);

    if (resend) {
      try {
        const result = await resend.emails.send({
          from: getFromEmail(),
          to,
          subject,
          html,
        });

        return NextResponse.json({
          success: true,
          messageId: result.data?.id || null,
          source: "resend",
        });
      } catch (err) {
        console.error("[API/email] Resend error:", err);
        return NextResponse.json(
          { error: "Failed to send email" },
          { status: 500 }
        );
      }
    }

    // Fallback: mock success when Resend is not configured
    return NextResponse.json({
      success: true,
      messageId: `mock-${Date.now()}`,
      source: "mock",
      note: "Email service not configured. This is a mock response.",
    });
  } catch (err) {
    console.error("[API/email] POST error:", err);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
