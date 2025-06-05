'use client';

import { Button } from '@/components/ui/button';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/constants/store';
import { Tabs, TabsTrigger, TabsList } from '@/components/ui/tabs';

const tabs = [
  {
    label: 'Học viên',
    value: 'student',
  },
  {
    label: 'Giảng viên',
    value: 'lecture',
  },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  const currentTab = tabs.find((tab) => pathname.includes(tab.value))?.value;

  useEffect(() => {
    if (!userInfo.id) {
      router.push('/login');
    }
  }, [userInfo.id]);

  const handleTabClick = (value: string) => {
    if (value !== currentTab) {
      router.push(`/profile/${value}`);
    }
  };

  return (
    <Tabs defaultValue={currentTab}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center gap-1"
              onClick={() => handleTabClick(tab.value)}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {/* Luôn render nội dung con của layout */}
      <div className="mt-6">{children}</div>
    </Tabs>
  );
}
