import { MediaType } from './mediaType';

export type NotificationType = {
  id: string;
  notification_id: string;
  title: string;
  body: string;
  type: 'NEW_COMMENT' | string; // thêm các loại khác nếu có
  is_read: boolean;
  metadata: {
    course_id?: string;
    lecture_id?: string;
    comment_id?: string;
  } | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdBy: string;
  updatedBy: string;
  user_id: string;
  image?: MediaType;
};
