'use client';

import { Star, Users, Heart, Clock, BookOpen, LibraryBig, Share2 } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import CourseMain from './courseMain';
import type { CourseForm } from '@/types/courseType';
import { APIGetReview } from '@/utils/comment';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

import Popup from '../courseDetails/popup';
import ReviewListUser from './reviewListUser';
import {
  APIAddFavoriteCourse,
  APIGetFavoriteCourse,
  APIRemoveFavoriteCourse,
} from '@/utils/course';
import { useSelector } from 'react-redux';
import { RootState } from '@/constants/store';
import { useRouter } from 'next/navigation';
import { LoginRequiredPopup } from '../alert/LoginRequire';
import { ShineBorder } from '../magicui/shine-border';
import { Card, CardContent, CardHeader } from '../ui/card';
import CourseRequirements from '../courseDetails/courseRequirements';
import CourseOutcomes from '../courseDetails/courseOutcomes';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import ViewMoreButton from '../button/viewMoreButton';
import { ShareDialog } from './ShareDialog';

import { formatPrice } from '../formatPrice';
import { APIGetRecommendationByCourseId } from '@/utils/recommendation';
import AnimateWrapper from '../animations/animateWrapper';
import CoursesBlock from '../block/courses-block';
import ShowMoreText from '../courseDetails/showMoreText';
import { CouponType } from '@/types/couponType';
import CouponSection from './CouponSection';
import { APIGetEnrolledCourse } from '@/utils/course';

type InfoCourseProps = {
  lecture: string;
  course: CourseForm;
  totalDuration: number;
  totalLessons: number;
  coupons?: CouponType[];
  isOwner?: boolean;
};

const InfoCourse: React.FC<InfoCourseProps> = ({
  lecture,
  course,
  totalDuration,
  coupons,
  totalLessons,
  isOwner,
}) => {
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const router = useRouter();

  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleFeatureClick = () => {
    if (!userInfo?.id) {
      setShowLoginPopup(true);
    }
  };
  // Format duration in hours and minutes
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const [levelShow, setLevelShow] = useState<string | null>(null);
  const [showReviews, setShowReviews] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [recommendation, setRecommendation] = useState<CourseForm[]>([]);

  const handleGetReviews = async (id: string) => {
    try {
      const response = await APIGetReview(id);
      if (response?.status === 200) {
        setReviews(response.data);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const handleGetRecommendation = useCallback(async () => {
    const response = await APIGetRecommendationByCourseId(course.id || '');
    if (response?.status === 200) {
      setRecommendation(response?.data || []);
    }
  }, [course.id]);

  useEffect(() => {
    handleGetRecommendation();
  }, [handleGetRecommendation]);

  const toggleFavorite = () => {
    if (isFavorite) {
      handleRemoveFavorite();
    } else {
      handleAddFavorite();
    }
  };

  const handleAddFavorite = async () => {
    if (course.id) {
      const response = await APIAddFavoriteCourse(course.id);
      if (response?.status === 201) {
        setIsFavorite(true);
      }
    } else {
      handleFeatureClick();
    }
  };

  const handleRemoveFavorite = async () => {
    if (course.id && userInfo?.id) {
      const response = await APIRemoveFavoriteCourse(course.id);
      if (response?.status === 204) {
        setIsFavorite(false);
      }
    } else {
      handleFeatureClick();
    }
  };

  const handleGetEnrolledCourse = async () => {
    try {
      const response = await APIGetEnrolledCourse();
      if (response && response.data) {
        setIsRegistered(response.data.some((item: any) => item.id === course.id));
      }
    } catch (error) {
      console.error('Error checking enrollment status:', error);
    }
  };

  useEffect(() => {
    if (course.id) {
      handleGetReviews(course.id);
      handleGetFavoriteCourse();
      handleGetEnrolledCourse();
    }
  }, [course.id]);

  const handleGetFavoriteCourse = async () => {
    const response = await APIGetFavoriteCourse();
    if (response && response.data) {
      setIsFavorite(response.data.some((item: any) => item.id === course.id));
    }
  };

  useEffect(() => {
    if (course?.level === 'BEGINNER') {
      setLevelShow('Cơ bản');
    } else if (course?.level === 'INTERMEDIATE') {
      setLevelShow('Trung bình');
    } else if (course?.level === 'ADVANCED') {
      setLevelShow('Nâng cao');
    }
  }, [course?.level]);

  const sectionTitleClassName = cn(
    'font-semibold text-lg md:text-xl dark:text-AntiFlashWhite  text-slate-800'
  );

  const subtitleClassName = cn(
    'font-medium text-gray-700 dark:text-gray-300 md:text-base text-sm font-sans break-words w-full'
  );

  return (
    <div className="flex flex-col w-full font-sans gap-4">
      <Card className=" rounded-lg relative overflow-hidden">
        <ShineBorder
          shineColor={['#545AE8', '#8844FF', '#B781FF']}
          borderWidth={1.5}
          duration={1}
        />

        <CardContent>
          <div className="flex flex-col font-sans md:flex-row gap-6 w-full  pt-8 rounded-lg">
            {/* Course Image */}
            <div className="relative rounded-xl overflow-hidden shadow-md aspect-video w-full md:w-2/5 shrink-0">
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_URL_IMAGE || ''}${course?.thumbnail?.key || ''}`}
                alt={course?.title || 'Khóa học'}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300"
              />
            </div>

            {/* Course Content */}
            <div className="flex flex-col justify-start gap-4 font-sans w-full md:w-3/5 ">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex flex-1 flex-col min-w-0">
                  <h2 className="font-bold font-sans text-xl md:text-2xl text-eerieBlack dark:text-AntiFlashWhite break-words w-full">
                    {course.title}
                  </h2>
                  <p className={subtitleClassName}>{course?.subtitle}</p>
                </div>

                {/* Favorites Button */}
              </div>

              {/* Course Stats */}
              <div className="flex flex-wrap items-center gap-3 font-sans">
                {/* Rating */}
                <div className="flex items-center gap-1 px-3 py-1.5 bg-champagne dark:bg-black50 rounded-full border border-white">
                  <Star size={14} color="#FFCD29" fill="#FFCD29" />
                  <span className="text-xs font-medium text-Sunglow">
                    {course?.avg_rating ? course?.avg_rating : 'N/A'}
                  </span>
                </div>

                {/* Level */}
                <div className="flex items-center font-sans gap-1 px-3 py-1.5 bg-teaGreen dark:bg-black50 rounded-full border border-white">
                  <span className="text-xs font-medium text-goGreen">{levelShow}</span>
                </div>

                {/* Students */}
                <div className="flex items-center font-sans gap-1 px-3 py-1.5 bg-majorelleBlue20 dark:bg-black50 rounded-full border border-white">
                  <Users size={14} className={'text-majorelleBlue'} />
                  <span className="text-xs font-medium text-majorelleBlue">
                    {course?.total_enrolled
                      ? course?.total_enrolled > 1000
                        ? `${(course?.total_enrolled / 1000).toFixed(1)}k+`
                        : `${course?.total_enrolled}`
                      : 'N/A'}
                  </span>
                </div>

                {/* Lessons */}
                <div className="flex items-center font-sans gap-1 px-3 py-1.5 bg-blue-50 dark:bg-black50 rounded-full border border-white">
                  <BookOpen size={14} className="text-blue-500" />
                  <span className="text-xs font-medium text-blue-500">{totalLessons} bài học</span>
                </div>

                {/* Duration */}
                <div className="flex items-center font-sans gap-1 px-3 py-1.5 bg-purple-50 dark:bg-black50 rounded-full border border-white">
                  <Clock size={14} className="text-purple-500" />
                  <span className="text-xs font-medium text-purple-500">
                    {formatDuration(totalDuration || 0)}
                  </span>
                </div>
              </div>

              {/* Instructor and Price */}
              <div className="grid grid-cols-2 gap-2 mt-2 justify-between">
                <div className="flex flex-col ">
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-sans">
                    Giảng viên
                  </span>
                  <span className="text-base font-medium text-black dark:text-white font-sans">
                    {lecture}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-sans">Giá</span>
                  <span className="text-bases font-bold text-goGreen dark:text-goGreen font-sans">
                    {formatPrice(Number(course?.price))}
                  </span>
                </div>
              </div>

              {/* Reviews Link */}
              <div className="flex flex-row justify-between">
                <button
                  onClick={() => setShowReviews(true)}
                  className="text-majorelleBlue hover:text-LavenderIndigo underline text-sm font-medium transition-colors self-start mt-2 font-sans"
                >
                  Xem đánh giá ({reviews.length})
                </button>
                <div className="flex gap-2">
                  <ShareDialog
                    courseTitle={course.title}
                    courseSubtitle={course.subtitle}
                    courseThumbnail={course.thumbnail?.key}
                    courseId={course.id || ''}
                    trigger={
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center font-sans gap-2 transition-all self-start hover:text-blue-500 hover:border-blue-500"
                      >
                        <Share2 size={16} className="text-current" />
                        Chia sẻ
                      </Button>
                    }
                  />
                  <Button
                    onClick={toggleFavorite}
                    variant={isFavorite ? 'default' : 'outline'}
                    size="sm"
                    className={cn(
                      'flex items-center font-sans gap-2 transition-all self-start',
                      isFavorite
                        ? 'bg-red-500 hover:bg-red-600 border-red-500 text-white'
                        : 'hover:text-red-500 hover:border-red-500'
                    )}
                  >
                    <Heart
                      size={16}
                      className={cn(
                        'transition-all',
                        isFavorite ? 'fill-white text-white' : 'text-current'
                      )}
                    />
                    {isFavorite ? 'Đã lưu vào yêu thích' : 'Lưu vào yêu thích'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {coupons && isOwner && (
        <CouponSection
          coupons={coupons}
          userInfo={userInfo}
          sectionTitleClassName={sectionTitleClassName}
        />
      )}

      {/* Course Description */}
      <Card className="flex flex-col font-sans">
        <CardHeader className="flex flex-col ">
          <h3 className={sectionTitleClassName}>Mô Tả</h3>
        </CardHeader>
        <CardContent>
          <ShowMoreText text={course?.description || ''} />
        </CardContent>
      </Card>

      {/* Course Content */}
      <Card className="flex flex-col font-sans">
        <CardHeader className="flex flex-col">
          <h3 className={sectionTitleClassName}>
            Nội Dung
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
              <span>{course.sections?.length || 0} chương</span>
              <span>•</span>
              <span>{totalLessons} bài học</span>
              <span>•</span>
              <span>Thời lượng {formatDuration(totalDuration)}</span>
            </div>
          </h3>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col ">
            <CourseMain course={course} isRegistered={isRegistered} isOwner={isOwner} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="flex flex-col font-sans">
          <CardHeader className="flex flex-col">
            <h3 className={sectionTitleClassName}>Kiến thức cần biết trước khi bắt đầu</h3>
          </CardHeader>
          <CardContent>
            <CourseRequirements requirements={course.requirements} />
          </CardContent>
        </Card>
        <Card className="flex flex-col font-sans">
          <CardHeader className="flex flex-col">
            <h3 className="font-semibold text-lg md:text-xl text-eerieBlack dark:text-AntiFlashWhite font-sans">
              Bạn nhận được gì từ khóa học này
            </h3>
          </CardHeader>
          <CardContent>
            <CourseOutcomes outcomes={course.outcomes} />
          </CardContent>
        </Card>
      </div>

      {/* Instructor Section */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className={'flex flex-row justify-between'}>
            <h3 className={sectionTitleClassName}>Giảng viên</h3>
            <ViewMoreButton
              onClick={() => {
                router.push(`/lecturer/${course?.instructor?.user?.username}`);
              }}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <div className="flex items-start space-x-6 mb-3">
              <Avatar className="w-16 h-16">
                <AvatarImage
                  src={`${process.env.NEXT_PUBLIC_BASE_URL_IMAGE || ''}${course?.instructor?.user?.profile_image?.key || ''}`}
                />
                <AvatarFallback>
                  {' '}
                  {course?.instructor?.user.last_name?.[0]}
                  {course?.instructor?.user.first_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 flex flex-row w-full justify-between ">
                <div className="flex flex-col">
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">{`${course?.instructor?.user.last_name || ''} ${course?.instructor?.user.first_name || ''}`}</h3>
                  <p className={subtitleClassName}>{course?.instructor?.headline}</p>
                </div>
                <div className="flex gap-1 flex-row">
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-champagne dark:bg-black50 rounded-full border border-white h-fit">
                    <Star size={14} color="#FFCD29" fill="#FFCD29" />
                    <span className="text-xs font-medium text-Sunglow">
                      {course?.avg_rating ? course?.avg_rating : 'N/A'}
                    </span>
                  </div>

                  {/* Students */}
                  <div className="flex items-center font-sans gap-1 px-3 py-1.5 bg-majorelleBlue20 dark:bg-black50 rounded-full border border-white h-fit">
                    <Users size={14} color="#545ae8" />
                    <span className="text-xs font-medium text-majorelleBlue">
                      {course?.total_enrolled
                        ? course?.total_enrolled > 1000
                          ? `${(course?.total_enrolled / 1000).toFixed(1)}k+`
                          : `${course?.total_enrolled} học viên`
                        : 'N/A'}
                    </span>
                  </div>

                  {/* Lessons */}
                  <div className="flex items-center font-sans gap-1 px-3 py-1.5 bg-blue-50 dark:bg-black50 rounded-full border border-white h-fit">
                    <LibraryBig size={14} className="text-blue-500" />
                    <span className="text-xs font-medium text-blue-500">
                      {totalLessons} khóa học
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <ShowMoreText text={course?.instructor?.biography || ''} />
          </div>
        </CardContent>
      </Card>

      <AnimateWrapper delay={0.3} direction="up">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Khóa học tương tự
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Các khóa học tương tự có thể bạn quan tâm
            </p>
          </div>
        </div>

        {Array.isArray(recommendation) && recommendation.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6">
            {recommendation.map((course) => (
              <CoursesBlock key={course.id} {...course} />
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
                <BookOpen className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Không có khóa học tương tự
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">
                Khám phá các khóa học chất lượng cao và bắt đầu hành trình học tập của bạn ngay hôm
                nay.
              </p>
              <Button
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white dark:text-black px-8"
                onClick={() => router.push('/course')}
              >
                Khám phá khóa học
              </Button>
            </CardContent>
          </Card>
        )}
      </AnimateWrapper>

      {/* Reviews Popup */}
      {showReviews && (
        <Popup onClose={() => setShowReviews(false)}>
          <h3 className="text-lg font-semibold mb-4 font-sans">
            Tất cả đánh giá ({reviews.length})
          </h3>
          <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-2">
            {reviews.length > 0 ? (
              reviews &&
              reviews.length > 0 &&
              reviews.map((review, index) => <ReviewListUser key={index} reviews={review} />)
            ) : (
              <p className="text-center text-gray-500 py-4 font-sans">Chưa có đánh giá nào</p>
            )}
          </div>
        </Popup>
      )}

      <LoginRequiredPopup
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
        featureName="tính năng yêu thích"
      />
    </div>
  );
};

export default InfoCourse;
