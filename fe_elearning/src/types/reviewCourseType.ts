import { MediaType } from './mediaType';

export interface ReviewCourseType {
  course_id?: string;
  user_id?: string;
  is_refunded?: boolean;
  rating?: number;
  rating_comment?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  updatedBy?: string;
  deletedAt?: string | null;
  user?: {
    id?: string;
    username?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    profile_image?: MediaType;
  };
}
