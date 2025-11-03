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
      return NextResponse.json({ error: captcha.error }, { status: 403 });
    }

    // Check if all required fields are provided
    switch (true) {
      case !username:
        return NextResponse.json(
          { error: "Username is required" },
          { status: 400 },
        );
      case !name:
        return NextResponse.json(
          { error: "Name is required" },
          { status: 400 },
        );
      case !email:
        return NextResponse.json(
          { error: "Email is required" },
          { status: 400 },
        );
      case !password:
        return NextResponse.json(
          { error: "Password is required" },
          { status: 400 },
        );
    }

    // Check Password & Email Validation
    switch (true) {
      case password.length < 8:
        return NextResponse.json(
          { error: "Password must be at least 8 characters long." },
          { status: 400 },
        );
      case !/[a-z]/.test(password):
        return NextResponse.json(
          { error: "Password must contain at least one lowercase letter." },
          { status: 400 },
        );
      case !/[A-Z]/.test(password):
        return NextResponse.json(
          { error: "Password must contain at least one uppercase letter." },
          { status: 400 },
        );
      case !/[0-9]/.test(password):
        return NextResponse.json(
          { error: "Password must contain at least one number." },
          { status: 400 },
        );
      case !/[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(password):
        return NextResponse.json(
          { error: "Password must contain at least one special character." },
          { status: 400 },
        );
      case !isValidEmail(email):
        return NextResponse.json(
          { error: "Enter a valid email address." },
          { status: 400 },
        );
      case !isValidUsername(username):
        return NextResponse.json(
          { error: "Username must be lowercase letters and numbers only." },
          { status: 400 },
        );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim().toLowerCase();

    // new code

    await connectDB();
    const user = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
    });

    if (user) {
      if (user.email.toLowerCase() === normalizedEmail) {
        return NextResponse.json({
          success: false,
          error: "This email is already registered.",
        });
      }
      if (user.username.toLowerCase() === normalizedUsername) {
        return NextResponse.json({
          success: false,
          error: "Sorry, that username is not available.",
        });
      }
    }

    // const db = await getDb();
    // const user = await db.collection("users").findOne({
    //   $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
    // });

    // if (user) {
    //   if (user.email.toLowerCase() === normalizedEmail) {
    //     return NextResponse.json(
    //       { error: "This email is already registered." },
    //       { status: 409 },
    //     );
    //   }
    //   if (user.username.toLowerCase() === normalizedUsername) {
    //     return NextResponse.json(
    //       { error: "Sorry, that username is not available." },
    //       { status: 409 },
    //     );
    //   }
    // }

    // Hash password
    const hashedPassword = await hash(password, 10);
    // Generate a secure email verification token
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
    return NextResponse.json({ success: true, res });
    // const result = await db.collection("users").insertOne(newUser);
    // return NextResponse.json({ result, success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
