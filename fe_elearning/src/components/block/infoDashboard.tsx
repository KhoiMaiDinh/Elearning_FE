import React, { ReactElement, useEffect } from "react";
import CountUp from "react-countup";
import AOS from "aos";
import "aos/dist/aos.css";

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
  // Khởi tạo AOS cho animation fade-up
  useEffect(() => {
    AOS.init({
      duration: 500,
      once: true,
    });
  }, []);

  return (
    <div
      data-aos="fade-up"
      className="flex flex-row rounded-md items-center justify-center gap-2 p-4 bg-white dark:bg-black50 shadow-md hover:shadow-lg transition-shadow"
    >
      <Icon color={color} size={48} />
      <div className="flex flex-col font-sans text-black dark:text-AntiFlashWhite leading-snug">
        <p className="text-[24px] font-bold">
          <CountUp
            start={0}
            end={number}
            duration={1} // Thời gian để đếm từ 0 đến số (2.5 giây)
            separator="," // Thêm dấu phẩy cho số lớn
            decimals={0} // Số thập phân (0 nếu là số nguyên)
          />
        </p>
        <p className="text-[16px] font-medium">{title}</p>
      </div>
    </div>
  );
};

export default InfoDashboard;
