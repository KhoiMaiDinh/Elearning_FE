"use client";
import AnimateWrapper from "@/components/animations/animateWrapper";
import CoursesBlock from "@/components/block/courses-block";
import FilterBlock from "@/components/filter/filter-block";
import courseBlock from "@/types/coursesBlockType";
import { APIGetListCourse } from "@/utils/course";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

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

  const [isLoading, setIsLoading] = useState(true);
  const [listFavCourse, setListFavCourse] = useState([]);
  const [listCourse, setListCourse] = useState([]);
  const [paramsCourse, setParamsCourse] = useState({
    page: 1,
    limit: 10,
    category_slug: undefined,
    level: undefined,
    min_price: undefined,
    max_price: undefined,
    min_rating: undefined,
    instructor_username: undefined,
    with_instructor: true,
    with_category: true,
    include_disabled: false,
  });
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleGetListCourse = async () => {
    try {
      const response = await APIGetListCourse(paramsCourse);
      if (response && response.data) {
        const data = response.data.map((item: any) => ({
          coverPhoto: item?.thumbnail?.key || "",
          avatar: item?.instructor?.user?.profile_image?.key || "",
          title: item?.title || "",
          rating: item?.rating || null,
          level: item?.level || null,
          numberStudent: item?.number_student || null,
          description: item?.subtitle || "",
          name:
            item?.instructor?.user?.first_name +
            " " +
            item?.instructor?.user?.last_name,
          price: item?.price,
          id: item?.id,
        }));
        setListCourse(data);
      }
    } catch (err) {
      console.error("Error during get list course:", err);
    }
  };
  useEffect(() => {
    handleGetListCourse();
  }, [paramsCourse]);
  return (
    <div className="w-full h-full flex flex-col gap-3 bg-AntiFlashWhite dark:bg-eerieBlack font-sans font-medium text-majorelleBlue  overflow-auto">
      {/* header */}
      <div className="grid md:grid-cols-3 grid-cols-1 items-center ">
        {" "}
        <div className="col-span-1 flex justify-center">
          <img
            src="/images/course_bg.png"
            alt="Khóa học"
            className="md:w-[300px] w-[200px] rounded-xl"
          />
        </div>
        <div className="md:col-span-2 col-span-1 flex items-center justify-center flex-col text-center text-white ">
          <AnimateWrapper delay={0.3} direction="right">
            <div className="md:col-span-2 col-span-1 flex items-center justify-center flex-col text-center text-white md:px-4">
              <h1 className="lg:text-4xl md:text-2xl text-xl font-extrabold dark:text-white text-eerieBlack leading-tight">
                Khám phá các{" "}
                <span className="text-LavenderIndigo">khóa học nổi bật</span>
                <br />
                từ nhiều lĩnh vực đa dạng
              </h1>{" "}
              <p className="mt-4 lg:text-lg md:text-base text-sm text-muted-foreground max-w-xl">
                Các khóa học của chúng tôi được thiết kế bởi chuyên gia thực
                chiến — giúp bạn học nhanh, ứng dụng được ngay, và nâng cao kỹ
                năng theo từng bước.
              </p>
              <div className="mt-4 md:mt-6 flex md:gap-4 gap-2 md:text-base text-[10px]">
                <button className="bg-custom-gradient-button-violet text-white md:px-6 px-4 py-2 rounded-xl hover:bg-majorelleBlue70 transition">
                  Xem tất cả khóa học
                </button>
                <button className="border dark:border-white border-eerieBlack  dark:text-white text-eerieBlack px-6 py-2 rounded-xl hover:text-white hover:bg-eerieBlack dark:hover:bg-white dark:hover:text-black transition">
                  Đăng ký học thử
                </button>
              </div>
            </div>
          </AnimateWrapper>
        </div>
      </div>
      {/* Giang vien uu tu */}
      <section className="py-12  overflow-hidden">
        <AnimateWrapper delay={0.3} direction="up">
          <div className="text-center mb-8">
            <h2 className="md:text-2xl text-xl font-bold text-cosmicCobalt dark:text-white">
              Khóa học nổi bật{" "}
            </h2>
            <p className="md:text-sm text-xs text-muted-foreground mt-2">
              Những khóa học được học viên đánh giá cao, đang thu hút hàng nghìn
              người học mỗi ngày{" "}
            </p>
          </div>
        </AnimateWrapper>

        <div className="relative w-full whitespace-nowrap">
          <AnimateWrapper delay={0.3} direction="up">
            <div className="inline-flex animate-marquee space-x-4 md:space-x-6 gap-4 md:gap-10">
              {dataCourse
                .concat(dataCourse)
                .map((course: courseBlock, idx: number) => (
                  <div
                    key={idx}
                    className="w-40 h-24 md:w-96 md:h-52 rounded-lg overflow-hidden border-2 border-white dark:border-darkSilver shadow-md"
                  >
                    <img
                      src={course.coverPhoto}
                      alt={`Course ${idx}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
            </div>
          </AnimateWrapper>
        </div>
      </section>
      <AnimateWrapper delay={0.3} direction="up">
        <div className="md:px-6 pt-4 pb-2">
          <h2 className="md:text-2xl text-xl font-bold text-cosmicCobalt dark:text-white">
            Danh sách khóa học
          </h2>
          <p className="md:text-sm text-xs text-muted-foreground mt-1">
            Khám phá các khóa học được thiết kế tâm huyết bởi những chuyên gia
          </p>
        </div>
      </AnimateWrapper>
      <AnimateWrapper delay={0.2} direction="up" amount={0.01}>
        <div className="w-full h-full flex items-end justify-end">
          <FilterBlock />
        </div>{" "}
        <div className="w-full h-full md:px-6 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2 lg:grid-cols-4 md:grid-cols-2 ">
          {listCourse.map((course: courseBlock, index: number) => (
            <CoursesBlock {...course} />
          ))}
        </div>
      </AnimateWrapper>
    </div>
  );
};

export default Page;
