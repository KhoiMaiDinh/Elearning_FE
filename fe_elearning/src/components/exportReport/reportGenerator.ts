import { format } from 'date-fns';
import ExcelJS from 'exceljs';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { EmotionData, AspectData, AnalysisData } from '@/types/reportTypes';
import { generateCharts } from './chartGenerator';
import { calculateEmotionTrendPercentages, calculateAspectSummary } from './dataProcessor';

// Configure pdfMake with Vietnamese font support
(pdfMake as any).vfs = pdfFonts;
(pdfMake as any).fonts = {
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf',
  },
  Inter: {
    normal: 'Inter-Regular.ttf',
    bold: 'Inter-Medium.ttf',
    italics: 'Inter-Italic.ttf',
    bolditalics: 'Inter-MediumItalic.ttf',
  },
};

const addOverviewSheet = (workbook: ExcelJS.Workbook, analysis: AnalysisData) => {
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

  return overviewSheet;
};

const addTrendSheet = (workbook: ExcelJS.Workbook, processedTrend: EmotionData[]) => {
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

  return trendSheet;
};

const addAspectSheet = (workbook: ExcelJS.Workbook, processedAspects: AspectData[]) => {
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

  return aspectSheet;
};

const addChartsToWorkbook = async (
  workbook: ExcelJS.Workbook,
  trendSheet: ExcelJS.Worksheet,
  aspectSheet: ExcelJS.Worksheet,
  processedTrend: EmotionData[],
  processedAspects: AspectData[]
) => {
  // Generate charts
  const generatedCharts = await generateCharts(processedTrend, processedAspects);

  const chartImages = {
    trend: workbook.addImage({
      base64: generatedCharts.trendChart.split(',')[1],
      extension: 'png',
    }),
    aspect: workbook.addImage({
      base64: generatedCharts.aspectChart.split(',')[1],
      extension: 'png',
    }),
    sentiment: workbook.addImage({
      base64: generatedCharts.sentimentChart.split(',')[1],
      extension: 'png',
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
};

export const generateWorkbookWithCharts = async (
  analysis: AnalysisData,
  trend: any[],
  aspectSummaries: any[],
  startDate: string,
  endDate: string
): Promise<ExcelJS.Workbook> => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'E-Learning System';
  workbook.created = new Date();

  // Process data for charts
  const processedTrend = calculateEmotionTrendPercentages(trend, startDate, endDate);
  const processedAspects = calculateAspectSummary(aspectSummaries);

  // Add sheets
  const overviewSheet = addOverviewSheet(workbook, analysis);
  const trendSheet = addTrendSheet(workbook, processedTrend);
  const aspectSheet = addAspectSheet(workbook, processedAspects);

  // Add charts to sheets
  await addChartsToWorkbook(workbook, trendSheet, aspectSheet, processedTrend, processedAspects);

  return workbook;
};

export const generateExcelReport = async (
  analysis: AnalysisData,
  trend: any[],
  aspectSummaries: any[],
  startDate: string,
  endDate: string
): Promise<boolean> => {
  try {
    const workbook = await generateWorkbookWithCharts(
      analysis,
      trend,
      aspectSummaries,
      startDate,
      endDate
    );
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

export const generatePDFReport = async (
  analysis: AnalysisData,
  trend: any[],
  aspectSummaries: any[],
  startDate: string,
  endDate: string
): Promise<boolean> => {
  try {
    // Process data for charts
    const processedTrend = calculateEmotionTrendPercentages(trend, startDate, endDate);
    const processedAspects = calculateAspectSummary(aspectSummaries);

    // Generate charts
    const generatedCharts = await generateCharts(processedTrend, processedAspects);

    // Prepare overview data
    const overviewData = [
      ['Tổng số bình luận', (analysis?.total_comments || 0).toString()],
      ['Cảm xúc chủ đạo', analysis?.leading_emotion || 'N/A'],
      [
        'Tỷ lệ cảm xúc chủ đạo',
        analysis?.leading_emotion_percentage
          ? `${(Number(analysis.leading_emotion_percentage) * 100).toFixed(2)}%`
          : '0.00%',
      ],
      ['Số khóa học đang hoạt động', (analysis?.active_course_count || 0).toString()],
    ];

    // Prepare trend data
    const trendTableData = processedTrend.map((day: EmotionData) => [
      day.period === 'Tổng' ? 'Tổng' : format(new Date(day.period), 'dd/MM/yyyy'),
      `${day.positive}%`,
      `${day.negative}%`,
      `${day.neutral}%`,
      `${day.conflict}%`,
    ]);

    // Prepare aspect data
    const aspectTableData = processedAspects.map((aspect: AspectData) => [
      aspect.aspect,
      `${aspect.positive}%`,
      `${aspect.negative}%`,
      `${aspect.neutral}%`,
      `${aspect.conflict}%`,
      `${aspect.none}%`,
    ]);

    // Create PDF document definition
    const docDefinition: any = {
      content: [
        // Title page
        {
          text: 'BÁO CÁO PHÂN TÍCH CẢM XÚC KHÓA HỌC',
          style: 'title',
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },
        {
          text: `Thời gian: ${format(new Date(endDate), 'dd/MM/yyyy')} - ${format(new Date(startDate), 'dd/MM/yyyy')}`,
          style: 'subtitle',
          alignment: 'center',
          margin: [0, 0, 0, 30],
        },

        // Overview section
        {
          text: '1. TỔNG QUAN',
          style: 'sectionHeader',
          margin: [0, 20, 0, 10],
        },
        {
          table: {
            headerRows: 1,
            widths: ['60%', '40%'],
            body: [
              [
                { text: 'Chỉ số', style: 'tableHeader' },
                { text: 'Giá trị', style: 'tableHeader' },
              ],
              ...overviewData.map((row) => [
                { text: row[0], style: 'tableCell' },
                { text: row[1], style: 'tableCell' },
              ]),
            ],
          },
          layout: {
            fillColor: function (rowIndex: number) {
              return rowIndex === 0 ? '#4F81BD' : rowIndex % 2 === 0 ? '#E6EFF7' : null;
            },
          },
          margin: [0, 0, 0, 20],
        },

        // Page break
        { text: '', pageBreak: 'before' },

        // Trend analysis section
        {
          text: '2. XU HƯỚNG CẢM XÚC THEO THỜI GIAN',
          style: 'sectionHeader',
          margin: [0, 0, 0, 10],
        },

        // Trend chart
        ...(generatedCharts.trendChart
          ? [
              {
                image: generatedCharts.trendChart,
                width: 500,
                margin: [0, 0, 0, 20],
              },
            ]
          : []),

        // Trend table
        {
          table: {
            headerRows: 1,
            widths: ['20%', '20%', '20%', '20%', '20%'],
            body: [
              [
                { text: 'Ngày', style: 'tableHeader' },
                { text: 'Tích cực (%)', style: 'tableHeader' },
                { text: 'Tiêu cực (%)', style: 'tableHeader' },
                { text: 'Trung lập (%)', style: 'tableHeader' },
                { text: 'Mâu thuẫn (%)', style: 'tableHeader' },
              ],
              ...trendTableData.map((row, index) =>
                row.map((cell) => ({
                  text: cell,
                  style: index === 0 || index === 1 ? 'tableCellBold' : 'tableCell',
                }))
              ),
            ],
          },
          layout: {
            fillColor: function (rowIndex: number) {
              return rowIndex === 0
                ? '#4F81BD'
                : rowIndex === 1
                  ? '#7299C9'
                  : rowIndex % 2 === 0
                    ? '#E6EFF7'
                    : null;
            },
          },
          margin: [0, 0, 0, 20],
        },

        // Page break
        { text: '', pageBreak: 'before' },

        // Aspect analysis section
        {
          text: '3. PHÂN TÍCH KHÍA CẠNH',
          style: 'sectionHeader',
          margin: [0, 0, 0, 10],
        },

        // Sentiment chart subsection
        {
          text: '3.1. Phân bố Cảm xúc Tổng quan',
          style: 'subsectionHeader',
          margin: [0, 0, 0, 10],
        },

        // Sentiment chart
        ...(generatedCharts.sentimentChart
          ? [
              {
                image: generatedCharts.sentimentChart,
                width: 500,
                margin: [0, 0, 0, 20],
              },
            ]
          : []),

        // Aspect chart subsection
        {
          text: '3.2. Phân bố theo Khía cạnh',
          style: 'subsectionHeader',
          margin: [0, 0, 0, 10],
        },

        // Aspect chart
        ...(generatedCharts.aspectChart
          ? [
              {
                image: generatedCharts.aspectChart,
                width: 500,
                margin: [0, 0, 0, 20],
              },
            ]
          : []),

        // Aspect table
        {
          table: {
            headerRows: 1,
            widths: ['30%', '14%', '14%', '14%', '14%', '14%'],
            body: [
              [
                { text: 'Khía cạnh', style: 'tableHeader' },
                { text: 'Tích cực (%)', style: 'tableHeader' },
                { text: 'Tiêu cực (%)', style: 'tableHeader' },
                { text: 'Trung lập (%)', style: 'tableHeader' },
                { text: 'Mâu thuẫn (%)', style: 'tableHeader' },
                { text: 'Không có (%)', style: 'tableHeader' },
              ],
              ...aspectTableData.map((row, index) =>
                row.map((cell) => ({
                  text: cell,
                  style: index === aspectTableData.length - 1 ? 'tableCellBold' : 'tableCell',
                }))
              ),
            ],
          },
          layout: {
            fillColor: function (rowIndex: number) {
              return rowIndex === 0
                ? '#4F81BD'
                : rowIndex === aspectTableData.length
                  ? '#7299C9'
                  : rowIndex % 2 === 0
                    ? '#E6EFF7'
                    : null;
            },
          },
          margin: [0, 0, 0, 20],
        },
      ],

      // Styles
      styles: {
        title: {
          fontSize: 20,
          bold: true,
          font: 'Roboto',
        },
        subtitle: {
          fontSize: 12,
          font: 'Roboto',
        },
        sectionHeader: {
          fontSize: 16,
          bold: true,
          font: 'Roboto',
        },
        subsectionHeader: {
          fontSize: 14,
          bold: true,
          font: 'Roboto',
        },
        tableHeader: {
          fontSize: 10,
          bold: true,
          color: 'white',
          font: 'Roboto',
        },
        tableCell: {
          fontSize: 9,
          font: 'Roboto',
        },
        tableCellBold: {
          fontSize: 9,
          bold: true,
          font: 'Roboto',
        },
      },

      // Default style
      defaultStyle: {
        font: 'Roboto',
        fontSize: 10,
      },

      // Footer
      footer: function (currentPage: number, pageCount: number) {
        return [
          {
            columns: [
              {
                text: `Trang ${currentPage} / ${pageCount}`,
                alignment: 'center',
                font: 'Roboto',
                fontSize: 9,
              },
              {
                text: `Tạo ngày: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`,
                alignment: 'right',
                font: 'Roboto',
                fontSize: 9,
              },
            ],
            margin: [20, 0, 20, 0],
          },
        ];
      },
    };

    // Generate and download PDF
    pdfMake
      .createPdf(docDefinition)
      .download(`Báo cáo khóa học ${format(new Date(), 'dd-MM-yyyy')}.pdf`);

    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};
