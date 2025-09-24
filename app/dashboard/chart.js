"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const res = {
  totalVisitors: 125,
  totalVisits: 340,
  dailyVisits: [
    { date: "2025-09-20", visits: 50 },
    { date: "2025-09-21", visits: 60 },
    { date: "2025-09-22", visits: 80 },
    { date: "2025-09-23", visits: 45 },
    { date: "2025-09-24", visits: 120 },
    { date: "2025-09-25", visits: 450 },
    { date: "2025-09-26", visits: 300 },
    { date: "2025-09-27", visits: 200 },
    { date: "2025-09-28", visits: 600 },
    { date: "2025-09-29", visits: 380 },
    { date: "2025-09-30", visits: 760 },
    { date: "2025-09-31", visits: 150 },
  ],
  topReferrers: [
    { referrer: "https://google.com", count: 40 },
    { referrer: "https://twitter.com", count: 22 },
    { referrer: "Direct", count: 15 },
  ],
};

const data = res.dailyVisits

export default function Chart() {
  return (
    <div style={{ width: "100%" }}>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart
          width={500}
          height={200}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            connectNulls
            type="monotone"
            dataKey="visits"
            stroke="#8884d8"
            fill="#8884d8"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
