import { Star, Users } from "lucide-react";
import React from "react";

type infoCourse = {
  title: string;
  rating?: number;
  level?: string;
  numberStudent?: number;
  lecture: string;
  price: number;
  description: string;
};
const InfoCourse: React.FC<infoCourse> = ({
  title,
  rating,
  level,
  numberStudent,
  lecture,
  price,
  description,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="flex flex-col w-full md:gap-8 gap-4">
      <div className="flex lg:flex-row md:flex-row flex-col w-full gap-4 ">
        <div className="flex w-full lg:w-1/3 relative ">
          <img
            src={"/images/avatar.jpg"}
            alt="Khóa học"
            className="w-full h-auto rounded-md "
          />
          <div className="bg-black absolute inset-0  bg-opacity-30"></div>
        </div>

        <div className="flex flex-col font-sans gap-2 md:gap-4">
          <text className="font-bold text-[20px] md:text-[24px] lg:text-[24px] text-left ">
            {title}
          </text>
          <div className="flex w-full items-center justify-center md:justify-start">
            <div className="w-3/4 flex h-1/6 flex-row justify-between items-center">
              <div className="w-16 h-6 bg-champagne dark:bg-black50 rounded-full flex flex-row gap-1 px-3 py-1 items-center justify-center border border-white">
                <Star color="#FFCD29" fill="#FFCD29" size={12} />
                <text className="text-Sunglow text-[10px] font-sans font-medium">
                  {rating}
                </text>
              </div>
              <div className="w-24 h-6 bg-teaGreen dark:bg-black50 rounded-full flex flex-row gap-1 px-3 py-1 items-center justify-center border border-white">
                <text className="text-goGreen text-[10px] font-sans font-medium">
                  {level}
                </text>
              </div>
              <div className="w-16 h-6 bg-majorelleBlue20 dark:bg-black50 rounded-full flex flex-row gap-1 px-3 py-1 items-center justify-center border border-white">
                <Users color="#545ae8" size={20} />
                <text className="text-majorelleBlue text-[10px] font-sans font-medium">
                  {numberStudent && numberStudent > 1000
                    ? `${numberStudent / 1000}k+`
                    : `${numberStudent}+`}
                </text>
              </div>
            </div>
          </div>
          <text className="font-medium text-[16px] dark:text-AntiFlashWhite text-black70 md:text-[20px] lg:text-[20px] text-left ">
            Giảng viên: {lecture}
          </text>
          <text className="font-medium text-[16px] dark:text-AntiFlashWhite text-black70 md:text-[20px] lg:text-[20px] text-left ">
            Giá: {formatPrice(Number(price))}
          </text>
        </div>
      </div>

      <div className="flex flex-col font-sans">
        <text className="font-medium text-darkSilver md:text-[16px] text-[14px]">
          {description}
        </text>
      </div>

      <div className="flex flex-col font-sans gap-2">
        <text className="font-bold text-[16px] dark:text-AntiFlashWhite text-black md:text-[20px] lg:text-[20px] text-left ">
          Nội dung khóa học
        </text>

        <text className="font-normal text-black  italic dark:text-AntiFlashWhite md:text-[16px] text-[14px]">
          {`${"11"} chương - ${"132"} bài học - thời lượng ${"1 giờ 15 phút"}`}
        </text>

        <div className=" flex flex-col"></div>
      </div>
    </div>
  );
};

export default InfoCourse;
