import React from 'react';
import { Skeleton } from '../ui/skeleton';

export type CouponStatus = 'active' | 'expired' | 'scheduled';

type Props = {
  rows?: number;
  coupon_status?: CouponStatus;
};

const CouponTableSkeleton: React.FC<Props> = ({ rows = 1, coupon_status = 'active' }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={`row-${rowIndex}`} className="border-b">
          <td className="p-4 align-middle">
            <Skeleton className="h-5 w-24" />
          </td>
          <td className="p-4 align-middle">
            <Skeleton className="h-5 w-12" />
          </td>
          <td className="p-4 align-middle">
            <Skeleton className="h-5 w-32" />
          </td>
          <td className="p-4 align-middle">
            <Skeleton className="h-5 w-16" />
          </td>
          <td className="p-4 align-middle">
            <Skeleton className="h-5 w-24" />
          </td>
          <td className="p-4 align-middle">
            <Skeleton className="h-5 w-24" />
          </td>

          {coupon_status !== 'scheduled' && (
            <td className="p-4 align-middle">
              <Skeleton className="h-5 w-20" />
            </td>
          )}

          <td className="p-4 align-middle">
            <Skeleton className="h-5 w-16" />
          </td>
          <td className="p-4 align-middle">
            <Skeleton className="h-5 w-16" />
          </td>
          {coupon_status !== 'active' && (
            <td className="p-4 align-middle">
              <div className="flex items-center gap-2">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={`action-${rowIndex}-${i}`} className="h-8 w-8 rounded-md" />
                ))}
              </div>
            </td>
          )}
        </tr>
      ))}
    </>
  );
};

export default CouponTableSkeleton;
