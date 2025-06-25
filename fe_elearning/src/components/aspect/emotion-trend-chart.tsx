import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface EmotionData {
  period: string;
  positive: number;
  negative: number;
  neutral: number;
  conflict: number;
}

interface EmotionTrendChartProps {
  data: EmotionData[];
  title?: string;
  timeFormat?: 'day' | 'week' | 'month';
}

export function EmotionTrendChart({
  data,
  title = 'Xu hướng Cảm xúc theo Thời gian',
  timeFormat = 'day',
}: EmotionTrendChartProps) {
  // Format date based on timeFormat
  const formatPeriod = (period: string) => {
    const date = new Date(period);
    switch (timeFormat) {
      case 'day':
        return date.toLocaleDateString('vi-VN', {
          month: 'short',
          day: 'numeric',
        });
      case 'week':
        return `T${Math.ceil(date.getDate() / 7)}`;
      case 'month':
        return date.toLocaleDateString('vi-VN', {
          month: 'short',
          year: '2-digit',
        });
      default:
        return period;
    }
  };

  // Process data for chart
  const chartData = data.map((item) => ({
    ...item,
    period: formatPeriod(item.period),
    positive: Math.round(item.positive * 10) / 10,
    negative: Math.round(item.negative * 10) / 10,
    neutral: Math.round(item.neutral * 10) / 10,
    conflict: Math.round(item.conflict * 10) / 10,
  }));

  const getTimeLabel = () => {
    switch (timeFormat) {
      case 'day':
        return 'theo Ngày';
      case 'week':
        return 'theo Tuần';
      case 'month':
        return 'theo Tháng';
      default:
        return '';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Phân bố cảm xúc {getTimeLabel()} (%)</CardDescription>
      </CardHeader>
      <CardContent className="p-2 sm:p-6">
        <ChartContainer
          config={{
            positive: {
              label: 'Tích cực',
              color: '#10b981',
            },
            negative: {
              label: 'Tiêu cực',
              color: '#ef4444',
            },
            neutral: {
              label: 'Trung tính',
              color: '#6b7280',
            },
            conflict: {
              label: 'Xung đột',
              color: '#f59e0b',
            },
          }}
          className="h-[400px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <defs>
                <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorNeutral" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6b7280" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6b7280" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorConflict" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="period" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <ChartTooltip
                content={<ChartTooltipContent formatter={(value, name) => [`${value}%`, name]} />}
              />
              <Legend />

              <Area
                type="monotone"
                dataKey="positive"
                stackId="1"
                stroke="#10b981"
                fill="url(#colorPositive)"
                strokeWidth={2}
                name="Tích cực"
              />
              <Area
                type="monotone"
                dataKey="neutral"
                stackId="1"
                stroke="#6b7280"
                fill="url(#colorNeutral)"
                strokeWidth={2}
                name="Trung tính"
              />
              <Area
                type="monotone"
                dataKey="negative"
                stackId="1"
                stroke="#ef4444"
                fill="url(#colorNegative)"
                strokeWidth={2}
                name="Tiêu cực"
              />
              <Area
                type="monotone"
                dataKey="conflict"
                stackId="1"
                stroke="#f59e0b"
                fill="url(#colorConflict)"
                strokeWidth={2}
                name="Xung đột"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// Alternative Line Chart version
export function EmotionTrendLineChart({
  data,
  title = 'Xu hướng Cảm xúc theo Thời gian',
  timeFormat = 'day',
}: EmotionTrendChartProps) {
  const formatPeriod = (period: string) => {
    const date = new Date(period);
    switch (timeFormat) {
      case 'day':
        return date.toLocaleDateString('vi-VN', {
          month: 'short',
          day: 'numeric',
        });
      case 'week':
        return `T${Math.ceil(date.getDate() / 7)}`;
      case 'month':
        return date.toLocaleDateString('vi-VN', {
          month: 'short',
          year: '2-digit',
        });
      default:
        return period;
    }
  };

  const chartData = data.map((item) => ({
    ...item,
    period: formatPeriod(item.period),
    positive: Math.round(item.positive * 10) / 10,
    negative: Math.round(item.negative * 10) / 10,
    neutral: Math.round(item.neutral * 10) / 10,
    conflict: Math.round(item.conflict * 10) / 10,
  }));

  const getTimeLabel = () => {
    switch (timeFormat) {
      case 'day':
        return 'theo Ngày';
      case 'week':
        return 'theo Tuần';
      case 'month':
        return 'theo Tháng';
      default:
        return '';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Xu hướng cảm xúc {getTimeLabel()} (%)</CardDescription>
      </CardHeader>
      <CardContent className="p-2 sm:p-6">
        <ChartContainer
          config={{
            positive: {
              label: 'Tích cực',
              color: '#10b981',
            },
            negative: {
              label: 'Tiêu cực',
              color: '#ef4444',
            },
            neutral: {
              label: 'Trung tính',
              color: '#6b7280',
            },
            conflict: {
              label: 'Xung đột',
              color: '#f59e0b',
            },
          }}
          className="h-[400px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="period" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <ChartTooltip
                content={<ChartTooltipContent formatter={(value, name) => [`${value}%`, name]} />}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="positive"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                name="Tích cực"
              />
              <Line
                type="monotone"
                dataKey="negative"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                name="Tiêu cực"
              />
              <Line
                type="monotone"
                dataKey="neutral"
                stroke="#6b7280"
                strokeWidth={3}
                dot={{ fill: '#6b7280', strokeWidth: 2, r: 4 }}
                name="Trung tính"
              />
              <Line
                type="monotone"
                dataKey="conflict"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                name="Xung đột"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
