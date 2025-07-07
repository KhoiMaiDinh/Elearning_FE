'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { differenceInDays } from 'date-fns';

import { ExportReportPopUpProps, ExportFormData } from '@/types/reportTypes';
import ExportForm from './ExportForm';
import { generateExcelReport } from './reportGenerator';
import {
  APIGetAspectSegmentTrendOverTime,
  APIGetCommentsForInstructorAnalysis,
  APIGetCommentsForInstructorAspectDistribution,
} from '@/utils/comment';

export default function ExportReportDialog({
  isOpen,
  onClose,
  courseId,
  courses = [],
}: ExportReportPopUpProps) {
  const [formData, setFormData] = useState<ExportFormData>({
    fileType: 'excel',
    selectedCourses: [],
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
  });

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
      if (formData.fileType === 'excel') {
        const analysisResponse = await handleGetAnalysisOfMonth(
          formData.startDate,
          formData.endDate
        );
        const trendResponse = await handleGetEmotionTrend(formData.startDate, formData.endDate);

        let aspectSummaryData: any[] = [];
        if (courseId) {
          const singleCourseAspect = await handleGetAspectSummary(courseId);
          aspectSummaryData = [singleCourseAspect];
        } else if (formData.selectedCourses.length > 0) {
          const responses = await Promise.all(
            formData.selectedCourses.map(async (course) => {
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
          aspectSummaryData,
          formData.startDate,
          formData.endDate
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

        <ExportForm
          formData={formData}
          onFormChange={setFormData}
          courses={courses}
          courseId={courseId}
        />

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleExport} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Xuất báo cáo'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
