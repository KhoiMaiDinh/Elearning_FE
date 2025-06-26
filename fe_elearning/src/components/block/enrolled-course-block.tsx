import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Calendar } from 'lucide-react';
import { Progress } from '../ui/progress';
import { PlayCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CourseForm } from '@/types/courseType';

const EnrolledCourseBlock = ({ course }: { course: CourseForm }) => {
  const router = useRouter();
  return (
    <Card className="overflow-hidden border-0 hover:shadow-md hover:translate-y-[-4px] transition-all duration-300">
      <div className="relative group">
        <img
          src={
            `${process.env.NEXT_PUBLIC_BASE_URL_IMAGE}${course.thumbnail?.key}` ||
            '/images/logo.png'
          }
          alt={course.title}
          className="w-full aspect-video object-cover group-hover:scale-105 transition-all duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Button
          size="sm"
          className="absolute top-4 right-4 bg-white/90 hover:bg-white text-blue-700 rounded-full w-8 h-8 p-0 flex items-center justify-center"
          onClick={() => router.push(`/course-details/${course.id}`)}
        >
          <PlayCircle className="w-5 h-5" />
        </Button>
      </div>

      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1 flex-1">
            {course.title}
          </h3>
        </div>

        <div className="mb-3">
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md inline-block">
            {course.category?.translations[0]?.name}
          </span>
        </div>

        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          <Calendar className="w-4 h-4 mr-1" />
          <span>Truy cập gần nhất: 1 ngày trước</span>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Tiến độ: {course.course_progress?.completed}/{course.course_progress?.total} bài học
            </span>
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">
              {course.course_progress?.progress}%
            </span>
          </div>
          <Progress value={course.course_progress?.progress} className="h-2" />
        </div>

        <Button
          className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white dark:text-black"
          onClick={() => router.push(`/course-details/${course.id}`)}
        >
          Tiếp tục học
        </Button>
      </CardContent>
    </Card>
  );
};

export default EnrolledCourseBlock;
