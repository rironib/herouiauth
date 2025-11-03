// app/api/reset/route.js

import { hash } from "bcrypt";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { verifyTurnstile } from "@/lib/verifyTurnstile";

// Password strength checker
function isStrongPassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
}

export async function POST(req) {
  try {
    const { token, newPassword, captchaToken } = await req.json();

    // ✅ Validate captcha using our helper
    const captcha = await verifyTurnstile(captchaToken);
    if (!captcha.success) {
      return NextResponse.json({ error: captcha.error }, { status: 403 });
    }

    switch (true) {
      case !token:
        return NextResponse.json(
          { error: "Verification token is required." },
          { status: 400 },
        );
      case !newPassword:
        return NextResponse.json(
          { error: "New password is required." },
          { status: 400 },
        );
      case !isStrongPassword(newPassword):
        return NextResponse.json(
          {
            error:
              "Password must include at least one lowercase letter, one uppercase letter, one number, and one special character.",
          },
          { status: 400 },
        );
    }

    await connectDB();
    const user = await User.findOne({ resetToken: token });
    switch (true) {
      case !user:
        return NextResponse.json(
          { error: "The provided token is invalid." },
          { status: 400 },
        );
      case !user.resetTokenExpiry:
        return NextResponse.json(
          { error: "The provided token is invalid." },
          { status: 400 },
        );
      case new Date(user.resetTokenExpiry) < new Date():
        return NextResponse.json(
          { error: "The provided token has been expired." },
          { status: 400 },
        );
    }

    const hashedPassword = await hash(newPassword, 10);

    // Update user with new password and reset token
    await User.updateOne(
      { _id: user._id },
      {
        $set: { password: hashedPassword },
        $unset: { resetToken: "", resetTokenExpiry: "" },
      },
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
