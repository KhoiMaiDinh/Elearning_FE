// @/types/courseFormType.ts
export interface Lesson {
  lesson_title: string;
  lesson_content: string;
  resources: string[];
  video_url: string;
}

export interface Section {
  section_title: string;
  content: Lesson[]; // Đảm bảo content luôn là mảng
  section_video: string;
  section_description: string;
  section_resources: string[];
}

export interface CourseForm {
  title: string;
  rating: number;
  enrolled_students: number;
  level: string;
  price: number;
  lecture: string;
  short_description: string;
  course: Section[]; // course luôn là mảng
}
