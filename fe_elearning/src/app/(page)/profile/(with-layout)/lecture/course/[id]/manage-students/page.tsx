'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StudentList from '@/components/manage-students/student-list';
import NotificationHistory from '@/components/manage-students/notification-history';
import SendNotification from '@/components/manage-students/send-notification';
import { useParams } from 'next/navigation';

export default function ManageStudentsPage() {
  const params = useParams();
  const courseId = params.id as string;
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Quản lý học viên</h1>

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
