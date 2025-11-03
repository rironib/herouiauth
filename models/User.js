// models/User.js

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    username: { type: String, unique: true, sparse: true, lowercase: true },
    email: { type: String, unique: true, required: true, lowercase: true },
    password: { type: String },

    // Roles & permissions
    isAdmin: { type: Boolean, default: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },

    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

    // Email verification
    verifyToken: { type: String },
    emailVerified: { type: Date, default: null },

    // Password reset
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
    resetLastSent: { type: Date },
  },
  { timestamps: true, versionKey: false },
);

// Avoid OverwriteModelError on hot reload
export default mongoose.models.User || mongoose.model("User", UserSchema);
