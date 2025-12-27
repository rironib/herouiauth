// app/api/reset/route.js

import connectDB from "@/lib/db";
import { verifyTurnstile } from "@/lib/verifyTurnstile";
import User from "@/models/User";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

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
      return NextResponse.json(captcha.error, { status: 403 });
    }

    switch (true) {
      case !token:
        return NextResponse.json("Verification token is required.", {
          status: 400,
        });
      case !newPassword:
        return NextResponse.json("New password is required.", { status: 400 });
      case !isStrongPassword(newPassword):
        return NextResponse.json(
          "Password must include at least one lowercase letter, one uppercase letter, one number, and one special character.",
          { status: 400 },
        );
    }

    await connectDB();
    const user = await User.findOne({ resetToken: token });
    switch (true) {
      case !user:
        return NextResponse.json("The provided token is invalid.", {
          status: 400,
        });
      case !user.resetTokenExpiry:
        return NextResponse.json("The provided token is invalid.", {
          status: 400,
        });
      case new Date(user.resetTokenExpiry) < new Date():
        return NextResponse.json("The provided token has been expired.", {
          status: 400,
        });
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

    return NextResponse.json({
      success: true,
      message: "Password has been reset successfully.",
    });
  } catch (error) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
