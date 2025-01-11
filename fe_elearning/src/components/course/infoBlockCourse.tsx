import React from "react";
import { Button } from "../ui/button";
import {
  Clock3,
  Gauge,
  IconNode,
  Infinity,
  TableOfContents,
} from "lucide-react";
import IconWithText from "./iconWithText";

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
    <div className="flex flex-col lg:w-80 md:w-72 w-full items-center justify-center gap-2">
      {isRegistered && (
        <div className="flex flex-col w-full">
          <div className="flex w-full items-center justify-center">
            <text className="font-sans font-medium ">Tiến độ</text>
          </div>
        </div>
      )}
      {!isRegistered && (
        <div className="flex flex-col items-center justify-center">
          <img />
          <text className="flex flex-col font-sans font-medium text-black70 dark:text-AntiFlashWhite ">
            {formatPrice(Number(price))}
          </text>
        </div>
      )}

      <div className="flex flex-col ">
        <Button className="bg-majorelleBlue w-fit items-center justify-center text-[20px] px-8 rounded-full py-2 font-sans font-bold text-white dark:bg-AntiFlashWhite dark:text-black">
          {isRegistered ? "Tiếp tục" : "Học ngay"}
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
