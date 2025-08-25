// FILE: src/app/api/verify/route.js

import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(req) {
  const { token } = await req.json();

  if (!token) {
    return NextResponse.json(
      { error: "Verification token is required." },
      { status: 400 },
    );
  }

  try {
    const db = await getDb();
    const user = await db.collection("users").findOne({ verifyToken: token });

    if (!user) {
      return NextResponse.json(
        {
          error:
            "The provided verification token is invalid or has been expired.",
        },
        { status: 400 },
      );
    }

    if (user?.emailVerified) {
      return NextResponse.json(
        { error: "Email is already verified." },
        { status: 200 },
      );
    }

    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: { emailVerified: new Date() },
        $unset: { verifyToken: "" },
      },
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
