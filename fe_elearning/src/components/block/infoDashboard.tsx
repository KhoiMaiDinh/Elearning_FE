import React, { ReactElement } from "react";

type infoDashboard = {
  number: number;
  title: string;
  Icon: React.ElementType;
  color?: string;
};
const InfoDashboard: React.FC<infoDashboard> = ({
  number,
  title,
  Icon,
  color,
}) => {
  return (
    <div className="flex flex-row rounded-md items-center justify-center gap-2">
      <Icon color={color} size={48} />
      <div className="flex flex-col font-sans text-black dark:text-AntiFlashWhite leading-snug">
        <p className="text-[24px] font-bold">{number}</p>
        <p className="text-[16px] font-medium">{title}</p>
      </div>
    </div>
  );
};

export default InfoDashboard;
