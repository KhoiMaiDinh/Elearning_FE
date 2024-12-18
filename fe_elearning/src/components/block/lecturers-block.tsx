"use client";
import React from "react";
import { BookOpen, Star, Users } from "lucide-react";
import { Button } from "../ui/button";

type lecturersBlock = {
  avatar?: string;
  name?: string;
  rating?: number;
  major?: string;
  description?: string;
  number?: number;
};
const LecturersBlock: React.FC<lecturersBlock> = ({}) => {
  return (
    <div className="w-72 h-64 bg-white rounded-2xl p-3 shadow-lg border border-lightSilver ">
      <div className="w-full flex flex-row gap-4 items-center  mb-4">
        <div className="w-16 h-16 rounded-lg overflow-hidden ">
          <img
            className="object-cover w-full h-full"
            src="/images/avatar.jpg"
            alt="avatar"
          />
        </div>
        <div className="flex flex-col items-start gap-2 text-black">
          <div className="w-16 h-6 bg-champagne rounded-full flex flex-row gap-1 px-3 py-1 items-center justify-center border border-white">
            <Star color="#FFCD29" fill="#FFCD29" size={16} />
            <text className="text-Sunglow text-[16px] font-sans font-bold ">
              4.9
            </text>
          </div>
          <div className="w-full flex flex-col ">
            <span className="text-[14px] font-semibold">Lê Thị Thu Hiền</span>
            <span className="text-[8px] font-light text-darkSilver">
              Chuyên môn: Công nghệ thông tin
            </span>
          </div>
        </div>
      </div>
      <div className="w-full h-1/3 flex flex-col">
        <text className="text-darkSilver font-sans font-normal text-[12px] leading-tight line-clamp-3">
          Chuyên gia CNTT với nhiều năm kinh nghiệm giảng dạy, cùng với đó là
          các bài báo khoa học đạt chuẩn quốc tế, bằng thạc sĩ đồ đó, blalabla
          nha{" "}
        </text>
      </div>

      <div className="w-full flex flex-col">
        <div className="w-full flex flex-row text-darkSilver font-sans font-medium text-[10px] items-center gap-3">
          <BookOpen color="#736c6c" size={12} />
          <text>12 khóa học</text>
        </div>
        <div className="w-full flex flex-row text-darkSilver font-sans font-medium text-[10px] items-center gap-3">
          <Users color="#736c6c" size={12} />
          <text>250+ học viên</text>
        </div>
      </div>

      <div className="w-full flex flex-row justify-end">
        <Button className="bg-majorelleBlue70 w-fit px-3 h-fit rounded-xl text-white text-[10px] font-sans font-medium shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300">
          Xem chi tiết
        </Button>
      </div>
    </div>
  );
};

export default LecturersBlock;
