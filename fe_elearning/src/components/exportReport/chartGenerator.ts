import { format } from 'date-fns';
import Chart from 'chart.js/auto';
import { EmotionData, AspectData, ChartResult } from '@/types/reportTypes';

export const generateSentimentDistributionChart = async (
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

  // Set black background
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

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
  ctx.strokeStyle = '#ffffff';
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
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`${segment.label} (${segment.value}%)`, legendX + 20, legendY + 9);
  });

  // Draw percentage labels on segments
  currentX = chartX;
  ctx.font = 'bold 8px Arial';
  ctx.textAlign = 'center';
  segments.forEach((segment) => {
    const segmentWidth = (segment.value / 100) * chartWidth;
    if (segmentWidth > 40) {
      // Only show label if segment is wide enough
      const labelX = currentX + segmentWidth / 2;
      const labelY = chartY + chartHeight / 2 + 5;

      // Use contrasting color for text
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`${segment.label} (${segment.value}%)`, labelX, labelY);
    }
    currentX += segmentWidth;
  });

  return canvas.toDataURL('image/png', 1.0);
};

export const generateTrendChart = async (processedTrend: EmotionData[]): Promise<string> => {
  return new Promise((resolve) => {
    const createCanvas = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 400;
      return canvas;
    };

    const trendCanvas = createCanvas();
    const ctx = trendCanvas.getContext('2d');

    if (!ctx) {
      resolve('');
      return;
    }

    // Set black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, trendCanvas.width, trendCanvas.height);

    const chart = new Chart(trendCanvas, {
      type: 'line',
      plugins: [
        {
          id: 'background-color',
          beforeDraw: (chart: any) => {
            const ctx = chart.ctx;
            ctx.save();
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
          },
        },
      ],
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
            backgroundColor: 'rgba(16, 185, 129, 0.3)',
            fill: 'origin',
            tension: 0.4,
            borderWidth: 2,
          },
          {
            label: 'Tiêu cực',
            data: processedTrend.slice(1).map((d) => Number(d.negative)),
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.3)',
            fill: 'origin',
            tension: 0.4,
            borderWidth: 2,
          },
          {
            label: 'Trung lập',
            data: processedTrend.slice(1).map((d) => Number(d.neutral)),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.3)',
            fill: 'origin',
            tension: 0.4,
            borderWidth: 2,
          },
          {
            label: 'Mâu thuẫn',
            data: processedTrend.slice(1).map((d) => Number(d.conflict)),
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.3)',
            fill: 'origin',
            tension: 0.4,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: false,
        layout: {
          padding: 0,
        },
        animation: {
          onComplete: function () {
            // Ensure black background is applied
            const chartCtx = trendCanvas.getContext('2d');
            if (chartCtx) {
              chartCtx.save();
              chartCtx.globalCompositeOperation = 'destination-over';
              chartCtx.fillStyle = '#000000';
              chartCtx.fillRect(0, 0, trendCanvas.width, trendCanvas.height);
              chartCtx.restore();
            }
            // Wait a bit more for chart to fully render
            setTimeout(() => {
              resolve(trendCanvas.toDataURL('image/png', 1.0));
            }, 100);
          },
        },
        interaction: {
          mode: 'index',
          intersect: false,
        },
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
              maxTicksLimit: 10,
              callback: (value: any, index: number, values: any[]) => {
                const totalTicks = values.length;
                const step = Math.ceil(totalTicks / 8);
                const dateStr = processedTrend.slice(1)[index]?.period;
                return index % step === 0 && dateStr ? format(new Date(dateStr), 'dd/MM') : '';
              },
            },
            grid: {
              display: false,
            },
          },
        },
      },
    });

    // Fallback in case animation doesn't trigger
    setTimeout(() => {
      resolve(trendCanvas.toDataURL('image/png', 1.0));
    }, 1000);
  });
};

export const generateAspectChart = async (processedAspects: AspectData[]): Promise<string> => {
  const createCanvas = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 400;
    return canvas;
  };

  const aspectCanvas = createCanvas();
  const ctx = aspectCanvas.getContext('2d');
  if (!ctx) return '';

  // Set black background
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, aspectCanvas.width, aspectCanvas.height);

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
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // Draw inner circle for donut effect with black background
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
    } else {
      // Draw empty circle if no data
      const radius = chartSize / 2;
      ctx.beginPath();
      ctx.arc(x + radius, y + radius, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Add label
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(aspect.aspect, x + chartSize / 2, y + chartSize + 12);
  });

  return aspectCanvas.toDataURL('image/jpeg', 1.0);
};

export const generateCharts = async (
  processedTrend: EmotionData[],
  processedAspects: AspectData[]
): Promise<ChartResult> => {
  const [trendChart, aspectChart, sentimentChart] = await Promise.all([
    generateTrendChart(processedTrend),
    generateAspectChart(processedAspects),
    generateSentimentDistributionChart(processedAspects),
  ]);

  return {
    trendChart,
    aspectChart,
    sentimentChart,
  };
};
