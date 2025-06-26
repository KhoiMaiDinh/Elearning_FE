import { Users, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CourseForm } from '@/types/courseType';
import { RatingStars } from '../rating/ratingStars';
import { formatPrice } from '../formatPrice';
import CourseLevelBadge from '../badge/courseLevelBadge';
import { useSelector } from 'react-redux';
import { RootState } from '@/constants/store';
import { useRouter } from 'next/navigation';
import ShowMoreText from './showMoreText';

type CourseDescriptionTabProps = {
  courseData: CourseForm;
  showRegister: boolean;
};

const CourseDescriptionTab: React.FC<CourseDescriptionTabProps> = ({
  courseData,
  showRegister = false,
}) => {
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const router = useRouter();
  return (
    <Card className="dark:border-slate-700 border-blue-200 shadow-xl backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge className="bg-gradient-144 text-white border-none">Mô tả Khóa học</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold  dark:text-white text-slate-800 mb-2">
            {courseData.title}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 ">{courseData.subtitle}</p>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-1">
            <RatingStars rating={courseData.avg_rating ?? 0} />
            <span className=" dark:text-slate-300 text-slate-600 ml-2">
              {courseData.avg_rating ?? 'N/A'} (128 đánh giá)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center p-3 dark:bg-slate-700/30 rounded-lg border border-blue-100 dark:border-transparent shadow-sm">
            <Users className="w-6 h-6 text-majorelleBlue mx-auto mb-2" />
            <p className=" dark:text-white text-slate-800 font-semibold">
              {(courseData.total_enrolled ?? 0) > 1000
                ? `${((courseData.total_enrolled ?? 0) / 1000).toFixed(1)}k+`
                : `${courseData.total_enrolled ?? 0}`}
            </p>
            <p className=" dark:text-slate-400 text-slate-600 text-sm">Học viên</p>
          </div>
          <div className="text-center p-3 dark:bg-slate-700/30 rounded-lg border border-blue-100 dark:border-transparent shadow-sm">
            <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <p className=" dark:text-white text-slate-900 font-semibold">12 giờ</p>
            <p className=" dark:text-slate-400 text-slate-600 text-sm">Thời lượng</p>
          </div>

          <div className="text-center p-3 dark:bg-slate-700/30 rounded-lg border border-blue-100 dark:border-transparent shadow-sm">
            <DollarSign className="w-6 h-6 text-beautyGreen mx-auto mb-2" />
            {courseData.priceFinal && courseData.priceFinal !== courseData.price ? (
              <>
                <span className="text-darkSilver dark:text-lightSilver line-through">
                  {formatPrice(courseData.price)}
                </span>
                <span className="dark:text-white text-slate-900 font-semibold">
                  {formatPrice(courseData.priceFinal)}
                </span>
              </>
            ) : (
              <span className="dark:text-white text-slate-900 font-semibold">
                {formatPrice(courseData.price)}
              </span>
            )}
            <p className="dark:text-slate-400 text-slate-600 text-sm">Giá khóa học</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <span className=" dark:text-slate-400 text-slate-600">Giảng viên:</span>
            <span className="text-black dark:text-white font-medium">
              {courseData.instructor?.user?.last_name} {courseData.instructor?.user?.first_name}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <span className=" dark:text-slate-400 text-slate-600">Cấp độ:</span>
            <CourseLevelBadge level={courseData.level} />
          </div>
          <div className="flex items-start space-x-3 flex-col">
            <span className=" dark:text-slate-400 text-slate-600">Mô tả</span>
            <ShowMoreText text={courseData.description} initialLines={3} />
          </div>
        </div>

        {showRegister && (
          <div className="flex space-x-3">
            <Button
              className="flex-1 bg-custom-gradient-button-violet hover:brightness-105 dark:text-white shadow shadow-majorelleBlue"
              onClick={() => {
                if (userInfo.id) {
                  router.push(`/checkout/${courseData.id}`);
                } else {
                  router.push('/login');
                }
              }}
            >
              Đăng ký ngay
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseDescriptionTab;
