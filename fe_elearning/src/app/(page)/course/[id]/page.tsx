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
import { Edit, Eye, Loader2, Share2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { APIGetRecommendationByCourseId } from '@/utils/recommendation';
import { APIGetCouponByCourse } from '@/utils/coupon';
import { CouponType } from '@/types/couponType';
import { useSearchParams } from 'next/navigation';
import { APIGetInstructorRatings } from '@/utils/rating';
import { ReviewCourseType } from '@/types/reviewCourseType';
import Popup from '@/components/courseDetails/popup';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { RatingStars } from '@/components/rating/ratingStars';
import { X } from 'lucide-react';

const Page = () => {
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const { id: rawId } = useParams();
  const id = Array.isArray(rawId) ? rawId[0] : rawId; // Ensure `id` is a string
  const searchParams = useSearchParams();
  const ratingParam = searchParams.get('rating');
  const [dataCourse, setDataCourse] = useState<CourseForm>();
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
      if (userInfo.id === dataCourse?.instructor?.user?.id) {
        setIsOwner(true);
      }
    }
  }, [userInfo, dataCourse]);

  const handleGetDetailCourse = useCallback(async () => {
    setLoading(true);
    const response = await APIGetCourseById(id || '', {
      with_sections: true,
      with_thumbnail: true,
    });
    if (response && response.data) {
      setDataCourse(response.data);
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
      handleGetCouponByCourse();
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
      setDataCourse(response.data);
    }
    // setLoading(false); // Don't forget to stop loading
  }, [id]);

  useEffect(() => {
    if (isRegistered) {
      handleGetFullCourse();
    }
  }, [isRegistered, handleGetFullCourse]);

  useEffect(() => {
    if (dataCourse && userInfo) {
      const totalDuration =
        dataCourse.sections?.reduce(
          (total, section) =>
            total + section.items.reduce((sum, item) => sum + (item.duration_in_seconds || 0), 0),
          0
        ) || 0;
      const totalLessons =
        dataCourse.sections?.reduce((total, section) => total + section.items.length, 0) || 0;
      setTotalDuration(totalDuration);
      setTotalLessons(totalLessons);
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [dataCourse, userInfo]);

  return !loading ? (
    <div className="container mx-auto py-8 bg-AntiFlashWhite dark:bg-eerieBlack min-h-screen text-richBlack dark:text-AntiFlashWhite">
      <AnimateWrapper delay={0.2} direction="up" amount={0.01}>
        <div className="flex flex-col lg:flex-row gap-8 relative" style={{ position: 'relative' }}>
          {/* Main Content */}
          <div className="lg:w-3/4">
            {dataCourse && (
              <InfoCourse
                course={dataCourse}
                lecture={
                  dataCourse.instructor?.user?.first_name +
                  ' ' +
                  dataCourse.instructor?.user?.last_name
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
                      courseTitle={dataCourse?.title}
                      courseSubtitle={dataCourse?.subtitle}
                      courseThumbnail={dataCourse?.thumbnail?.key}
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
                thumbnail={dataCourse?.thumbnail?.key}
                totalDuration={totalDuration}
                id={id || ''}
                isRegistered={isRegistered}
                price={dataCourse?.price}
                level={dataCourse?.level || ''}
                totalLessons={totalLessons}
                courseProgress={dataCourse?.course_progress?.progress}
                courseTitle={dataCourse?.title}
                courseSubtitle={dataCourse?.subtitle}
                // courseProgress={0.00001}
              />
            </div>
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
