'use client';
import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

const Page = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isStudentActive = pathname.includes('/profile/student');

  useEffect(() => {
    if (isStudentActive) {
      router.push('/profile/student');
    } else {
      router.push('/profile/lecture');
    }
  }, [isStudentActive]);
  return <div></div>;
};

export default Page;
