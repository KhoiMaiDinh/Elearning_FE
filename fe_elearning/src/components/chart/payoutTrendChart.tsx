'use client';

import {
  Line,
  LineChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const data = [
  { month: 'Jul', totalPayouts: 45000, instructorCount: 12 },
  { month: 'Aug', totalPayouts: 52000, instructorCount: 15 },
  { month: 'Sep', totalPayouts: 48000, instructorCount: 14 },
  { month: 'Oct', totalPayouts: 61000, instructorCount: 18 },
  { month: 'Nov', totalPayouts: 58000, instructorCount: 17 },
  { month: 'Dec', totalPayouts: 67000, instructorCount: 20 },
  { month: 'Jan', totalPayouts: 47700, instructorCount: 16 },
];

export function PayoutTrendsChart() {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis yAxisId="left" tickFormatter={(value) => `$${value / 1000}k`} />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip
            formatter={(value, name) => [
              name === 'totalPayouts' ? `$${value.toLocaleString()}` : value,
              name === 'totalPayouts' ? 'Total Payouts' : 'Instructor Count',
            ]}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="totalPayouts"
            name="Total Payouts"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="instructorCount"
            name="Instructor Count"
            stroke="#82ca9d"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
