'use client';

import { ExportReportPopUpProps } from '@/types/reportTypes';
import ExportReportDialog from './ExportReportDialog';

export default function ExportReportPopUp({
  isOpen,
  onClose,
  courseId,
  courses = [],
}: ExportReportPopUpProps) {
  return (
    <ExportReportDialog isOpen={isOpen} onClose={onClose} courseId={courseId} courses={courses} />
  );
}
