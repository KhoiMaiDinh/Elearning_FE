'use client';

import { CommentList } from '@/components/aspect/comment-list';
import { AspectEmotionCircles } from '@/components/aspect/aspect-emotion-circles';
import { useSelector } from 'react-redux';
import { RootState } from '@/constants/store';
import { CommentEachItemCourse } from '@/types/commentType';

interface CommentAspect {
  comment_aspect_id: string;
  aspect: string;
  emotion: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  deletedAt: null;
}

interface Comment {
  lecture_comment_id: string;
  lecture_id: string;
  user_id: string;
  content: string;
  is_solved: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  deletedAt: null;
  aspects: CommentAspect[];
  user: {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    profile_image: {
      key: string;
      rejection_reason: null;
      status: string;
      bucket: string;
    };
  };
}

function _transformComment(comment: CommentEachItemCourse): Comment | null {
  if (
    !comment.lecture_comment_id ||
    !comment.lecture_id ||
    !comment.user_id ||
    !comment.content ||
    !comment.aspects ||
    !comment.user ||
    !comment.user.id ||
    !comment.user.username ||
    !comment.user.email ||
    !comment.user.first_name ||
    !comment.user.last_name ||
    !comment.user.profile_image
  ) {
    return null;
  }

  return {
    lecture_comment_id: comment.lecture_comment_id,
    lecture_id: comment.lecture_id,
    user_id: comment.user_id,
    content: comment.content,
    is_solved: comment.is_solved || false,
    createdAt: comment.createdAt || new Date().toISOString(),
    createdBy: comment.createdBy || 'system',
    updatedAt: comment.updatedAt || new Date().toISOString(),
    updatedBy: comment.updatedBy || 'system',
    deletedAt: null,
    aspects: comment.aspects as CommentAspect[],
    user: {
      id: comment.user.id,
      username: comment.user.username,
      email: comment.user.email,
      first_name: comment.user.first_name,
      last_name: comment.user.last_name,
      profile_image: {
        key: comment.user.profile_image.key,
        rejection_reason: null,
        status: comment.user.profile_image.status,
        bucket: comment.user.profile_image.bucket,
      },
    },
  };
}

export default function StaticDetails() {
  const commentsData = useSelector(
    (state: RootState) => state.comment.comment
  ) as CommentEachItemCourse[];

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="space-y-8">
        <AspectEmotionCircles comments={commentsData} />
        <CommentList comments={commentsData} />
      </div>
    </main>
  );
}
