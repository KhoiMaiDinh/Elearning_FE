'use client';

import { useEffect, useState } from 'react';
import { Bell, Check, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  APIGetNotification,
  APIReadAllNotification,
  APIReadNotification,
} from '@/utils/notification';
import { NotificationType } from '@/types/notificationType';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/constants/store';
import { toast } from 'react-toastify';
import { setIsNewNotification } from '@/constants/socketSlice';
import { NotificationToast } from './NotificationToast';
import { useTheme } from 'next-themes';

// Update the sample notification data to include thumbnailType and course thumbnails

export function NotificationCenter() {
  const isNewNotification = useSelector((state: RootState) => state.socket.isNewNotification);
  const latestNotification = useSelector((state: RootState) => state.notification.list[0]);
  const [open, setOpen] = useState(false);
  const [activeNotifications, setActiveNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [unreadCount, setUnreadCount] = useState(0);
  const [total, setTotal] = useState(0);
  const { theme } = useTheme();
  const [afterCursor, setAfterCursor] = useState(undefined);
  const [beforeCursor, setBeforeCursor] = useState(undefined);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  // Use socket hook

  const handleGetNotification = async () => {
    try {
      if (afterCursor) {
        setIsLoadingMore(true);
      }
      if (!afterCursor && activeNotifications.length > 0) return;
      const response = await APIGetNotification({ limit: 10, afterCursor, beforeCursor });
      if (response.status === 200) {
        setActiveNotifications((prev) => [...prev, ...response.data]);
        setUnreadCount(response.unseen_count);
        setTotal(response.total);
        setAfterCursor(response.afterCursor);
        setBeforeCursor(response.beforeCursor);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Initial load - only run once when component mounts
  useEffect(() => {
    handleGetNotification();
  }, []); // Empty dependency array

  const handleReadAllNotification = async () => {
    try {
      const response = await APIReadAllNotification();
      if (response.status === 200) {
        handleGetNotification();
        setActiveNotifications((prev) => {
          return prev.map((n) => ({ ...n, is_read: true }));
        });
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error reading all notification:', error);
    }
  };

  const handleReadNotification = async (id: string) => {
    try {
      const response = await APIReadNotification(id);
      if (response.status === 200) {
        handleGetNotification();
        setActiveNotifications((prev) => {
          const index = prev.findIndex((n) => n.id === id);
          if (index !== -1 && !prev[index].is_read) {
            const newNotifications = [...prev];
            newNotifications[index].is_read = true;
            setUnreadCount(unreadCount - 1);
            return newNotifications;
          }
          return prev;
        });
      }
    } catch (error) {
      console.error('Error reading notification:', error);
    }
  };

  useEffect(() => {
    if (isNewNotification) {
      toast(<NotificationToast notification={latestNotification} />, {
        style: {
          backgroundColor: theme === 'dark' ? '#000000' : '#ffffff',
          borderLeft: '5px solid #3DB189',
          lineHeight: '1.2',
        },
        autoClose: 3000,
      });
      setActiveNotifications((prev) => {
        const exists = prev.some((n) => n.id === latestNotification.id);
        if (!exists) {
          return [latestNotification, ...prev];
        }
        return prev;
      });
      setUnreadCount(unreadCount + 1);
      dispatch(setIsNewNotification(false));
    }
  }, [isNewNotification]);

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
              <Button variant="ghost" size="sm" onClick={handleReadAllNotification}>
                Đánh dấu tất cả đã đọc
              </Button>
            )}
          </div>
        </div>

        <div
          className="max-h-[60vh] overflow-y-auto"
          onScroll={(e) => {
            const element = e.currentTarget;
            const scrollPosition = Math.ceil(element.scrollTop + element.clientHeight);
            const isAtBottom = scrollPosition >= element.scrollHeight;

            if (isAtBottom && afterCursor && !loading) {
              handleGetNotification();
            }
          }}
        >
          {' '}
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <span className="text-muted-foreground">Đang tải...</span>
            </div>
          ) : activeNotifications && activeNotifications?.length > 0 ? (
            activeNotifications &&
            activeNotifications.length > 0 &&
            activeNotifications?.map((notification) => (
              <NotificationItem
                key={notification.notification_id}
                notification={notification}
                handleReadNotification={handleReadNotification}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Bell className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Không có thông báo nào</p>
            </div>
          )}{' '}
          {isLoadingMore && (
            <div className="flex items-center justify-center p-8">
              <span className="text-muted-foreground">Đang tải...</span>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Update NotificationItem component
function NotificationItem({
  notification,
  handleReadNotification,
}: {
  notification: NotificationType;
  handleReadNotification: (id: string) => void;
}) {
  const { id, type, title, is_read, image, body, createdAt } = notification;

  return (
    <div
      className={`p-4 border-b flex gap-3 ${is_read ? 'bg-gray-300 dark:bg-richBlack' : 'bg-muted/30'} cursor-pointer hover:bg-muted/50 transition-colors`}
      onClick={() => {
        if (notification?.metadata && notification?.metadata !== null) {
          window.open(
            type === 'NEW_COMMENT'
              ? `/course-details/${notification?.metadata?.course_id}?lecture=${notification?.metadata?.lecture_id}&comment=${notification?.metadata?.comment_id}`
              : type === 'INSTRUCTOR_REGISTERED'
                ? `/profile/lecture?tab=ho-so`
                : type === 'PROFILE_APPROVED'
                  ? `/profile/lecture?tab=ho-so`
                  : type === 'PROFILE_REJECTED'
                    ? `/profile/lecture?tab=ho-so&rejected=true&reason=${notification?.body}`
                    : '',
            '_blank'
          );
          handleReadNotification(notification?.id);
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
        ) : type === 'PROFILE_APPROVED' ? (
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <Check className="h-4 w-4 text-vividMalachite" />
          </div>
        ) : type === 'PROFILE_REJECTED' ? (
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <X className="h-4 w-4 text-redPigment" />
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
            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
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

        <p className="text-xs text-muted-foreground line-clamp-3 mt-1">{body}</p>
      </div>
    </div>
  );
}
