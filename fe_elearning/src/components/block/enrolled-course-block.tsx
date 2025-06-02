import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Calendar } from 'lucide-react';
import { Progress } from '../ui/progress';
import { PlayCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CourseForm } from '@/types/courseType';

const EnrolledCourseBlock = ({ course }: { course: CourseForm }) => {
  const router = useRouter();
  return (
    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="relative">
        <img
          src={
            `${process.env.NEXT_PUBLIC_BASE_URL_IMAGE}${course.thumbnail?.key}` ||
            '/images/logo.png'
          }
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
          <Badge className="bg-blue-600 hover:bg-blue-700">
            {course.category?.translations[0]?.name}
          </Badge>
        </div>
        <Button
          size="sm"
          className="absolute top-4 right-4 bg-white/90 hover:bg-white text-blue-700 rounded-full w-8 h-8 p-0 flex items-center justify-center"
          onClick={() => router.push(`/course-details/${course.id}`)}
        >
          <PlayCircle className="w-5 h-5" />
        </Button>
      </div>

      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
          {course.title}
        </h3>

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
