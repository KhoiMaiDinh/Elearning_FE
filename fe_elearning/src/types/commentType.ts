export interface CommentEachItemCourse {
  id?: string;
  lecture_id: string;
  content?: string;
  lecture_comment_id?: string;
  user_id?: string;
  is_solved?: boolean;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  deletedAt?: string | null;
  aspects?: [];
  user?: {
    id?: string;
    username?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    profile_image?: {
      key: string;
      rejection_reason: string | null;
      status: string;
      bucket: string;
    };
  };
}
