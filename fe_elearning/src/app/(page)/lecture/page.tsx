"use client";
import LecturersBlock from "@/components/block/lecturers-block";
import FilterBlock from "@/components/filter/filter-block";
import React, { useEffect, useRef, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import AnimateWrapper from "@/components/animations/animateWrapper";
import { APIGetListLecture } from "@/utils/lecture";
import { Lecture } from "@/types/registerLectureFormType";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
// const dataLecture: lectureBlock[] = [
//   {
//     avatar: "/images/avatar.jpg",
//     name: "Lê Thị Thu Hiền",
//     rating: 4.9,
//     major: "Công nghệ thông tin",
//     description:
//       "Chuyên gia CNTT vớibáo khoa học đạt chuẩn quốc tế báo khoa học đạt chuẩn quốc tếbáo khoa học đạt chuẩn quốc tếbáo khoa học đạt chuẩn quốc tếbáo khoa học đạt chuẩn quốc tếbáo khoa học đạt chuẩn quốc tếbáo khoa học đạt chuẩn quốc tếbáo khoa học đạt chuẩn quốc tếbáo khoa học đạt chuẩn quốc tếbáo khoa học đạt chuẩn quốc tế, bằng thạc sĩ đồ đó, blalabla nha.",
//     numberCourse: 12,
//     numberStudent: 250,
//   },
//   {
//     avatar: "/images/avatar2.jpg",
//     name: "Nguyễn Văn An",
//     rating: 4.8,
//     major: "Phân tích dữ liệu",
//     description:
//       "Kinh nghiệm 10 năm trong lĩnh vực phân tích dữ liệu và hướng dẫn sử dụng các công cụ như Python, R và Tableau.",
//     numberCourse: 8,
//     numberStudent: 180,
//   },
//   {
//     avatar: "/images/avatar.jpg",
//     name: "Lê Thị Thu Hiền",
//     rating: 4.9,
//     major: "Công nghệ thông tin",
//     description:
//       "Chuyên gia CNTT với nhiều năm kinh nghiệm giảng dạy, cùng với đó là các bài báo khoa học đạt chuẩn quốc tế, bằng thạc sĩ đồ đó, blalabla nha.",
//     numberCourse: 12,
//     numberStudent: 250,
//   },
//   {
//     avatar: "/images/avatar2.jpg",
//     name: "Nguyễn Văn An",
//     rating: 4.8,
//     major: "Phân tích dữ liệu",
//     description:
//       "Kinh nghiệm 10 năm trong lĩnh vực phân tích dữ liệu và hướng dẫn sử dụng các công cụ như Python, R và Tableau.",
//     numberCourse: 8,
//     numberStudent: 180,
//   },
//   {
//     avatar: "/images/avatar.jpg",
//     name: "Lê Thị Thu Hiền",
//     rating: 4.9,
//     major: "Công nghệ thông tin",
//     description:
//       "Chuyên gia CNTT với nhiều năm kinh nghiệm giảng dạy, cùng với đó là các bài báo khoa học đạt chuẩn quốc tế, bằng thạc sĩ đồ đó, blalabla nha.",
//     numberCourse: 12,
//     numberStudent: 250,
//   },
//   {
//     avatar: "/images/avatar2.jpg",
//     name: "Nguyễn Văn An",
//     rating: 4.8,
//     major: "Phân tích dữ liệu",
//     description:
//       "Kinh nghiệm 10 năm trong lĩnh vực phân tích dữ liệu và hướng dẫn sử dụng các công cụ như Python, R và Tableau.",
//     numberCourse: 8,
//     numberStudent: 180,
//   },
//   {
//     avatar: "/images/avatar.jpg",
//     name: "Lê Thị Thu Hiền",
//     rating: 4.9,
//     major: "Công nghệ thông tin",
//     description:
//       "Chuyên gia CNTT với nhiều năm kinh nghiệm giảng dạy, cùng với đó là các bài báo khoa học đạt chuẩn quốc tế, bằng thạc sĩ đồ đó, blalabla nha.",
//     numberCourse: 12,
//     numberStudent: 250,
//   },
//   {
//     avatar: "/images/avatar2.jpg",
//     name: "Nguyễn Văn An",
//     rating: 4.8,
//     major: "Phân tích dữ liệu",
//     description:
//       "Kinh nghiệm 10 năm trong lĩnh vực phân tích dữ liệu và hướng dẫn sử dụng các công cụ như Python, R và Tableau.",
//     numberCourse: 8,
//     numberStudent: 180,
//   },
//   //... more lecturers
// ];

const Page = () => {
  const router = useRouter();
  const [lecture, setLecture] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    search: undefined,
    order: undefined,
    specialty: undefined,
  });
  const handleGetLecture = async () => {
    setLoading(true);
    const response = await APIGetListLecture(filter);
    if (response?.status === 200) {
      setLecture(response.data);
    }
    setLoading(false);
  };
  const handleScrollToLecture = () => {
    const lectureSection = document.getElementById("lecture");
    if (lectureSection) {
      lectureSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    // Scroll to top when the component mounts or route changes
    handleGetLecture();
    window.scrollTo(0, 0);
  }, []);
  return loading ? (
    <div className="w-full h-full flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  ) : (
    <div className="w-full h-full flex flex-col p-6  gap-3 bg-AntiFlashWhite dark:bg-eerieBlack font-sans font-medium text-majorelleBlue  overflow-auto">
      {/* header */}
      <div className="grid md:grid-cols-3 grid-cols-1 items-center ">
        {" "}
        <div className="md:col-span-2 col-span-1 flex items-center justify-center flex-col text-center text-white ">
          <AnimateWrapper direction="left">
            <div className="md:col-span-2 col-span-1 flex items-center justify-center flex-col text-center text-white md:px-4">
              <h1 className="lg:text-4xl md:text-2xl text-xl font-extrabold dark:text-white text-eerieBlack leading-tight">
                Gặp gỡ đội ngũ{" "}
                <span className="text-LavenderIndigo">giảng viên ưu tú</span>
                <br />
                từ các lĩnh vực khác nhau
              </h1>{" "}
              <p className="mt-4 lg:text-lg md:text-sm text-xs text-muted-foreground max-w-xl">
                Đội ngũ giảng viên của chúng tôi bao gồm những chuyên gia hàng
                đầu trong nhiều lĩnh vực — luôn sẵn sàng truyền cảm hứng và kiến
                thức thực chiến cho bạn.
              </p>
              <div className="mt-4 md:mt-6 flex md:gap-4 gap-2 md:text-base text-[10px]">
                <button
                  className="bg-custom-gradient-button-violet text-white md:px-6 px-4 py-2 rounded-xl hover:bg-majorelleBlue70 transition"
                  onClick={handleScrollToLecture}
                >
                  Khám phá giảng viên
                </button>
                <button
                  className="border dark:border-white border-eerieBlack  dark:text-white text-eerieBlack px-6 py-2 rounded-xl hover:text-white hover:bg-eerieBlack dark:hover:bg-white dark:hover:text-black transition"
                  onClick={() => router.push("/course")}
                >
                  Đăng ký học thử
                </button>
              </div>
            </div>
          </AnimateWrapper>
        </div>
        <div className="col-span-1 flex justify-center">
          <img
            src="/images/lecture_bg.png"
            alt="Giảng viên"
            className="md:w-[300px] w-[200px] rounded-xl"
          />
        </div>
      </div>

      {/* Giang vien uu tu */}
      <section className="py-12  overflow-hidden">
        <AnimateWrapper direction="up">
          <div className="text-center mb-8">
            <h2 className="md:text-2xl text-xl font-bold text-cosmicCobalt dark:text-white">
              Gương mặt ưu tú
            </h2>
            <p className="md:text-sm text-xs text-muted-foreground mt-2">
              Những giảng viên xuất sắc đồng hành cùng bạn
            </p>
          </div>
        </AnimateWrapper>

        <div className="relative w-full whitespace-nowrap">
          <AnimateWrapper direction="up">
            <div className="inline-flex animate-marquee space-x-4 md:space-x-6 gap-4 md:gap-10">
              {lecture.concat(lecture).map((lecture: Lecture, idx: number) => (
                <div
                  key={idx}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-white dark:border-darkSilver shadow-md"
                >
                  <img
                    src={`${process.env.NEXT_PUBLIC_BASE_URL_IMAGE}${lecture?.user?.profile_image?.key}`}
                    alt={`Lecturer ${idx}`}
                    className="object-cover text-cosmicCobalt w-full h-full"
                  />
                </div>
              ))}
            </div>
          </AnimateWrapper>
        </div>
      </section>

      {/* Danh sach giang vien */}
      <AnimateWrapper direction="up">
        <div className="md:px-6 pt-4 pb-2" id="lecture">
          <h2 className="md:text-2xl text-xl font-bold text-cosmicCobalt dark:text-white">
            Danh sách giảng viên
          </h2>
          <p className="md:text-sm text-xs text-muted-foreground mt-1">
            Khám phá đội ngũ giảng viên nhiều kinh nghiệm, tận tâm và đầy nhiệt
            huyết.
          </p>
        </div>
      </AnimateWrapper>
      <AnimateWrapper direction="up" amount={0.01}>
        <div className="w-full h-full flex items-end justify-end">
          <FilterBlock />
        </div>
        <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-2 lg:grid-cols-4 md:grid-cols-2 ">
          {lecture.map((lecture: Lecture, index: number) => (
            <LecturersBlock
              avatar={lecture?.user?.profile_image?.key}
              name={lecture.user.first_name + " " + lecture.user.last_name}
              rating={lecture.user.rating}
              major={lecture.category.translations[0].name}
              numberCourse={lecture.total_courses}
              numberStudent={lecture.user.number_student}
              description={lecture.biography}
              username={lecture?.user?.username}
            />
          ))}
        </div>
      </AnimateWrapper>
    </div>
  );
};

export default Page;
