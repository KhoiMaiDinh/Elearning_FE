'use client';

import { useState } from 'react';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// Update the sample notification data to include thumbnailType and course thumbnails
const notifications = [
  {
    id: 1,
    type: 'sale',
    title: 'New Course Purchase',
    message: "John Smith purchased 'Advanced React Development'",
    time: '2 minutes ago',
    read: false,
    amount: '$129.99',
    thumbnailType: 'user',
    user: {
      name: 'John Smith',
      avatar: '/placeholder.svg?height=32&width=32',
      initials: 'JS',
    },
    course: {
      name: 'Advanced React Development',
      thumbnail: '/placeholder.svg?height=32&width=48',
    },
  },
  {
    id: 2,
    type: 'message',
    title: 'New Student Question',
    message: "Sarah Johnson asked: 'When will the next module be available?'",
    time: '1 hour ago',
    read: false,
    thumbnailType: 'user',
    course: {
      name: 'Advanced React Development',
      thumbnail: '/placeholder.svg?height=32&width=48',
    },
    user: {
      name: 'Sarah Johnson',
      avatar: '/placeholder.svg?height=32&width=32',
      initials: 'SJ',
    },
  },
  {
    id: 3,
    type: 'review',
    title: 'New Course Review',
    message: "Michael Brown left a 5-star review on 'Python for Beginners'",
    time: '3 hours ago',
    read: true,
    rating: 5,
    thumbnailType: 'course',
    course: {
      name: 'Python for Beginners',
      thumbnail: '/placeholder.svg?height=32&width=48',
    },
    user: {
      name: 'Michael Brown',
      avatar: '/placeholder.svg?height=32&width=32',
      initials: 'MB',
    },
  },
  {
    id: 4,
    type: 'completion',
    title: 'Course Completion',
    message: "15 students completed 'JavaScript Fundamentals' this week",
    time: '1 day ago',
    read: true,
    count: 15,
    thumbnailType: 'course',
    course: {
      name: 'JavaScript Fundamentals',
      thumbnail: '/placeholder.svg?height=32&width=48',
    },
  },
  {
    id: 5,
    type: 'alert',
    title: 'Low Engagement Alert',
    message: "Engagement dropping in 'CSS Masterclass' - 30% decrease in participation",
    time: '2 days ago',
    read: false,
    thumbnailType: 'course',
    course: {
      name: 'CSS Masterclass',
      thumbnail: '/placeholder.svg?height=32&width=48',
    },
    metric: '30% decrease',
  },
  {
    id: 6,
    type: 'sale',
    title: 'Bulk Purchase',
    message: "Corporate client purchased 25 licenses for 'Data Science Essentials'",
    time: '2 days ago',
    read: true,
    amount: '$2,499.75',
    thumbnailType: 'course',
    course: {
      name: 'Data Science Essentials',
      thumbnail: '/placeholder.svg?height=32&width=48',
    },
    user: {
      name: 'Acme Corp',
      avatar: '/placeholder.svg?height=32&width=32',
      initials: 'AC',
    },
  },
  {
    id: 7,
    type: 'message',
    title: 'Support Request',
    message: "Technical issue reported in module 3 of 'Docker & Kubernetes'",
    time: '3 days ago',
    read: true,
    thumbnailType: 'course',
    course: {
      name: 'Docker & Kubernetes',
      thumbnail: '/placeholder.svg?height=32&width=48',
    },
    user: {
      name: 'David Wilson',
      avatar: '/placeholder.svg?height=32&width=32',
      initials: 'DW',
    },
  },
];

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [activeNotifications, setActiveNotifications] = useState(notifications);
  const [activeTab, setActiveTab] = useState('all');

  const unreadCount = activeNotifications.filter((n) => !n.read).length;

  const filteredNotifications =
    activeTab === 'all'
      ? activeNotifications
      : activeNotifications.filter((n) => n.type === activeTab);

  const markAllAsRead = () => {
    setActiveNotifications(activeNotifications.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: any) => {
    setActiveNotifications(
      activeNotifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id: any) => {
    setActiveNotifications(activeNotifications.filter((n) => n.id !== id));
  };

  const _getNotificationIcon = (type: any) => {
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
  };

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
          <DropdownMenuLabel className="text-lg font-semibold">Notifications</DropdownMenuLabel>
          <div className="flex items-center gap-2">
            <NotificationSettings />
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b px-4">
            <TabsList className="w-full justify-start gap-4 h-auto bg-transparent p-0">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-primary data-[state=active]:border-b-2 rounded-none px-2 py-2"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="sale"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-primary data-[state=active]:border-b-2 rounded-none px-2 py-2"
              >
                Sales
              </TabsTrigger>
              <TabsTrigger
                value="message"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-primary data-[state=active]:border-b-2 rounded-none px-2 py-2"
              >
                Messages
              </TabsTrigger>
              <TabsTrigger
                value="review"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-primary data-[state=active]:border-b-2 rounded-none px-2 py-2"
              >
                Reviews
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Bell className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No notifications to display</p>
              </div>
            )}
          </div>
        </Tabs>

        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center text-center cursor-pointer">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Replace the NotificationItem component with this updated version
function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
}: {
  notification: any;
  onMarkAsRead: any;
  onDelete: any;
}) {
  const { id, type, title, message, time, read, user, course, thumbnailType } = notification;
  return (
    <div className={`p-4 border-b flex gap-3 ${read ? 'bg-background' : 'bg-muted/30'}`}>
      <div className="flex-shrink-0 mt-1">
        {thumbnailType === 'user' && user ? (
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar || '/placeholder.svg'} alt={user.name} />
            <AvatarFallback>{user.initials}</AvatarFallback>
          </Avatar>
        ) : thumbnailType === 'course' && course ? (
          <div className="h-8 w-10 rounded-md overflow-hidden border">
            <img
              src={course.thumbnail || '/placeholder.svg'}
              alt={course.name}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            {getTypeIcon(type)}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-medium">{title}</h4>
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground whitespace-nowrap">{time}</span>
            <div className="flex">
              {!read && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onMarkAsRead(id)}
                >
                  <Check className="h-3 w-3" />
                  <span className="sr-only">Mark as read</span>
                </Button>
              )}
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onDelete(id)}>
                <X className="h-3 w-3" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">{message}</p>

        {renderNotificationDetails(notification)}

        <div className="flex gap-2 mt-2">
          {type === 'message' && (
            <Button size="sm" variant="outline" className="h-7 text-xs">
              Reply
            </Button>
          )}
          {type === 'sale' && (
            <Button size="sm" variant="outline" className="h-7 text-xs">
              View Order
            </Button>
          )}
          {type === 'review' && (
            <Button size="sm" variant="outline" className="h-7 text-xs">
              Thank Student
            </Button>
          )}
          {type === 'alert' && (
            <Button size="sm" variant="outline" className="h-7 text-xs">
              View Analytics
            </Button>
          )}
          <Button size="sm" variant="ghost" className="h-7 text-xs">
            View Details
          </Button>
        </div>
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

function NotificationSettings() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Notification settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[240px]">
        <DropdownMenuLabel>Notification Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <div className="p-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="sales-notifications" className="text-sm">
                Sales
              </Label>
              <Switch id="sales-notifications" defaultChecked />
            </div>
          </div>
          <div className="p-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="message-notifications" className="text-sm">
                Messages
              </Label>
              <Switch id="message-notifications" defaultChecked />
            </div>
          </div>
          <div className="p-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="review-notifications" className="text-sm">
                Reviews
              </Label>
              <Switch id="review-notifications" defaultChecked />
            </div>
          </div>
          <div className="p-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="completion-notifications" className="text-sm">
                Completions
              </Label>
              <Switch id="completion-notifications" defaultChecked />
            </div>
          </div>
          <div className="p-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="alert-notifications" className="text-sm">
                Alerts
              </Label>
              <Switch id="alert-notifications" defaultChecked />
            </div>
          </div>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <BarChart className="mr-2 h-4 w-4" />
          <span>Advanced Settings</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
