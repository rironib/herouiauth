// app/api/analytics/route.js
import connectDB from "@/lib/mongooseDB";
import Visitor from "@/models/Visitor";

export async function GET() {
  await connectDB();

  // Total unique visitors
  const totalVisitors = await Visitor.countDocuments();

  // Total visits (sum of visitCount)
  const totalVisitsAgg = await Visitor.aggregate([
    { $group: { _id: null, total: { $sum: "$visitCount" } } },
  ]);
  const totalVisits = totalVisitsAgg[0]?.total || 0;

  // Visits per day (last 7 days)
  const dailyVisits = await Visitor.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$lastVisit" } },
        visits: { $sum: "$visitCount" },
      },
    },
    { $sort: { _id: 1 } },
    { $limit: 7 },
  ]);

  // Top 5 referrers
  const topReferrers = await Visitor.aggregate([
    {
      $group: {
        _id: "$referrer",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);

  return Response.json({
    totalVisitors,
    totalVisits,
    dailyVisits: dailyVisits.map((d) => ({ date: d._id, visits: d.visits })),
    topReferrers: topReferrers.map((r) => ({
      referrer: r._id || "Direct",
      count: r.count,
    })),
  });
}
