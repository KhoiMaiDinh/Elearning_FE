'use client';

import * as React from 'react';
import {
  Frame,
  Map,
  PieChart,
  Settings2,
  LayoutDashboard,
  BookMarked,
  IdCard,
  BookCheck,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { WebName } from '@/components/web-name';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { useSelector } from 'react-redux';
import { RootState } from '@/constants/store';

// This is sample data.
const data = {
  user: {
    name: 'Thu Hien',
    email: 'thuhien@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: {
    name: 'E-learning',
    logo: BookCheck,
    description: 'Chạm đến thành công',
  },

  navMain: [
    {
      title: 'Trang chủ',
      url: '/',
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: 'Khóa học',
      url: '/course',
      icon: BookMarked,
    },
    {
      title: 'Giảng viên',
      url: '/lecture',
      icon: IdCard,
    },
  ],
  projects: [
    {
      name: 'kcjdckcjdc',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  // Lọc navMain để chỉ thêm mục "Cài đặt" nếu có userInfo
  const filteredNavMain = userInfo.id
    ? [
        ...data.navMain,
        {
          title: 'Cài đặt',
          url: '/setting',
          icon: Settings2,
        },
      ]
    : data.navMain;

  return (
    <Sidebar collapsible="icon" {...props} className="bg-AntiFlashWhite dark:bg-eerieBlack">
      <SidebarHeader>
        <WebName teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      {userInfo.id && (
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
      )}
      <SidebarRail />
    </Sidebar>
  );
}
