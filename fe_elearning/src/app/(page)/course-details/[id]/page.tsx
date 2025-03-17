"use client";

import React, { useState } from "react";
import VideoPlayer from "@/components/courseDetails/videoPlayer";
import LessonList from "@/components/courseDetails/lessonList";
import CourseTabs from "@/components/courseDetails/courseTab";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CourseForm, Lesson, Section } from "@/types/courseType";

// Dữ liệu mẫu dựa trên CourseForm
const courseData: CourseForm = {
  title: "Lập Trình Web Toàn Diện Với JavaScript",
  level: "Trung cấp",
  price: 699000,
  priceFinal: 599000,
  short_description:
    "Khóa học cung cấp kiến thức từ cơ bản đến nâng cao về lập trình web với JavaScript.",
  course: [
    {
      section_title: "Giới thiệu về JavaScript",
      content: [
        {
          lesson_title: "JavaScript là gì?",
          lesson_content:
            "Tìm hiểu cơ bản về JavaScript và vai trò của nó trong lập trình web.",
          resources: ["Tài liệu giới thiệu JavaScript.pdf"],
          video_url:
            "http://192.168.110.50:9000/video/427928847_7210588072356478_1781648401361081538_n/master.m3u8",
        },
        {
          lesson_title: "Thiết lập môi trường làm việc",
          lesson_content:
            "Hướng dẫn cài đặt và sử dụng trình biên tập mã như VS Code.",
          resources: ["Hướng dẫn cài đặt VS Code.pdf"],
          video_url:
            "http://192.168.110.50:9000/video/huong_dan_pos365/master.m3u8",
        },
      ],
      section_video: "https://example.com/video/section-intro.mp4",
      section_description: "Tổng quan về JavaScript và cách bắt đầu.",
      section_resources: ["Tổng quan JavaScript.pdf"],
    },
    {
      section_title: "Lập trình cơ bản với JavaScript",
      content: [
        {
          lesson_title: "Biến và kiểu dữ liệu",
          lesson_content:
            "Tìm hiểu cách khai báo biến và các kiểu dữ liệu trong JavaScript.",
          resources: ["Biến và kiểu dữ liệu.pdf"],
          video_url: "https://example.com/video/variables-and-data-types.mp4",
        },
      ],
      section_video: "https://example.com/video/basic-js.mp4",
      section_description: "Học các khái niệm cơ bản của lập trình JavaScript.",
      section_resources: ["Tài liệu cơ bản.pdf"],
    },
  ],
  rating: 4.9,
  enrolled_students: 5000,
  lecture: "Lê Thị Thu Hiền",
  coverPhoto: "/images/course-cover.jpg",
};

const LearnPage = () => {
  const [currentLesson, setCurrentLesson] = useState<Lesson>(
    courseData.course[0].content[0]
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
          <LessonList
            sections={courseData.course}
            currentLessonId={currentLesson.lesson_title}
            onLessonSelect={(lesson) => setCurrentLesson(lesson)}
            isExpanded={isSidebarOpen}
          />
        </div>

        {/* Video Player */}
        <div className="flex-1">
          <VideoPlayer
            videoUrl={currentLesson.video_url}
            title={currentLesson.lesson_title}
            coverPhoto={courseData.coverPhoto}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="p-4">
        <CourseTabs
          description={courseData.short_description}
          sections={courseData.course}
          lecture={courseData.lecture}
          rating={courseData.rating}
          enrolledStudents={courseData.enrolled_students}
          price={courseData.price}
          priceFinal={courseData.priceFinal}
        />
      </div>
    </div>
  );
};

export default LearnPage;
