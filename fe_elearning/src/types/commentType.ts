import { CourseItem } from "./courseType";
import { UserType } from "./userType";

export interface CommentAspect {
  comment_aspect_id: string;
  aspect: string;
  emotion: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  deletedAt: null;
}

export interface LectureComment {
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
  user: UserType;
  lecture: CourseItem;
}

export interface StatisticsEachItemCourse {
  instructor_quality: {
    positive: number;
    neutral: number;
    negative: number;
    none: number;
  };
  content_quality: {
    positive: number;
    neutral: number;
    negative: number;
    none: number;
  };
  technology: {
    positive: number;
    neutral: number;
    negative: number;
    none: number;
  };
  teaching_pace: {
    positive: number;
    neutral: number;
    negative: number;
    none: number;
  };
  study_materials: {
    positive: number;
    neutral: number;
    negative: number;
    none: number;
  };
  other: {
    positive: number;
    neutral: number;
    negative: number;
    none: number;
  };
  assignments_practice: {
    positive: number;
    neutral: number;
    negative: number;
    none: number;
  };
}

export interface StatisticItemCourseResponse {
  comments: LectureComment[];
  statistics: StatisticsEachItemCourse;
}
