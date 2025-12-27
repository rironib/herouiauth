// app/api/forgot/route.js

import connectDB from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/mailer";
import { verifyTurnstile } from "@/lib/verifyTurnstile";
import User from "@/models/User";
import { NextResponse } from "next/server";
import crypto from "node:crypto";

const EMAIL_REGEX = new RegExp(/^[A-Za-z0-9._]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/);
const RESET_TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours
const RESET_REQUEST_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

// Email validation regex
export const isValidEmail = (email) => {
  return EMAIL_REGEX.test(email);
};

export async function POST(req) {
  try {
    const { email, captchaToken } = await req.json();

    // ✅ Validate captcha using our helper
    const captcha = await verifyTurnstile(captchaToken);
    if (!captcha.success) {
      return NextResponse.json(captcha.error, { status: 403 });
    }

    switch (true) {
      case !email:
        return NextResponse.json("Email is required", { status: 400 });
      case !isValidEmail(email):
        return NextResponse.json("Enter a valid email address.", {
          status: 400,
        });
    }

    const normalizedEmail = email.trim().toLowerCase();

    await connectDB();
    const user = await User.findOne({ email: normalizedEmail }).select(
      "+resetToken +resetLastSent",
    );

    if (!user) {
      return NextResponse.json(
        "If the email is registered, you will receive a password reset link.",
        { status: 200 },
      );
    }
    if (!user.emailVerified) {
      return NextResponse.json("Your account is not verified.", {
        status: 403,
      });
    }

    const lastSent = user.resetLastSent ? new Date(user.resetLastSent) : null;
    const now = new Date();

    // 30-day cooldown on reset requests
    if (lastSent && now - lastSent < RESET_REQUEST_COOLDOWN_MS) {
      const remaining = RESET_REQUEST_COOLDOWN_MS - (now - lastSent);
      const hours = Math.floor(remaining / (60 * 60 * 1000));
      const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
      return NextResponse.json(
        `Please wait ${hours} hour(s) and ${minutes} minute(s) before requesting again.`,
        { status: 429 },
      );
    }

    // Generate reset token and expiry (24 hours from now)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(now.getTime() + RESET_TOKEN_EXPIRY_MS);

    // Send reset email
    await sendPasswordResetEmail(normalizedEmail, resetToken);

    // Update user with new token and timestamp
    await User.updateOne(
      { _id: user._id },
      { $set: { resetToken, resetTokenExpiry, resetLastSent: now } },
    );

    return NextResponse.json({
      success: true,
      message: "Password reset link sent.",
    });
  } catch (error) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
