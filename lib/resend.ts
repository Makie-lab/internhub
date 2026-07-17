import { Resend } from "resend";

/**
 * Get a Resend client instance.
 * Returns null if the API key is not configured.
 */
export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

/**
 * Get the "from" email address for sending emails.
 */
export function getFromEmail(): string {
  return process.env.RESEND_FROM_EMAIL || "noreply@internhub.com";
}
