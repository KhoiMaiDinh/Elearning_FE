'use client';

import { Star, Users, Heart, Clock, BookOpen } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import CourseMain from './courseMain';
import type { CourseForm } from '@/types/courseType';
import { APIGetReview } from '@/utils/comment';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { formatPrice } from '../formatPrice';
import Popup from '../courseDetails/popup';
import ReviewListUser from './reviewListUser';
import { APIAddFavoriteCourse, APIRemoveFavoriteCourse } from '@/utils/course';
import { useSelector } from 'react-redux';
import { RootState } from '@/constants/store';
import { useRouter } from 'next/navigation';
import { LoginRequiredPopup } from '../alert/LoginRequire';

type InfoCourseProps = {
  lecture: string;
  course: CourseForm;
};

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
    }
  }, [course.id]);

  useEffect(() => {
    if (course?.level === 'BEGINNER') {
      setLevelShow('Cơ bản');
    } else if (course?.level === 'INTERMEDIATE') {
      setLevelShow('Trung bình');
    } else if (course?.level === 'ADVANCED') {
      setLevelShow('Nâng cao');
    }
  }, [course?.level]);

  return (
    <div className="flex flex-col w-full font-sans md:gap-8 gap-4">
      <div className="flex flex-col font-sans md:flex-row gap-6 w-full">
        {/* Course Image */}
        <div className="relative w-full md:w-1/3 rounded-xl overflow-hidden shadow-md">
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_URL_IMAGE || ''}${course?.thumbnail?.key || ''}`}
            alt={course?.title || 'Khóa học'}
            className="w-full h-auto aspect-video object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Course Content */}
        <div className="flex flex-col justify-start gap-4 font-sans w-full md:w-2/3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <h2 className="font-bold  font-sans text-xl md:text-2xl lg:text-3xl text-eerieBlack dark:text-AntiFlashWhite">
              {course?.title}
            </h2>

            {/* Favorites Button */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 dark:text-gray-400 font-sans">Giảng viên</span>
              <span className="text-base font-medium text-black dark:text-white font-sans">
                {lecture}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 dark:text-gray-400 font-sans">Giá</span>
              <span className="text-lg font-bold text-goGreen dark:text-goGreen font-sans">
                {formatPrice(Number(course?.price))}
              </span>
            </div>
          </div>

          {/* Reviews Link */}
          <button
            onClick={() => setShowReviews(true)}
            className="text-majorelleBlue hover:text-LavenderIndigo underline text-sm font-medium transition-colors self-start mt-2 font-sans"
          >
            Xem đánh giá ({reviews.length})
          </button>
        </div>
      </div>

      {/* Subtitle */}
      <div className="flex flex-col font-sans bg-gray-50 dark:bg-gray-800/30 p-4 rounded-lg">
        <p className="font-medium text-gray-700 dark:text-gray-300 md:text-base text-sm font-sans">
          {course?.subtitle}
        </p>
      </div>

      {/* Course Description */}
      <div className="flex flex-col font-sans gap-3">
        <h3 className="font-bold text-lg md:text-xl text-eerieBlack dark:text-AntiFlashWhite font-sans">
          Mô tả khóa học
        </h3>
        <div
          className="prose prose-sm md:prose-base dark:prose-invert max-w-none font-sans"
          dangerouslySetInnerHTML={{ __html: course?.description || '' }}
        ></div>
      </div>

      {/* Course Content */}
      <div className="flex flex-col font-sans gap-3 mt-2">
        <h3 className="font-bold text-lg md:text-xl text-eerieBlack dark:text-AntiFlashWhite font-sans  ">
          Nội dung khóa học
        </h3>

        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>{course.sections?.length || 0} chương</span>
          <span>•</span>
          <span>{totalLessons} bài học</span>
          <span>•</span>
          <span>Thời lượng {formatDuration(totalDuration)}</span>
        </div>

        <div className="flex flex-col">
          <CourseMain course={course} />
        </div>
      </div>

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
