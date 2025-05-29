'use client';

import { Button } from '@/components/ui/button';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/constants/store';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { TabsTrigger } from '@/components/ui/tabs';
import { TabsList } from '@/components/ui/tabs';
import { GraduationCap } from 'lucide-react';
import { User } from 'lucide-react';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  // Xác định nút nào đang active dựa trên đường dẫn
  const isStudentActive = pathname.includes(`/profile/${tabs[0].value}`);
  const isLectureActive = pathname.includes(`/profile/${tabs[1].value}`);

  const handleButtonClick = (type: string) => {
    router.push(`/profile/${type === 'student' ? 'student' : 'lecture'}`);
  };

  useEffect(() => {
    if (userInfo.id) {
      if (isStudentActive) {
        router.push(`/profile/${tabs[0].value}`);
      } else {
        router.push(`/profile/${tabs[1].value}`);
      }
    } else {
      router.push('/login');
    }
  }, [userInfo.id]);

  return (
    // <div className="w-full h-full p-4 flex flex-col gap-3 bg-AntiFlashWhite dark:bg-eerieBlack font-sans font-medium text-majorelleBlue overflow-auto">
    //   <div className="flex justify-center gap-2 bg-majorelleBlue50 rounded-full w-fit p-2">
    //     <Button
    //       onClick={() => handleButtonClick('student')}
    //       className={`lg:w-32 md:w-24 sm:w-24 w-24 rounded-full ${
    //         isStudentActive
    //           ? 'bg-majorelleBlue text-white hover:bg-majorelleBlue'
    //           : 'bg-trnsp text-black hover:bg-majorelleBlue70 hover:text-white shadow-none'
    //       } hover:shadow-lg`}
    //     >
    //       Học viên
    //     </Button>

    //     <Button
    //       onClick={() => handleButtonClick('lecture')}
    //       className={`lg:w-32 md:w-24 sm:w-24 w-24 rounded-full ${
    //         isLectureActive
    //           ? 'bg-majorelleBlue text-white hover:bg-majorelleBlue'
    //           : 'bg-trnsp text-black hover:bg-majorelleBlue70 hover:text-white shadow-none'
    //       } hover:shadow-lg`}
    //     >
    //       Giảng viên
    //     </Button>
    //   </div>
    //   {children}
    // </div>
    <Tabs defaultValue={isStudentActive ? tabs[0].value : tabs[1].value}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center gap-1"
              onClick={() => handleButtonClick(tab.value)}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <TabsContent value={isStudentActive ? tabs[0].value : tabs[1].value} className="space-y-8">
        <div>{children}</div>
      </TabsContent>
    </Tabs>
  );
}
