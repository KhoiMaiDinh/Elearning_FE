import { MediaType } from "./mediaType";

export interface VideoType {
  id: string;
  video_duration: number | null;
  video_status: "UPLOADED" | "VALIDATED" | "PENDING";

  video: {
    key: string;
    status: "UPLOADED" | "VALIDATED" | "PENDING";
    bucket: string;
    rejection_reason: string | null;
  };
  version: number;
}

export interface ResourceType {
  key: string;
  id: string;
}

export interface CourseItem {
  id: string;
  title: string;
  description: string;
  video: VideoType | null;
  resources: ResourceType[];
  is_preview: boolean;
  position: string;
  section_id: string;
  status?: string;
  previous_position?: string;
  video_duration?: number | null;
}

export interface Section {
  id: string;
  title: string;
  description: string;
  position: string;
  status: string;
  course_id: string;
  lectures: CourseItem[];
  quizzes: any[];
  articles: any[];
}

export interface CourseForm {
  course_id?: string;
  id?: string;
  category: { slug: string; children: { slug: string }[] };
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
  level: string;
  enrolled_users?: number;
  thumbnail: MediaType | null;
  is_approved?: boolean;
  price: number;
  priceFinal?: number;
  course?: Section[];
  rating?: number;
}
