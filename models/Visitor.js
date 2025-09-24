// models/Visitor.js
import mongoose from "mongoose";

const VisitorSchema = new mongoose.Schema({
  visitorId: { type: String, unique: true }, // unique cookie key
  ip: String,
  userAgent: String,
  referrer: String,
  firstVisit: { type: Date, default: Date.now },
  lastVisit: { type: Date, default: Date.now },
  visitCount: { type: Number, default: 1 }, // track return visits
});

export default mongoose.models.Visitor ||
  mongoose.model("Visitor", VisitorSchema);
