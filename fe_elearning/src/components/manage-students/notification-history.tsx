'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { APIGetNotificationByCourse } from '@/utils/course';
import { NotificationAllStudentType } from '@/types/notificationType';
import Pagination from '../pagination/paginations';

interface NotificationHistoryProps {
  courseId: string;
}

export default function NotificationHistory({ courseId }: NotificationHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState<NotificationAllStudentType[]>([]);
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationAllStudentType | null>(null);

  const [filterParams, setFilterParams] = useState({
    page: 1,
    limit: 10,
  });
  const [total, setTotal] = useState(0);
  const filteredNotifications = notifications.filter((notification) =>
    notification.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGetNotificationByCourse = async () => {
    const response = await APIGetNotificationByCourse(courseId, {
      page: filterParams.page,
      limit: filterParams.limit,
    });
    if (response?.status === 200) {
      setNotifications(response?.data || []);
      setTotal(response?.total || 0);
    }
  };

  useEffect(() => {
    handleGetNotificationByCourse();
  }, [filterParams, courseId]);

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Search className="w-5 h-5 text-gray-500" />
          <Input
            placeholder="Tìm kiếm thông báo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Thời gian gửi</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell className="font-medium">{notification.title}</TableCell>
                  <TableCell>{new Date(notification.createdAt).toLocaleString('vi-VN')}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedNotification(notification)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination
            currentPage={filterParams.page}
            totalItem={Number(total)}
            itemPerPage={Number(filterParams.limit)}
            setCurrentPage={(page) => setFilterParams({ ...filterParams, page })}
          />
        </div>
      </div>

      <Dialog open={!!selectedNotification} onOpenChange={() => setSelectedNotification(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedNotification?.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              Gửi lúc:{' '}
              {selectedNotification &&
                new Date(selectedNotification.createdAt).toLocaleString('vi-VN')}
            </p>
            <p className="mt-4">{selectedNotification?.content}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
