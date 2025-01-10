"use client";
import React, { useEffect } from "react";

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
const Page = () => {
  useEffect(() => {
    // Scroll to top when the component mounts or route changes
    window.scrollTo(0, 0);
  }, []);
  return <div></div>;
};

export default Page;
