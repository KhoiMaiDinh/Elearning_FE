"use client";

import * as React from "react";
import {
  AudioWaveform,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  LayoutDashboard,
  BookMarked,
  IdCard,
  BookCheck,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { WebName } from "@/components/web-name";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "Thu Hien",
    email: "thuhien@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: {
    name: "E-learning",
    logo: BookCheck,
    description: "Chạm đến thành công",
  },

  navMain: [
    {
      title: "Trang chủ",
      url: "#",
      icon: LayoutDashboard,
      isActive: true,
      // items: [
      //   {
      //     title: "History",
      //     url: "#",
      //   },
      //   {
      //     title: "Starred",
      //     url: "#",
      //   },
      //   {
      //     title: "Settings",
      //     url: "#",
      //   },
      // ],
    },
    {
      title: "Khóa học",
      url: "#",
      icon: BookMarked,
      items: [
        {
          title: "Khối tự nhiên",
          url: "#",
        },
        {
          title: "Khối xã hội",
          url: "#",
        },
        {
          title: "Khối công nghệ",
          url: "#",
        },
        {
          title: "Khối kinh doanh",
          url: "#",
        },
        {
          title: "Khối marketing",
          url: "#",
        },
      ],
    },
    {
      title: "Giảng viên",
      url: "#",
      icon: IdCard,
      items: [
        {
          title: "Khối tự nhiên",
          url: "#",
        },
        {
          title: "Khối xã hội",
          url: "#",
        },
        {
          title: "Khối công nghệ",
          url: "#",
        },
        {
          title: "Khối kinh doanh",
          url: "#",
        },
        {
          title: "Khối marketing",
          url: "#",
        },
      ],
    },
    {
      title: "Cài đặt",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Cá nhân",
          url: "#",
        },
        {
          title: "Giao diện",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "kcjdckcjdc",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <WebName teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
