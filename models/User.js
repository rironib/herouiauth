// models/User.js

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 255,
      index: true,
    },
    password: {
      type: String,
      maxlength: 255,
    },

    // Roles & permissions
    isAdmin: { type: Boolean, default: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },

    // Timestamps (handled by timestamps: true, but kept for clarity)
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

    // Email verification
    verifyToken: { type: String, select: false },
    emailVerified: { type: Date, default: null },

    // Password reset
    resetToken: { type: String, select: false },
    resetTokenExpiry: { type: Date },
    resetLastSent: { type: Date },

    // OAuth fields
    image: { type: String, maxlength: 500 },
  },
  { timestamps: true, versionKey: false },
);

// Compound index for performance
UserSchema.index({ email: 1, emailVerified: 1 });

// Avoid OverwriteModelError on hot reload
export default mongoose.models.User || mongoose.model("User", UserSchema);
