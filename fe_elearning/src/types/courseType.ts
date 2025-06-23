import { MediaType } from './mediaType';
import { InstructorType } from './registerLectureFormType';
import { UserType } from './userType';

export interface VideoType {
  id: string;
  duration_in_seconds?: number | null;

  video: {
    key: string;
    status?: 'uploaded' | 'validated' | 'pending' | 'rejected';
    bucket: string;
    rejection_reason: string | null;
  };
  version: number;
}

export interface ResourceType {
  resource_file: MediaType;
  name: string;
}

export interface SeriesType {
  version: number;
  title: string;
  is_preview?: boolean;
  description?: string;
  duration_in_seconds?: number;
  status?: string;
  video: MediaType;
  resources?: ResourceType[];
}

export interface CourseItem {
  id: string;
  is_favorite?: boolean;
  title: string;
  description: string;
  video?: (MediaType & { duration_in_seconds: number }) | null;
  resources: ResourceType[];
  duration_in_seconds?: number;
  is_preview: boolean;
  position: string;
  section_id: string;
  status?: string;
  previous_position?: string;
  fileUrl?: string;
  progresses?: ProgressItem[];
  series: SeriesType[];
  is_hidden?: boolean;
  deletedAt?: string;
  section?: SectionType;
}

export type SectionType = {
  id: string;
  title: string;
  description: string;
  position: string;
  status: string;
  course_id: string;
  items: CourseItem[];
  quizzes: any[];
  articles: any[];
  is_expanded?: boolean;
  course?: CourseForm;
};

export interface Translation {
  category_translation_id?: string;
  name?: string;
  description?: string;
  parent_id?: string | null;
  language?: string;
  category_id?: string;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  deletedAt?: string | null;
}
export interface CourseForm {
  is_favorite?: boolean;
  course_id?: string;
  id?: string;
  category?: {
    slug?: string;
    children?: { slug: string; translations: Translation[] }[];
    parent?: { slug: string; translations: Translation[] };
    translations: Translation[];
  };
  published_at: string;
  title: string;
  subtitle: string;
  slug?: string;
  description: string;
  language?: string;
  outcomes?: string[];
  requirements?: string[];
  is_disabled?: boolean;
  status?: string;
  instructor_id?: string;
  instructor?: InstructorType;
  level: string;
  thumbnail: MediaType | null;
  is_approved?: boolean;
  price: number;
  priceFinal?: number;
  sections?: SectionType[];
  avg_rating?: number;
  total_enrolled?: number;
  course_progress?: CourseProgress | null;
  total_revenue?: number;
  createdAt?: string;
  updatedAt?: string;
  warning?: { reports: { reason: string }[] }[];
}

export interface CourseProgress {
  total: number;
  completed: number;
  progress: number;
}

export interface ProgressItem {
  user_lesson_progress_id?: string;
  user_id?: string;
  lecture_id?: string;
  course_id?: string;
  watch_time_in_percentage?: number;
  completed?: boolean;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  deletedAt?: string | null;
  user?: UserType;
}
