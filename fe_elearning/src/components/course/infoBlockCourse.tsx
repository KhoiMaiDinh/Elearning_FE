'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import {
  Clock3,
  Gauge,
  Infinity,
  PlayCircle,
  TableIcon as TableOfContents,
  Heart,
  Share2,
} from 'lucide-react';
import PieChartProgress from '../chart/pieChartProgress';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { formatPrice } from '../formatPrice';
import { useSelector } from 'react-redux';
import type { RootState } from '@/constants/store';
import { formatDuration } from '@/helpers';
import IconWithText from './iconWithText';
import { ShareDialog } from './ShareDialog';

type infoBlockCourse = {
  id: string;
  isRegistered: boolean;
  progress?: number;
  price?: number;
  level?: string;
  totalLessons?: number;
  courseProgress?: number;
  thumbnail?: any;
  totalDuration?: number;
  courseTitle?: string;
  courseSubtitle?: string;
};

const InfoBlockCourse: React.FC<infoBlockCourse> = ({
  id,
  isRegistered,
  price,
  level,
  totalLessons,
  courseProgress,
  thumbnail,
  totalDuration,
  courseTitle,
  courseSubtitle,
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

  const getLevelColor = () => {
    switch (level) {
      case 'BEGINNER':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'INTERMEDIATE':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'ADVANCED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto shadow-lg border-0 bg-white dark:bg-gray-900">
      {isRegistered ? (
        // Registered User Section
        <div className="p-6">
          {courseProgress !== 0 && courseProgress && (
            <>
              <div className="mb-6">
                <PieChartProgress courseProgress={30} />
              </div>
            </>
          )}

          <Button
            size="lg"
            className="w-full bg-custom-gradient-button-violet dark:bg-custom-gradient-button-blue hover:brightness-110 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] mb-3"
            onClick={() => router.push(`/course-details/${id}`)}
          >
            {courseProgress !== 0 && courseProgress
              ? 'Tiếp tục học'
              : courseProgress === 100 && courseProgress
                ? 'Đã hoàn thành'
                : 'Bắt đầu học'}
          </Button>

          {/* Share Button for Registered Users */}
          <ShareDialog
            courseTitle={courseTitle}
            courseSubtitle={courseSubtitle}
            courseThumbnail={thumbnail}
            courseId={id}
            trigger={
              <Button
                variant="outline"
                size="lg"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300"
              >
                <Share2 className="w-4 h-4" />
                Chia sẻ khóa học
              </Button>
            }
          />
        </div>
      ) : (
        // Unregistered User Section
        <>
          <CardHeader className="pb-4">
            <div className="text-center">
              <Badge
                variant="secondary"
                className="mb-3 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                Học thử miễn phí
              </Badge>
              <div
                className="relative group cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                onClick={() => router.push(`/course-details/${id}`)}
              >
                <div className="aspect-video relative">
                  <img
                    src={`${process.env.NEXT_PUBLIC_BASE_URL_IMAGE || ''}${thumbnail || ''}`}
                    alt="Học thử"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center group-hover:bg-black/50 transition-colors duration-300">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 mb-3 group-hover:scale-110 transition-transform duration-300">
                      <PlayCircle size={32} className="text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {formatPrice(Number(price))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Truy cập trọn đời</p>
            </div>

            <Button
              size="lg"
              className="w-full bg-custom-gradient-button-violet dark:bg-custom-gradient-button-blue hover:brightness-110 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] mb-3"
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

            {/* Share Button for Unregistered Users */}
            <ShareDialog
              courseTitle={courseTitle}
              courseSubtitle={courseSubtitle}
              courseThumbnail={thumbnail}
              courseId={id}
              trigger={
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300"
                >
                  <Share2 className="w-4 h-4" />
                  Chia sẻ khóa học
                </Button>
              }
            />
          </CardContent>
        </>
      )}

      <Separator className="" />
    </Card>
  );
};

export default InfoBlockCourse;
