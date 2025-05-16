import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Clock3, Gauge, Infinity, PlayCircle, TableOfContents } from 'lucide-react';
import IconWithText from './iconWithText';
import PieChartProgress from '../chart/pieChartProgress';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle } from '../ui/card';
import { formatPrice } from '../formatPrice';
import { useSelector } from 'react-redux';
import { RootState } from '@/constants/store';
type infoBlockCourse = {
  id: string;
  isRegistered: boolean;
  progress?: number;
  price?: number;
  level?: string;
  totalLessons?: number;
  courseProgress?: number;
  thumbnail?: any;
};

const InfoBlockCourse: React.FC<infoBlockCourse> = ({
  id,
  isRegistered,
  // progress,
  price,
  level,
  totalLessons,
  courseProgress,
  thumbnail,
}) => {
  const router = useRouter();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  const [levelShow, setLevelShow] = useState<string | null>(null);

  useEffect(() => {
    if (level === 'BEGINNER') {
      setLevelShow('Cơ bản');
    } else if (level === 'INTERMEDIATE') {
      setLevelShow('Trung bình');
    } else if (level === 'ADVANCED') {
      setLevelShow('Nâng cao');
    }
  }, [level]);

  return (
    <Card className="flex flex-col lg:w-80 md:w-72 p-4 w-full items-center justify-center gap-2 md:gap-4 ">
      {isRegistered && (
        <div className="flex flex-col w-full">
          {courseProgress !== 0 && courseProgress && (
            <CardHeader>
              <CardTitle className="font-sans text-center font-bold text-black dark:text-AntiFlashWhite text-[24px] ">
                Tiến độ
              </CardTitle>
            </CardHeader>
          )}
          {courseProgress !== 0 && courseProgress && (
            <PieChartProgress courseProgress={courseProgress} />
          )}
        </div>
      )}
      {!isRegistered && (
        <div className="flex flex-col items-center justify-center rounded-md overflow-hidden">
          <CardHeader>
            <CardTitle className="font-sans font-bold text-black dark:text-AntiFlashWhite text-[24px] ">
              Tiến độ
            </CardTitle>
          </CardHeader>
          <div
            className="relative hover:cursor-pointer hover:shadow-md group overflow-hidden"
            onClick={() => {
              router.push(`/course-details/${id}`);
            }}
          >
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_URL_IMAGE || ''}${thumbnail || ''}`}
              alt="Học thử"
              className="w-full  relative transition-transform duration-300 ease-in-out group-hover:scale-105"
            />
            <div className="absolute top-0 w-full h-full bg-black50 flex flex-col justify-between items-center p-4">
              {/* Icon ở giữa */}
              <div className="flex-grow flex justify-center items-center">
                <PlayCircle size={32} fill="#000000" color="#ffffff" className="" />
              </div>

              {/* Chữ ở dưới cùng */}
              <text className="text-AntiFlashWhite text-[16px] font-sans font-medium">
                Học thử miễn phí
              </text>
            </div>
          </div>
          <text className="flex flex-col text-[20px] font-sans font-bold text-black dark:text-AntiFlashWhite ">
            {formatPrice(Number(price))}
          </text>
        </div>
      )}

      <div className="flex flex-col ">
        {!isRegistered && (
          <div className="grid grid-cols-2 gap-2">
            <Button
              className="bg-custom-gradient-button-violet w-full items-center justify-center text-sm px-8 rounded-md py-2 font-sans font-bold text-white  hover:shadow-md hover:scale-105 transition-all duration-300"
              onClick={() => {
                if (userInfo.id) {
                  router.push(`/checkout/${id}`);
                } else {
                  router.push('/login');
                }
              }}
            >
              Đăng ký ngay
            </Button>

            <Button className="bg-custom-gradient-button-blue w-full items-center justify-center text-sm px-8 rounded-md py-2 font-sans font-bold text-white  hover:shadow-md hover:scale-105 transition-all duration-300">
              Thêm vào giỏ hàng
            </Button>
          </div>
        )}

        {isRegistered && (
          <Button
            className="bg-custom-gradient-button-violet w-fit items-center justify-center text-[20px] px-8 rounded-md py-2 font-sans font-bold text-white  hover:shadow-md hover:scale-105 transition-all duration-300"
            onClick={() => {
              router.push(`/course-details/${id}`);
            }}
          >
            {courseProgress !== 0 && courseProgress
              ? 'Tiếp tục'
              : courseProgress === 100 && courseProgress
                ? 'Đã hoàn thành'
                : 'Bắt đầu'}
          </Button>
        )}
      </div>

      <div className="flex flex-col lg:gap-4 md:gap-4 gap-2 w-full">
        <IconWithText IconComponent={Gauge} title={`Trình độ ${levelShow}`} />
        <IconWithText IconComponent={TableOfContents} title={`Tổng số ${totalLessons} bài học`} />
        <IconWithText IconComponent={Clock3} title={`Thời lượng ${'dcc'}`} />
        <IconWithText IconComponent={Infinity} title={`Học mọi lúc mọi nơi`} />
      </div>
    </Card>
  );
};

export default InfoBlockCourse;
