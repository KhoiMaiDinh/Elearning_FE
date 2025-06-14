import React from 'react';
import { Bell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { NotificationType } from '@/types/notificationType';

interface NotificationToastProps {
  notification: NotificationType;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ notification }) => {
  const { title, body, image } = notification;

  return (
    <div className="flex items-start gap-3 p-3 rounded-md shadow-sm border-l-4 bg-white dark:bg-black  ">
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
          <div className="h-8 w-8 rounded-full  border flex items-center justify-center">
            <Bell className="h-5 w-5 text-blue-500" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold font-sans text-black dark:text-white line-clamp-1">
          {title}
        </h4>
        <p className="text-sm font-sans text-black dark:text-gray-300 line-clamp-2">{body}</p>
      </div>
    </div>
  );
};
