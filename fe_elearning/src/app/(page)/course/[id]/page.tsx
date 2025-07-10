'use client';
import AnimateWrapper from '@/components/animations/animateWrapper';
import InfoBlockCourse from '@/components/course/infoBlockCourse';
import InfoCourse from '@/components/course/infoCourse';
import { ShareDialog } from '@/components/course/ShareDialog';
import { RootState } from '@/constants/store';
import { CourseForm } from '@/types/courseType';
import { APIGetCourseById, APIGetEnrolledCourse, APIGetFullCourse } from '@/utils/course';
import { useParams, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Edit, Eye, Loader2, Share2, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { APIGetCouponByCourse } from '@/utils/coupon';
import { CouponType } from '@/types/couponType';
import { useSearchParams } from 'next/navigation';
import { APIGetInstructorRatings } from '@/utils/rating';
import { ReviewCourseType } from '@/types/reviewCourseType';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RatingStars } from '@/components/rating/ratingStars';
import Popup from '@/components/courseDetails/popup';

const Page = () => {
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const { id: rawId } = useParams();
  const id = Array.isArray(rawId) ? rawId[0] : rawId; // Ensure `id` is a string
  const searchParams = useSearchParams();
  const ratingParam = searchParams.get('rating');
  const [courseData, setCourseData] = useState<CourseForm>();
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0);
  const [totalLessons, setTotalLessons] = useState(0);
  const [coupons, setCoupons] = useState<CouponType[]>([]);
  const [showRatingPopup, setShowRatingPopup] = useState<boolean>(false);
  const [selectedRating, setSelectedRating] = useState<ReviewCourseType | null>(null);
  const [allRatings, setAllRatings] = useState<ReviewCourseType[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (userInfo.id) {
      if (userInfo.id === courseData?.instructor?.user?.id) {
        setIsOwner(true);
      }
    }
  }, [userInfo, courseData]);

  const handleGetDetailCourse = useCallback(async () => {
    setLoading(true);
    const response = await APIGetCourseById(id || '', {
      with_sections: true,
      with_thumbnail: true,
    });
    if (response && response.data) {
      setCourseData(response.data);
    }
    setLoading(false);
  }, [id]);

  const handleGetEnrolledCourse = useCallback(async () => {
    setLoading(true);
    const response = await APIGetEnrolledCourse();
    if (response && response.data) {
      setIsRegistered(response.data.some((item: any) => item.id === id));
    }
    setLoading(false);
  }, [id]);

  const handleGetCouponByCourse = useCallback(async () => {
    const response = await APIGetCouponByCourse(id || '');
    if (response && response?.data) {
      setCoupons(response.data);
    }
  }, [id]);

  const handleGetRatings = useCallback(async () => {
    try {
      const response = await APIGetInstructorRatings({ limit: 100 }); // Get more ratings
      if (response && response.data) {
        setAllRatings(response.data);
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  }, []);

  const handleGetRatingForPopup = useCallback(
    (userId: string) => {
      // Find rating by user_id and course_id
      const rating = allRatings.find((r) => r.user_id === userId && r.course_id === id);
      if (rating) {
        setSelectedRating(rating);
        setShowRatingPopup(true);
      }
    },
    [allRatings, id]
  );

  useEffect(() => {
    // handleGetCourseById();
    handleGetDetailCourse();
    handleGetEnrolledCourse();
  }, []);

  useEffect(() => {
    if (isOwner) {
      handleGetRatings();
    }
  }, [isOwner, handleGetCouponByCourse, handleGetRatings]);

  // Handle rating parameter from URL
  useEffect(() => {
    if (ratingParam && allRatings.length > 0) {
      handleGetRatingForPopup(ratingParam);
    }
  }, [ratingParam, allRatings, handleGetRatingForPopup]);

  const handleGetFullCourse = useCallback(async () => {
    setLoading(true);
    const response = await APIGetFullCourse(id || '');
    if (response && response.data) {
      setCourseData(response.data);
    }
    // setLoading(false); // Don't forget to stop loading
  }, [id]);

  useEffect(() => {
    if (isRegistered) {
      handleGetFullCourse();
    }
  }, [isRegistered, handleGetFullCourse]);

  useEffect(() => {
    handleGetCouponByCourse();
  }, []);

  useEffect(() => {
    if (courseData && userInfo) {
      const totalDuration =
        courseData.sections?.reduce(
          (total, section) =>
            total + section.items.reduce((sum, item) => sum + (item.duration_in_seconds || 0), 0),
          0
        ) || 0;
      const totalLessons =
        courseData.sections?.reduce((total, section) => total + section.items.length, 0) || 0;
      setTotalDuration(totalDuration);
      setTotalLessons(totalLessons);
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [courseData, userInfo]);

  return !loading ? (
    <div className="container mx-auto py-8 bg-AntiFlashWhite dark:bg-eerieBlack min-h-screen text-richBlack dark:text-AntiFlashWhite">
      <AnimateWrapper delay={0.2} direction="up" amount={0.01}>
        <div className="flex flex-col lg:flex-row gap-8 relative" style={{ position: 'relative' }}>
          {/* Main Content */}
          <div className="lg:w-3/4">
            {courseData && (
              <InfoCourse
                course={courseData}
                lecture={
                  courseData.instructor?.user?.first_name +
                  ' ' +
                  courseData.instructor?.user?.last_name
                }
                totalDuration={totalDuration}
                totalLessons={totalLessons}
                coupons={coupons}
                isOwner={isOwner}
              />
            )}
          </div>
          {isOwner && (
            <div
              className="lg:w-1/4 top-24 h-fit sticky"
              // style={{ position: 'sticky', top, height: 'fit-content' }}
            >
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 space-y-4 mb-0 pb-2">
                  <Button
                    variant="outline"
                    className="text-white w-full bg-custom-gradient-button-violet flex justify-between"
                    onClick={() => {
                      router.push(`/profile/lecture/course/${id}`);
                    }}
                  >
                    Chỉnh sửa khóa học
                    <Edit className="w-4 h-4 mr-2" />
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full flex justify-between"
                    onClick={() => {
                      router.push(`/course-details/${id}`);
                    }}
                  >
                    Xem khóa học
                    <Eye className="w-4 h-4 mr-2" />
                  </Button>
                  <Separator />
                  <div className="flex space-x-2">
                    <ShareDialog
                      courseTitle={courseData?.title}
                      courseSubtitle={courseData?.subtitle}
                      courseThumbnail={courseData?.thumbnail?.key}
                      courseId={id || ''}
                      trigger={
                        <Button variant="ghost" size="icon" className="flex-1">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Sidebar */}
          {!isOwner && (
            <div className="lg:w-1/4 top-24 h-fit sticky">
              <InfoBlockCourse
                thumbnail={courseData?.thumbnail?.key}
                totalDuration={totalDuration}
                id={id || ''}
                isRegistered={isRegistered}
                price={courseData?.price}
                level={courseData?.level || ''}
                totalLessons={totalLessons}
                courseProgress={courseData?.course_progress?.progress}
                courseTitle={courseData?.title}
                courseSubtitle={courseData?.subtitle}
                // courseProgress={0.00001}
              />
            </div>
          )}

          {/* Rating Detail Popup */}
          {showRatingPopup && selectedRating && (
            <Popup
              onClose={() => {
                setShowRatingPopup(false);
                setSelectedRating(null);
              }}
            >
              <div className="max-w-3xl mx-auto">
                <div className="flex flex-row justify-between h-full items-start">
                  <h3 className="text-xl font-semibold mb-4">Chi tiết Đánh giá</h3>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        className="rounded-full w-8 h-8 items-center justify-center flex"
                        onClick={() => {
                          setShowRatingPopup(false);
                          setSelectedRating(null);
                        }}
                      >
                        <X className="w-4 h-4 text-gray-950 dark:text-AntiFlashWhite/80" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Rating Content */}
                <Card className="mb-6 dark:bg-slate-800/30 bg-white/90 dark:border-slate-700 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex space-x-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={
                            selectedRating.user?.profile_image?.key
                              ? `${process.env.NEXT_PUBLIC_BASE_URL_IMAGE}${selectedRating.user?.profile_image?.key}`
                              : ''
                          }
                        />
                        <AvatarFallback className="bg-orange-600 text-white">
                          {selectedRating.user?.first_name?.[0] || ''}
                          {selectedRating.user?.last_name?.[0] || ''}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-lg dark:text-white text-slate-800">
                              Đánh giá từ {selectedRating.user?.first_name}{' '}
                              {selectedRating.user?.last_name}
                            </h4>
                            <div className="flex items-center gap-2">
                              <RatingStars rating={selectedRating.rating || 0} />
                              <span className="text-sm dark:text-slate-400 text-slate-600">
                                {selectedRating.rating || 0}/5 sao
                              </span>
                              <span className="text-sm dark:text-slate-400 text-slate-600">•</span>
                              <span className="text-sm dark:text-slate-400 text-slate-600">
                                {new Date(selectedRating.createdAt || '').toLocaleString('vi-VN', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="dark:text-slate-300 text-slate-700 leading-relaxed mb-4">
                          <p>
                            {selectedRating.rating_comment
                              ? `"${selectedRating.rating_comment}"`
                              : 'Người dùng không để lại bình luận cụ thể.'}
                          </p>
                        </div>

                        {/* Course Info */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                          <h5 className="font-medium dark:text-white text-slate-800 mb-1">
                            Khóa học được đánh giá:
                          </h5>
                          <p className="text-sm dark:text-slate-300 text-slate-600">
                            {selectedRating.course?.title || courseData?.title}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </Popup>
          )}
        </div>
      </AnimateWrapper>
    </div>
  ) : (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="w-10 h-10 animate-spin" />
    </div>
  );
};

export default Page;
