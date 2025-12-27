// app/api/register/route.js

import connectDB from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mailer";
import { verifyTurnstile } from "@/lib/verifyTurnstile";
import User from "@/models/User";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import crypto from "node:crypto";

const EMAIL_REGEX = new RegExp(/^[A-Za-z0-9._]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/);

export const isValidEmail = (email) => {
  return EMAIL_REGEX.test(email);
};

export async function POST(req) {
  try {
    const { name, email, password, captchaToken } = await req.json();

    // ✅ Validate captcha using our helper
    const captcha = await verifyTurnstile(captchaToken);
    if (!captcha.success) {
      return NextResponse.json(captcha.error, { status: 403 });
    }

    // Check if all required fields are provided
    switch (true) {
      case !name:
        return NextResponse.json("Name is required", { status: 400 });
      case !email:
        return NextResponse.json("Email is required", { status: 400 });
      case !password:
        return NextResponse.json("Password is required", { status: 400 });
    }

    // Check Password & Email Validation
    switch (true) {
      case password.length < 8:
        return NextResponse.json(
          "Password must be at least 8 characters long.",
          { status: 400 },
        );
      case !/[a-z]/.test(password):
        return NextResponse.json(
          "Password must contain at least one lowercase letter.",
          { status: 400 },
        );
      case !/[A-Z]/.test(password):
        return NextResponse.json(
          "Password must contain at least one uppercase letter.",
          { status: 400 },
        );
      case !/[0-9]/.test(password):
        return NextResponse.json("Password must contain at least one number.", {
          status: 400,
        });
      case !/[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(password):
        return NextResponse.json(
          "Password must contain at least one special character.",
          { status: 400 },
        );
      case !isValidEmail(email):
        return NextResponse.json("Enter a valid email address.", {
          status: 400,
        });
    }

    const normalizedEmail = email.trim().toLowerCase();

    await connectDB();
    const user = await User.findOne({ email: normalizedEmail });

    if (user) {
      return NextResponse.json("Email already exists.", {
        status: 409,
      });
    }

    // Hash password & generate verification token
    const hashedPassword = await hash(password, 10);
    const token = crypto.randomBytes(32).toString("hex");

    // Send email verification
    await sendVerificationEmail(email, token);

    // Insert new user
    const newUser = {
      name,
      email: normalizedEmail,
      password: hashedPassword,
      verifyToken: token,
    };

    const res = await User.create(newUser);
    if (!res._id) {
      return NextResponse.json("Something went wrong", { status: 500 });
    }
    return NextResponse.json({
      success: true,
      message: "Registration successful. Check your email for verification.",
    });
  } catch (e) {
    return NextResponse.json(e.message, { status: 500 });
  }
}
