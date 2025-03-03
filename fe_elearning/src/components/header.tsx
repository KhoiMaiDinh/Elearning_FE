"use client";
import React, { useEffect } from "react";
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
} from "lucide-react";
import { useTheme } from "next-themes";
import { APIGetCurrentUser } from "@/utils/user";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/constants/userSlice";
import { RootState } from "@/constants/store";
import { usePathname, useRouter } from "next/navigation";

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

  const { theme, setTheme } = useTheme(); // Sử dụng hook từ `next-themes`
  const dispatch = useDispatch();

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
    localStorage.setItem("expires_at", ""); // Thời gian hết hạn
  };

  useEffect(() => {
    !userInfo.id && handleGetCurrentUser(); // Gọi hàm lấy thông tin người dùng hiện tại khi Header mount
  }, []);
  return (
    <div className="z-50 w-full p-2 h-11/12 flex items-center justify-between  top-0 sticky bg-AntiFlashWhite dark:bg-eerieBlack transition-colors">
      {/* Nội dung Header */}

      <div className=" flex w-full justify-between md:px-4 items-center space-x-4">
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
        <div className="hidden md:flex  h-full flex-grow-0 items-center justify-center sm:flex-grow-0 md:w-1/5 md:justify-start">
          <img
            // src={
            //   aboutUs?.logo.startsWith('data:image')
            //     ? aboutUs?.logo
            //     : process.env.NEXT_PUBLIC_BASE_URL_IMAGE + aboutUs?.logo
            // }
            src={"/images/logo.png"}
            alt="logo"
            className="h-16 w-auto" // Đảm bảo kích thước logo nhỏ gọn
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

        <div className="flex flex-row gap-2">
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
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={userInfo.profile_image}
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
                        src={userInfo.profile_image}
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
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup> */}
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
