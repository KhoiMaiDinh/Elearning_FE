'use client';

import React, { useState, useEffect, useCallback } from 'react';
import VideoPlayer from '@/components/courseDetails/videoPlayer';
import CourseTabs from '@/components/courseDetails/courseTab';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { CourseForm, CourseItem, Section } from '@/types/courseType';
import CourseItemList from '@/components/courseDetails/lessonList';
import AnimateWrapper from '@/components/animations/animateWrapper';
import { APIGetFullCourse, APIGetEnrolledCourse, APIGetCourseById } from '@/utils/course';
import { useParams, useRouter } from 'next/navigation';
import ButtonReview from '@/components/courseDetails/buttonReview';
import ButtonMore from '@/components/courseDetails/buttonMore';
import { useSelector } from 'react-redux';
import { RootState } from '@/constants/store';
import { Button } from '@/components/ui/button';

// Hàm helper để kiểm tra và lấy video URL
const _getVideoUrl = (item: CourseItem | Section | undefined): string | undefined => {
  if (!item) return undefined;

  // Check if it's a CourseItem with a video
  if ('video' in item && item.video) {
    return item.video.id;
  }

  // Check if it's a Section with items that have videos
  if ('items' in item && item.items && item.items.length > 0) {
    const firstItem = item.items[0];
    if (firstItem.video) {
      return firstItem.video.id;
    }
  }

  return undefined;
};

const LearnPage = () => {
  const { id } = useParams();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const router = useRouter();
  const [courseData, setCourseData] = useState<CourseForm | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const [currentCourseItem, setCurrentCourseItem] = useState<CourseItem | undefined>(undefined);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const [sections, setSections] = useState<Section[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if (userInfo.id && courseData?.instructor?.user?.id) {
      setIsOwner(userInfo.id === courseData.instructor.user.id);
    }
  }, [userInfo, courseData]);

  const handleGetCourseData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await APIGetFullCourse(id as string);
      if (response?.status === 200) {
        setCourseData(response?.data);
        const sortedSections = response.data.sections.sort((a: Section, b: Section) =>
          a.position.localeCompare(b.position)
        );
        setSections(sortedSections);
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const handleGetEnrolledCourse = useCallback(async () => {
    const response = await APIGetEnrolledCourse();
    if (response?.status === 200) {
      setIsRegistered(response?.data?.some((item: any) => item.id === id));
    }
  }, [id]);

  const handleGetCourseDataNotEnrolled = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await APIGetCourseById(id as string, {
        with_sections: true,
        with_thumbnail: true,
      });
      if (response?.status === 200) {
        setCourseData(response?.data);
        const sortedSections = response.data.sections.sort((a: Section, b: Section) =>
          a.position.localeCompare(b.position)
        );
        setSections(sortedSections);
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    handleGetEnrolledCourse();
    if (isRegistered || isOwner) {
      handleGetCourseData();
    } else {
      handleGetCourseDataNotEnrolled();
    }
  }, [
    id,
    isRegistered,
    isOwner,
    handleGetEnrolledCourse,
    handleGetCourseData,
    handleGetCourseDataNotEnrolled,
  ]);

  useEffect(() => {
    if (courseData?.sections && sections) {
      if (isRegistered || isOwner) {
        // For registered users or owner, show first video from first section
        const firstSection = sections[0];
        if (firstSection && firstSection.items && firstSection.items.length > 0) {
          setCurrentCourseItem(firstSection.items[0]);
        }
      } else {
        // For unregistered users, find first preview video
        let previewItem: CourseItem | undefined;
        for (const section of sections) {
          const previewInSection = section.items?.find((item) => item.is_preview);
          if (previewInSection) {
            previewItem = previewInSection;
            break;
          }
        }
        setCurrentCourseItem(previewItem);
      }
    }
  }, [courseData, sections, isRegistered, isOwner]);

  useEffect(() => {
    if (currentCourseItem?.video) {
      setVideoUrl(currentCourseItem?.video?.key);
    }
  }, [currentCourseItem]);

  useEffect(() => {
    if (userInfo.id) {
      router.push(`/course-details/${id}`);
    } else {
      router.push('/login');
    }
  }, [userInfo.id]);

  return (
    <AnimateWrapper delay={0.2} direction="up">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="animate-spin" size={24} />
        </div>
      ) : (
        <div className="min-h-screen bg-AntiFlashWhite p-4 gap-4 flex flex-col dark:bg-eerieBlack text-richBlack dark:text-AntiFlashWhite ">
          <div className="flex flex-col lg:flex-row gap-4 ">
            <p className="text-2xl font-bold">{courseData?.title}</p>
          </div>
          <div className="flex flex-col lg:flex-row gap-4 ">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden mb-4 p-2 bg-majorelleBlue text-white rounded-full"
            >
              {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>

            <div
              className={`${
                isSidebarOpen ? 'w-full lg:w-1/4' : 'w-0 lg:w-16'
              } transition-all duration-300 bg-white dark:bg-richBlack rounded-lg shadow-md overflow-hidden`}
            >
              {courseData?.sections && (
                <CourseItemList
                  isRegistered={isRegistered || isOwner}
                  sections={courseData.sections}
                  currentCourseItemId={currentCourseItem?.title || ''}
                  onCourseItemSelect={(courseItem) => setCurrentCourseItem(courseItem)}
                  isExpanded={isSidebarOpen}
                  isOwner={isOwner}
                />
              )}
            </div>

            <div className="flex-1">
              {currentCourseItem &&
              videoUrl &&
              (isRegistered || isOwner || (!isRegistered && currentCourseItem.is_preview)) ? (
                <VideoPlayer
                  videoUrl={process.env.NEXT_PUBLIC_BASE_URL_VIDEO + videoUrl}
                  title={currentCourseItem.title}
                  coverPhoto={courseData?.thumbnail?.key}
                  lecture_id={currentCourseItem.id}
                  progress={currentCourseItem.progresses?.[0]?.watch_time_in_percentage}
                />
              ) : (
                <div className="p-4 text-center bg-white dark:bg-richBlack rounded-lg shadow-md">
                  <p className="text-lg font-medium">
                    {!isRegistered && !isOwner
                      ? 'Bạn cần đăng ký khóa học để xem nội dung này'
                      : 'Không có video để phát cho mục này.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {courseData && (isRegistered || isOwner) && (
            <div className="">
              <CourseTabs
                currentCourseItem={currentCourseItem}
                description={courseData.description || ''}
                sections={courseData.sections}
                lecture={courseData.instructor}
                rating={courseData.avg_rating}
                enrolledStudents={courseData.total_enrolled}
                price={courseData.price}
                priceFinal={courseData.priceFinal}
                isOwner={isOwner}
              />
            </div>
          )}

          {!isRegistered && !isOwner && (
            <div className="p-4 text-center bg-white dark:bg-richBlack rounded-lg shadow-md">
              <Button
                variant="outline"
                className="bg-custom-gradient-button-violet dark:bg-custom-gradient-button-blue hover:brightness-125 text-white"
                onClick={() => {
                  const path = userInfo.id ? `/checkout/${id}` : '/login';
                  router.push(path);
                }}
              >
                Đăng ký khóa học
              </Button>
            </div>
          )}
        </div>
      )}

      {courseData?.id && !isOwner && isRegistered && (
        <>
          <ButtonReview course_id={courseData?.id || ''} />
          <ButtonMore
            course_id={courseData?.id || ''}
            label={`Bạn đang ở bài học ${currentCourseItem?.title}, chương ${
              sections.find((section) => section.items?.includes(currentCourseItem as CourseItem))
                ?.title
            }`}
          />
        </>
      )}
    </AnimateWrapper>
  );
};

export default LearnPage;
