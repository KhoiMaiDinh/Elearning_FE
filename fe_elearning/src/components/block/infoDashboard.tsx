import React, { ReactElement, useEffect } from "react";

import CountUp from "../text/countUp";

type infoDashboard = {
  number: number;
  title: string;
  Icon: React.ElementType;
  color?: string;
  bgColor?: string;
};

const InfoDashboard: React.FC<infoDashboard> = ({
  number,
  title,
  Icon,
  color,
  bgColor,
}) => {
  // Khởi tạo AOS cho animation fade-up

  return (
    <div className="flex flex-row rounded-md items-center justify-center gap-2 p-4 bg-white relative dark:bg-eerieBlack shadow-md hover:shadow-lg transition-shadow">
      <div className={`p-2 bg-[${bgColor}] z-10`}>
        <Icon color={color} size={48} />
      </div>
      <div className="flex flex-col font-sans z-10 text-black dark:text-AntiFlashWhite leading-snug">
        <p className="text-lg font-bold">
          <CountUp
            from={0}
            to={number}
            separator=","
            direction="up"
            duration={1}
            className="count-up-text"
          />
        </p>
        <p className="text-[16px] font-medium text-darkSilver dark:text-lightSilver">
          {title}
        </p>
      </div>
    </div>
  );
};

export default InfoDashboard;
