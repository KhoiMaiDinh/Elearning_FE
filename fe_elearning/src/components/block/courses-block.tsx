"use client";
import React from "react";
import { BookOpen, Star, Users } from "lucide-react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

type coursesBlock = {
  avatar?: string;
  name?: string;
  rating?: number;
  major?: string;
  description?: string;
  number?: number;
};
const CoursesBlock: React.FC<coursesBlock> = ({}) => {
  return (
    <div className="w-72 h-80 bg-white rounded-2xl p-3 shadow-lg border border-lightSilver gap-1 flex flex-col">
      {/* Ảnh lớn hơn */}
      <div className="w-full h-40 rounded-lg overflow-hidden">
        <img
          className="object-cover w-full h-full"
          src="/images/avatar.jpg"
          alt="avatar"
        />
      </div>

      <div className="w-full flex h-1/6 flex-row justify-between items-center">
        <div className="w-16 h-6 bg-champagne rounded-full flex flex-row gap-1 px-3 py-1 items-center justify-center border border-white">
          <Star color="#FFCD29" fill="#FFCD29" size={16} />
          <text className="text-Sunglow text-[12px] font-sans font-medium">
            4.9
          </text>
        </div>
        <div className="w-24 h-6 bg-teaGreen rounded-full flex flex-row gap-1 px-3 py-1 items-center justify-center border border-white">
          <text className="text-goGreen text-[12px] font-sans font-medium">
            Sơ cấp
          </text>
        </div>
        <div className="w-16 h-6 bg-majorelleBlue20 rounded-full flex flex-row gap-1 px-3 py-1 items-center justify-center border border-white">
          <Users color="#545ae8" size={20} />
          <text className="text-majorelleBlue text-[12px] font-sans font-medium">
            120+
          </text>
        </div>
      </div>

      <div className="w-full flex flex-col ">
        <span className="text-[14px] font-semibold text-left">
          Học css từ con số 0
        </span>
      </div>

      {/* Giới hạn mô tả 3 dòng */}
      <div className="w-full flex flex-col">
        <text className="text-darkSilver font-sans font-normal text-[12px] leading-tight line-clamp-3">
          Chuyên gia CNTT với nhiều năm kinh nghiệm giảng dạy, cùng với đó là
          các bài báo khoa học đạt chuẩn quốc tế, bằng thạc sĩ đồ đó, blalabla
          nha
        </text>
      </div>

      <div className="w-full flex flex-row gap-4 items-center">
        <div className="w-8 h-7 rounded-md overflow-hidden">
          <img
            className="object-cover w-full h-full"
            src="/images/avatar.jpg"
            alt="avatar"
          />
        </div>

        <div className="w-full flex flex-col">
          <span className="text-[12px] font-semibold text-darkSilver">
            Lê Thị Thu Hiền
          </span>
        </div>
      </div>

      <div className="w-full flex flex-row justify-between items-end font-sans font-medium text-[12px]">
        {/* <div className="flex flex-col gap-0.5">
          <text className="text-darkSilver line-through">120.000 đ</text>
          <text className="text-black">120.000 đ</text>
        </div> */}
        <div className="w-3/5 flex flex-row gap-0.5 items-center self-center">
          <Progress
            value={33}
            className="w-4/5  bg-majorelleBlue20"
            color="#ffffff"
          ></Progress>
          <text className="font-sans font-normal text-[10px]">33%</text>
        </div>

        <Button className="bg-black w-fit px-3 h-fit rounded-xl text-white text-[10px] font-sans font-medium shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300">
          Xem chi tiết
        </Button>
      </div>
    </div>
  );
};

export default CoursesBlock;
