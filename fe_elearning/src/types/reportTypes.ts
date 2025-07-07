export interface Course {
  id: string;
  title: string;
}

export interface ExportReportPopUpProps {
  isOpen: boolean;
  onClose: () => void;
  courseId?: string;
  courses?: Course[];
}

export interface ExportFormData {
  fileType: 'excel' | 'pdf';
  selectedCourses: string[];
  startDate: string;
  endDate: string;
}

export interface EmotionData {
  period: string;
  positive: number;
  negative: number;
  neutral: number;
  conflict: number;
}

export interface AspectData {
  aspect: string;
  positive: number;
  negative: number;
  neutral: number;
  conflict: number;
  none: number;
}

export interface ChartResult {
  trendChart: string;
  aspectChart: string;
  sentimentChart: string;
}

export interface AnalysisData {
  total_comments?: number;
  leading_emotion?: string;
  leading_emotion_percentage?: number;
  active_course_count?: number;
}

export const ASPECT_LABELS = {
  instructor_quality: 'Chất lượng giảng viên',
  content_quality: 'Chất lượng nội dung',
  technology: 'Công nghệ',
  teaching_pace: 'Tốc độ',
  study_materials: 'Tài liệu',
  assignments_practice: 'Bài tập',
  other: 'Khác',
} as const;

export interface ExportFormProps {
  formData: ExportFormData;
  onFormChange: (data: ExportFormData) => void;
  courses: Course[];
  courseId?: string;
}

export interface CourseSelectProps {
  courses: Course[];
  selectedCourses: string[];
  onSelectionChange: (courseIds: string[]) => void;
}
