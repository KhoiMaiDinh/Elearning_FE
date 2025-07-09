import React, { useEffect, useState } from 'react';
import ProfileLecture from './profileLecture';
import CourseLecture from './courseLecture';
import StatisticLecture from './statisticLecture';
import BankAccountLecture from './bankAccountLecture';
import { useRouter } from 'next/navigation';
import { Overview } from './overview';
import CouponManagement from '@/app/(page)/profile/(with-layout)/lecture/components/couponManagement';
import Payout from './payout';
import { useTheme } from 'next-themes';

export enum TABS {
  OVERVIEW = 'tong-quan',
  PROFILE = 'ho-so',
  COURSE = 'khoa-hoc',
  STATISTIC = 'phan-tich-phan-hoi',
  BANK_ACCOUNT = 'tai-khoan-ngan-hang',
  COUPON_MANAGEMENT = 'uu-dai',
  PAYOUT = 'thanh-khoan',
}

const RegisteredLecture = ({ tab, isApproved }: { tab: TABS; isApproved: boolean }) => {
  const theme = useTheme();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TABS | null>(null);

  const tabs = isApproved
    ? [
        { id: TABS.OVERVIEW, label: 'Tổng quan' },
        { id: TABS.PROFILE, label: 'Hồ sơ' },
        { id: TABS.COURSE, label: 'Khóa học' },
        { id: TABS.STATISTIC, label: 'Phân tích phản hồi' },
        { id: TABS.BANK_ACCOUNT, label: 'Tài khoản ngân hàng' },
        { id: TABS.COUPON_MANAGEMENT, label: 'Ưu đãi' },
        { id: TABS.PAYOUT, label: 'Thanh toán' },
      ]
    : [{ id: TABS.PROFILE, label: 'Hồ sơ' }];

  useEffect(() => {
    if (!tab || !Object.values(TABS).includes(tab as TABS)) {
      router.replace(`/profile/lecture?tab=${isApproved ? TABS.OVERVIEW : TABS.PROFILE}`);
      setActiveTab(isApproved ? TABS.OVERVIEW : TABS.PROFILE);
    } else if (!isApproved && tab !== TABS.PROFILE) {
      router.replace(`/profile/lecture?tab=${TABS.PROFILE}`);
      setActiveTab(TABS.PROFILE);
    } else {
      setActiveTab(tab as TABS);
    }
  }, [tab, isApproved]);

  if (activeTab === null) return null;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex w-full border-b border-gray/20 dark:border-darkSilver/20 relative z-10">
        {tabs &&
          tabs.length > 0 &&
          tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(`Clicking tab: ${tab.id}`);
                router.replace(`/profile/lecture?tab=${tab.id}`);
              }}
              className={`
              md:px-8 md:py-3 px-2 py-1 md:text-sm text-xs font-medium transition-all duration-200 cursor-pointer relative z-50 pointer-events-auto
              ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-black50 text-majorelleBlue dark:text-white border-b-2 border-majorelleBlue'
                  : 'text-black50 dark:text-darkSilver hover:bg-gray/90 dark:hover:bg-darkSilver/10'
              }
              
            `}
              style={{
                textShadow: 'none',
                pointerEvents: 'auto',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textShadow =
                  theme.theme === 'light'
                    ? '3px 3px 6px rgba(0, 0, 0, 0.5)'
                    : '3px 3px 6px rgba(255, 255, 255, 0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textShadow = 'none';
              }}
              type="button"
            >
              {tab.label}
            </button>
          ))}
      </div>

      <div className="w-full flex-1 mt-6 relative z-0">
        {isApproved ? (
          <>
            <div className={activeTab === TABS.OVERVIEW ? 'relative z-0' : 'hidden'}>
              <Overview />
            </div>
            <div className={activeTab === TABS.PROFILE ? 'relative z-0' : 'hidden'}>
              <ProfileLecture />
            </div>
            <div className={activeTab === TABS.COURSE ? 'relative z-0' : 'hidden'}>
              <CourseLecture />
            </div>
            <div className={activeTab === TABS.STATISTIC ? 'relative z-0' : 'hidden'}>
              <StatisticLecture />
            </div>
            <div className={activeTab === TABS.BANK_ACCOUNT ? 'relative z-0' : 'hidden'}>
              <BankAccountLecture />
            </div>
            <div className={activeTab === TABS.COUPON_MANAGEMENT ? 'relative z-0' : 'hidden'}>
              <CouponManagement />
            </div>
            <div className={activeTab === TABS.PAYOUT ? 'relative z-0' : 'hidden'}>
              <Payout />
            </div>
          </>
        ) : (
          <div className={activeTab === TABS.PROFILE ? 'relative z-0' : 'hidden'}>
            <ProfileLecture />
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisteredLecture;
