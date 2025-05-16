import React from 'react';
import ProfileLecture from './profileLecture';
import CourseLecture from './courseLecture';
import StatisticLecture from './statisticLecture';
import BankAccountLecture from './bankAccountLecture';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Overview } from './overview';
const RegisteredLecture = () => {
  enum TABS {
    OVERVIEW = 'tong-quan',
    PROFILE = 'ho-so',
    COURSE = 'khoa-hoc',
    STATISTIC = 'thong-ke',
    BANK_ACCOUNT = 'tai-khoan-ngan-hang',
  }

  const query = useSearchParams();
  const router = useRouter();
  const activeTab = (query.get('tab') as TABS) || TABS.OVERVIEW;

  const tabs = [
    { id: TABS.OVERVIEW, label: 'Tổng quan' },
    { id: TABS.PROFILE, label: 'Hồ sơ' },
    { id: TABS.COURSE, label: 'Khóa học' },
    { id: TABS.STATISTIC, label: 'Thống kê' },
    { id: TABS.BANK_ACCOUNT, label: 'Tài khoản ngân hàng' },
  ];

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex w-full border-b border-gray/20 dark:border-darkSilver/20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              router.replace(`/profile/lecture?tab=${tab.id}`);
            }}
            className={`
              md:px-8 md:py-3 px-2 py-1 md:text-sm text-xs font-medium transition-all duration-200
              ${
                activeTab === tab.id
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
        <div className={activeTab === TABS.OVERVIEW ? '' : 'hidden'}>
          <Overview />
        </div>
        <div className={activeTab === TABS.PROFILE ? '' : 'hidden'}>
          <ProfileLecture />
        </div>
        <div className={activeTab === TABS.COURSE ? '' : 'hidden'}>
          <CourseLecture />
        </div>
        <div className={activeTab === TABS.STATISTIC ? '' : 'hidden'}>
          <StatisticLecture />
        </div>
        <div className={activeTab === TABS.BANK_ACCOUNT ? '' : 'hidden'}>
          <BankAccountLecture />
        </div>
      </div>
    </div>
  );
};

export default RegisteredLecture;
