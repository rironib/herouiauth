// api/contact/route.js

import axios from "axios";
import connectDB from "@/lib/db";
import Contact from "@/models/Contact";
import { NextResponse } from "next/server";

/* -------------------------------
   POST NEW CONTACT
-------------------------------- */
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, message, token } = body;
    if (!name || !email || !message || !token)
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 },
      );

    // 🧠 Verify Turnstile token
    const turnstileRes = await axios.post(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
      }),
    );
    if (!turnstileRes.data?.success) {
      return NextResponse.json(
        { success: false, message: "Captcha verification failed" },
        { status: 400 },
      );
    }

    await connectDB();
    const contact = new Contact({ name, email, message });
    await contact.save();
    return NextResponse.json({
      success: true,
      message: "Contact submitted successfully",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || String(err) },
      { status: 500 },
    );
  }
}
