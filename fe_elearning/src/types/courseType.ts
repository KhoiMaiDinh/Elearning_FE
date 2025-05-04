import { User } from "next-auth";
import { MediaType } from "./mediaType";
import { Lecture } from "./registerLectureFormType";

export interface VideoType {
  id: string;
  duration_in_seconds?: number | null;

  video: {
    key: string;
    status: "uploaded" | "validated" | "pending";
    bucket: string;
    rejection_reason: string | null;
  };
  version: number;
}

export interface ResourceType {
  resource_file: MediaType;
  name: string;
}

export interface CourseItem {
  id: string;
  title: string;
  description: string;
  videos?: VideoType[];
  video?: VideoType | null;
  resources: ResourceType[];
  is_preview: boolean;
  position: string;
  section_id: string;
  status?: string;
  previous_position?: string;
  fileUrl?: string;
  progresses?: ProgressItem[];
}

export interface Section {
  id: string;
  title: string;
  description: string;
  position: string;
  status: string;
  course_id: string;
  items: CourseItem[];
  // lectures: CourseItem[];
  quizzes: any[];
  articles: any[];
}

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
  course_id?: string;
  id?: string;
  category?: {
    slug?: string;
    children?: { slug: string; translations: Translation[] }[];
    parent?: { slug: string; translations: Translation[] };
    translations: Translation[];
  };
  title: string;
  subtitle: string;
  slug?: string;
  description?: string;
  language?: string;
  outcomes?: string[];
  requirements?: string[];
  is_disabled?: boolean;
  status?: string;
  instructor_id?: string;
  instructor?: Lecture;
  level: string;
  thumbnail: MediaType | null;
  is_approved?: boolean;
  price: number;
  priceFinal?: number;
  sections?: Section[];
  avg_rating?: number;
  total_enrolled?: number;
  course_progress?: CourseProgress | null;
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
  user?: User;
}
