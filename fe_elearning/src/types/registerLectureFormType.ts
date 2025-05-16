import { Category } from './categoryType';
import { MediaType } from './mediaType';
export type RegisterLectureForm = {
  category: {
    slug: string;
  };
  biography: string;
  certificates: MediaType[];
  headline: string;
  resume: MediaType;
  website_url?: string | null;
  facebook_url?: string | null;
  linkedin_url?: string | null;
  bankAccount: string;
  bankName: string;
  accountHolder: string;
};

export type Lecture = RegisterLectureForm & {
  category: Category;
  is_approved: boolean;
  user: {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    profile_image: MediaType;
    number_course?: number;
    number_student?: number;
    rating?: number;
  };
  total_courses: number;
  total_students: number;
  avg_rating: number;
  approved_at: string;
};
