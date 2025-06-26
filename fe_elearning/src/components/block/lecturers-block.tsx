'use client';

import type React from 'react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, Users, BookOpen, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

type LecturersBlockProps = {
  avatar?: string;
  name?: string;
  rating?: number;
  major?: string;
  description?: string;
  numberCourse?: number;
  numberStudent?: number;
  username?: string;
};

const LecturersBlock: React.FC<LecturersBlockProps> = ({
  avatar,
  name,
  rating,
  major,
  description,
  numberCourse,
  numberStudent,
  username,
}) => {
  const router = useRouter();

  return (
    <Card
      className="w-full overflow-hidden border-0 hover:shadow-md hover:translate-y-[-4px] transition-all duration-300 bg-white dark:bg-gray-800/90 backdrop-blur-sm cursor-pointer group"
      onClick={() => router.push(`/lecturer/${username}`)}
    >
      <div className="relative h-28 bg-gradient-to-r from-blue-600 to-purple-600 overflow-hidden">
        <div className="items-center justify-center flex  w-full h-28  ">
          <Avatar className="w-24 h-24 border-4 shadow-lg">
            <AvatarImage
              src={process.env.NEXT_PUBLIC_BASE_URL_IMAGE + (avatar || '')}
              alt={name}
              className="object-cover"
            />
            <AvatarFallback className="bg-PaleViolet/50 text-white text-xl">
              {name
                ?.split(' ')
                .map((n) => n[0])
                .join('') || 'GV'}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <CardHeader className=" pb-3 text-center">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{name || 'Giảng viên'}</h3>
        <Badge
          variant="secondary"
          className="mx-auto mt-1 bg-custom-gradient-button-violet text-white hover:from-blue-700 hover:to-purple-700"
        >
          {major || 'Chưa xác định'}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4 pb-6">
        {/* Description */}
        <div
          className="text-sm text-gray-600 dark:text-gray-400 text-center line-clamp-3 "
          dangerouslySetInnerHTML={{
            __html: description || 'Chưa có mô tả',
          }}
        />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-center pt-2">
          <div className="flex flex-col items-center p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
              <Star className="w-4 h-4" />
              <span className="font-medium">
                {rating || rating === 0 ? rating.toFixed(1) : 'N/A'}
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Đánh giá</span>
          </div>

          <div className="flex flex-col items-center p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <BookOpen className="w-4 h-4" />
              <span className="font-medium">
                {numberCourse || numberCourse === 0 ? numberCourse : 'N/A'}
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Khóa học</span>
          </div>

          <div className="flex flex-col items-center p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
            <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
              <Users className="w-4 h-4" />
              <span className="font-medium">
                {numberStudent || numberStudent === 0 ? numberStudent : 'N/A'}
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Học viên</span>
          </div>
        </div>

        {/* View Profile Link */}
        <div className="flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-medium pt-2 group-hover:underline">
          Xem hồ sơ
          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </CardContent>
    </Card>
  );
};

export default LecturersBlock;
