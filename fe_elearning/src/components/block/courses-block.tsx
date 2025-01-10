"use client";
import React from "react";
import { BookOpen, Star, Users } from "lucide-react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

type coursesBlock = {
  coverPhoto?: string;
  avatar?: string;
  title?: string;
  rating?: number;
  level?: string;
  numberStudent?: number;
  description?: string;
  name?: string;
  status?: string;
  progress?: number;
  price?: number;
  priceFinal?: number;
};
const CoursesBlock: React.FC<coursesBlock> = ({
  coverPhoto,
  rating,
  level,
  numberStudent,
  name,
  status,
  progress,
  title,
  avatar,
  description,
  price,
  priceFinal,
}) => {
  return (
    <div className="w-full h-full  rounded-2xl hover:pt-0 pt-1  ">
      <div className="w-full h-full bg-white dark:bg-black50 dark:shadow-majorelleBlue20 dark:text-AntiFlashWhite rounded-2xl p-3 shadow-md border border-lightSilver gap-1 flex flex-col hover:shadow-lg hover:mt-0 hover:cursor-pointer">
        {/* Ảnh lớn hơn */}
        <div className="w-full h-24 rounded-lg overflow-hidden">
          <img
            className="object-cover w-full h-full"
            src={coverPhoto}
            alt="avatar"
          />
        </div>

        <div className="w-full flex h-1/6 flex-row justify-between items-center">
          <div className="w-16 h-6 bg-champagne rounded-full flex flex-row gap-1 px-3 py-1 items-center justify-center border border-white">
            <Star color="#FFCD29" fill="#FFCD29" size={12} />
            <text className="text-Sunglow text-[10px] font-sans font-medium">
              {rating}
            </text>
          </div>
          <div className="w-24 h-6 bg-teaGreen rounded-full flex flex-row gap-1 px-3 py-1 items-center justify-center border border-white">
            <text className="text-goGreen text-[10px] font-sans font-medium">
              {level}
            </text>
          </div>
          <div className="w-16 h-6 bg-majorelleBlue20 rounded-full flex flex-row gap-1 px-3 py-1 items-center justify-center border border-white">
            <Users color="#545ae8" size={20} />
            <text className="text-majorelleBlue text-[10px] font-sans font-medium">
              {numberStudent && numberStudent > 1000
                ? `${numberStudent / 1000}k+`
                : `${numberStudent}+`}
            </text>
          </div>
        </div>

        <div className="w-full flex flex-col ">
          <span className="text-[14px] font-semibold text-left">{title}</span>
        </div>

        {/* Giới hạn mô tả 3 dòng */}
        <div className="w-full flex flex-col items-start justify-start h-14">
          <text className="text-darkSilver dark:text-lightSilver font-sans font-normal text-[12px] leading-tight line-clamp-3">
            {description}
          </text>
        </div>

        <div className="w-full flex flex-row gap-4 items-center">
          <div className="w-8 h-7 rounded-md overflow-hidden">
            <img
              className="object-cover w-full h-full"
              src={avatar}
              alt="avatar"
            />
          </div>

          <div className="w-full flex flex-col">
            <span className="text-[12px] font-semibold text-darkSilver">
              {name}
            </span>
          </div>
        </div>

        <div className="w-full flex flex-row justify-between items-end font-sans font-medium text-[12px]">
          <div className="flex">
            {status === "Chưa đăng ký" && (
              <div className="flex flex-col gap-0.5">
                <text className="text-darkSilver line-through">{price}đ</text>
                <text className="text-black dark:text-AntiFlashWhite">
                  {priceFinal} đ
                </text>
              </div>
            )}
            {status === "Đang học" && (
              <div className="w-3/5 flex flex-row gap-0.5 items-center self-center">
                <Progress
                  value={progress}
                  className="w-4/5"
                  color="#ff0000"
                ></Progress>
                <text className="font-sans font-normal text-[10px]">
                  {progress}%
                </text>
              </div>
            )}
          </div>

          <Button className="bg-black dark:border-AntiFlashWhite dark:border-solid dark:border dark:hover:text-eerieBlack w-fit px-3 h-fit rounded-xl text-white text-[10px] font-sans font-medium shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300">
            Xem chi tiết
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CoursesBlock;
