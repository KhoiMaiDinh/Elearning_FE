"use client";
import React from "react";
import { BookOpen, Star, Users } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";

type lecturersBlock = {
  avatar?: string;
  name?: string;
  rating?: number;
  major?: string;
  description?: string;
  numberCourse?: number;
  numberStudent?: number;
};
const LecturersBlock: React.FC<lecturersBlock> = ({
  avatar,
  name,
  rating,
  major,
  description,
  numberCourse,
  numberStudent,
}) => {
  const { theme } = useTheme();
  return (
    <div className="w-full h-full  rounded-2xl hover:pt-0 pt-1 ">
      <div className="w-full h-56 bg-custom-gradient-light dark:bg-custom-gradient-dark text-black70 dark:text-AntiFlashWhite rounded-2xl p-3 shadow-md shadow-majorelleBlue20  border border-lightSilver hover:shadow-xl hover:mt-0 hover:cursor-pointer ">
        <div className="w-full flex flex-row gap-4 items-center  mb-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden ">
            <img
              className="object-cover w-full h-full"
              src={avatar}
              alt="avatar"
            />
          </div>
          <div className="flex flex-col items-start gap-2 dark:text-AntiFlashWhite text-black70">
            <div className="w-16 h-6 dark:bg-black50 bg-champagne  rounded-full flex flex-row gap-1 px-3 py-1 items-center justify-center border border-white">
              <Star color="#FFCD29" fill="#FFCD29" size={12} />
              <text className="text-Sunglow text-[10px] font-sans font-bold ">
                {rating}
              </text>
            </div>
            <div className="w-full flex flex-col ">
              <span className="text-[14px] font-semibold">{name}</span>
              <span className="text-[8px] font-sans font-medium dark:text-lightSilver text-darkSilver">
                Chuyên môn: {major}
              </span>
            </div>
          </div>
        </div>
        <div className="w-full h-1/3 flex flex-col">
          <text className="dark:text-lightSilver text-darkSilver font-sans font-normal text-[12px] leading-tight line-clamp-3">
            {description}
          </text>
        </div>

        <div className="w-full flex flex-col">
          <div className="w-full flex flex-row dark:text-lightSilver text-darkSilver font-sans font-medium text-[10px] items-center gap-3">
            <BookOpen
              color={`${theme === "light" ? "#736c6c" : "#d9d9d9"}`}
              size={12}
            />
            <text>{numberCourse} khóa học</text>
          </div>
          <div className="w-full flex flex-row dark:text-lightSilver text-darkSilver font-sans font-medium text-[10px] items-center gap-3">
            <Users
              color={`${theme === "light" ? "#736c6c" : "#d9d9d9"}`}
              size={12}
            />
            <text>{numberStudent}+ học viên</text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturersBlock;
