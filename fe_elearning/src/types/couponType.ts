import { CouponStatus } from '@/app/(page)/profile/(with-layout)/lecture/components/couponManagement';
import { CourseForm } from './courseType';

export type CouponType = {
  code: string;
  creator_roles: string[];
  creator_username: string;
  expires_at: Date;
  is_active: boolean;
  is_public: boolean;
  starts_at: Date;
  usage_limit: number | null;
  usage_count: number;
  revenue: number;
  value: number;
  course: CourseForm;
  total_revenue: number;
};

export type CouponQueryType = {
  page: number;
  limit: number;
  q: string | undefined;
  status: CouponStatus;
  is_active: boolean | undefined;
  is_public: boolean | undefined;
  usage_exceeded: boolean | undefined;
};
