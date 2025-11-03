// app/api/verify/route.js

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { verifyTurnstile } from "@/lib/verifyTurnstile";

export async function POST(req) {
  const { token, captchaToken } = await req.json();

  if (!token) {
    return NextResponse.json({
      success: false,
      error: "Verification token is required.",
    });
  }

  // ✅ Validate captcha using our helper
  const captcha = await verifyTurnstile(captchaToken);
  if (!captcha.success) {
    return NextResponse.json({ success: false, error: captcha.error });
  }

  try {
    await connectDB();
    const user = await User.findOne({ verifyToken: token });

    if (!user) {
      return NextResponse.json({
        success: false,
        error: "Invalid verification token.",
      });
    }

    if (user?.emailVerified) {
      return NextResponse.json({
        success: false,
        error: "Email already verified.",
      });
    }
    await User.updateOne(
      { verifyToken: token },
      { $set: { emailVerified: new Date() } },
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
