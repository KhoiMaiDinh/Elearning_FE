"use client";
import "./page.css";
import CoursesBlock from "@/components/block/courses-block";
import InfoDashboard from "@/components/block/infoDashboard";
import LecturersBlock from "@/components/block/lecturers-block";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ArrowRightCircle,
  BookCheck,
  ChevronRight,
  Film,
  GraduationCap,
  Headset,
  IdCard,
  Loader2,
  UsersRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import SplitText from "@/components/text/splitText";
import FadeContent from "@/components/animations/fadeContent";
import { useRouter } from "next/navigation";
import AnimateWrapper from "@/components/animations/animateWrapper";
import { APIGetListLecture } from "@/utils/lecture";
import { APIGetListCourse } from "@/utils/course";
import BlurColor from "@/components/blurColor/blurColor";
import { CourseForm } from "@/types/courseType";
import { Lecture } from "@/types/registerLectureFormType";
// const dataCourse = [
//   {
//     coverPhoto: "/images/course1.jpg",
//     avatar: "/images/avatar.jpg",
//     title: "Lập trình ReactJS cơ bản",
//     rating: 4.9,
//     level: "Cơ bản",
//     numberStudent: 1200,
//     description:
//       "Khóa học dành cho người mới bắt đầu muốn tìm hiểu về ReactJS.",
//     name: "Nguyễn Văn A",
//     status: "Chưa đăng ký",
//     progress: 45, // Đã hoàn thành 45% khóa học
//     price: 500000,
//     priceFinal: 450000, // Giá sau giảm
//   },
//   {
//     coverPhoto: "/images/course2.jpg",
//     avatar: "/images/avatar.jpg",
//     title: "Phân tích dữ liệu với Python",
//     rating: 4.8,
//     level: "Trung cấp",
//     numberStudent: 800,
//     description:
//       "Học cách phân tích dữ liệu và trực quan hóa với Python. Tìm hiểu cách xây dựng ứng dụng di động đa nền tảng với Flutter hg r f r rkr rx s frf er e gre rg erg er g rgs g se sg egr e g erg e t eg rver g erg er g rv.",

//     name: "Lê Thị B",
//     status: "Đang học",
//     progress: 50, // Đã hoàn thành khóa học
//     price: 700000,
//     priceFinal: 700000, // Không giảm giá
//   },
//   {
//     coverPhoto: "/images/course3.jpg",
//     avatar: "/images/avatar.jpg",
//     title: "Thiết kế giao diện với Figma",
//     rating: 4.7,
//     level: "Cơ bản",
//     numberStudent: 650,
//     description: "Khóa học cung cấp kiến thức cơ bản về thiết kế UI/UX.",
//     name: "Trần Minh C",
//     status: "Chưa đăng ký",
//     price: 400000,
//     priceFinal: 350000, // Giá sau giảm
//   },
//   {
//     coverPhoto: "/images/course4.jpg",
//     avatar: "/images/avatar.jpg",
//     title: "Lập trình Backend với Node.js",
//     rating: 4.6,
//     level: "Nâng cao",
//     numberStudent: 1550,
//     description: "Nâng cao kỹ năng lập trình backend với Node.js và Express.",
//     name: "Phạm Duy D",
//     status: "Chưa đăng ký",
//     progress: 60, // Đã hoàn thành 60% khóa học
//     price: 600000,
//     priceFinal: 500000, // Giá sau giảm
//   },
//   {
//     coverPhoto: "/images/course5.jpg",
//     avatar: "/images/avatar.jpg",
//     title: "Phát triển ứng dụng di động với Flutter",
//     rating: 4.9,
//     level: "Trung cấp",
//     numberStudent: 1100,
//     description:
//       "Tìm hiểu cách xây dựng ứng dụng di động đa nền tảng với Flutter hg r f r rkr rx s frf er e gre rg erg er g rgs g se sg egr e g erg e t eg rver g erg er g rv.",
//     name: "Hoàng Văn E",
//     status: "Chưa đăng ký",
//     progress: 100, // Đã hoàn thành khóa học
//     price: 800000,
//     priceFinal: 750000, // Giá sau giảm
//   },
// ];
export default function Page() {
  const router = useRouter();

  const [listLecture, setListLecture] = useState<Lecture[]>([]);
  const [listCourse, setListCourse] = useState<CourseForm[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paramsLecture, setParamsLecture] = useState({
    page: 1,
    limit: 10,
    search: undefined,
    specialty: undefined,
    is_approved: true,
  });

  const [paramsCourse, setParamsCourse] = useState({
    page: 1,
    limit: 10,
    search: undefined,
    category_slug: undefined,
    level: undefined,
    with_instructor: true,
  });

  const handleGetListLecture = async () => {
    try {
      setIsLoading(true);
      const response = await APIGetListLecture(paramsLecture);
      if (response && response.data) {
        setIsLoading(false);
        setListLecture(response.data);
      } else {
        setIsLoading(false);
        setError("Không tìm thấy dữ liệu");
      }
    } catch (err) {
      setIsLoading(false);
      console.error("Error during get list lecture:", err);
    }
  };

  const handleGetListCourse = async () => {
    try {
      setIsLoading(true);
      const response = await APIGetListCourse(paramsCourse);
      if (response && response.data) {
        setListCourse(response.data);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setError("Không tìm thấy dữ liệu");
      }
    } catch (err) {
      setIsLoading(false);
      console.error("Error during get list course:", err);
    }
  };
  useEffect(() => {
    handleGetListLecture();
    handleGetListCourse();
  }, []);

  return isLoading ? (
    <div className="w-full h-full flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  ) : (
    <div className="w-full min-h-screen bg-AntiFlashWhite dark:bg-eerieBlack text-richBlack dark:text-AntiFlashWhite font-sans overflow-x-hidden">
      {/* Hero Section */}

      <section className="relative overflow-hidden">
        <div className="bg-LavenderIndigo/50 w-full h-full overflow-hidden">
          <>
            <div
              className="absolute h-48 w-48 rounded-full bg-deepPink/20 blur-2xl md:h-96 md:w-96"
              style={{ top: "40%", right: "0%" }}
            />

            <div
              className="absolute h-48 w-48 rounded-full bg-deepPink/20 blur-2xl md:h-96 md:w-96"
              style={{ top: "60%", right: "40%" }}
            />

            <div
              className="absolute h-48 w-48 rounded-full bg-deepPink/20 blur-2xl md:h-96 md:w-96"
              style={{ top: "0%", right: "60%" }}
            />

            <div
              className="absolute h-48 w-48 rounded-full bg-white/70 blur-3xl md:h-96 md:w-96"
              style={{ top: "60%", right: "80%" }}
            />

            <div
              className="absolute h-48 w-48 rounded-full bg-white/70 blur-3xl md:h-96 md:w-96 z-0"
              style={{ top: "0%", right: "80%" }}
            />
            <div
              className="absolute h-48 w-48 rounded-full bg-white/70 blur-3xl md:h-96 md:w-96 z-0"
              style={{ top: "50%", right: "0%" }}
            />
          </>
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 p-4 h-[calc(100vh-64px)] z-10">
            <div className="col-span-1  md:col-span-1 relative text-left flex flex-col md:justify-center w-full dark:text-white gap-2 items-center h-full md:text-left px-4  text-LavenderIndigo font-sans  z-20">
              <SplitText
                text="Học các kỹ năng từ những giảng viên hàng đầu của chúng tôi"
                className="lg:text-[38px] text-left md:text-[24px] text-[20px] font-bold text-eerieBlack"
                delay={15}
                animationFrom={{
                  opacity: 0,
                  transform: "translate3d(0,50px,0)",
                }}
                animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
                threshold={0.2}
                rootMargin="-50px"
              />
              <SplitText
                text=" Giảng viên & chuyên gia chất lượng cao, uy tín, kinh nghiệm;"
                className="mt-2 lg:text-[16px] text-left md:text-[14px] text-[12px] md:text-black70 dark:text-white text-majorelleBlue"
                delay={10}
                animationFrom={{
                  opacity: 0,
                  transform: "translate3d(0,50px,0)",
                }}
                animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
                threshold={0.2}
                rootMargin="-50px"
              />
              <SplitText
                text="Mô hình học tập đa dạng & định hướng kết quả đầu ra, tích hợp công nghệ tiên tiến."
                className="mt-2 lg:text-[16px] text-left md:text-[14px] text-[12px] md:text-black70 dark:text-white text-majorelleBlue"
                delay={10}
                animationFrom={{
                  opacity: 0,
                  transform: "translate3d(0,50px,0)",
                }}
                animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
                threshold={0.2}
                rootMargin="-50px"
              />

              <div className="flex items-center gap-4">
                <Button
                  className="bg-custom-gradient-button-violet text-white hover:scale-105 transition-all duration-300 rounded-full px-6 py-3 font-semibold"
                  onClick={() => router.push("/course")}
                >
                  Tìm khóa học
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <div className="flex items-center gap-2 text-white">
                  <Headset className="w-6 h-6 text-beautyGreen" />
                  <div>
                    <p className="text-sm dark:text-beautyGreen text-majorelleBlue opacity-80">
                      Hotline
                    </p>
                    <p className="font-bold dark:text-beautyGreen text-majorelleBlue ">
                      1900 1008
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-1 z-10">
              <img
                src="/images/home_bg.png"
                alt="dashboard_bg"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto gap-2 flex flex-col  md:absolute z-20 left-0 right-0 bottom-0 md:translate-y-[50%]">
        <div
          className="grid grid-cols-1 h-full md:grid-cols-4 gap-6"
          data-aos="fade-up"
        >
          <AnimateWrapper direction="up" amount={0.5}>
            <InfoDashboard
              number={10}
              title={"Giảng viên"}
              Icon={IdCard}
              color="#1568DF"
              bgColor="#1568DF"
            />
          </AnimateWrapper>
          <AnimateWrapper direction="up" amount={0.5}>
            <InfoDashboard
              number={2000}
              title={"Bài học"}
              Icon={BookCheck}
              color="#219653"
              bgColor="#219653"
            />
          </AnimateWrapper>
          <AnimateWrapper direction="up" amount={0.5}>
            <InfoDashboard
              number={100}
              title={"Sinh viên"}
              Icon={GraduationCap}
              color="#9B51DF"
              bgColor="#9B51DF"
            />
          </AnimateWrapper>
          <AnimateWrapper direction="up" amount={0.5}>
            <InfoDashboard
              number={10}
              title={"Video"}
              Icon={Film}
              color="#FF2E2E"
              bgColor="#FF2E2E"
            />
          </AnimateWrapper>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white dark:bg-cosmicCobalt/10 py-16 pt-36">
        <div className="container mx-auto text-center" data-aos="fade-up">
          <AnimateWrapper delay={0.3} direction="up">
            <h2 className="text-3xl md:text-4xl font-bold text-cosmicCobalt dark:text-white mb-6">
              Về chúng tôi
            </h2>
            <p className="text-darkSilver dark:text-lightSilver max-w-3xl mx-auto leading-relaxed">
              Chúng tôi cung cấp các khóa học kết hợp lý thuyết và thực hành,
              được thiết kế bởi đội ngũ chuyên gia hàng đầu. Mục tiêu là mang
              lại giá trị thực tiễn cho học viên và doanh nghiệp thông qua giáo
              dục chất lượng cao.
            </p>
          </AnimateWrapper>
        </div>
      </section>

      <section className="relative bg-LavenderIndigo/50 w-screen h-full p-4 overflow-hidden">
        <div className="container mx-auto">
          <BlurColor />

          <div className="container mx-auto z-20">
            <AnimateWrapper delay={0.3} direction="up">
              <section className="container mx-auto py-16">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl z-10 font-bold text-cosmicCobalt dark:text-AntiFlashWhite">
                    Giảng viên tiêu biểu
                  </h2>
                  <Button
                    variant="link"
                    className="z-10 text-cosmicCobalt dark:text-AntiFlashWhite dark:hover:text-AntiFlashWhite/80 hover:text-majorelleBlue70"
                    onClick={() => router.push("/lecture")}
                  >
                    Xem tất cả <ChevronRight className="ml-1 w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 z-10 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {listLecture.slice(0, 4).map((lecture, index) => (
                    <FadeContent
                      key={index}
                      blur={true}
                      duration={100}
                      easing="ease-out"
                      initialOpacity={0}
                      className="transform transition-all hover:-translate-y-2"
                    >
                      <LecturersBlock
                        avatar={lecture?.user?.profile_image?.key}
                        name={
                          lecture?.user?.first_name +
                          " " +
                          lecture?.user?.last_name
                        }
                        rating={lecture?.user?.rating}
                        major={lecture?.category?.translations[0]?.name}
                        numberCourse={lecture?.total_courses}
                        numberStudent={lecture?.user?.number_student}
                        description={lecture?.biography}
                        username={lecture?.user?.username}
                      />{" "}
                    </FadeContent>
                  ))}
                </div>
              </section>
            </AnimateWrapper>

            {/* Courses Section */}
            <AnimateWrapper delay={0.3} direction="up">
              <section className="py-16">
                <div className="container z-10 mx-auto">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl z-10 font-bold text-cosmicCobalt dark:text-AntiFlashWhite">
                      Khóa học nổi bật
                    </h2>
                    <Button
                      variant="link"
                      className="z-10 text-cosmicCobalt dark:text-AntiFlashWhite dark:hover:text-AntiFlashWhite/80 hover:text-majorelleBlue70"
                      onClick={() => router.push("/course")}
                    >
                      Xem tất cả <ChevronRight className="ml-1 w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid z-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {listCourse.slice(0, 4).map((course, index) => (
                      <FadeContent
                        key={index}
                        blur={true}
                        duration={100}
                        easing="ease-out"
                        initialOpacity={0}
                        className="transform transition-all hover:-translate-y-2"
                      >
                        <CoursesBlock {...course} />
                      </FadeContent>
                    ))}
                  </div>
                </div>
              </section>
            </AnimateWrapper>
          </div>
        </div>
      </section>

      {/* Lecturers Section */}

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-majorelleBlue to-persianIndigo dark:text-white text-cosmicCobalt py-16">
        <div className="container mx-auto text-center" data-aos="zoom-in">
          <AnimateWrapper delay={0.3} direction="up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Sẵn sàng nâng cao kỹ năng của bạn?
            </h2>
          </AnimateWrapper>
          <AnimateWrapper delay={0.3} direction="up">
            <p className="text-lg mb-6 max-w-2xl mx-auto text-darkSilver">
              Tham gia ngay hôm nay để trải nghiệm học tập chất lượng từ đội ngũ
              giảng viên hàng đầu.
            </p>
          </AnimateWrapper>
          <AnimateWrapper delay={0.3} direction="up">
            <Button
              className="bg-yankeesBlue text-white hover:bg-yankeesBlue/80 rounded-full px-8 py-3 font-semibold"
              onClick={() => router.push("/signup")}
            >
              Bắt đầu ngay <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </AnimateWrapper>
        </div>
      </section>
    </div>
  );
}
