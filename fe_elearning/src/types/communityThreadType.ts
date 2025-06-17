import { UserType } from './userType';

export interface CommunityThread {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    profile_image: {
      key: string;
    };
  };
  lecture: {
    id: string;
    title: string;
    section: {
      course: {
        title: string;
        id: string;
      };
      id: string;
      title: string;
    };
  };
}

export interface CommunityThreadReply {
  id: string;
  content: string;
  author: UserType;
  createdAt: string;
  vote_count: number;
  has_upvoted?: boolean;
}
