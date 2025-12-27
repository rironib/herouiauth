// api/contact/route.js

import connectDB from "@/lib/db";
import { verifyTurnstile } from "@/lib/verifyTurnstile";
import Contact from "@/models/Contact";
import { NextResponse } from "next/server";

/* -------------------------------
   POST NEW CONTACT
-------------------------------- */

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, message, captchaToken } = body;
    if (!name || !email || !message || !captchaToken) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 },
      );
    }

    if (message.length < 50) {
      return NextResponse.json("Message must be at least 50 characters long", {
        status: 400,
      });
    }

    // ✅ Validate captcha using our helper
    const captcha = await verifyTurnstile(captchaToken);
    if (!captcha.success) {
      return NextResponse.json(captcha.error, { status: 403 });
    }

    await connectDB();
    const res = await Contact.create({ name, email, message });
    if (!res._id) {
      return NextResponse.json("Something went wrong", { status: 500 });
    }
    return NextResponse.json({
      success: true,
      message: "Message submitted successfully",
    });
  } catch (e) {
    return NextResponse.json(e.message || "Something went wrong.", {
      status: 500,
    });
  }
}
