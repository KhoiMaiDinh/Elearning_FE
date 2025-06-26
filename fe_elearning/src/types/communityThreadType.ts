import { CourseItem } from './courseType';
import { UserType } from './userType';

export interface CommunityThread {
  id: string;
  title: string;
  content: string;
  author: UserType;
  lecture?: CourseItem;
  createdAt: string;
  replies?: CommunityThreadReply[];
}

export interface CommunityThreadReply {
  id: string;
  content: string;
  author: UserType;
  createdAt: string;
  vote_count: number;
  has_upvoted?: boolean;
}
