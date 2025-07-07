export type InstructorOverviewType = {
  enrolled_students: number;
  active_students: number;
  total_payout: number;
  avg_rating: number;
  total_ratings_made: number;
  enrolled_students_monthly_shift: number;
  active_students_monthly_shift: number;
};

export type CumulativeFeedChartType = FeedChartType & {
  cumulative_data: number[];
  year: number;
};

export type FeedChartType = {
  labels: string[];
  data: number[];
};

export type CourseCompletionRateType = {
  title: string;
  completion_rate: number;
  completed_students: number;
  total_students: number;
};

export type PayoutSummaryType = {
  total: number;
  available_for_payout: number;
  available_percentage: number;
  in_30_day_holding: number;
  holding_percentage: number;
  next_holding: number;
  next_holding_percentage: number;
};

export type NextPayoutType = {
  available_to_pay: number;
  breakdown: {
    amount: number;
    title: string;
  }[];
};

export type StudentEngagementType = {
  id: string;
  title: string;
  avg_engagement: number;
};

export type CourseRatingType = {
  id: string;
  title: string;
  average_rating: string;
  rating_count: number;
};

import { Category } from './categoryType';
import { MediaType } from './mediaType';
export type RegisterInstructorForm = {
  user: { first_name: string; last_name: string };
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
};

export type InstructorType = RegisterInstructorForm & {
  category: Category;
  is_approved: boolean;
  disapproval_reason?: string;
  user: {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    profile_image?: MediaType;
    number_course?: number;
    number_student?: number;
    rating?: number;
  };
  total_courses: number;
  total_students: number;
  avg_rating: number;
  approved_at: string;
};
