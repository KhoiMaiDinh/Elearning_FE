"use client";

import React from "react";
import { Pie, PieChart, Label } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const chartData = (value: number) => [
  { name: "Used", value, fill: "#8844FF" },
  { name: "Remaining", value: 100 - value, fill: "rgba(136, 68, 255, 0.2)" },
];

type Props = {
  percentage: number; // Giá trị phần trăm
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
          strokeWidth={0}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-foreground font-bold text-2xl"
                  >
                    {percentage}%
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </div>
  );
};

const PieChartProgress = () => {
  return (
    <div className="">
      <PercentagePieChart percentage={50} />
    </div>
  );
};

export default PieChartProgress;
