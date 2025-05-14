import React, { useState } from 'react';
import ProfileLecture from './profileLecture';
import CourseLecture from './courseLecture';
import StatisticLecture from './statisticLecture';
import BankAccountLecture from './bankAccountLecture';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Overview } from './overview';
const RegisteredLecture = () => {
  const query = useSearchParams();
  const tab = query.get('tab');
  const router = useRouter();
  const [active, setActive] = useState(tab || 'Hồ sơ');

  const tabs = [
    { id: 'Tổng quan', label: 'Tổng quan' },
    { id: 'Hồ sơ', label: 'Hồ sơ' },
    { id: 'Khóa học', label: 'Khóa học' },
    { id: 'Thống kê', label: 'Thống kê' },
    { id: 'Tài khoản ngân hàng', label: 'Tài khoản ngân hàng' },
  ];

  const TabContent = {
    'Tổng quan': Overview,
    'Hồ sơ': ProfileLecture,
    'Khóa học': CourseLecture,
    'Thống kê': StatisticLecture,
    'Tài khoản ngân hàng': BankAccountLecture,
  };

  const ActiveComponent = TabContent[active as keyof typeof TabContent];

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex w-full border-b border-gray/20 dark:border-darkSilver/20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActive(tab.id);
              router.push(`/profile/lecture?tab=${tab.id}`);
            }}
            className={`
              md:px-8 md:py-3 px-2 py-1 md:text-sm text-xs font-medium transition-all duration-200
              ${
                active === tab.id
                  ? 'bg-white dark:bg-black50 text-majorelleBlue dark:text-white border-b-2 border-majorelleBlue'
                  : 'text-black50 dark:text-darkSilver hover:bg-gray/10 dark:hover:bg-darkSilver/10'
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
