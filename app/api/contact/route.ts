import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation/contact";
import { rateLimit } from "@/lib/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Strip CR/LF to neutralise email-header injection on subject/replyTo.
function sanitizeHeader(input: string): string {
  return input.replace(/[\r\n]+/g, " ").trim();
}

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, "contact", 3, 60 * 60 * 1000);
  if (!limited.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSeconds) },
      }
    );
  }

  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input." },
        { status: 400 }
      );
    }

    const { name, email, message, website } = parsed.data;

    // Honeypot: bots fill the hidden `website` field. Pretend success and bail.
    if (website && website.trim() !== "") {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: process.env.CONTACT_TO_EMAIL!,
      replyTo: sanitizeHeader(email),
      subject: sanitizeHeader(`New message from ${name}`),
      html: `
        <div style="font-family: monospace; max-width: 600px;">
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}