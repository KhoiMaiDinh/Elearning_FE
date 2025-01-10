"use client";
import LecturersBlock from "@/components/block/lecturers-block";
import FilterBlock from "@/components/filter/filter-block";
import lectureBlock from "@/types/lecturesBlockType";
import React, { useEffect } from "react";

const dataLecture: lectureBlock[] = [
  {
    avatar: "/images/avatar.jpg",
    name: "Lê Thị Thu Hiền",
    rating: 4.9,
    major: "Công nghệ thông tin",
    description:
      "Chuyên gia CNTT vớibáo khoa học đạt chuẩn quốc tế báo khoa học đạt chuẩn quốc tếbáo khoa học đạt chuẩn quốc tếbáo khoa học đạt chuẩn quốc tếbáo khoa học đạt chuẩn quốc tếbáo khoa học đạt chuẩn quốc tếbáo khoa học đạt chuẩn quốc tếbáo khoa học đạt chuẩn quốc tếbáo khoa học đạt chuẩn quốc tếbáo khoa học đạt chuẩn quốc tế, bằng thạc sĩ đồ đó, blalabla nha.",
    numberCourse: 12,
    numberStudent: 250,
  },
  {
    avatar: "/images/avatar2.jpg",
    name: "Nguyễn Văn An",
    rating: 4.8,
    major: "Phân tích dữ liệu",
    description:
      "Kinh nghiệm 10 năm trong lĩnh vực phân tích dữ liệu và hướng dẫn sử dụng các công cụ như Python, R và Tableau.",
    numberCourse: 8,
    numberStudent: 180,
  },
  {
    avatar: "/images/avatar.jpg",
    name: "Lê Thị Thu Hiền",
    rating: 4.9,
    major: "Công nghệ thông tin",
    description:
      "Chuyên gia CNTT với nhiều năm kinh nghiệm giảng dạy, cùng với đó là các bài báo khoa học đạt chuẩn quốc tế, bằng thạc sĩ đồ đó, blalabla nha.",
    numberCourse: 12,
    numberStudent: 250,
  },
  {
    avatar: "/images/avatar2.jpg",
    name: "Nguyễn Văn An",
    rating: 4.8,
    major: "Phân tích dữ liệu",
    description:
      "Kinh nghiệm 10 năm trong lĩnh vực phân tích dữ liệu và hướng dẫn sử dụng các công cụ như Python, R và Tableau.",
    numberCourse: 8,
    numberStudent: 180,
  },
  {
    avatar: "/images/avatar.jpg",
    name: "Lê Thị Thu Hiền",
    rating: 4.9,
    major: "Công nghệ thông tin",
    description:
      "Chuyên gia CNTT với nhiều năm kinh nghiệm giảng dạy, cùng với đó là các bài báo khoa học đạt chuẩn quốc tế, bằng thạc sĩ đồ đó, blalabla nha.",
    numberCourse: 12,
    numberStudent: 250,
  },
  {
    avatar: "/images/avatar2.jpg",
    name: "Nguyễn Văn An",
    rating: 4.8,
    major: "Phân tích dữ liệu",
    description:
      "Kinh nghiệm 10 năm trong lĩnh vực phân tích dữ liệu và hướng dẫn sử dụng các công cụ như Python, R và Tableau.",
    numberCourse: 8,
    numberStudent: 180,
  },
  {
    avatar: "/images/avatar.jpg",
    name: "Lê Thị Thu Hiền",
    rating: 4.9,
    major: "Công nghệ thông tin",
    description:
      "Chuyên gia CNTT với nhiều năm kinh nghiệm giảng dạy, cùng với đó là các bài báo khoa học đạt chuẩn quốc tế, bằng thạc sĩ đồ đó, blalabla nha.",
    numberCourse: 12,
    numberStudent: 250,
  },
  {
    avatar: "/images/avatar2.jpg",
    name: "Nguyễn Văn An",
    rating: 4.8,
    major: "Phân tích dữ liệu",
    description:
      "Kinh nghiệm 10 năm trong lĩnh vực phân tích dữ liệu và hướng dẫn sử dụng các công cụ như Python, R và Tableau.",
    numberCourse: 8,
    numberStudent: 180,
  },
  //... more lecturers
];

const Page = () => {
  useEffect(() => {
    // Scroll to top when the component mounts or route changes
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="w-full h-full flex flex-col gap-3 bg-AntiFlashWhite dark:bg-eerieBlack font-sans font-medium text-majorelleBlue  overflow-auto">
      <FilterBlock />
      <div className="w-full h-full px-6 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2 lg:grid-cols-4 md:grid-cols-2 ">
        {dataLecture.map((lecture: lectureBlock, index: number) => (
          <LecturersBlock
            avatar={lecture.avatar}
            name={lecture.name}
            rating={lecture.rating}
            major={lecture.major}
            numberCourse={lecture.numberCourse}
            numberStudent={lecture.numberStudent}
            description={lecture.description}
          />
        ))}
      </div>
    </div>
  );
};

export default Page;
