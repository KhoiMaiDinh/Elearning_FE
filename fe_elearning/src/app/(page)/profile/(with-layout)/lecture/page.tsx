'use client';
import Loader from '@/components/loading/loader';
import NotRegisteredLecture from '@/components/profile-lecture/notRegisteredLecture';
import RegisteredLecture from '@/components/profile-lecture/registeredLecture';
import { RootState } from '@/constants/store';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { useSelector } from 'react-redux';

const Page = () => {
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') ?? 'tong-quan';

  return (
    <div className="w-full h-full">
      {userInfo.id ? (
        !userInfo?.roles?.some((role) => role.role_name === 'instructor') &&
        !userInfo?.instructor_profile ? (
          <NotRegisteredLecture />
        ) : (
          <RegisteredLecture tab={tabParam as any} />
        )
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default Page;
