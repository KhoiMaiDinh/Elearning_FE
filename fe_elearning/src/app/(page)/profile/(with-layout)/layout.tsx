'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useMemo } from 'react';
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

  // Get current tab based on pathname
  const currentTab = useMemo(() => {
    return tabs.find((tab) => pathname?.includes(tab.value))?.value ?? tabs[0].value;
  }, [pathname]);

  useEffect(() => {
    if (!userInfo?.id) {
      router.push('/login');
    }
  }, [userInfo?.id]);

  const handleTabChange = (value: string) => {
    if (value !== currentTab) {
      router.push(`/profile/${value}`);
    }
  };

  // Prevent rendering before we know the tab value (to avoid hydration mismatch)
  if (!currentTab) return null;

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange}>
      <div className="flex flex-col p-4 sm:flex-row justify-between items-start sm:items-center gap-4">
        <TabsList className="shadow">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-1">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <div className="mt-6">{children}</div>
    </Tabs>
  );
}
