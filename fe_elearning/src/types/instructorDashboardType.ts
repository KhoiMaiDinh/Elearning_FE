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
  average_rating: number;
  rating_count: number;
};
