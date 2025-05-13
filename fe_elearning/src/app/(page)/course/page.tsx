"use client";
import AnimateWrapper from "@/components/animations/animateWrapper";
import CoursesBlock from "@/components/block/courses-block";
import FilterBlock from "@/components/filter/filter-block";
import { CourseForm } from "@/types/courseType";
import { APIGetEnrolledCourse, APIGetListCourse } from "@/utils/course";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import SelectFilter from "@/components/selectComponent/selectFilter";
import { dataLevel, priceRanges } from "@/constants/selectData";
import { APIGetCategory } from "@/utils/category";
import CourseFilter from "@/components/filter/filterCourse";
const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Scroll to top when the component mounts or route changes
    window.scrollTo(0, 0);
  }, []);

  const [listFavCourse, setListFavCourse] = useState([]);
  const [listCourse, setListCourse] = useState<CourseForm[]>([]);
  const [listCourseOfUser, setListCourseOfUser] = useState<CourseForm[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [isLoadingUserCourses, setIsLoadingUserCourses] = useState(false);
  const [category, setCategory] = useState<any[]>([]);

  // Initialize params from URL
  const [paramsCourse, setParamsCourse] = useState({
    page: 1,
    limit: 10,
    category_slug: searchParams.get("category_slug") || undefined,
    level: searchParams.get("level") || undefined,
    min_price: searchParams.get("min_price")
      ? parseInt(searchParams.get("min_price")!)
      : undefined,
    max_price: searchParams.get("max_price")
      ? parseInt(searchParams.get("max_price")!)
      : undefined,
    min_rating: searchParams.get("min_rating")
      ? parseInt(searchParams.get("min_rating")!)
      : undefined,
    instructor_username: undefined,
    with_instructor: true,
    with_category: true,
    include_disabled: false,
    with_thumbnail: true,
  });

  const handleGetListCourse = async () => {
    try {
      setIsLoadingCourses(true);
      const response = await APIGetListCourse(paramsCourse);
      if (response && response.data) {
        setListCourse(response.data);
      }
    } catch (err) {
      console.error("Error during get list course:", err);
    } finally {
      setIsLoadingCourses(false);
    }
  };

  const handleGetListCourseOfUser = async () => {
    try {
      setIsLoadingUserCourses(true);
      const response = await APIGetEnrolledCourse();
      if (response && response.data) {
        setListCourseOfUser(response?.data);
      }
    } catch (err) {
      console.error("Error during get list course of user:", err);
    } finally {
      setIsLoadingUserCourses(false);
    }
  };

  const handleGetCategory = async () => {
    try {
      const response = await APIGetCategory({
        language: "vi",
        with_children: true,
      });

      // Function to extract only children categories (bỏ cha)
      const extractChildrenOnly = (categories: any[]): any[] => {
        let result: any[] = [];

        categories.forEach((category) => {
          // Nếu có children thì xử lý tiếp
          if (category?.children && category?.children.length > 0) {
            category.children.forEach((child: any) => {
              result.push({
                id: child?.slug,
                value: child?.translations[0]?.name,
              });

              // Nếu con cũng có children thì xử lý tiếp (deep children)
              if (child.children && child.children.length > 0) {
                const deeper = extractChildrenOnly([child]);
                result = [...result, ...deeper];
              }
            });
          }
        });

        return result;
      };

      const childrenCategories = extractChildrenOnly(response?.data || []);
      setCategory(childrenCategories);
    } catch (error) {
      console.log(error);
    }
  };

  const handleScrollToCourse = () => {
    const courseSection = document.getElementById("course");
    if (courseSection) {
      courseSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    handleGetListCourse();
  }, [paramsCourse]);

  useEffect(() => {
    handleGetListCourseOfUser();
    handleGetCategory();
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-3 bg-AntiFlashWhite dark:bg-eerieBlack font-sans font-medium text-majorelleBlue  overflow-auto">
      {/* header */}
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
          <AnimateWrapper delay={0} direction="right">
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
                <button
                  className="bg-custom-gradient-button-violet text-white md:px-6 px-4 py-2 rounded-xl hover:bg-majorelleBlue70 transition"
                  onClick={handleScrollToCourse}
                >
                  Xem tất cả khóa học
                </button>
                <button
                  className="border dark:border-white border-eerieBlack  dark:text-white text-eerieBlack px-6 py-2 rounded-xl hover:text-white hover:bg-eerieBlack dark:hover:bg-white dark:hover:text-black transition"
                  onClick={handleScrollToCourse}
                >
                  Đăng ký học thử
                </button>
              </div>
            </div>
          </AnimateWrapper>
        </div>
      </div>
      {/* Giang vien uu tu */}
      <section className="py-12  overflow-hidden">
        <AnimateWrapper delay={0} direction="up">
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
          <AnimateWrapper delay={0} direction="up">
            <div className="inline-flex animate-marquee space-x-4 md:space-x-6 gap-4 md:gap-10">
              {listCourse
                .concat(listCourse)
                .map((course: CourseForm, idx: number) => (
                  <div
                    key={idx}
                    className="w-40 h-24 md:w-96 md:h-52 rounded-lg overflow-hidden border-2 border-white dark:border-darkSilver shadow-md"
                  >
                    <img
                      src={`${process.env.NEXT_PUBLIC_BASE_URL_IMAGE || ""}${
                        course.thumbnail?.key || ""
                      }`}
                      alt={`Course ${idx}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
            </div>
          </AnimateWrapper>
        </div>
      </section>
      {isLoadingUserCourses ? (
        <div className="w-full h-full flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        listCourseOfUser.length > 0 && (
          <AnimateWrapper delay={0} direction="up">
            <div className="md:px-6 pt-4 pb-2">
              <h2 className="md:text-2xl text-xl font-bold text-cosmicCobalt dark:text-white">
                Khóa học của bạn
              </h2>
              <p className="md:text-sm text-xs text-muted-foreground mt-1">
                Các khóa học mà bạn đã đăng ký
              </p>
            </div>
          </AnimateWrapper>
        )
      )}

      <AnimateWrapper delay={0} direction="up" amount={0.01}>
        <div className="w-full h-full md:px-6 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2 lg:grid-cols-4 md:grid-cols-2 ">
          {listCourseOfUser.map((course: CourseForm, index: number) => (
            <CoursesBlock
              key={index}
              {...course}
              course_progress={course.course_progress}
            />
          ))}
        </div>
      </AnimateWrapper>

      <AnimateWrapper delay={0} direction="up">
        <div className="md:px-6 pt-4 pb-2" id="course">
          <h2 className="md:text-2xl text-xl font-bold text-cosmicCobalt dark:text-white">
            Danh sách khóa học
          </h2>
          <p className="md:text-sm text-xs text-muted-foreground mt-1">
            Khám phá các khóa học được thiết kế tâm huyết bởi những chuyên gia
          </p>
        </div>

        <div className="md:px-6 pt-4 pb-2">
          <CourseFilter
            paramsCourse={paramsCourse}
            setParamsCourse={setParamsCourse}
            router={router}
            category={category}
          />
        </div>
      </AnimateWrapper>

      <AnimateWrapper delay={0} direction="up" amount={0.01}>
        {isLoadingCourses ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="w-full h-full md:px-6 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2 lg:grid-cols-4 md:grid-cols-2 pb-2 ">
            {listCourse.map((course: CourseForm, index: number) => (
              <CoursesBlock key={index} {...course} />
            ))}
          </div>
        )}
      </AnimateWrapper>
    </div>
  );
};

export default Page;
