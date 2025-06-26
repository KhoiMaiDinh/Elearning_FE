'use client';

import type React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';
import { Trophy, Target } from 'lucide-react';

type Props = {
  percentage: number;
};

const chartData = (value: number) => {
  const clamped = Math.max(0, Math.min(value, 100));
  return [
    { name: 'completed', value: clamped },
    { name: 'remaining', value: 100 - clamped },
  ];
};

export const PercentagePieChart: React.FC<Props> = ({ percentage }) => {
  const data = chartData(100);
  const completedPercentage = Math.max(0, Math.min(percentage, 100));

  // Dynamic colors based on progress
  const getProgressColor = (percent: number) => {
    if (percent >= 90) return '#22c55e'; // bright green
    if (percent >= 80) return '#10b981'; // green
    if (percent >= 70) return '#06b6d4'; // cyan
    if (percent >= 60) return '#3b82f6'; // blue
    if (percent >= 50) return '#6366f1'; // indigo
    if (percent >= 40) return '#8b5cf6'; // violet
    if (percent >= 30) return '#d946ef'; // pink
    if (percent >= 20) return '#f43f5e'; // rose
    return '#f59e0b'; // amber
  };

  const progressColor = getProgressColor(completedPercentage);
  const COLORS = [progressColor, 'rgba(156, 163, 175, 0.2)'];

  return (
    <div className="relative w-48 h-48 mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={85}
            startAngle={90}
            endAngle={450}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {completedPercentage}%
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Hoàn thành</div>
        </div>
      </div>

      {/* Progress ring animation */}
      {/* <div
        className="absolute inset-0 rounded-full border-2 border-transparent"
        style={{
          background: `conic-gradient(${progressColor} ${completedPercentage * 3.6}deg, transparent 0deg)`,
          mask: 'radial-gradient(circle, transparent 60px, black 60px, black 85px, transparent 85px)',
          WebkitMask:
            'radial-gradient(circle, transparent 60px, black 60px, black 85px, transparent 85px)',
        }}
      /> */}
    </div>
  );
};

type PieChartProgressProps = {
  courseProgress: number;
};

const PieChartProgress: React.FC<PieChartProgressProps> = ({ courseProgress }) => {
  const getProgressMessage = (progress: number) => {
    if (progress === 0) return 'Chưa bắt đầu';
    if (progress < 25) return 'Mới bắt đầu';
    if (progress <= 50) return 'Đang tiến bộ';
    if (progress <= 75) return 'Sắp hoàn thành';
    if (progress < 100) return 'Gần xong rồi';
    return 'Hoàn thành xuất sắc';
  };

  const getProgressIcon = (progress: number) => {
    if (progress >= 100) return <Trophy className="w-5 h-5 text-yellow-500" />;
    return <Target className="w-5 h-5 text-blue-500" />;
  };

  return (
    <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            {getProgressIcon(courseProgress)}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tiến độ học tập</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {getProgressMessage(courseProgress)}
          </p>
        </div>

        <div className="mb-6">
          <PercentagePieChart percentage={courseProgress} />
        </div>

        {/* Linear progress bar as additional indicator */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Tiến độ tổng thể</span>
            <span className="font-medium text-gray-900 dark:text-white">{courseProgress}%</span>
          </div>
          <Progress value={courseProgress} className="h-2 bg-gray-200 dark:bg-gray-700" />
        </div>

        {/* Achievement badges */}
        {courseProgress > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {courseProgress >= 25 && (
              <div className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs font-medium">
                Người học tích cực
              </div>
            )}
            {courseProgress >= 50 && (
              <div className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs font-medium">
                Đã qua nửa chặng
              </div>
            )}
            {courseProgress >= 75 && (
              <div className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full text-xs font-medium">
                Sắp hoàn thành
              </div>
            )}
            {courseProgress === 100 && (
              <div className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full text-xs font-medium">
                🎉 Hoàn thành
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PieChartProgress;
