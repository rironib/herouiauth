// app/api/verify/route.js

import connectDB from "@/lib/db";
import { verifyTurnstile } from "@/lib/verifyTurnstile";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { token, captchaToken } = await req.json();

  if (!token) {
    return NextResponse.json("Verification token is required.", {
      status: 400,
    });
  }

  // ✅ Validate captcha using our helper
  const captcha = await verifyTurnstile(captchaToken);
  if (!captcha.success) {
    return NextResponse.json(captcha.error, { status: 403 });
  }

  try {
    await connectDB();
    const user = await User.findOne({ verifyToken: token });

    if (!user) {
      return NextResponse.json("Invalid verification token.", { status: 400 });
    }

    if (user?.emailVerified) {
      return NextResponse.json("Email already verified.", { status: 400 });
    }
    await User.updateOne(
      { verifyToken: token },
      { $set: { emailVerified: new Date() } },
    );
    return NextResponse.json({
      success: true,
      message: "Email verified successfully.",
    });
  } catch (err) {
    return NextResponse.json(err.message, { status: 500 });
  }
}
