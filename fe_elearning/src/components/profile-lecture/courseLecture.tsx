"use client";
import React, { useEffect } from "react";
import FilterBlock from "../filter/filter-block";
import courseBlock from "@/types/coursesBlockType";
import CoursesBlock from "../block/courses-block";

const dataCourse = [
  {
    coverPhoto: "/images/course1.jpg",
    avatar: "/images/avatar.jpg",
    title: "Lập trình ReactJS cơ bản",
    rating: 4.9,
    level: "Cơ bản",
    numberStudent: 1200,
    description:
      "Khóa học dành cho người mới bắt đầu muốn tìm hiểu về ReactJS.",
    name: "Nguyễn Văn A",
    status: "Chưa đăng ký",
    progress: 45, // Đã hoàn thành 45% khóa học
    price: 500000,
    priceFinal: 450000, // Giá sau giảm
  },
  {
    coverPhoto: "/images/course2.jpg",
    avatar: "/images/avatar.jpg",
    title: "Phân tích dữ liệu với Python",
    rating: 4.8,
    level: "Trung cấp",
    numberStudent: 800,
    description:
      "Học cách phân tích dữ liệu và trực quan hóa với Python. Tìm hiểu cách xây dựng ứng dụng di động đa nền tảng với Flutter hg r f r rkr rx s frf er e gre rg erg er g rgs g se sg egr e g erg e t eg rver g erg er g rv.",

    name: "Lê Thị B",
    status: "Chưa đăng ký",
    progress: 100, // Đã hoàn thành khóa học
    price: 700000,
    priceFinal: 700000, // Không giảm giá
  },
  {
    coverPhoto: "/images/course3.jpg",
    avatar: "/images/avatar.jpg",
    title: "Thiết kế giao diện với Figma",
    rating: 4.7,
    level: "Cơ bản",
    numberStudent: 650,
    description: "Khóa học cung cấp kiến thức cơ bản về thiết kế UI/UX.",
    name: "Trần Minh C",
    status: "Chưa đăng ký",
    progress: 0, // Chưa bắt đầu
    price: 400000,
    priceFinal: 350000, // Giá sau giảm
  },
  {
    coverPhoto: "/images/course4.jpg",
    avatar: "/images/avatar.jpg",
    title: "Lập trình Backend với Node.js",
    rating: 4.6,
    level: "Nâng cao",
    numberStudent: 1550,
    description: "Nâng cao kỹ năng lập trình backend với Node.js và Express.",
    name: "Phạm Duy D",
    status: "Chưa đăng ký",
    progress: 60, // Đã hoàn thành 60% khóa học
    price: 600000,
    priceFinal: 500000, // Giá sau giảm
  },
  {
    coverPhoto: "/images/course5.jpg",
    avatar: "/images/avatar.jpg",
    title: "Phát triển ứng dụng di động với Flutter",
    rating: 4.9,
    level: "Trung cấp",
    numberStudent: 1100,
    description:
      "Tìm hiểu cách xây dựng ứng dụng di động đa nền tảng với Flutter hg r f r rkr rx s frf er e gre rg erg er g rgs g se sg egr e g erg e t eg rver g erg er g rv.",
    name: "Hoàng Văn E",
    status: "Chưa đăng ký",
    progress: 100, // Đã hoàn thành khóa học
    price: 800000,
    priceFinal: 750000, // Giá sau giảm
  },
];
const CourseLecture = () => {
  useEffect(() => {
    // Scroll to top when the component mounts or route changes
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="w-full h-full flex flex-col gap-3 bg-white dark:bg-black50 font-sans font-medium text-majorelleBlue  overflow-auto  p-4 rounded-b-sm">
      <div className="w-full h-full flex items-end justify-end">
        <FilterBlock />
      </div>{" "}
      <div className="w-full h-full px-6 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2 lg:grid-cols-4 md:grid-cols-2 ">
        {dataCourse.map((course: courseBlock, index: number) => (
          <CoursesBlock
            avatar={course.avatar}
            name={course.name}
            rating={course.rating}
            title={course.title}
            level={course.level}
            numberStudent={course.numberStudent}
            description={course.description}
            progress={course.progress}
            price={course.price}
            priceFinal={course.priceFinal}
            status={course.status}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseLecture;
