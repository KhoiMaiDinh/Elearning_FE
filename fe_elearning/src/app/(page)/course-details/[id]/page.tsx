"use client";

import React, { useState } from "react";
import VideoPlayer from "@/components/courseDetails/videoPlayer";
import CourseTabs from "@/components/courseDetails/courseTab";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CourseForm, CourseItem, Section } from "@/types/courseType";
import CourseItemList from "@/components/courseDetails/lessonList";
import AnimateWrapper from "@/components/animations/animateWrapper";

// Dữ liệu mẫu dựa trên CourseForm (giữ nguyên)
const courseData: CourseForm = {
  title: "Lập Trình Web Toàn Diện Với JavaScript",
  subtitle: "Khóa học cung cấp kiến thức từ cơ bản đến nâng cao ",
  level: "Trung cấp",
  price: 699000,
  priceFinal: 599000,
  outcomes: ["jj", "kb", "vuk"],
  is_disabled: false,
  is_approved: true,
  category: { slug: "8", children: [{ slug: "8" }], translations: [] },
  description:
    "Khóa học cung cấp kiến thức từ cơ bản đến nâng cao về lập trình web với JavaScript.",
  course: [
    {
      id: "1",
      title: "Giới thiệu về JavaScript",
      lectures: [
        {
          id: "1",
          section_id: "1",
          title: "JavaScript là gì?",
          description:
            "Tìm hiểu cơ bản về JavaScript và vai trò của nó trong lập trình web.",
          resources: [{ key: "", id: "" }],
          video: {
            id: "http://192.168.110.50:9000/video/427928847_7210588072356478_1781648401361081538_n/master.m3u8",
            video_duration: 100,
            video_status: "UPLOADED",
            video: {
              key: "",
              status: "UPLOADED",
              bucket: "",
              rejection_reason: "",
            },
            version: 1,
          },
          is_preview: true,
          position: "1",
        },
        {
          id: "2",
          section_id: "1",
          title: "Thiết lập môi trường làm việc",
          description:
            "Hướng dẫn cài đặt và sử dụng trình biên tập mã như VS Code.",
          resources: [{ key: "", id: "" }],
          video: {
            id: "http://192.168.110.50:9000/video/427928847_7210588072356478_1781648401361081538_n/master.m3u8",
            video_duration: 100,
            video_status: "UPLOADED",
            video: {
              key: "",
              status: "UPLOADED",
              bucket: "",
              rejection_reason: "",
            },
            version: 1,
          },
          is_preview: true,
          position: "2",
        },
      ],
      position: "1",
      description: "Tổng quan về JavaScript và cách bắt đầu.",
      status: "ACTIVE",
      course_id: "1",
      quizzes: [],
      articles: [],
    },
    {
      id: "2",
      title: "Lập trình cơ bản với JavaScript",
      lectures: [
        {
          id: "1",
          section_id: "1",
          title: "Biến và kiểu dữ liệu",
          description:
            "Tìm hiểu cách khai báo biến và các kiểu dữ liệu trong JavaScript.",
          resources: [{ key: "Biến và kiểu dữ liệu.pdf", id: "" }],
          video: {
            id: " https://example.com/video/variables-and-data-types.mp4",
            video_duration: 100,
            video_status: "UPLOADED",
            video: {
              key: "",
              status: "UPLOADED",
              bucket: "",
              rejection_reason: "",
            },
            version: 1,
          },
          is_preview: true,
          position: "1",
        },
      ],
      position: "2",
      description: "Học các khái niệm cơ bản của lập trình JavaScript.",
      status: "ACTIVE",
      course_id: "1",
      quizzes: [],
      articles: [],
    },
  ],
  rating: 4.9,
  enrolled_users: 5000,
  instructor_id: "Lê Thị Thu Hiền",
  thumbnail: {
    id: "1",
    media_id: "1",
    bucket: "1",
    key: "1",
    status: "1",
    rejection_reason: "1",
    entity: "1",
    entity_property: "1",
    expires_at: "1",
    user_id: "1",
  },
};

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
  const [currentCourseItem, setCurrentCourseItem] = useState<
    CourseItem | Section | undefined
  >(
    courseData?.sections
      ? courseData.sections[0].items
        ? courseData.sections[0].items[0]
        : courseData.sections[0]
      : undefined
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Lấy video URL từ currentCourseItem
  const videoUrl = getVideoUrl(currentCourseItem);

  return (
    <AnimateWrapper delay={0.2} direction="up">
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
            {currentCourseItem && courseData.sections && (
              <CourseItemList
                sections={courseData.sections}
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
                videoUrl={videoUrl} // videoUrl đã được đảm bảo là string nhờ kiểm tra
                title={currentCourseItem.title}
                coverPhoto={courseData.thumbnail?.key}
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
              description={courseData.description || ""}
              sections={courseData.sections}
              lecture={courseData.instructor_id}
              rating={courseData.rating}
              enrolledStudents={courseData.number_student}
              price={courseData.price}
              priceFinal={courseData.priceFinal}
            />
          )}
        </div>
      </div>
    </AnimateWrapper>
  );
};

export default LearnPage;
