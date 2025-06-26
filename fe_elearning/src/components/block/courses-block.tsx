'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, Star, Users, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { CourseForm } from '@/types/courseType';
import { formatPrice } from '../formatPrice';
import { APIAddFavoriteCourse, APIRemoveFavoriteCourse } from '@/utils/course';
import { useSelector } from 'react-redux';
import type { RootState } from '@/constants/store';
import { Progress } from '@/components/ui/progress';
import CourseLevelBadge from '../badge/courseLevelBadge';

type CoursesBlockProps = CourseForm & {
  show_heart?: boolean;
};

const CoursesBlock: React.FC<CoursesBlockProps> = ({
  is_favorite,
  id,
  thumbnail,
  avg_rating,
  level,
  total_enrolled,
  title,
  course_progress,
  instructor,
  description,
  price,
  show_heart = true,
  coupons,
  subtitle,
}) => {
  const router = useRouter();

  const [isFavorite, setIsFavorite] = useState<boolean>(is_favorite || false);
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  const handleAddFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (id && userInfo?.id) {
      const res = await APIAddFavoriteCourse(id);
      if (res?.status === 201) {
        setIsFavorite(true);
      }
    } else {
      router.push('/login');
    }
  };

  const handleRemoveFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (id && userInfo?.id) {
      const res = await APIRemoveFavoriteCourse(id);
      if (res?.status === 204) {
        setIsFavorite(false);
      }
    } else {
      router.push('/login');
    }
  };

  return (
    <Card
      className="group w-full h-full overflow-hidden border border-gray-200/60 dark:border-gray-800/60 shadow-sm hover:shadow-xl transition-all duration-500 hover:translate-y-[-8px] bg-white dark:bg-gray-900/50 backdrop-blur-sm cursor-pointer"
      onClick={() => router.push(`/course/${id}`)}
    >
      <div className="relative">
        {/* Thumbnail */}
        <div className="relative  w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
          <img
            src={process.env.NEXT_PUBLIC_BASE_URL_IMAGE + (thumbnail?.key || '')}
            alt={title}
            className="w-full  object-cover transition-all duration-700 aspect-video group-hover:scale-110"
          />

          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Favorite Button */}
          {show_heart && (
            <button
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-gray-800 hover:scale-110 transition-all duration-300 border border-white/20"
              onClick={isFavorite ? handleRemoveFavorite : handleAddFavorite}
            >
              <Heart
                className={`w-5 h-5 transition-all duration-300 ${
                  isFavorite
                    ? 'fill-red-500 text-red-500 scale-110'
                    : 'text-gray-600 hover:text-red-500 dark:text-gray-300'
                }`}
              />
            </button>
          )}

          {/* Level Badge */}
          {level && (
            <div className="absolute bottom-4 left-4">
              <CourseLevelBadge level={level} className="shadow-lg backdrop-blur-sm" />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-6 space-y-4">
        {/* Title */}
        <h3 className="font-bold text-xl text-gray-900 dark:text-white line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {title}
        </h3>

        {/* Instructor */}
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9 border-2 border-gray-200 dark:border-gray-700 shadow-sm">
            <AvatarImage
              alt={instructor?.user?.last_name || ''}
              src={
                process.env.NEXT_PUBLIC_BASE_URL_IMAGE +
                (instructor?.user?.profile_image?.key || '')
              }
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
              {instructor?.user?.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {instructor?.user?.first_name} {instructor?.user?.last_name}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Giảng viên</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {avg_rating ? (Math.round(avg_rating * 10) / 10).toFixed(1) : 'N/A'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {total_enrolled || 0} học viên
            </span>
          </div>
        </div>

        {/* Description */}
        <div
          className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed h-10 overflow-hidden"
          dangerouslySetInnerHTML={{ __html: subtitle || '' }}
        />
      </CardContent>

      <CardFooter className="relative px-6 py-5 border-t border-gray-100/80 dark:border-gray-800/80 bg-gradient-to-r from-gray-50/50 to-gray-100/30 dark:from-gray-900/30 dark:to-gray-800/30">
        <div className="w-full flex flex-col h-full">
          {/* Progress Bar (if applicable) */}
          {course_progress !== undefined && (
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">Tiến độ học tập</span>
                </div>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                  {course_progress?.progress}%
                </span>
              </div>
              <Progress
                value={course_progress?.progress}
                className="h-2 bg-gray-200 dark:bg-gray-700"
              />
            </div>
          )}

          {/* Spacer to push price to bottom */}
          <div className="flex-1"></div>

          {/* Price Section */}
          <div className="flex items-center justify-start mt-auto">
            <div className="flex items-center gap-3">
              {price && coupons && coupons[0] && coupons[0].value > 0 ? (
                <>
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {formatPrice(price - (price * coupons[0].value) / 100)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                    {formatPrice(price)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {formatPrice(price)}
                </span>
              )}
            </div>
          </div>

          {/* Discount Badge - Absolute positioning */}
          {price && coupons && coupons[0] && coupons[0].value > 0 && (
            <div className="absolute top-3 right-6">
              <Badge className="bg-vividMalachite/20 text-vividMalachite font-semibold shadow-md">
                -{coupons[0].value}%
              </Badge>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default CoursesBlock;
