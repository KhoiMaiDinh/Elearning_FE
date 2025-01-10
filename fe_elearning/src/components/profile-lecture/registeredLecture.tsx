import React, { useState } from "react";
import ProfileLecture from "./profileLecture";
import CourseLecture from "./courseLecture";
import StatisticLecture from "./statisticLecture";

const RegisteredLecture = () => {
  const [active, setActive] = useState("Hồ sơ");
  const handleButtonClick = async (type: string) => {
    setActive(type);
  };

  return (
    <div className="w-full h-full">
      <div className="w-full flex flex-row lg:text-[16px] md:text-[16px] text-[12px] font-sans font-medium text-black dark:text-AntiFlashWhite sm:text-[12px] lg:items-start md:items-start items-center ">
        <div
          onClick={() => handleButtonClick("Hồ sơ")}
          className={`flex w-fit px-8 py-2 rounded-t-sm hover:shadow-md hover:cursor-pointer ${
            active === "Hồ sơ"
              ? "bg-white dark:bg-black50"
              : "text-black50 bg-none dark:text-darkSilver"
          }`}
        >
          <text>Hồ sơ</text>
        </div>
        <div
          onClick={() => handleButtonClick("Khóa học")}
          className={`flex w-fit px-8 py-2 rounded-t-sm hover:shadow-md hover:cursor-pointer ${
            active === "Khóa học"
              ? "bg-white dark:bg-black50"
              : "text-black50 bg-none dark:text-darkSilver"
          }`}
        >
          <text>Khóa học</text>
        </div>
        <div
          onClick={() => handleButtonClick("Thống kê")}
          className={`flex w-fit px-8 py-2 rounded-t-sm hover:shadow-md hover:cursor-pointer ${
            active === "Thống kê"
              ? "bg-white dark:bg-black50"
              : "text-black50 bg-none dark:text-darkSilver"
          }`}
        >
          <text>Thống kê</text>
        </div>
      </div>

      <div className="w-full flex items-center ">
        {active === "Hồ sơ" && <ProfileLecture />}
        {active === "Khóa học" && <CourseLecture />}
        {active === "Thống kê" && <StatisticLecture />}
      </div>
    </div>
  );
};

export default RegisteredLecture;
