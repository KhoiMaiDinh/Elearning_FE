"use client";

import React, { useState, useEffect } from "react";
import VideoPlayer from "@/components/courseDetails/videoPlayer";
import CourseTabs from "@/components/courseDetails/courseTab";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { CourseForm, CourseItem, Section } from "@/types/courseType";
import CourseItemList from "@/components/courseDetails/lessonList";
import AnimateWrapper from "@/components/animations/animateWrapper";
import { APIGetFullCourse } from "@/utils/course";
import { useParams, useRouter } from "next/navigation";
import ButtonReview from "@/components/courseDetails/buttonReview";
import ButtonMore from "@/components/courseDetails/buttonMore";
import { useSelector } from "react-redux";
import { RootState } from "@/constants/store";
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
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const router = useRouter();
  const [courseData, setCourseData] = useState<CourseForm | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(true);

  const [currentCourseItem, setCurrentCourseItem] = useState<
    CourseItem | undefined
  >(undefined);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const [sections, setSections] = useState<Section[]>([]);
  const [isOwner, setIsOwner] = useState(false);

  // Lấy video URL từ currentCourseItem
  // const videoUrl = getVideoUrl(currentCourseItem);

  useEffect(() => {
    if (userInfo.id) {
      if (userInfo.id === courseData?.instructor?.user?.id) {
        setIsOwner(true);
      }
    }
  }, [userInfo, courseData]);

  const handleGetCourseData = async () => {
    setIsLoading(true);
    const response = await APIGetFullCourse(id as string);
    if (response?.status === 200) {
      setCourseData(response?.data);
      const sortedSections = response.data.sections.sort(
        (a: Section, b: Section) => a.position.localeCompare(b.position)
      );
      setSections(sortedSections);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    handleGetCourseData();
  }, [id]);

  useEffect(() => {
    if (courseData?.sections && sections) {
      setCurrentCourseItem(sections[0].items[0]);
    }
  }, [courseData, sections]);

  useEffect(() => {
    if (currentCourseItem?.video) {
      setVideoUrl(currentCourseItem?.video?.video?.key);
    }
  }, [currentCourseItem]);

  useEffect(() => {
    if (userInfo.id) {
      router.push(`/course-details/${id}`);
    } else {
      router.push("/login");
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
          {/* Video và Danh mục bài học */}
          <div className="flex flex-col lg:flex-row gap-4 ">
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
                  lecture_id={currentCourseItem.id}
                  progress={
                    currentCourseItem.progresses?.[0]?.watch_time_in_percentage
                  }
                />
              ) : (
                <div className="p-4 text-center">
                  <p>Không có video để phát cho mục này.</p>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="">
            {courseData && (
              <CourseTabs
                currentCourseItem={currentCourseItem}
                description={courseData.description || ""}
                sections={courseData.sections}
                lecture={courseData.instructor}
                rating={courseData.avg_rating}
                enrolledStudents={courseData.total_enrolled}
                price={courseData.price}
                priceFinal={courseData.priceFinal}
                isOwner={isOwner}
              />
            )}
          </div>
        </div>
      )}

      {courseData?.id && !isOwner && (
        <ButtonReview course_id={courseData?.id || ""} />
      )}
      {courseData?.id && !isOwner && (
        <ButtonMore course_id={courseData?.id || ""} />
      )}
    </AnimateWrapper>
  );
};

export default LearnPage;
