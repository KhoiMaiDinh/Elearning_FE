'use client';

import { useEffect, useState } from 'react';
import {
  Bell,
  DollarSign,
  MessageSquare,
  Star,
  CheckCircle,
  AlertCircle,
  BarChart,
  Settings,
  X,
  Check,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { APIGetNotification } from '@/utils/notification';
import { NotificationType } from '@/types/notificationType';

// Update the sample notification data to include thumbnailType and course thumbnails

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [activeNotifications, setActiveNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(false);

  const unreadCount = activeNotifications?.filter((n) => !n.is_read)?.length || 0;

  const markAllAsRead = async () => {
    try {
      const updatedNotifications = activeNotifications.map((n) => ({ ...n, is_read: true }));
      setActiveNotifications(updatedNotifications);
      // Here you can add API call to update read status on server if needed
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      setActiveNotifications(
        activeNotifications.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      // Here you can add API call to update read status on server if needed
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      setActiveNotifications(activeNotifications.filter((n) => n.id !== id));
      // Here you can add API call to delete notification on server if needed
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleGetNotification = async () => {
    try {
      setLoading(true);
      const response = await APIGetNotification();
      if (response.status === 200) {
        setActiveNotifications(response.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetNotification();
  }, []);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[380px]">
        <div className="flex items-center justify-between p-4">
          <DropdownMenuLabel className="text-lg font-semibold">Thông báo</DropdownMenuLabel>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Đánh dấu tất cả đã đọc
              </Button>
            )}
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <span className="text-muted-foreground">Đang tải...</span>
            </div>
          ) : activeNotifications && activeNotifications?.length > 0 ? (
            activeNotifications?.map((notification) => (
              <NotificationItem
                key={notification.notification_id}
                notification={notification}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Bell className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Không có thông báo nào</p>
            </div>
          )}
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center text-center cursor-pointer">
          Xem tất cả thông báo
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Update NotificationItem component
function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
}: {
  notification: NotificationType;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const { id, type, title, is_read, image, body, createdAt } = notification;

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMarkAsRead(id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(id);
  };

  return (
    <div
      className={`p-4 border-b flex gap-3 ${is_read ? 'bg-background' : 'bg-muted/30'} cursor-pointer hover:bg-muted/50 transition-colors`}
      onClick={() => {
        if (notification?.metadata && notification?.metadata !== null) {
          window.open(
            type === 'NEW_COMMENT'
              ? `/course-details/${notification?.metadata?.course_id}?lecture=${notification?.metadata?.lecture_id}&comment=${notification?.metadata?.comment_id}`
              : '',
            '_blank'
          );
        }
      }}
    >
      <div className="flex-shrink-0 mt-1">
        {image && image?.entity === 'user' ? (
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={
                process.env.NEXT_PUBLIC_BASE_URL_IMAGE
                  ? `${process.env.NEXT_PUBLIC_BASE_URL_IMAGE}${image?.key || ''}`
                  : '/placeholder.svg'
              }
              alt={body || ''}
            />
            <AvatarFallback>{body?.slice(0, 2)?.toUpperCase()}</AvatarFallback>
          </Avatar>
        ) : image && image?.entity === 'course' ? (
          <div className="h-8 w-10 rounded-md overflow-hidden border">
            <img
              src={
                process.env.NEXT_PUBLIC_BASE_URL_IMAGE
                  ? `${process.env.NEXT_PUBLIC_BASE_URL_IMAGE}${image?.key || ''}`
                  : '/placeholder.svg'
              }
              alt={body}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <Bell className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-col items-start gap-2">
          <h4 className="text-sm font-medium line-clamp-1">{title}</h4>
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {new Date(createdAt).toLocaleString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{body}</p>
      </div>
    </div>
  );
}

function getTypeIcon(type: any) {
  switch (type) {
    case 'sale':
      return <DollarSign className="h-4 w-4 text-green-500" />;
    case 'message':
      return <MessageSquare className="h-4 w-4 text-blue-500" />;
    case 'review':
      return <Star className="h-4 w-4 text-amber-500" />;
    case 'completion':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'alert':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
}

function renderNotificationDetails(notification: any) {
  const { type } = notification;

  switch (type) {
    case 'sale':
      return (
        <div className="mt-1 flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {notification.amount}
          </Badge>
        </div>
      );
    case 'review':
      return (
        <div className="mt-1 flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < notification.rating ? 'fill-amber-400 text-amber-400' : 'text-muted'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">{notification.course.name}</span>
        </div>
      );
    case 'completion':
      return (
        <div className="mt-1 flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {notification.count} students
          </Badge>
          <span className="text-xs text-muted-foreground">{notification.course.name}</span>
        </div>
      );
    case 'alert':
      return (
        <div className="mt-1 flex items-center gap-2">
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            {notification.metric}
          </Badge>
          <span className="text-xs text-muted-foreground">{notification.course.name}</span>
        </div>
      );
    case 'message':
      return (
        <div className="mt-1">
          <span className="text-xs text-muted-foreground">{notification.course.name}</span>
        </div>
      );
    default:
      return null;
  }
}
