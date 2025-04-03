"use client";

import React, { useState } from "react";
import VideoPlayer from "@/components/courseDetails/videoPlayer";
import CourseTabs from "@/components/courseDetails/courseTab";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CourseForm, CourseItem, Section } from "@/types/courseType";
import CourseItemList from "@/components/courseDetails/lessonList";

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
  category_id: "8",
  description:
    "Khóa học cung cấp kiến thức từ cơ bản đến nâng cao về lập trình web với JavaScript.",
  course: [
    {
      title: "Giới thiệu về JavaScript",
      content: [
        {
          title: "JavaScript là gì?",
          description:
            "Tìm hiểu cơ bản về JavaScript và vai trò của nó trong lập trình web.",
          resource_id: [""],
          video_id:
            "http://192.168.110.50:9000/video/427928847_7210588072356478_1781648401361081538_n/master.m3u8",
          is_preview: true,
          position: "1",
        },
        {
          title: "Thiết lập môi trường làm việc",
          description:
            "Hướng dẫn cài đặt và sử dụng trình biên tập mã như VS Code.",
          resource_id: [""],
          video_id:
            "http://192.168.110.50:9000/video/427928847_7210588072356478_1781648401361081538_n/master.m3u8",
          is_preview: true,
          position: "2",
        },
      ],
      position: "1",
      section_video: "https://example.com/video/section-intro.mp4",
      section_description: "Tổng quan về JavaScript và cách bắt đầu.",
      section_resources: ["Tổng quan JavaScript.pdf"],
    },
    {
      title: "Lập trình cơ bản với JavaScript",
      content: [
        {
          title: "Biến và kiểu dữ liệu",
          description:
            "Tìm hiểu cách khai báo biến và các kiểu dữ liệu trong JavaScript.",
          resource_id: ["Biến và kiểu dữ liệu.pdf"],
          video_id: "https://example.com/video/variables-and-data-types.mp4",
          is_preview: true,
          position: "1",
        },
      ],
      position: "2",
      section_video: "https://example.com/video/basic-js.mp4",
      section_description: "Học các khái niệm cơ bản của lập trình JavaScript.",
      section_resources: ["Tài liệu cơ bản.pdf"],
    },
  ],
  rating: 4.9,
  enrolled_users: 5000,
  instructor_id: "Lê Thị Thu Hiền",
  thumbnail_id: "/images/course-cover.jpg",
};

// Hàm helper để kiểm tra và lấy video URL
const getVideoUrl = (
  item: CourseItem | Section | undefined
): string | undefined => {
  if (!item) return undefined;
  return "video_id" in item
    ? item.video_id
    : "section_video" in item
    ? item.section_video
    : undefined;
};

const LearnPage = () => {
  const [currentCourseItem, setCurrentCourseItem] = useState<
    CourseItem | Section | undefined
  >(
    courseData?.course
      ? courseData.course[0].content
        ? courseData.course[0].content[0]
        : courseData.course[0]
      : undefined
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Lấy video URL từ currentCourseItem
  const videoUrl = getVideoUrl(currentCourseItem);

  return (
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
          {currentCourseItem && courseData.course && (
            <CourseItemList
              sections={courseData.course}
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
              coverPhoto={courseData.thumbnail_id}
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
            description={courseData.description}
            sections={courseData.course}
            lecture={courseData.instructor_id}
            rating={courseData.rating}
            enrolledStudents={courseData.enrolled_users}
            price={courseData.price}
            priceFinal={courseData.priceFinal}
          />
        )}
      </div>
    </div>
  );
};

export default LearnPage;
