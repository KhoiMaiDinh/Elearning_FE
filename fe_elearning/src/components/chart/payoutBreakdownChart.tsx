'use client';

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Bank Transfer', value: 45, amount: 28350 },
  { name: 'PayPal', value: 30, amount: 18900 },
  { name: 'Stripe', value: 20, amount: 12600 },
  { name: 'Wire Transfer', value: 5, amount: 3150 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

export function PayoutBreakdownChart() {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, props) => [
              `${value}% ($${props.payload.amount.toLocaleString()})`,
              name,
            ]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
