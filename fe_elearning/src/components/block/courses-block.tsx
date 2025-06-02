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

const CoursesBlock: React.FC<CourseForm> = ({
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
}) => {
  const router = useRouter();

  const [levelShow, setLevelShow] = useState<string>('');
  const [isFavorite, setIsFavorite] = useState<boolean>(is_favorite || false);
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  useEffect(() => {
    switch (level) {
      case 'BEGINNER':
        setLevelShow('Cơ bản');
        break;
      case 'INTERMEDIATE':
        setLevelShow('Trung bình');
        break;
      case 'ADVANCED':
        setLevelShow('Nâng cao');
        break;
      default:
        setLevelShow('Không xác định');
    }
  }, [level]);

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

  const getLevelColor = () => {
    switch (level) {
      case 'BEGINNER':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'INTERMEDIATE':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'ADVANCED':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <Card
      className="w-full h-full overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-4px] bg-white dark:bg-gray-800/90 backdrop-blur-sm"
      onClick={() => router.push(`/course/${id}`)}
    >
      <div className="relative">
        {/* Thumbnail */}
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={process.env.NEXT_PUBLIC_BASE_URL_IMAGE + (thumbnail?.key || '')}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />

          {/* Favorite Button */}
          <button
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 dark:bg-gray-800/80 flex items-center justify-center shadow-md hover:bg-white dark:hover:bg-gray-800 transition-colors"
            onClick={isFavorite ? handleRemoveFavorite : handleAddFavorite}
          >
            <Heart
              className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-red-500'}`}
            />
          </button>

          {/* Level Badge */}
          {level && (
            <Badge className={`absolute bottom-3 left-3 ${getLevelColor()}`}>{levelShow}</Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <CardContent className="px-5 space-y-2">
        {/* Title */}
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-2 ">
          {title}
        </h3>

        {/* Instructor */}
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8 border-2 border-white dark:border-gray-700">
            <AvatarImage
              alt={instructor?.user?.last_name || ''}
              src={
                process.env.NEXT_PUBLIC_BASE_URL_IMAGE +
                (instructor?.user?.profile_image?.key || '')
              }
              className="object-cover"
            />
            <AvatarFallback>{instructor?.user?.last_name?.[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {instructor?.user?.first_name} {instructor?.user?.last_name}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-gray-700 dark:text-gray-300">
              {avg_rating ? (Math.round(avg_rating * 10) / 10).toFixed(1) : 'N/A'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="text-gray-700 dark:text-gray-300">{total_enrolled || 0}</span>
          </div>
        </div>

        {/* Description */}
        <div
          className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 min-h-[2.5rem]"
          dangerouslySetInnerHTML={{ __html: description || '' }}
        />
      </CardContent>

      <CardFooter className="px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="w-full space-y-3">
          {/* Progress Bar (if applicable) */}
          {course_progress !== undefined && (
            <div className="space-y-1 w-full">
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>Tiến độ</span>
                </div>
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  {course_progress?.progress}%
                </span>
              </div>
              <Progress value={course_progress?.progress} className="h-2" />
            </div>
          )}

          {/* Price */}
          <div className="flex justify-between items-center">
            {price && (
              <span className="font-bold text-lg text-gray-900 dark:text-white">
                {formatPrice(price)}
              </span>
            )}
            <Badge className="bg-blue-600 hover:bg-blue-700">
              {course_progress ? 'Tiếp tục học' : 'Xem chi tiết'}
            </Badge>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CoursesBlock;
