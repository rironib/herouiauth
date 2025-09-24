// app/api/visitor/route.js
import Visitor from "@/models/Visitor";
import connectDB from "@/lib/mongooseDB";

export async function POST(req) {
  const body = await req.json();
  console.log(body);

  await connectDB();
  // const body = await req.json();

  // Only insert if not already exists
  const exists = await Visitor.findOne({ visitorId: body.visitorId });
  if (exists) return Response.json({ message: "Already exists" });

  const visitor = new Visitor(body);
  await visitor.save();

  return Response.json({ success: true });
}

export async function PUT(req) {
  await connectDB();
  const { visitorId } = await req.json();

  const visitor = await Visitor.findOne({ visitorId });
  if (!visitor) return Response.json({ message: "Not found" }, { status: 404 });

  visitor.visitCount += 1;
  visitor.lastVisit = new Date();
  await visitor.save();

  return Response.json({ success: true });
}
