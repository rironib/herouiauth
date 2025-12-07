// app/api/register/route.js

import { NextResponse } from "next/server";
import { sendVerificationEmail } from "@/lib/mailer";
import { hash } from "bcrypt";
import crypto from "node:crypto";
import { verifyTurnstile } from "@/lib/verifyTurnstile";
import connectDB from "@/lib/db";
import User from "@/models/User";

const EMAIL_REGEX = new RegExp(/^[A-Za-z0-9._]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/);

export const isValidEmail = (email) => {
  return EMAIL_REGEX.test(email);
};

// Username Validation Regex
export const isValidUsername = (username) => {
  return /^[a-z0-9]+$/.test(username);
};

export async function POST(req) {
  try {
    const { name, username, email, password, captchaToken } = await req.json();

    // ✅ Validate captcha using our helper
    const captcha = await verifyTurnstile(captchaToken);
    if (!captcha.success) {
      return NextResponse.json(
        { success: false, message: captcha.error },
        { status: 403 },
      );
    }

    // Check if all required fields are provided
    switch (true) {
      case !username:
        return NextResponse.json(
          { success: false, message: "Username is required" },
          { status: 400 },
        );
      case !name:
        return NextResponse.json(
          { success: false, message: "Name is required" },
          { status: 400 },
        );
      case !email:
        return NextResponse.json(
          { success: false, message: "Email is required" },
          { status: 400 },
        );
      case !password:
        return NextResponse.json(
          { success: false, message: "Password is required" },
          { status: 400 },
        );
    }

    // Check Password & Email Validation
    switch (true) {
      case password.length < 8:
        return NextResponse.json(
          {
            success: false,
            message: "Password must be at least 8 characters long.",
          },
          { status: 400 },
        );
      case !/[a-z]/.test(password):
        return NextResponse.json(
          {
            success: false,
            message: "Password must contain at least one lowercase letter.",
          },
          { status: 400 },
        );
      case !/[A-Z]/.test(password):
        return NextResponse.json(
          {
            success: false,
            message: "Password must contain at least one uppercase letter.",
          },
          { status: 400 },
        );
      case !/[0-9]/.test(password):
        return NextResponse.json(
          {
            success: false,
            message: "Password must contain at least one number.",
          },
          { status: 400 },
        );
      case !/[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(password):
        return NextResponse.json(
          {
            success: false,
            message: "Password must contain at least one special character.",
          },
          { status: 400 },
        );
      case !isValidEmail(email):
        return NextResponse.json(
          { success: false, message: "Enter a valid email address." },
          { status: 400 },
        );
      case !isValidUsername(username):
        return NextResponse.json(
          {
            success: false,
            message: "Username must be lowercase letters and numbers only.",
          },
          { status: 400 },
        );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim().toLowerCase();

    await connectDB();
    const user = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
    });

    if (user) {
      return NextResponse.json({
        success: false,
        message: "Username or email already exists.",
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
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword,
      verifyToken: token,
    };

    const res = await User.create(newUser);
    if (!res._id) {
      return NextResponse.json({
        success: false,
        message: "Something went wrong",
      });
    }
    return NextResponse.json({
      success: true,
      message: "Registration successful. Check your email for verification.",
    });
  } catch (e) {
    return NextResponse.json({ success: false, message: e.message });
  }
}
