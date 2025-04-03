"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Menu,
  Moon,
  Sun,
  Eye,
} from "lucide-react";
import { useTheme } from "next-themes";
import { APIGetCurrentUser } from "@/utils/user";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/constants/userSlice";
import { RootState } from "@/constants/store";
import { usePathname, useRouter } from "next/navigation";
// import io from "socket.io-client"; // Comment lại vì chưa có Socket.IO

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const router = useRouter();
  const pathname = usePathname();
  const menuItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Khóa học", path: "/course" },
    { label: "Giảng viên", path: "/lecture" },
    { label: "Liên hệ", path: "/contact" },
  ];

  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch();

  // State cho thông báo
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Khóa học mới đã được thêm!",
      date: "2025-03-07",
      link: "/course/new",
      isRead: false,
    },
    {
      id: 2,
      message: "Bạn có một tin nhắn mới.",
      date: "2025-03-06",
      link: "/messages",
      isRead: true,
    },
  ]);

  // Socket.IO (comment lại vì chưa có)
  /*
  useEffect(() => {
    const socket = io("https://your-socket-server-url");
    socket.on("newNotification", (newNotification) => {
      setNotifications((prev) => [
        { ...newNotification, isRead: false },
        ...prev,
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  */

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleGetCurrentUser = async () => {
    const response = await APIGetCurrentUser();
    if (response?.status === 200) {
      dispatch(setUser(response?.data));
    }
  };

  const handleLogOut = () => {
    router.push("/login");
    localStorage.setItem("access_token", "");
    localStorage.setItem("refresh_token", "");
    localStorage.setItem("expires_at", "");
  };

  // Đánh dấu thông báo là đã xem
  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  // Đánh dấu tất cả thông báo là đã xem
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true }))
    );
  };

  useEffect(() => {
    !userInfo.id && handleGetCurrentUser();
  }, []);

  return (
    <div className="z-50 w-full p-2 h-11/12 flex items-center justify-between top-0 sticky bg-AntiFlashWhite dark:bg-eerieBlack transition-colors shadow-md">
      <div className="flex w-full justify-between md:px-4 items-center space-x-4">
        <div className="flex h-full items-center sm:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <button className="rounded p-2">
                <Menu size={24} className="text-black dark:text-white" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black font-sans font-medium text-white">
              {menuItems.map((item) => (
                <DropdownMenuItem
                  onClick={() => router.push(item.path)}
                  key={item.path}
                  className={`hover:cursor-pointer ${
                    pathname === item.path ? "font-bold text-majorelleBlue" : ""
                  }`}
                >
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="hidden md:flex h-full flex-grow-0 items-center justify-center sm:flex-grow-0 md:w-1/5 md:justify-start">
          <img
            src={"/images/logo.png"}
            alt="logo"
            className="h-16 w-auto"
            onClick={() => router.push("/")}
          />
        </div>

        <div className="z-20 md:flex items-center justify-center hidden gap-6 md:gap-10 lg:gap-16">
          {menuItems.map((item) => (
            <div
              key={item.path}
              className={`hover:cursor-pointer ${
                pathname === item.path ? "font-bold text-majorelleBlue" : ""
              }`}
              onClick={() => router.push(item.path)}
            >
              <text className="text-[12px] md:text-[16px] lg:text-[18px]">
                {item.label}
              </text>
            </div>
          ))}
        </div>

        <div className="flex flex-row gap-2 items-center">
          <div>
            <button
              className="outline-none p-2 rounded-full bg-gray-200 dark:bg-eerieBlack hover:bg-lightSilver dark:hover:bg-black50 transition-colors"
              onClick={toggleTheme}
            >
              {theme === "light" ? (
                <Sun className="h-[1.2rem] w-[1.2rem] text-black transition-transform" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem] text-white transition-transform" />
              )}
            </button>
          </div>

          {/* Mục thông báo */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative p-2 rounded-full bg-AntiFlashWhite dark:bg-eerieBlack hover:bg-lightSilver dark:hover:bg-black50 transition-colors"
              >
                <Bell className="h-[1.2rem] w-[1.2rem] text-black dark:text-white" />
                {notifications.filter((n) => !n.isRead).length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-redPigment text-white text-xs rounded-full">
                    {notifications.filter((n) => !n.isRead).length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-80 rounded-lg bg-white dark:bg-richBlack shadow-lg border border-gray-200 dark:border-gray-700"
              align="end"
              sideOffset={8}
            >
              <DropdownMenuLabel className="font-semibold text-cosmicCobalt dark:text-AntiFlashWhite px-4 py-2 flex items-center justify-between">
                <span>Thông báo</span>
                <Button
                  variant="link"
                  className="text-majorelleBlue p-0 h-auto text-sm"
                  onClick={markAllAsRead} // Chỉ đánh dấu tất cả là đã xem
                >
                  Xem tất cả
                </Button>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-darkSilver/10 dark:bg-darkSilver/70" />
              <div className="max-h-64 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className={`flex items-start gap-2 p-3 cursor-pointer hover:bg-darkSilver/10 dark:hover:bg-darkSilver/80 ${
                        !notification.isRead
                          ? "bg-majorelleBlue/50 dark:bg-majorelleBlue/90"
                          : ""
                      }`}
                      onClick={() => {
                        markAsRead(notification.id);
                        router.push(notification.link);
                      }}
                    >
                      <div className="flex-1">
                        <p
                          className={`text-sm ${
                            notification.isRead
                              ? "text-darkSilver dark:text-lightSilver"
                              : "text-cosmicCobalt dark:text-AntiFlashWhite font-medium"
                          }`}
                        >
                          {notification.message}
                        </p>
                        <p className="text-xs text-darkSilver/70 dark:text-lightSilver/70">
                          {new Date(notification.date).toLocaleDateString(
                            "vi-VN"
                          )}
                        </p>
                      </div>
                      <Eye
                        size={16}
                        className={`${
                          notification.isRead
                            ? "text-gray-400"
                            : "text-majorelleBlue"
                        }`}
                      />
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem className="text-darkSilver dark:text-lightSilver p-3">
                    Không có thông báo nào
                  </DropdownMenuItem>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Nút đăng nhập */}
          {!userInfo.id && (
            <button
              className="px-4 py-2 bg-majorelleBlue70 text-[12px] lg:text-[16px] md:text-[16px] font-sans font-medium text-black border rounded-lg hover:bg-majorelleBlue50 hover:text-black hover:shadow-md dark:bg-majorelleBlue70 dark:text-white dark:hover:bg-majorelleBlue50 dark:hover:text-gray-200"
              onClick={() => router.push("/login")}
            >
              Đăng nhập
            </button>
          )}
          {userInfo.id && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={
                        process.env.NEXT_PUBLIC_BASE_URL_IMAGE +
                        userInfo.profile_image?.key
                      }
                      alt={userInfo.username}
                    />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {userInfo.username}
                    </span>
                    <span className="truncate text-xs">{userInfo.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={"bottom"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={
                          process.env.NEXT_PUBLIC_BASE_URL_IMAGE +
                          userInfo.profile_image?.key
                        }
                        alt={userInfo.username}
                      />
                      {/* <AvatarFallback className="rounded-lg">CN</AvatarFallback> */}
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {userInfo.username}
                      </span>
                      <span className="truncate text-xs">{userInfo.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => router.push("/profile/student")}
                  >
                    <BadgeCheck />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/billing")}>
                    <CreditCard />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleLogOut()}>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
