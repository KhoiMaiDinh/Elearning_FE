import React from "react";
import { Button } from "../ui/button";
import {
  Clock3,
  Gauge,
  IconNode,
  Infinity,
  PlayCircle,
  TableOfContents,
} from "lucide-react";
import IconWithText from "./iconWithText";
import PieChartProgress from "../chart/pieChartProgress";

type infoBlockCourse = {
  isRegistered: boolean;
  progress?: number;
  price?: number;
  level?: string;
};

const InfoBlockCourse: React.FC<infoBlockCourse> = ({
  isRegistered,
  progress,
  price,
  level,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="flex flex-col lg:w-80 md:w-72 w-full items-center justify-center gap-2 md:gap-4 ">
      {isRegistered && (
        <div className="flex flex-col w-full">
          <div className="flex w-full items-center justify-center">
            <text className="font-sans font-bold text-black dark:text-AntiFlashWhite text-[24px] ">
              Tiến độ
            </text>
          </div>
          <PieChartProgress />
        </div>
      )}
      {!isRegistered && (
        <div className="flex flex-col items-center justify-center rounded-md overflow-hidden">
          <div className="relative hover:cursor-pointer hover:shadow-md group overflow-hidden">
            <img
              src="/images/avatar.jpg"
              alt="Học thử"
              className="w-full  relative transition-transform duration-300 ease-in-out group-hover:scale-105"
            />
            <div className="absolute top-0 w-full h-full bg-black50 flex flex-col justify-between items-center p-4">
              {/* Icon ở giữa */}
              <div className="flex-grow flex justify-center items-center">
                <PlayCircle
                  size={32}
                  fill="#000000"
                  color="#ffffff"
                  className=""
                />
              </div>

              {/* Chữ ở dưới cùng */}
              <text className="text-AntiFlashWhite text-[16px] font-sans font-medium">
                Học thử miễn phí
              </text>
            </div>
          </div>
          <text className="flex flex-col text-[20px] font-sans font-bold text-black dark:text-AntiFlashWhite ">
            {formatPrice(Number(price))}
          </text>
        </div>
      )}

      <div className="flex flex-col ">
        <Button className="bg-majorelleBlue w-fit items-center justify-center text-[20px] px-8 rounded-full py-2 font-sans font-bold text-white dark:bg-AntiFlashWhite dark:text-black hover:shadow-md dark:hover:shadow-majorelleBlue dark:hover:text-majorelleBlue">
          {isRegistered ? "Tiếp tục" : "Đăng ký"}
        </Button>
      </div>

      <div className="flex flex-col lg:gap-4 md:gap-4 gap-2 w-full">
        <IconWithText IconComponent={Gauge} title={`Trình độ ${level}`} />
        <IconWithText
          IconComponent={TableOfContents}
          title={`Tổng số ${"22"} bài học`}
        />
        <IconWithText IconComponent={Clock3} title={`Thời lượng ${"dcc"}`} />
        <IconWithText IconComponent={Infinity} title={`Học mọi lúc mọi nơi`} />
      </div>
    </div>
  );
};

export default InfoBlockCourse;
