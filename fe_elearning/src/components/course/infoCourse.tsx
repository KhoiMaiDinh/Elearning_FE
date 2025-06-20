'use client';

import { Star, Users, Heart, Clock, BookOpen, LibraryBig } from 'lucide-react';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import CourseMain from './courseMain';
import type { CourseForm } from '@/types/courseType';
import { APIGetReview } from '@/utils/comment';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { formatPrice } from '../formatPrice';
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
import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import CourseRequirements from '../courseDetails/courseRequirements';
import CourseOutcomes from '../courseDetails/courseOutcomes';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import ViewMoreButton from '../button/viewMoreButton';

type InfoCourseProps = {
  lecture: string;
  course: CourseForm;
};

interface ShowMoreTextProps {
  text: string;
  collapsedHeight?: number;
}

interface ShowMoreTextProps {
  text: string;
  initialLines?: number;
}

function ShowMoreText({ text, initialLines = 3 }: ShowMoreTextProps) {
  const [open, setOpen] = useState(false);
  const [shouldShowButton, setShouldShowButton] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const el = contentRef.current;
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight || '20');
    const maxHeight = lineHeight * initialLines;

    setShouldShowButton(el.scrollHeight > maxHeight + 1);
  }, [text, initialLines]);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen} className="relative w-full">
      <div className="relative">
        <Collapsible.Content
          forceMount
          className={`relative transition-max-height duration-300 ease-in-out overflow-hidden ${
            open ? 'max-h-[1000px]' : `line-clamp-${initialLines}`
          }`}
        >
          <div
            ref={contentRef}
            className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: text }}
          />

          {/* Gradient overlay on text (only when collapsed) */}
          {!open && shouldShowButton && (
            <>
              {/* Light mode gradient */}
              <div
                className="absolute bottom-0 left-0 w-full h-8 pointer-events-none dark:hidden"
                style={{
                  backgroundImage: `linear-gradient(to top, white, transparent)`,
                }}
              />

              {/* Dark mode gradient */}
              <div
                className="absolute bottom-0 left-0 w-full h-8 pointer-events-none hidden dark:block"
                style={{
                  backgroundImage: `linear-gradient(to top, #0f0f0f, transparent)`,
                }}
              />
            </>
          )}
        </Collapsible.Content>
      </div>

      {shouldShowButton && (
        <Collapsible.Trigger asChild>
          <Button variant="ghost" size="sm" className="mt-2 px-0 text-primary">
            {open ? (
              <>
                Thu gọn <ChevronUp className="ml-1 h-4 w-4" />
              </>
            ) : (
              <>
                Xem thêm <ChevronDown className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        </Collapsible.Trigger>
      )}
    </Collapsible.Root>
  );
}

const InfoCourse: React.FC<InfoCourseProps> = ({ lecture, course }) => {
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const router = useRouter();
  const totalLessons =
    course.sections?.reduce((total, section) => total + section.items.length, 0) || 0;
  const totalDuration =
    course.sections?.reduce(
      (total, section) =>
        total + section.items.reduce((sum, item) => sum + (item.duration_in_seconds || 0), 0),
      0
    ) || 0;

  const [showLoginPopup, setShowLoginPopup] = useState(false);

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

  useEffect(() => {
    if (course.id) {
      handleGetReviews(course.id);
      handleGetFavoriteCourse();
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
                  <Users size={14} color="#545ae8" />
                  <span className="text-xs font-medium text-majorelleBlue">
                    {course?.total_enrolled
                      ? course?.total_enrolled > 1000
                        ? `${(course?.total_enrolled / 1000).toFixed(1)}k+`
                        : `${course?.total_enrolled}+`
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
                    {formatDuration(totalDuration)}
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
        </CardContent>
      </Card>

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
            <CourseMain course={course} />
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
                  src={`${process.env.NEXT_PUBLIC_BASE_URL_IMAGE || ''}${course?.instructor?.user.profile_image.key || ''}`}
                />
                <AvatarFallback>
                  {' '}
                  {userInfo.last_name?.[0]}
                  {userInfo.first_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 flex flex-row w-full justify-between ">
                <div className="flex flex-col">
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">{`${course?.instructor?.user.last_name || ''} ${course?.instructor?.user.first_name || ''}`}</h3>
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
