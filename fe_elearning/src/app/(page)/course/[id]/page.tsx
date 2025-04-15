"use client";
import AnimateWrapper from "@/components/animations/animateWrapper";
import InfoBlockCourse from "@/components/course/infoBlockCourse";
import InfoCourse from "@/components/course/infoCourse";
import { APIGetCourseById } from "@/utils/course";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const dataCourseDetails = {
  title: "Lập Trình Web Toàn Diện Với JavaScript",
  rating: 4.9,
  enrolled_students: 5000,
  level: "Trung cấp",
  price: 699000,
  lecture: "Lê Thị Thu Hiền",
  short_description:
    "Khóa học cung cấp kiến thức từ cơ bản đến nâng cao về lập trình web với JavaScript, bao gồm cả front-end và back-end.",
  course: [
    {
      section_title: "Giới thiệu về JavaScript",
      content: [
        {
          lesson_title: "JavaScript là gì?",
          lesson_content:
            "Tìm hiểu cơ bản về JavaScript và vai trò của nó trong lập trình web.",
          resources: ["Tài liệu giới thiệu JavaScript.pdf"],
          video_url: "https://example.com/video/javascript-introduction.mp4",
        },
        {
          lesson_title: "Thiết lập môi trường làm việc",
          lesson_content:
            "Hướng dẫn cài đặt và sử dụng trình biên tập mã như VS Code.",
          resources: ["Hướng dẫn cài đặt VS Code.pdf"],
          video_url: "https://example.com/video/setup-environment.mp4",
        },
      ],
      section_video: "https://example.com/video/course-intro.mp4",
      section_description:
        "Tổng quan về nội dung khóa học và mục tiêu đạt được.",
      section_resources: ["Tài liệu tổng quan khóa học.pdf"],
    },
    {
      section_title: "Lập trình cơ bản với JavaScript",
      content: [
        {
          lesson_title: "Biến và kiểu dữ liệu",
          lesson_content:
            "Tìm hiểu cách khai báo biến và các kiểu dữ liệu trong JavaScript.",
          resources: ["Biến và kiểu dữ liệu trong JavaScript.pdf"],
          video_url: "https://example.com/video/variables-and-data-types.mp4",
        },
        {
          lesson_title: "Câu lệnh điều kiện và vòng lặp",
          lesson_content:
            "Cách sử dụng if-else và các vòng lặp trong lập trình.",
          resources: ["Câu lệnh điều kiện và vòng lặp.pdf"],
          video_url: "https://example.com/video/loops-and-conditions.mp4",
        },
      ],
      section_video: "https://example.com/video/basic-js.mp4",
      section_description:
        "Học cách viết mã JavaScript cơ bản thông qua các ví dụ thực tế.",
      section_resources: ["Tài liệu lập trình cơ bản.pdf"],
    },
    {
      section_title: "JavaScript Nâng Cao",
      content: [
        {
          lesson_title: "Xử lý sự kiện trong JavaScript",
          lesson_content:
            "Hướng dẫn sử dụng các sự kiện để tạo tính tương tác cho website.",
          resources: ["Tài liệu về sự kiện trong JavaScript.pdf"],
          video_url: "https://example.com/video/event-handling.mp4",
        },
        {
          lesson_title: "Làm việc với API",
          lesson_content: "Cách sử dụng Fetch API để giao tiếp với server.",
          resources: ["Hướng dẫn làm việc với API.pdf"],
          video_url: "https://example.com/video/fetch-api.mp4",
        },
      ],
      section_video: "https://example.com/video/advanced-js.mp4",
      section_description:
        "Nâng cao kỹ năng lập trình JavaScript với các khái niệm chuyên sâu.",
      section_resources: ["Tài liệu nâng cao JavaScript.pdf"],
    },
  ],
};

const Page = () => {
  const { id: rawId } = useParams();
  const id = Array.isArray(rawId) ? rawId[0] : rawId; // Ensure `id` is a string
  const [dataCourse, setDataCourse] = useState<any>(null);
  useEffect(() => {
    const fetchData = async () => {
      const response = await APIGetCourseById(id || "", {
        with_instructor: true,
      });
      if (response && response.data) {
        setDataCourse(response.data);
      }
    };
    fetchData();
  }, [id]);
  return (
    <div className="container mx-auto py-8 bg-AntiFlashWhite dark:bg-eerieBlack min-h-screen text-richBlack dark:text-AntiFlashWhite">
      <AnimateWrapper delay={0.2} direction="up" amount={0.01}>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-3/4">
            <InfoCourse
              title={dataCourse?.title}
              rating={dataCourse?.rating}
              numberStudent={dataCourse?.number_student}
              level={dataCourse?.level}
              lecture={
                dataCourse?.instructor?.user?.first_name +
                " " +
                dataCourse?.instructor?.user?.last_name
              }
              price={dataCourse?.price}
              description={dataCourse?.subtitle}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/4">
            <InfoBlockCourse
              isRegistered={true}
              price={dataCourseDetails.price}
              level={dataCourseDetails.level}
            />
          </div>
        </div>
      </AnimateWrapper>
    </div>
  );
};

export default Page;
