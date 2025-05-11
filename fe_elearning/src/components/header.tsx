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
import { setUser, clearUser } from "@/constants/userSlice";
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
import { NotificationCenter } from "./notifications/notificationComponent";
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
  /* useEffect(() => {
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
  }, []); */

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleGetCurrentUser = async () => {
    const response = await APIGetCurrentUser();
    if (response?.status === 200) {
      userInfo !== response?.data && dispatch(setUser(response?.data));
    }
  };

  const handleLogOut = () => {
    router.push("/login");
    localStorage.setItem("access_token", "");
    localStorage.setItem("refresh_token", "");
    localStorage.setItem("expires_at", "");
    dispatch(clearUser());
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
    handleGetCurrentUser();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-4 flex h-16 items-center justify-between">
        {/* Mobile Menu */}
        <div className="flex items-center sm:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 rounded-xl">
              {menuItems.map((item) => (
                <DropdownMenuItem
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className={`${
                    pathname === item.path
                      ? "bg-muted font-medium text-LavenderIndigo dark:text-PaleViolet"
                      : ""
                  }`}
                >
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="h-10 w-auto cursor-pointer"
            onClick={() => router.push("/")}
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex items-center space-x-8">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === item.path
                  ? "text-LavenderIndigo dark:text-PaleViolet font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full bg-muted/50 hover:bg-muted"
          >
            {theme === "light" ? (
              <Sun className="h-5 w-5 transition-all" />
            ) : (
              <Moon className="h-5 w-5 transition-all" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Notifications */}
          <NotificationCenter />

          {/* User Menu or Login Button */}
          {!userInfo.id ? (
            <Button
              className="bg-gradient-to-r from-LavenderIndigo to-majorelleBlue hover:brightness-110 text-white"
              onClick={() => router.push("/login")}
            >
              Đăng nhập
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8 rounded-full border-2 border-muted">
                    <AvatarImage
                      src={
                        process.env.NEXT_PUBLIC_BASE_URL_IMAGE +
                          userInfo.profile_image?.key || "/placeholder.svg"
                      }
                      alt={userInfo.username || "User"}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-xs">
                      {userInfo.first_name?.[0]}
                      {userInfo.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 rounded-xl" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {userInfo.first_name} {userInfo.last_name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userInfo.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => router.push("/profile/student")}
                  >
                    <BadgeCheck className="mr-2 h-4 w-4" />
                    <span>Tài khoản</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/billing")}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Thanh toán</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell className="mr-2 h-4 w-4" />
                    <span>Thông báo</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-carminePink focus:text-carminePink"
                  onClick={handleLogOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
