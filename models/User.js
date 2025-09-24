// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    username: { type: String, unique: true, sparse: true, lowercase: true },
    email: { type: String, unique: true, required: true, lowercase: true },
    password: { type: String },
    image: { type: String },

    // Roles & permissions
    isAdmin: { type: Boolean, default: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },

    // Email verification
    emailVerified: { type: Date, default: null },

    // Password reset
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
    resetLastSent: { type: Date },
  },
  { timestamps: true },
);

// Avoid OverwriteModelError on hot reload
export default mongoose.models.User || mongoose.model("User", UserSchema);
