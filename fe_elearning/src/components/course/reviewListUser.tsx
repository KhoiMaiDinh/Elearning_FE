import React from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';

import { ReviewCourseType } from '@/types/reviewCourseType';

interface ReviewListProps {
  reviews: ReviewCourseType;
}

const ReviewListUser = ({ reviews }: ReviewListProps) => {
  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('vi-VN');
  };
  return (
    <Card className="font-sans">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          {/* Bên trái: Avatar + Tên + Ngày */}
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage
                src={
                  process.env.NEXT_PUBLIC_BASE_URL_IMAGE +
                    (reviews.user?.profile_image?.key || 'default-key.jpg') || '/placeholder.svg'
                }
                alt={reviews.user?.first_name + ' ' + reviews.user?.last_name}
                className="w-10 h-10 object-cover"
              />
              <AvatarFallback>
                {reviews.user?.first_name?.charAt(0) || '?'}
                {reviews.user?.last_name?.charAt(0) || '?'}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium font-sans text-sm">
                {reviews.user?.first_name + ' ' + reviews.user?.last_name}
              </div>
              <div className="text-xs text-muted-foreground font-sans">
                {formatDate(reviews.createdAt || '')}
              </div>
            </div>
          </div>

          {/* Bên phải: Số sao */}
          <div className="text-Sunglow text-sm">
            {'★'.repeat(reviews.rating || 0)}
            {'☆'.repeat(5 - (reviews.rating || 0))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="font-sans text-sm">
        <p>{reviews.rating_comment}</p>
      </CardContent>
    </Card>
  );
};

export default ReviewListUser;
