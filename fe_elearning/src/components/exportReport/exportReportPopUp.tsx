'use client';

import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import html2canvas from 'html2canvas';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Check, FileSpreadsheet, FileType, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ExcelJS from 'exceljs';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  APIGetAspectSegmentTrendOverTime,
  APIGetCommentsForInstructor,
  APIGetCommentsForInstructorAnalysis,
  APIGetCommentsForInstructorAspectDistribution,
  APIGetReview,
} from '@/utils/comment';
import { differenceInDays, format } from 'date-fns';

import Chart from 'chart.js/auto';

interface Course {
  id: string;
  title: string;
}

interface ExportReportPopUpProps {
  isOpen: boolean;
  onClose: () => void;
  courseId?: string;
  courses?: Course[];
}

const ASPECT_LABELS = {
  instructor_quality: 'Chất lượng giảng viên',
  content_quality: 'Chất lượng nội dung',
  technology: 'Công nghệ',
  teaching_pace: 'Tốc độ',
  study_materials: 'Tài liệu',
  assignments_practice: 'Bài tập',
  other: 'Khác',
};

interface ChartOptions {
  title: {
    text: string;
    font?: {
      size?: number;
      bold?: boolean;
    };
  };
  legend: {
    position: 'top' | 'bottom' | 'left' | 'right';
  };
  width: number;
  height: number;
  type: string;
  addSeries: (options: any) => void;
}

interface EmotionData {
  period: string;
  positive: number;
  negative: number;
  neutral: number;
  conflict: number;
}

interface AspectData {
  aspect: string;
  positive: number;
  negative: number;
  neutral: number;
  conflict: number;
  none: number;
}

interface ChartResult {
  trendChart: string;
  aspectChart: string;
  sentimentChart: string;
}

const transformTrendData = (trend: any[]) => {
  return trend.slice(1).map((day) => ({
    period: day.period,
    positive: Number(day.positive || 0),
    negative: Number(day.negative || 0),
    neutral: Number(day.neutral || 0),
    conflict: Number(day.conflict || 0),
  }));
};

const transformAspectData = (aspects: any[]) => {
  return aspects.map((aspect) => ({
    aspect: aspect.aspect,
    statistics: {
      positive: Number(aspect.positive || 0),
      negative: Number(aspect.negative || 0),
      neutral: Number(aspect.neutral || 0),
      conflict: Number(aspect.conflict || 0),
      none: Number(aspect.none || 0),
    },
  }));
};

const transformToComments = (aspects: any[]) => {
  // Transform aspect data into a format that AspectEmotionCircles expects
  return aspects.map((aspect) => ({
    aspects: [
      {
        aspect: aspect.aspect,
        emotion: getLeadingEmotion(aspect),
      },
    ],
  }));
};

const getLeadingEmotion = (aspect: any) => {
  const emotions = ['positive', 'negative', 'neutral', 'conflict'];
  return emotions.reduce((leading, emotion) => {
    return Number(aspect[emotion]) > Number(aspect[leading]) ? emotion : leading;
  }, 'positive');
};

const renderComponentToImage = async (Component: React.ComponentType<any>, props: any) => {
  const container = document.createElement('div');

  // Set default styles
  container.style.width = '800px';
  container.style.height = '400px';
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.backgroundColor = 'transparent';
  container.style.overflow = 'hidden';
  container.style.padding = '20px';
  container.style.margin = '0';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';

  document.body.appendChild(container);

  try {
    const root = createRoot(container);
    root.render(
      <div style={{ width: '100%', height: '100%', background: 'transparent' }}>
        <Component {...props} />
      </div>
    );

    // Wait longer for charts to render properly
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const canvas = await html2canvas(container, {
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
    });

    root.unmount();

    return canvas.toDataURL('image/jpeg', 1.0);
  } catch (error) {
    console.error('Error rendering component:', error);
    throw error;
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
};

const calculateEmotionTrendPercentages = (trend: any[]): EmotionData[] => {
  if (!Array.isArray(trend)) {
    return [];
  }

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

  const result = [
    {
      period: 'Tổng',
      positive: Number(percentages.positive),
      negative: Number(percentages.negative),
      neutral: Number(percentages.neutral),
      conflict: Number(percentages.conflict),
    },
    ...trend.map((day) => {
      const dayPositive = Number(day.positive || 0);
      const dayNegative = Number(day.negative || 0);
      const dayNeutral = Number(day.neutral || 0);
      const dayConflict = Number(day.conflict || 0);

      // Calculate daily total
      const dailyTotal = dayPositive + dayNegative + dayNeutral + dayConflict;

      // Normalize to percentages (ensure total = 100%)
      if (dailyTotal > 0) {
        return {
          period: day.period,
          positive: Number(((dayPositive / dailyTotal) * 100).toFixed(2)),
          negative: Number(((dayNegative / dailyTotal) * 100).toFixed(2)),
          neutral: Number(((dayNeutral / dailyTotal) * 100).toFixed(2)),
          conflict: Number(((dayConflict / dailyTotal) * 100).toFixed(2)),
        };
      } else {
        return {
          period: day.period,
          positive: 0,
          negative: 0,
          neutral: 0,
          conflict: 0,
        };
      }
    }),
  ];

  return result;
};

const calculateAspectSummary = (summaries: any[]): AspectData[] => {
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

const generateSentimentDistributionChart = async (
  processedAspects: AspectData[]
): Promise<string> => {
  const createCanvas = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 300;
    return canvas;
  };

  const canvas = createCanvas();
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Calculate overall percentages from the total row
  const totalRow = processedAspects[processedAspects.length - 1];
  const totalPositive = Number(totalRow.positive);
  const totalNegative = Number(totalRow.negative);
  const totalNeutral = Number(totalRow.neutral);
  const totalConflict = Number(totalRow.conflict);

  // Set up canvas with transparent background
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Phân bố Cảm xúc Tổng quan', canvas.width / 2, 40);

  // Draw subtitle
  ctx.font = '14px Arial';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Tỉ lệ phần trăm các cảm xúc', canvas.width / 2, 65);

  // Chart dimensions
  const chartY = 100;
  const chartHeight = 60;
  const chartWidth = 600;
  const chartX = (canvas.width - chartWidth) / 2;

  // Draw main sentiment bar
  let currentX = chartX;
  const segments = [
    { value: totalPositive, color: '#10b981', label: 'Tích cực' },
    { value: totalNegative, color: '#ef4444', label: 'Tiêu cực' },
    { value: totalNeutral, color: '#3b82f6', label: 'Trung tính' },
    { value: totalConflict, color: '#f59e0b', label: 'Mâu thuẫn' },
  ];

  // Draw segments with subtle shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
  ctx.shadowBlur = 2;
  ctx.shadowOffsetY = 1;

  segments.forEach((segment) => {
    const segmentWidth = (segment.value / 100) * chartWidth;
    if (segmentWidth > 0) {
      ctx.fillStyle = segment.color;
      ctx.fillRect(currentX, chartY, segmentWidth, chartHeight);
      currentX += segmentWidth;
    }
  });

  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Draw border
  ctx.strokeStyle = '#d1d5db';
  ctx.lineWidth = 1;
  ctx.strokeRect(chartX, chartY, chartWidth, chartHeight);

  // Draw legend
  const legendY = chartY + chartHeight + 30;
  const legendItemWidth = 140;
  const legendStartX = (canvas.width - segments.length * legendItemWidth) / 2;

  segments.forEach((segment, index) => {
    const legendX = legendStartX + index * legendItemWidth;

    // Draw color box with rounded corners (fallback for older browsers)
    ctx.fillStyle = segment.color;
    if (typeof ctx.roundRect === 'function') {
      ctx.beginPath();
      ctx.roundRect(legendX, legendY, 12, 12, 2);
      ctx.fill();
    } else {
      // Fallback for older browsers
      ctx.fillRect(legendX, legendY, 12, 12);
    }

    // Draw label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`${segment.label} (${segment.value}%)`, legendX + 20, legendY + 9);
  });

  // Draw percentage labels on segments
  currentX = chartX;
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  segments.forEach((segment) => {
    const segmentWidth = (segment.value / 100) * chartWidth;
    if (segmentWidth > 40) {
      // Only show label if segment is wide enough
      const labelX = currentX + segmentWidth / 2;
      const labelY = chartY + chartHeight / 2 + 5;

      // Use contrasting color for text
      ctx.fillStyle = segment.color === '#f59e0b' ? '#1f2937' : '#ffffff';
      ctx.fillText(`${segment.value}%`, labelX, labelY);
    }
    currentX += segmentWidth;
  });

  return canvas.toDataURL('image/jpeg', 1.0);
};

const generateCharts = async (
  processedTrend: EmotionData[],
  processedAspects: AspectData[],
  aspectTotalRow: AspectData
): Promise<ChartResult> => {
  const createCanvas = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 400;
    return canvas;
  };

  // Area chart for emotion trends
  const trendCanvas = createCanvas();
  new Chart(trendCanvas, {
    type: 'line',
    data: {
      labels: processedTrend
        .slice(1)
        .map((day) =>
          day.period === 'Tổng' ? 'Tổng' : format(new Date(day.period), 'dd/MM/yyyy')
        ),
      datasets: [
        {
          label: 'Tích cực',
          data: processedTrend.slice(1).map((d) => Number(d.positive)),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          fill: true,
          tension: 0.4,
          borderWidth: 2,
        },
        {
          label: 'Tiêu cực',
          data: processedTrend.slice(1).map((d) => Number(d.negative)),
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          fill: true,
          tension: 0.4,
          borderWidth: 2,
        },
        {
          label: 'Trung lập',
          data: processedTrend.slice(1).map((d) => Number(d.neutral)),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          fill: true,
          tension: 0.4,
          borderWidth: 2,
        },
        {
          label: 'Mâu thuẫn',
          data: processedTrend.slice(1).map((d) => Number(d.conflict)),
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.2)',
          fill: true,
          tension: 0.4,
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: false,
      plugins: {
        title: {
          display: true,
          text: 'Xu hướng Cảm xúc theo Thời gian',
          font: {
            size: 16,
            weight: 'bold',
            family: 'Arial',
          },
          color: '#ffffff',
          padding: 20,
        },
        subtitle: {
          display: true,
          text: 'Phân bố cảm xúc theo Ngày (%)',
          color: '#ffffff',
          font: {
            family: 'Arial',
          },
          padding: {
            bottom: 20,
          },
        },
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 20,
            color: '#ffffff',
            font: {
              family: 'Arial',
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: function (value) {
              return value + '%';
            },
            color: '#ffffff',
            font: {
              family: 'Arial',
            },
          },
          grid: {
            color: 'rgba(107, 114, 128, 0.2)',
          },
        },
        x: {
          ticks: {
            color: '#ffffff',
            font: {
              family: 'Arial',
            },
          },
          grid: {
            display: false,
          },
        },
      },
    },
  });

  // Donut charts for aspects
  const aspectCanvas = createCanvas();
  aspectCanvas.height = 400;

  const ctx = aspectCanvas.getContext('2d');
  if (!ctx) return { trendChart: '', aspectChart: '', sentimentChart: '' } as ChartResult;

  // Clear canvas
  ctx.clearRect(0, 0, aspectCanvas.width, aspectCanvas.height);

  // Draw grid of donut charts
  const aspectData = processedAspects.slice(0, -1);
  const chartSize = 50;
  const cols = 3;

  // Tính toán padding dựa trên kích thước canvas và số cột
  const totalWidth = aspectCanvas.width;
  const totalPadding = totalWidth - cols * chartSize;
  const horizontalPadding = Math.floor(totalPadding / (cols + 1));

  // Tính số hàng cần thiết
  const rows = Math.ceil(aspectData.length / cols);
  const totalHeight = aspectCanvas.height;
  const verticalPadding = Math.floor((totalHeight - rows * (chartSize + 30)) / (rows + 1));

  // Vị trí bắt đầu để căn giữa
  const startX = horizontalPadding;
  const startY = verticalPadding;

  aspectData.forEach((aspect, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    const x = startX + col * (chartSize + horizontalPadding);
    const y = startY + row * (chartSize + verticalPadding + 30); // thêm 30px cho text

    // Draw donut chart with shadow
    const total =
      Number(aspect.positive) +
      Number(aspect.negative) +
      Number(aspect.neutral) +
      Number(aspect.conflict);

    if (total > 0) {
      let startAngle = -Math.PI / 2;
      const radius = chartSize / 2;
      const centerX = x + radius;
      const centerY = y + radius;

      // Add subtle shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
      ctx.shadowBlur = 3;
      ctx.shadowOffsetY = 1;

      // Draw segments
      [
        { value: aspect.positive, color: '#10b981' },
        { value: aspect.negative, color: '#ef4444' },
        { value: aspect.neutral, color: '#3b82f6' },
        { value: aspect.conflict, color: '#f59e0b' },
      ].forEach((segment) => {
        const sliceAngle = (Number(segment.value) / total) * (2 * Math.PI);

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = segment.color;
        ctx.fill();

        startAngle += sliceAngle;
      });

      // Reset shadow before drawing inner circle
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // Draw inner circle for donut effect with transparent background
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    } else {
      // Draw empty circle if no data
      const radius = chartSize / 2;
      ctx.beginPath();
      ctx.arc(x + radius, y + radius, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = '#d1d5db';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Add label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(aspect.aspect, x + chartSize / 2, y + chartSize + 12);

    // Add count (removed duplicate label)
  });

  // Generate sentiment distribution chart
  const sentimentChart = await generateSentimentDistributionChart(processedAspects);

  await new Promise((resolve) => setTimeout(resolve, 100));

  return {
    trendChart: trendCanvas.toDataURL('image/jpeg', 1.0),
    aspectChart: aspectCanvas.toDataURL('image/jpeg', 1.0),
    sentimentChart: sentimentChart,
  };
};

const generateWorkbookWithCharts = async (
  analysis: any,
  trend: any[],
  aspectSummaries: any[]
): Promise<ExcelJS.Workbook> => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'E-Learning System';
  workbook.created = new Date();

  // Process data for charts
  const processedTrend = calculateEmotionTrendPercentages(trend);
  const processedAspects = calculateAspectSummary(aspectSummaries);
  const aspectTotalRow = processedAspects[processedAspects.length - 1];

  // Generate charts
  const generatedCharts = await generateCharts(processedTrend, processedAspects, aspectTotalRow);

  // Add overview sheet
  const overviewSheet = workbook.addWorksheet('Tổng quan');
  overviewSheet.columns = [
    { header: 'Chỉ số', key: 'metric', width: 30 },
    { header: 'Giá trị', key: 'value', width: 20 },
  ];

  const overviewData = [
    { metric: 'Tổng số bình luận', value: analysis?.total_comments || 0 },
    { metric: 'Cảm xúc chủ đạo', value: analysis?.leading_emotion || 'N/A' },
    {
      metric: 'Tỷ lệ cảm xúc chủ đạo',
      value: analysis?.leading_emotion_percentage
        ? `${(Number(analysis.leading_emotion_percentage) * 100).toFixed(2)}%`
        : '0.00%',
    },
    { metric: 'Số khóa học đang hoạt động', value: analysis?.active_course_count || 0 },
  ];

  overviewSheet.addRows(overviewData);

  // Style overview sheet
  overviewSheet.getRow(1).font = { bold: true };
  overviewSheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4F81BD' },
  };
  overviewSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

  overviewData.forEach((_, index) => {
    const row = overviewSheet.getRow(index + 2);
    row.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE6EFF7' },
    };
  });

  // Add trend sheet
  const trendSheet = workbook.addWorksheet('Xu hướng cảm xúc');
  trendSheet.columns = [
    { header: 'Ngày', key: 'period', width: 15 },
    { header: 'Tích cực (%)', key: 'positive', width: 15 },
    { header: 'Tiêu cực (%)', key: 'negative', width: 15 },
    { header: 'Trung lập (%)', key: 'neutral', width: 15 },
    { header: 'Mâu thuẫn (%)', key: 'conflict', width: 15 },
  ];

  trendSheet.addRows(
    processedTrend.map((day: EmotionData) => ({
      period: day.period === 'Tổng' ? 'Tổng' : format(new Date(day.period), 'dd/MM/yyyy'),
      positive: day.positive,
      negative: day.negative,
      neutral: day.neutral,
      conflict: day.conflict,
    }))
  );

  // Style trend sheet
  trendSheet.getRow(1).font = { bold: true };
  trendSheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4F81BD' },
  };
  trendSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

  // Style total row
  const trendTotalRow = trendSheet.getRow(2);
  trendTotalRow.font = { bold: true };
  trendTotalRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE6EFF7' },
  };

  // Format numbers in trend sheet
  processedTrend.forEach((_: EmotionData, rowIndex: number) => {
    ['B', 'C', 'D', 'E'].forEach((col: string) => {
      const cell = trendSheet.getCell(`${col}${rowIndex + 2}`);
      cell.numFmt = '0.00"%"';
    });
  });

  // Add aspect sheet
  const aspectSheet = workbook.addWorksheet('Phân tích khía cạnh');
  aspectSheet.columns = [
    { header: 'Khía cạnh', key: 'aspect', width: 30 },
    { header: 'Tích cực (%)', key: 'positive', width: 15 },
    { header: 'Tiêu cực (%)', key: 'negative', width: 15 },
    { header: 'Trung lập (%)', key: 'neutral', width: 15 },
    { header: 'Mâu thuẫn (%)', key: 'conflict', width: 15 },
    { header: 'Không có (%)', key: 'none', width: 15 },
  ];

  aspectSheet.addRows(processedAspects);

  // Style aspect sheet
  aspectSheet.getRow(1).font = { bold: true };
  aspectSheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4F81BD' },
  };
  aspectSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

  // Style total row in aspect sheet
  const lastRow = aspectSheet.getRow(processedAspects.length + 1);
  lastRow.font = { bold: true };
  lastRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE6EFF7' },
  };

  // Add conditional formatting for emotion columns
  ['B', 'C', 'D', 'E', 'F'].forEach((col) => {
    aspectSheet.getColumn(col).numFmt = '0.00"%"';
    aspectSheet.addConditionalFormatting({
      ref: `${col}2:${col}${processedAspects.length}`,
      rules: [
        {
          type: 'colorScale',
          priority: 1,
          cfvo: [{ type: 'min' }, { type: 'max' }],
          color: [{ argb: 'FFFF9999' }, { argb: 'FF99FF99' }],
        },
      ],
    });
  });

  // Add charts to sheets
  const chartImages = {
    trend: workbook.addImage({
      base64: generatedCharts.trendChart.split(',')[1],
      extension: 'jpeg',
    }),
    aspect: workbook.addImage({
      base64: generatedCharts.aspectChart.split(',')[1],
      extension: 'jpeg',
    }),
    sentiment: workbook.addImage({
      base64: generatedCharts.sentimentChart.split(',')[1],
      extension: 'jpeg',
    }),
  };

  trendSheet.addImage(chartImages.trend, {
    tl: { col: 0, row: processedTrend.length + 2 },
    ext: { width: 800, height: 400 },
  });

  aspectSheet.addImage(chartImages.aspect, {
    tl: { col: 0, row: processedAspects.length + 2 },
    ext: { width: 800, height: 400 },
  });

  // Add sentiment distribution chart to aspect sheet
  aspectSheet.addImage(chartImages.sentiment, {
    tl: { col: 0, row: processedAspects.length + 25 },
    ext: { width: 800, height: 300 },
  });

  return workbook;
};

const generateExcelReport = async (analysis: any, trend: any[], aspectSummaries: any[]) => {
  try {
    const workbook = await generateWorkbookWithCharts(analysis, trend, aspectSummaries);
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Báo cáo khóa học ${format(new Date(), 'dd-MM-yyyy')}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Error saving Excel file:', error);
    return false;
  }
};

export default function ExportReportPopUp({
  isOpen,
  onClose,
  courseId,
  courses = [],
}: ExportReportPopUpProps) {
  const [fileType, setFileType] = useState<'excel' | 'pdf'>('excel');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(
    new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0]
  );
  const [openCourseSelect, setOpenCourseSelect] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const handleGetAnalysisOfMonth = async (start: string, end: string) => {
    const response = await APIGetCommentsForInstructorAnalysis(end, start);
    if (response?.status === 200) {
      return response?.data;
    }

    return [];
  };

  const handleGetEmotionTrend = async (start: string, end: string) => {
    const countDate = differenceInDays(new Date(start), new Date(end));
    const response = await APIGetAspectSegmentTrendOverTime({
      unit: 'day',
      count: countDate,
      course_id: courseId,
    });

    if (response?.status === 200) {
      return response?.data;
    }

    return [];
  };

  const handleGetAspectSummary = async (courseId: string) => {
    const response = await APIGetCommentsForInstructorAspectDistribution(courseId);
    if (response?.status === 200) {
      return response?.data?.[0]?.statistics;
    }

    return [];
  };

  const handleExport = async () => {
    setIsLoading(true);
    try {
      if (fileType === 'excel') {
        const analysisResponse = await handleGetAnalysisOfMonth(startDate, endDate);
        const trendResponse = await handleGetEmotionTrend(startDate, endDate);

        let aspectSummaryData: any[] = [];
        if (courseId) {
          const singleCourseAspect = await handleGetAspectSummary(courseId);
          aspectSummaryData = [singleCourseAspect];
        } else if (selectedCourses.length > 0) {
          const responses = await Promise.all(
            selectedCourses.map(async (course) => {
              const response = await handleGetAspectSummary(course);
              return response;
            })
          );
          aspectSummaryData = responses;
        }

        if (!analysisResponse || !trendResponse || !aspectSummaryData.length) {
          throw new Error('Không đủ dữ liệu để tạo báo cáo');
        }

        const success = await generateExcelReport(
          analysisResponse,
          trendResponse,
          aspectSummaryData
        );

        if (success) {
          onClose();
        }
      }
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Xuất báo cáo</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Định dạng file</Label>
            <RadioGroup
              defaultValue={fileType}
              onValueChange={(value) => setFileType(value as 'excel' | 'pdf')}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excel" id="excel" />
                <Label htmlFor="excel" className="flex items-center gap-1">
                  <FileSpreadsheet className="h-4 w-4" />
                  Excel
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf" className="flex items-center gap-1">
                  <FileType className="h-4 w-4" />
                  PDF
                </Label>
              </div>
            </RadioGroup>
          </div>

          {!courseId && (
            <div className="space-y-2">
              <Label>Khóa học</Label>
              <Popover open={openCourseSelect} onOpenChange={setOpenCourseSelect}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-full justify-between">
                    {selectedCourses.length === 0
                      ? 'Chọn khóa học'
                      : `${selectedCourses.length} khóa học đã chọn`}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <Command>
                    <CommandInput placeholder="Tìm khóa học..." />
                    <CommandEmpty>Không tìm thấy khóa học.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        onSelect={() => {
                          setSelectedCourses(
                            selectedCourses.length === courses.length
                              ? []
                              : courses.map((course) => course.id)
                          );
                        }}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            selectedCourses.length === courses.length ? 'opacity-100' : 'opacity-0'
                          }`}
                        />
                        Chọn tất cả
                      </CommandItem>
                      {courses.map((course) => (
                        <CommandItem
                          key={course.id}
                          onSelect={() => {
                            setSelectedCourses((prev) =>
                              prev.includes(course.id)
                                ? prev.filter((id) => id !== course.id)
                                : [...prev, course.id]
                            );
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              selectedCourses.includes(course.id) ? 'opacity-100' : 'opacity-0'
                            }`}
                          />
                          {course.title}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          )}

          <div className="space-y-2">
            <Label>Thời gian</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Từ ngày</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Đến ngày</Label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleExport}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Xuất báo cáo'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
