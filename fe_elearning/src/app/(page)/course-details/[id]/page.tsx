'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import VideoPlayer from '@/components/player/videoPlayer';
import CourseTabs from '@/components/courseDetails/courseTab';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { CourseForm, CourseItem, Section } from '@/types/courseType';
import CourseItemList from '@/components/courseDetails/lessonList';
import AnimateWrapper from '@/components/animations/animateWrapper';
import { APIGetFullCourse, APIGetEnrolledCourse, APIGetCourseById } from '@/utils/course';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import ButtonReview from '@/components/courseDetails/buttonReview';
import ButtonMore from '@/components/courseDetails/buttonMore';
import { useSelector } from 'react-redux';
import { RootState } from '@/constants/store';
import { Button } from '@/components/ui/button';
import CourseDescriptionTab from '@/components/courseDetails/courseDescriptionTab';

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
  const searchParams = useSearchParams();
  const lecture = searchParams.get('lecture');
  const comment = searchParams.get('comment');
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const router = useRouter();

  // Combined loading state
  const [loadingStates, setLoadingStates] = useState({
    isLoading: true,
    isLoadingRegister: false,
  });

  // Main course data state
  const [courseData, setCourseData] = useState<CourseForm | undefined>(undefined);
  const [currentCourseItem, setCurrentCourseItem] = useState<CourseItem | undefined>(undefined);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const [isRegistered, setIsRegistered] = useState(false);
  const [currentCommentItem, setCurrentCommentItem] = useState<string | undefined>('');

  // Derived states using useMemo
  const sections = useMemo(() => {
    if (!courseData?.sections) return [];
    return courseData.sections.sort((a: Section, b: Section) =>
      a.position.localeCompare(b.position)
    );
  }, [courseData?.sections]);

  const isOwner = useMemo(() => {
    if (!userInfo.id || !courseData?.instructor?.user?.id) return false;
    return userInfo.id === courseData.instructor.user.id;
  }, [userInfo.id, courseData?.instructor?.user?.id]);

  // API calls
  const handleGetCourseData = useCallback(async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, isLoading: true }));
      const response = await APIGetFullCourse(id as string);
      if (response?.status === 200) {
        setCourseData(response?.data);
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, isLoading: false }));
    }
  }, [id]);

  const handleGetEnrolledCourse = useCallback(async () => {
    setLoadingStates((prev) => ({ ...prev, isLoadingRegister: true }));
    try {
      const response = await APIGetEnrolledCourse();
      if (response?.status === 200) {
        setIsRegistered(response?.data?.some((item: any) => item.id === id));
      }
    } finally {
      setLoadingStates((prev) => ({ ...prev, isLoadingRegister: false }));
    }
  }, [id]);

  const handleGetCourseDataNotEnrolled = useCallback(async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, isLoading: true }));
      const response = await APIGetCourseById(id as string, {
        with_sections: true,
        with_thumbnail: true,
      });
      if (response?.status === 200) {
        setCourseData(response?.data);
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, isLoading: false }));
    }
  }, [id]);

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      await handleGetEnrolledCourse();
    };
    fetchInitialData();
  }, [handleGetEnrolledCourse]);

  // Fetch course data based on registration status
  useEffect(() => {
    if (isRegistered || isOwner) {
      handleGetCourseData();
    } else {
      handleGetCourseDataNotEnrolled();
    }
  }, [isRegistered, isOwner, handleGetCourseData, handleGetCourseDataNotEnrolled]);

  // Handle comment from URL
  useEffect(() => {
    if (comment) {
      setCurrentCommentItem(comment);
    }
  }, [comment]);

  // Set current course item based on registration status
  useEffect(() => {
    if (!courseData?.sections || !sections || loadingStates.isLoadingRegister) return;

    const setInitialCourseItem = () => {
      if (isOwner) {
        const firstSection = sections[0];
        if (!firstSection?.items?.length) return;

        if (lecture) {
          const lectureItem = firstSection.items.find((item) => item.id === lecture);
          if (lectureItem) {
            setCurrentCourseItem(lectureItem);
            return;
          }
        }
        setCurrentCourseItem(firstSection.items[0]);
      } else if (isRegistered) {
        let lectureToSet: CourseItem | undefined;

        // Find first incomplete lecture
        for (const section of sections) {
          const lectureInProgress = section.items?.find(
            (item) => (item.progresses?.[0]?.watch_time_in_percentage ?? 0) < 80
          );
          if (lectureInProgress) {
            lectureToSet = lectureInProgress;
            break;
          }
        }

        // If all complete, set to last lecture
        if (!lectureToSet) {
          const lastSectionWithItems = [...sections]
            .reverse()
            .find((s) => s.items && s.items.length > 0);
          if (lastSectionWithItems) {
            lectureToSet = lastSectionWithItems.items[lastSectionWithItems.items.length - 1];
          }
        }

        if (lectureToSet) {
          setCurrentCourseItem(lectureToSet);
        }
      } else {
        // For unregistered users, find first preview
        for (const section of sections) {
          const previewItem = section.items?.find((item) => item.is_preview);
          if (previewItem) {
            setCurrentCourseItem(previewItem);
            break;
          }
        }
      }
    };

    setInitialCourseItem();
  }, [courseData, sections, isRegistered, isOwner, loadingStates.isLoadingRegister, lecture]);

  // Update video URL when course item changes
  useEffect(() => {
    if (currentCourseItem?.video) {
      setVideoUrl(currentCourseItem.video.key);
    }
  }, [currentCourseItem]);

  // Handle authentication and routing
  useEffect(() => {
    if (!userInfo.id) {
      router.push('/login');
      return;
    }

    const queryParams = new URLSearchParams();
    if (lecture) queryParams.append('lecture', lecture);
    if (comment) queryParams.append('comment', comment);

    const url = `/course-details/${id}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    router.push(url);
  }, [userInfo.id, lecture, comment, id, router]);

  return (
    // <AnimateWrapper delay={0.2} direction="up">
    <>
      {loadingStates.isLoading || loadingStates.isLoadingRegister ? (
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="animate-spin" size={24} />
        </div>
      ) : (
        <div className="min-h-screen bg-AntiFlashWhite p-4 gap-4 flex flex-col dark:bg-eerieBlack text-richBlack dark:text-AntiFlashWhite ">
          {/* <div className="flex flex-col lg:flex-row gap-4 ">
            <p className="text-2xl font-bold">{courseData?.title}</p>
          </div> */}
          <div className="flex flex-col lg:flex-row gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2  text-white rounded-full "
            >
              {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>

            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden  ${
                isSidebarOpen ? 'h-[calc(100vh-4rem-2rem)] w-full lg:w-1/4' : 'max-h-0 w-0 lg:w-16'
              } bg-white dark:bg-richBlack rounded-lg shadow-md`}
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

            <div className="flex-1 h-[calc(100vh-4rem-2rem)] aspect-video">
              {currentCourseItem &&
              videoUrl &&
              (isRegistered || isOwner || (!isRegistered && currentCourseItem.is_preview)) ? (
                <VideoPlayer
                  src={process.env.NEXT_PUBLIC_BASE_URL_VIDEO + videoUrl}
                  title={currentCourseItem.title}
                  progress={currentCourseItem.progresses?.[0]?.watch_time_in_percentage}
                  isOwner={isOwner}
                  lecture_id={currentCourseItem.id}
                />
              ) : (
                <div className="p-4 text-center bg-white dark:bg-richBlack rounded-lg shadow-md h-full flex flex-col justify-center items-center space-y-4">
                  {/* Video placeholder skeleton */}
                  <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-gray-300 dark:text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>

                  {/* Message with subtle animation */}
                  <p className="text-lg font-medium animate-fade-in">
                    {!isRegistered && !isOwner
                      ? 'Bạn cần đăng ký khóa học để xem nội dung này'
                      : 'Không có video để phát cho mục này.'}
                  </p>

                  {/* Decorative line */}
                  <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              )}
            </div>
          </div>

          {courseData && (isRegistered || isOwner) && (
            <div className="">
              <CourseTabs
                currentCourseItem={currentCourseItem}
                courseData={courseData}
                isOwner={isOwner}
                currentCommentItem={currentCommentItem}
              />
            </div>
          )}

          {courseData && (
            <CourseDescriptionTab
              courseData={courseData}
              showRegister={!isRegistered && !isOwner}
            />
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
            label={`Bài học ${currentCourseItem?.title}, chương ${
              sections.find((section) => section.items?.includes(currentCourseItem as CourseItem))
                ?.title
            }`}
          />
        </>
      )}
    </>
    // </AnimateWrapper>
  );
};

export default LearnPage;
