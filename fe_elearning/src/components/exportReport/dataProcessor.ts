import { format } from 'date-fns';
import { EmotionData, AspectData, ASPECT_LABELS } from '@/types/reportTypes';

export const calculateEmotionTrendPercentages = (
  trend: any[],
  startDate: string,
  endDate: string
): EmotionData[] => {
  if (!Array.isArray(trend)) {
    return [];
  }

  // Generate all dates in the range
  const start = new Date(endDate);
  const end = new Date(startDate);
  const allDates: string[] = [];

  const currentDate = new Date(start);
  while (currentDate <= end) {
    allDates.push(format(currentDate, 'yyyy-MM-dd'));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Create a map of existing trend data
  const trendMap = new Map();
  trend.forEach((day) => {
    trendMap.set(day.period, day);
  });

  // Calculate total for all days (for overall summary)
  const totalAllDays = trend.reduce(
    (acc: { [key: string]: number }, day: any) => {
      acc.positive += Number(day.positive || 0);
      acc.negative += Number(day.negative || 0);
      acc.neutral += Number(day.neutral || 0);
      acc.conflict += Number(day.conflict || 0);
      return acc;
    },
    { positive: 0, negative: 0, neutral: 0, conflict: 0 }
  );

  const values: number[] = Object.values(totalAllDays).map((val) => Number(val));
  const grandTotal: number = values.reduce((sum: number, count: number): number => sum + count, 0);

  const percentages = {
    positive:
      grandTotal > 0 ? ((Number(totalAllDays.positive) / grandTotal) * 100).toFixed(2) : '0.00',
    negative:
      grandTotal > 0 ? ((Number(totalAllDays.negative) / grandTotal) * 100).toFixed(2) : '0.00',
    neutral:
      grandTotal > 0 ? ((Number(totalAllDays.neutral) / grandTotal) * 100).toFixed(2) : '0.00',
    conflict:
      grandTotal > 0 ? ((Number(totalAllDays.conflict) / grandTotal) * 100).toFixed(2) : '0.00',
  };

  // Generate data for all dates in range
  const dailyData = allDates.map((dateStr) => {
    const dayData = trendMap.get(dateStr);

    if (dayData) {
      const dayPositive = Number(dayData.positive || 0);
      const dayNegative = Number(dayData.negative || 0);
      const dayNeutral = Number(dayData.neutral || 0);
      const dayConflict = Number(dayData.conflict || 0);

      // Calculate daily total
      const dailyTotal = dayPositive + dayNegative + dayNeutral + dayConflict;

      // Normalize to percentages (ensure total = 100%)
      if (dailyTotal > 0) {
        return {
          period: dateStr,
          positive: Number(((dayPositive / dailyTotal) * 100).toFixed(2)),
          negative: Number(((dayNegative / dailyTotal) * 100).toFixed(2)),
          neutral: Number(((dayNeutral / dailyTotal) * 100).toFixed(2)),
          conflict: Number(((dayConflict / dailyTotal) * 100).toFixed(2)),
        };
      } else {
        return {
          period: dateStr,
          positive: 0,
          negative: 0,
          neutral: 0,
          conflict: 0,
        };
      }
    } else {
      // No data for this date, return zeros
      return {
        period: dateStr,
        positive: 0,
        negative: 0,
        neutral: 0,
        conflict: 0,
      };
    }
  });

  const result = [
    {
      period: 'Tổng',
      positive: Number(percentages.positive),
      negative: Number(percentages.negative),
      neutral: Number(percentages.neutral),
      conflict: Number(percentages.conflict),
    },
    ...dailyData,
  ];

  return result;
};

export const calculateAspectSummary = (summaries: any[]): AspectData[] => {
  if (!Array.isArray(summaries)) {
    return [];
  }

  const defaultAspect = {
    positive: 0,
    neutral: 0,
    negative: 0,
    conflict: 0,
    none: 0,
  };

  const combinedSummary: any = {};
  Object.keys(ASPECT_LABELS).forEach((aspect) => {
    combinedSummary[aspect] = { ...defaultAspect };
  });

  summaries.forEach((summary) => {
    Object.entries(summary).forEach(([aspect, data]: [string, any]) => {
      if (combinedSummary[aspect]) {
        Object.entries(data).forEach(([emotion, count]: [string, any]) => {
          const oldValue = combinedSummary[aspect][emotion] || 0;
          const newValue = Number(count || 0);
          combinedSummary[aspect][emotion] = oldValue + newValue;
        });
      }
    });
  });

  const aspectResults = Object.entries(combinedSummary).map(([aspect, data]: [string, any]) => {
    const total = Object.values(data).reduce((sum: any, count: any) => {
      const numCount = Number(count || 0);
      return sum + numCount;
    }, 0);

    const percentages = Object.entries(data).reduce((acc: any, [emotion, count]: [string, any]) => {
      const numCount = Number(count || 0);
      acc[emotion] = Number(total) > 0 ? ((numCount / Number(total)) * 100).toFixed(2) : '0.00';
      return acc;
    }, {});

    return {
      aspect: ASPECT_LABELS[aspect as keyof typeof ASPECT_LABELS] || aspect,
      ...percentages,
    };
  });

  const totalCounts = Object.values(combinedSummary).reduce(
    (acc: Record<string, number>, data: any) => {
      Object.entries(data).forEach(([emotion, count]: [string, any]) => {
        acc[emotion] = (acc[emotion] || 0) + Number(count || 0);
      });
      return acc;
    },
    {} as Record<string, number>
  );

  const totalAll = Object.values(totalCounts).reduce(
    (sum: number, count: number) => sum + count,
    0
  );

  const overallPercentages = Object.entries(totalCounts).reduce(
    (acc: Record<string, string>, [emotion, count]: [string, number]) => {
      acc[emotion] = totalAll > 0 ? ((count / totalAll) * 100).toFixed(2) : '0.00';
      return acc;
    },
    {} as Record<string, string>
  );

  const result = [
    ...aspectResults,
    {
      aspect: 'Tổng trung bình',
      ...overallPercentages,
    },
  ];

  return result;
};
