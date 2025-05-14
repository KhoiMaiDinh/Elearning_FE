'use client';

import React from 'react';
import { Pie, PieChart, Label } from 'recharts';

type Props = {
  percentage: number;
};

const chartData = (value: number) => {
  const clamped = Math.max(0, Math.min(value, 100));

  return [
    { name: 'Used', value: clamped, fill: '#8844FF' },
    {
      name: 'Remaining',
      value: 100 - clamped,
      fill: 'rgba(136, 68, 255, 0.2)',
    },
  ];
};

export const PercentagePieChart: React.FC<Props> = ({ percentage }) => {
  return (
    <div className="mx-auto max-w-[250px]">
      <PieChart width={250} height={250}>
        <Pie
          data={chartData(percentage)}
          dataKey="value"
          innerRadius={70}
          outerRadius={100}
          stroke="none"
          isAnimationActive={false}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                const { cx, cy } = viewBox;
                return (
                  <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="fill-foreground font-bold text-2xl leading-none"
                  >
                    {Math.max(0, Math.min(percentage, 100))}%
                  </text>
                );
              }
              return null;
            }}
          />
        </Pie>
      </PieChart>
    </div>
  );
};

type PieChartProgressProps = {
  courseProgress: number;
};

const PieChartProgress: React.FC<PieChartProgressProps> = ({ courseProgress }) => {
  return (
    <div className="w-full max-w-sm mx-auto">
      <PercentagePieChart percentage={courseProgress} />
    </div>
  );
};

export default PieChartProgress;
