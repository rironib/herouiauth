import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: [10, "Message should be at least 10 characters long"],
      maxlength: [2000, "Message cannot exceed 2000 characters"],
    },
    status: {
      type: String,
      enum: ["new", "read", "replied", "archived"],
      default: "new",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Contact =
  mongoose.models.Contact || mongoose.model("Contact", contactSchema);

export default Contact;
