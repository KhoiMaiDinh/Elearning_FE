"use client";

import React, { useState, useEffect } from "react";
import VideoPlayer from "@/components/courseDetails/videoPlayer";
import CourseTabs from "@/components/courseDetails/courseTab";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { CourseForm, CourseItem, Section } from "@/types/courseType";
import CourseItemList from "@/components/courseDetails/lessonList";
import AnimateWrapper from "@/components/animations/animateWrapper";
import { APIGetFullCourse } from "@/utils/course";
import { useParams } from "next/navigation";
import ButtonReview from "@/components/courseDetails/buttonReview";
// Hàm helper để kiểm tra và lấy video URL
const getVideoUrl = (
  item: CourseItem | Section | undefined
): string | undefined => {
  if (!item) return undefined;

  // Check if it's a CourseItem with a video
  if ("video" in item && item.video) {
    return item.video.id;
  }

  // Check if it's a Section with items that have videos
  if ("items" in item && item.items && item.items.length > 0) {
    const firstItem = item.items[0];
    if (firstItem.video) {
      return firstItem.video.id;
    }
  }

  return undefined;
};

const LearnPage = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = useState<CourseForm | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(true);

  const [currentCourseItem, setCurrentCourseItem] = useState<
    CourseItem | undefined
  >(undefined);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);

  // Lấy video URL từ currentCourseItem
  // const videoUrl = getVideoUrl(currentCourseItem);

  const handleGetCourseData = async () => {
    setIsLoading(true);
    const response = await APIGetFullCourse(id as string);
    if (response?.status === 200) {
      setCourseData(response?.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    handleGetCourseData();
  }, [id]);

  useEffect(() => {
    if (courseData?.sections) {
      setCurrentCourseItem(courseData?.sections[0].items[0]);
    }
  }, [courseData]);

  useEffect(() => {
    if (currentCourseItem?.video) {
      setVideoUrl(currentCourseItem?.video?.video?.key);
    }
  }, [currentCourseItem]);

  return (
    <AnimateWrapper delay={0.2} direction="up">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="animate-spin" size={24} />
        </div>
      ) : (
        <div className="min-h-screen bg-AntiFlashWhite dark:bg-eerieBlack text-richBlack dark:text-AntiFlashWhite">
          {/* Video và Danh mục bài học */}
          <div className="flex flex-col lg:flex-row gap-4 p-4">
            {/* Nút mở/thu nhỏ sidebar */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden mb-4 p-2 bg-majorelleBlue text-white rounded-full"
            >
              {isSidebarOpen ? (
                <ChevronLeft size={20} />
              ) : (
                <ChevronRight size={20} />
              )}
            </button>

            {/* Sidebar (Danh mục bài học) */}
            <div
              className={`${
                isSidebarOpen ? "w-full lg:w-1/4" : "w-0 lg:w-16"
              } transition-all duration-300 bg-white dark:bg-richBlack rounded-lg shadow-md overflow-hidden`}
            >
              {currentCourseItem && courseData?.sections && (
                <CourseItemList
                  sections={courseData?.sections}
                  currentCourseItemId={currentCourseItem?.title}
                  onCourseItemSelect={(courseItem) =>
                    setCurrentCourseItem(courseItem)
                  }
                  isExpanded={isSidebarOpen}
                />
              )}
            </div>

            {/* Video Player - Chỉ render khi có videoUrl */}
            <div className="flex-1">
              {currentCourseItem && videoUrl ? (
                <VideoPlayer
                  videoUrl={process.env.NEXT_PUBLIC_BASE_URL_VIDEO + videoUrl} // videoUrl đã được đảm bảo là string nhờ kiểm tra
                  title={currentCourseItem.title}
                  coverPhoto={courseData?.thumbnail?.key}
                />
              ) : (
                <div className="p-4 text-center">
                  <p>Không có video để phát cho mục này.</p>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="p-4">
            {courseData && (
              <CourseTabs
                currentCourseItem={currentCourseItem}
                description={courseData.description || ""}
                sections={courseData.sections}
                lecture={courseData.instructor}
                rating={courseData.rating}
                enrolledStudents={courseData.number_student}
                price={courseData.price}
                priceFinal={courseData.priceFinal}
              />
            )}
          </div>
        </div>
      )}

      {courseData?.course_id && (
        <ButtonReview course_id={courseData?.course_id || ""} />
      )}
    </AnimateWrapper>
  );
};

export default LearnPage;
