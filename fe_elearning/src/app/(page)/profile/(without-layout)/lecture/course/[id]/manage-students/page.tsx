'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StudentList from '@/components/manage-students/student-list';
import NotificationHistory from '@/components/manage-students/notification-history';
import SendNotification from '@/components/manage-students/send-notification';
import { useParams } from 'next/navigation';
import { APIGetCourseById } from '@/utils/course';
import { CourseForm } from '@/types/courseType';

export default function ManageStudentsPage() {
  const params = useParams();
  const courseId = params.id as string;

  const [courseData, setCourseData] = useState<CourseForm>();

  const handleGetDetailCourse = useCallback(async () => {
    const response = await APIGetCourseById(courseId || '', {
      with_sections: true,
      with_thumbnail: true,
    });
    if (response && response.data) {
      setCourseData(response.data);
    }
  }, [courseId]);

  useEffect(() => {
    handleGetDetailCourse();
  }, []);

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8 p-6 bg-white rounded-lg shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Quản lý học viên</h1>
          {courseData && (
            <span className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-full">
              {courseData.title}
            </span>
          )}
        </div>
        {courseData && (
          <div className="flex items-center gap-2 text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <span className="text-sm">Mã khóa học: {courseData.id}</span>
          </div>
        )}
      </div>

      <Tabs defaultValue="students" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="students">Danh sách học viên</TabsTrigger>
          <TabsTrigger value="notifications">Thông báo</TabsTrigger>
          <TabsTrigger value="history">Lịch sử thông báo</TabsTrigger>
        </TabsList>

        <TabsContent value="students">
          <StudentList courseId={courseId} />
        </TabsContent>

        <TabsContent value="notifications">
          <SendNotification courseId={courseId} />
        </TabsContent>

        <TabsContent value="history">
          <NotificationHistory courseId={courseId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
