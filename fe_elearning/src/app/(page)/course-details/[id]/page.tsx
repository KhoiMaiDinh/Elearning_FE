'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import VideoPlayer from '@/components/courseDetails/videoPlayer';
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

  const refreshCourseData = async () => {
    try {
      // Ensure id is string before calling API
      if (typeof id !== 'string') return;

      // Refresh course data to get updated ratings
      const response = await APIGetCourseById(id, {
        with_instructor: true,
        with_category: true,
        with_sections: false,
        with_thumbnail: true,
      });
      if (response?.status === 200) {
        setCourseData(response.data);
      }
    } catch (error) {
      console.error('Error refreshing course data:', error);
    }
  };

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
      // PRIORITY 1: If lecture parameter is provided, find and set that specific lecture
      if (lecture) {
        let foundLectureItem: CourseItem | undefined;

        for (const section of sections) {
          const lectureItem = section.items?.find((item) => item.id === lecture);
          if (lectureItem) {
            foundLectureItem = lectureItem;
            break;
          }
        }

        if (foundLectureItem) {
          setCurrentCourseItem(foundLectureItem);
          return;
        }
      }

      // PRIORITY 2: Fallback logic when no lecture parameter or lecture not found
      if (isOwner) {
        // For owner, set first available lecture from first section
        const firstSection = sections[0];
        if (firstSection?.items?.length) {
          setCurrentCourseItem(firstSection.items[0]);
        }
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
                  isOwner={isOwner}
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
                currentCommentItem={currentCommentItem}
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
          <ButtonReview course_id={courseData?.id || ''} onReviewSuccess={refreshCourseData} />
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
