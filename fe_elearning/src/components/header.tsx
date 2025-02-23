"use client";
import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { APIGetCurrentUser } from "@/utils/user";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/constants/userSlice";
import { RootState } from "@/constants/store";
import { useRouter } from "next/navigation";

const Header = () => {
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const router = useRouter();

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

  useEffect(() => {
    !userInfo.id && handleGetCurrentUser(); // Gọi hàm lấy thông tin người dùng hiện tại khi Header mount
  }, []);
  return (
    <div className="z-50 w-full h-11/12 flex items-center justify-between  top-0 sticky bg-AntiFlashWhite dark:bg-eerieBlack transition-colors">
      {/* Nội dung Header */}
      <h1 className="text-[16px] lg:text-[32px] md:text-[24px] font-bold lg:ml-4 ml-0 dark:text-white">
        My E-Learning
      </h1>
      <div className="lg:mr-4 mr-0 flex items-center space-x-4">
        {/* <LanguageSwitcher /> */}
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
      </div>
    </div>
  );
};

export default Header;
