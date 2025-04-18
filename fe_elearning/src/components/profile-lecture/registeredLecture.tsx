import React, { useState } from "react";
import ProfileLecture from "./profileLecture";
import CourseLecture from "./courseLecture";
import StatisticLecture from "./statisticLecture";
import BankAccountLecture from "./bankAccountLecture";
const RegisteredLecture = () => {
  const [active, setActive] = useState("Hồ sơ");

  const tabs = [
    { id: "Hồ sơ", label: "Hồ sơ" },
    { id: "Khóa học", label: "Khóa học" },
    { id: "Thống kê", label: "Thống kê" },
    { id: "Tài khoản ngân hàng", label: "Tài khoản ngân hàng" },
  ];

  const TabContent = {
    "Hồ sơ": ProfileLecture,
    "Khóa học": CourseLecture,
    "Thống kê": StatisticLecture,
    "Tài khoản ngân hàng": BankAccountLecture,
  };

  const ActiveComponent = TabContent[active as keyof typeof TabContent];

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex w-full border-b border-gray/20 dark:border-darkSilver/20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`
              px-8 py-3 text-sm font-medium transition-all duration-200
              ${
                active === tab.id
                  ? "bg-white dark:bg-black50 text-majorelleBlue dark:text-white border-b-2 border-majorelleBlue"
                  : "text-black50 dark:text-darkSilver hover:bg-gray/10 dark:hover:bg-darkSilver/10"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="w-full flex-1 mt-6">
        <ActiveComponent />
      </div>
    </div>
  );
};

export default RegisteredLecture;
