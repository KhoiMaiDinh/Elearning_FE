'use client';
import AnimateWrapper from '@/components/animations/animateWrapper';
import InfoBlockCourse from '@/components/course/infoBlockCourse';
import InfoCourse from '@/components/course/infoCourse';
import { RootState } from '@/constants/store';
import { CourseForm } from '@/types/courseType';
import {
  APIGetCourseById,
  APIGetEnrolledCourse,
  APIGetFavoriteCourse,
  APIGetFullCourse,
} from '@/utils/course';
import { useParams, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';

const Page = () => {
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const { id: rawId } = useParams();
  const id = Array.isArray(rawId) ? rawId[0] : rawId; // Ensure `id` is a string
  const [dataCourse, setDataCourse] = useState<CourseForm>();
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0);
  const [totalLessons, setTotalLessons] = useState(0);
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
  useEffect(() => {
    // handleGetCourseById();
    handleGetDetailCourse();
    handleGetEnrolledCourse();
  }, [handleGetDetailCourse, handleGetEnrolledCourse]);

  const handleGetFullCourse = useCallback(async () => {
    setLoading(true);
    const response = await APIGetFullCourse(id || '');
    if (response && response.data) {
      setDataCourse(response.data);
    }
    // setLoading(false); // Don’t forget to stop loading
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
        <div className="flex flex-col lg:flex-row gap-8">
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
              />
            )}
          </div>
          {isOwner && (
            <div className="lg:w-1/4">
              <div className="flex flex-col gap-4">
                <button
                  className="bg-custom-gradient-button-violet hover:brightness-125 dark:bg-custom-gradient-button-blue text-white px-4 py-2 rounded-md"
                  onClick={() => {
                    router.push(`/profile/lecture/course/${id}`);
                  }}
                >
                  Chỉnh sửa khóa học
                </button>
                <button
                  className="bg-custom-gradient-button-violet dark:bg-custom-gradient-button-blue hover:brightness-125 text-white px-4 py-2 rounded-md"
                  onClick={() => {
                    router.push(`/profile/lecture/course`);
                  }}
                >
                  Thêm bài học
                </button>

                <button
                  className="bg-custom-gradient-button-violet dark:bg-custom-gradient-button-blue hover:brightness-125 text-white px-4 py-2 rounded-md"
                  onClick={() => {
                    router.push(`/course-details/${id}`);
                  }}
                >
                  Xem khóa học
                </button>
              </div>
            </div>
          )}

          {/* Sidebar */}
          {!isOwner && (
            <div className="lg:w-1/4">
              <InfoBlockCourse
                thumbnail={dataCourse?.thumbnail?.key}
                totalDuration={totalDuration}
                id={id || ''}
                isRegistered={isRegistered}
                price={dataCourse?.price}
                level={dataCourse?.level || ''}
                totalLessons={totalLessons}
                courseProgress={dataCourse?.course_progress?.progress}
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
