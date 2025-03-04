// @/types/courseType.ts
export interface Lesson {
  lesson_title: string;
  lesson_content: string;
  resources: string[];
  video_url: string;
}

export interface Section {
  section_title: string;
  content: Lesson[];
  section_video: string;
  section_description: string;
  section_resources: string[];
}

export interface CourseForm {
  title: string;
  level: string;
  price: number;
  priceFinal?: number;
  short_description: string;
  course: Section[];
  rating?: number;
  enrolled_students?: number;
  lecture?: string;
  coverPhoto?: string;
}
