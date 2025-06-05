import React, { useEffect, useState } from 'react';
import ProfileLecture from './profileLecture';
import CourseLecture from './courseLecture';
import StatisticLecture from './statisticLecture';
import BankAccountLecture from './bankAccountLecture';
import { useRouter } from 'next/navigation';
import { Overview } from './overview';
import CouponManagement from '@/app/(page)/profile/(with-layout)/lecture/components/couponManagement';
import Payout from './payout';

export enum TABS {
  OVERVIEW = 'tong-quan',
  PROFILE = 'ho-so',
  COURSE = 'khoa-hoc',
  STATISTIC = 'phan-tich-phan-hoi',
  BANK_ACCOUNT = 'tai-khoan-ngan-hang',
  COUPON_MANAGEMENT = 'ma-giam-gia',
  PAYOUT = 'thanh-khoan',
}

const RegisteredLecture = ({ tab, isApproved }: { tab: TABS; isApproved: boolean }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TABS | null>(null);

  const tabs = isApproved
    ? [
        { id: TABS.OVERVIEW, label: 'Tổng quan' },
        { id: TABS.PROFILE, label: 'Hồ sơ' },
        { id: TABS.COURSE, label: 'Khóa học' },
        { id: TABS.STATISTIC, label: 'Phân tích phản hồi' },
        { id: TABS.BANK_ACCOUNT, label: 'Tài khoản ngân hàng' },
        { id: TABS.COUPON_MANAGEMENT, label: 'Mã giảm giá' },
        { id: TABS.PAYOUT, label: 'Thanh khoản' },
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
        {isApproved ? (
          <>
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
            <div className={activeTab === TABS.COUPON_MANAGEMENT ? '' : 'hidden'}>
              <CouponManagement />
            </div>
            <div className={activeTab === TABS.PAYOUT ? '' : 'hidden'}>
              <Payout />
            </div>
          </>
        ) : (
          <div className={activeTab === TABS.PROFILE ? '' : 'hidden'}>
            <ProfileLecture />
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisteredLecture;
