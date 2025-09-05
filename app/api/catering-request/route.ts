import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Optionally send email via provider
    if (env.email.sendOnCatering && env.email.provider && env.email.apiKey) {
      // Placeholder: integrate Resend or SendGrid based on env.email.provider
      // We do not actually send in this scaffold to avoid external calls.
      // Implementation hint: for Resend, POST https://api.resend.com/emails with API key
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

