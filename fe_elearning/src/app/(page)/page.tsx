"use client";
import "./page.css";
import CoursesBlock from "@/components/block/courses-block";
import InfoDashboard from "@/components/block/infoDashboard";
import LecturersBlock from "@/components/block/lecturers-block";
import { Button } from "@/components/ui/button";
import courseBlock from "@/types/coursesBlockType";
import lectureBlock from "@/types/lecturesBlockType";
import {
  ArrowRight,
  ArrowRightCircle,
  BookCheck,
  ChevronRight,
  Film,
  GraduationCap,
  Headset,
  IdCard,
  UsersRound,
} from "lucide-react";
import { useEffect } from "react";
import AOS from "aos";
import SplitText from "@/components/text/splitText";
import FadeContent from "@/components/animations/fadeContent";
import Aurora from "@/components/animations/background-aurora";
import { useRouter } from "next/navigation";

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
    status: "Đang học",
    progress: 50, // Đã hoàn thành khóa học
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
export default function Page() {
  const router = useRouter();
  return (
    // <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans overflow-x-hidden">
    //   {/* Hero Section với gradient overlay */}
    //   <section className="relative w-full h-[600px] bg-gradient-to-r from-indigo-600 to-purple-600">
    //     <div className="absolute inset-0 bg-black/40 z-10" />
    //     <div
    //       className="absolute inset-0 bg-cover bg-center"
    //       style={{ backgroundImage: `url('/images/dashboard_bg.png')` }}
    //     />
    //     <div className="relative z-20 container mx-auto h-full flex items-center">
    //       <div className="max-w-2xl space-y-6 text-white">
    //         <SplitText
    //           text="Khám phá kỹ năng mới từ những chuyên gia hàng đầu"
    //           className="text-4xl md:text-5xl font-bold leading-tight"
    //           delay={15}
    //           animationFrom={{ opacity: 0, transform: "translateY(50px)" }}
    //           animationTo={{ opacity: 1, transform: "translateY(0px)" }}
    //         />
    //         <SplitText
    //           text="Học tập linh hoạt với các khóa học chất lượng cao, được thiết kế bởi đội ngũ giảng viên giàu kinh nghiệm."
    //           className="text-lg md:text-xl text-gray-200"
    //           delay={10}
    //           animationFrom={{ opacity: 0, transform: "translateY(50px)" }}
    //           animationTo={{ opacity: 1, transform: "translateY(0px)" }}
    //         />
    //         <div className="flex items-center gap-4">
    //           <Button
    //             className="bg-white text-indigo-600 hover:bg-indigo-100 transition-all duration-300 rounded-full px-6 py-3 font-semibold"
    //             onClick={() => router.push("/courses")}
    //           >
    //             Tìm khóa học
    //             <ArrowRight className="ml-2 w-5 h-5" />
    //           </Button>
    //           <div className="flex items-center gap-2 text-white">
    //             <Headset className="w-6 h-6" />
    //             <div>
    //               <p className="text-sm opacity-80">Hotline</p>
    //               <p className="font-bold">1900 1008</p>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </section>

    //   {/* Stats Section */}
    //   <section className="container mx-auto py-16">
    //     <div
    //       className="grid grid-cols-1 md:grid-cols-4 gap-6"
    //       data-aos="fade-up"
    //     >
    // <InfoDashboard
    //   number={10}
    //   title={"Giảng viên"}
    //   Icon={IdCard}
    //   color="#1568DF"
    // />
    // <InfoDashboard
    //   number={2000}
    //   title={"Bài học"}
    //   Icon={BookCheck}
    //   color="#219653"
    // />
    // <InfoDashboard
    //   number={100}
    //   title={"Sinh viên"}
    //   Icon={GraduationCap}
    //   color="#9B51DF"
    // />
    // <InfoDashboard
    //   number={10}
    //   title={"Video"}
    //   Icon={Film}
    //   color="#FF2E2E"
    // />
    //     </div>
    //   </section>

    //   {/* About Section */}
    //   <section className="bg-white dark:bg-gray-800 py-16">
    //     <div className="container mx-auto text-center" data-aos="fade-up">
    //       <h2 className="text-3xl md:text-4xl font-bold mb-6">Về chúng tôi</h2>
    //       <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
    //         Chúng tôi cung cấp các khóa học kết hợp lý thuyết và thực hành, được
    //         thiết kế bởi đội ngũ chuyên gia hàng đầu. Mục tiêu là mang lại giá
    //         trị thực tiễn cho học viên và doanh nghiệp thông qua giáo dục chất
    //         lượng cao.
    //       </p>
    //     </div>
    //   </section>

    //   {/* Lecturers Section */}
    //   <section className="container mx-auto py-16">
    //     <div className="flex items-center justify-between mb-8">
    //       <h2 className="text-3xl font-bold">Giảng viên tiêu biểu</h2>
    //       <Button
    //         variant="link"
    //         className="text-indigo-600 hover:text-indigo-800"
    //         onClick={() => router.push("/lecturers")}
    //       >
    //         Xem tất cả <ChevronRight className="ml-1 w-4 h-4" />
    //       </Button>
    //     </div>
    //     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    //       {dataLecture.slice(0, 4).map((lecture, index) => (
    //         <FadeContent
    //           key={index}
    //           blur={true}
    //           duration={100}
    //           easing="ease-out"
    //           initialOpacity={0}
    //           className="transform transition-all hover:-translate-y-2"
    //         >
    //           <LecturersBlock {...lecture} />
    //         </FadeContent>
    //       ))}
    //     </div>
    //   </section>

    //   {/* Courses Section */}
    //   <section className="bg-gray-100 dark:bg-gray-800 py-16">
    //     <div className="container mx-auto">
    //       <div className="flex items-center justify-between mb-8">
    //         <h2 className="text-3xl font-bold">Khóa học nổi bật</h2>
    //         <Button
    //           variant="link"
    //           className="text-indigo-600 hover:text-indigo-800"
    //           onClick={() => router.push("/courses")}
    //         >
    //           Xem tất cả <ChevronRight className="ml-1 w-4 h-4" />
    //         </Button>
    //       </div>
    //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    //         {dataCourse.slice(0, 4).map((course, index) => (
    //           <FadeContent
    //             key={index}
    //             blur={true}
    //             duration={100}
    //             easing="ease-out"
    //             initialOpacity={0}
    //             className="transform transition-all hover:-translate-y-2"
    //           >
    //             <CoursesBlock {...course} />
    //           </FadeContent>
    //         ))}
    //       </div>
    //     </div>
    //   </section>

    //   {/* CTA Section */}
    //   <section className="bg-indigo-600 text-white py-16">
    //     <div className="container mx-auto text-center" data-aos="zoom-in">
    //       <h2 className="text-3xl md:text-4xl font-bold mb-4">
    //         Sẵn sàng nâng cao kỹ năng của bạn?
    //       </h2>
    //       <p className="text-lg mb-6 max-w-2xl mx-auto">
    //         Tham gia ngay hôm nay để trải nghiệm học tập chất lượng từ đội ngũ
    //         giảng viên hàng đầu.
    //       </p>
    //       <Button
    //         className="bg-white text-indigo-600 hover:bg-gray-100 rounded-full px-8 py-3 font-semibold"
    //         onClick={() => router.push("/signup")}
    //       >
    //         Bắt đầu ngay <ArrowRight className="ml-2 w-5 h-5" />
    //       </Button>
    //     </div>
    //   </section>
    // </div>

    <div className="w-full min-h-screen bg-AntiFlashWhite dark:bg-eerieBlack text-richBlack dark:text-AntiFlashWhite font-sans overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] bg-gradient-to-r from-majorelleBlue to-cosmicCobalt">
        <div className="absolute inset-0 bg-black/30 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center dark:opacity-20 opacity-50"
          style={{ backgroundImage: `url('/images/dashboard_bg.png')` }}
        />
        <div className="relative flex flex-col md:justify-center w-full dark:text-white gap-2 items-center h-full md:w-2/5 md:text-left px-4  text-majorelleBlue md:text-majorelleBlue font-sans text-center z-20">
          <SplitText
            text="Học các kỹ năng từ những giảng viên hàng đầu của chúng tôi"
            className="lg:text-[38px] text-left md:text-[24px] text-[20px] font-bold"
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
            text=" Giảng viên & chuyên gia chất lượng cao, uy tín, kinh nghiệm; Mô
              hình học tập đa dạng & định hướng kết quả đầu ra, tích hợp công
              nghệ tiên tiến."
            className="mt-2 lg:text-[16px] md:text-[14px] text-[12px] md:text-black70 dark:text-white text-majorelleBlue"
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
              className="bg-majorelleBlue text-white hover:bg-majorelleBlue70 transition-all duration-300 rounded-full px-6 py-3 font-semibold"
              onClick={() => router.push("/courses")}
            >
              Tìm khóa học
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2 text-white">
              <Headset className="w-6 h-6 text-beautyGreen" />
              <div>
                <p className="text-sm opacity-80">Hotline</p>
                <p className="font-bold dark:text-beautyGreen text-majorelleBlue ">
                  1900 1008
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto py-16">
        <div
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
          data-aos="fade-up"
        >
          <InfoDashboard
            number={10}
            title={"Giảng viên"}
            Icon={IdCard}
            color="#1568DF"
          />
          <InfoDashboard
            number={2000}
            title={"Bài học"}
            Icon={BookCheck}
            color="#219653"
          />
          <InfoDashboard
            number={100}
            title={"Sinh viên"}
            Icon={GraduationCap}
            color="#9B51DF"
          />
          <InfoDashboard
            number={10}
            title={"Video"}
            Icon={Film}
            color="#FF2E2E"
          />
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white dark:bg-cosmicCobalt/10 py-16">
        <div className="container mx-auto text-center" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-majorelleBlue dark:text-majorelleBlue mb-6">
            Về chúng tôi
          </h2>
          <p className="text-darkSilver dark:text-lightSilver max-w-3xl mx-auto leading-relaxed">
            Chúng tôi cung cấp các khóa học kết hợp lý thuyết và thực hành, được
            thiết kế bởi đội ngũ chuyên gia hàng đầu. Mục tiêu là mang lại giá
            trị thực tiễn cho học viên và doanh nghiệp thông qua giáo dục chất
            lượng cao.
          </p>
        </div>
      </section>

      {/* Lecturers Section */}
      <section className="container mx-auto py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-cosmicCobalt dark:text-AntiFlashWhite">
            Giảng viên tiêu biểu
          </h2>
          <Button
            variant="link"
            className="text-majorelleBlue hover:text-majorelleBlue70"
            onClick={() => router.push("/lecturers")}
          >
            Xem tất cả <ChevronRight className="ml-1 w-4 h-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dataLecture.slice(0, 4).map((lecture, index) => (
            <FadeContent
              key={index}
              blur={true}
              duration={100}
              easing="ease-out"
              initialOpacity={0}
              className="transform transition-all hover:-translate-y-2"
            >
              <LecturersBlock {...lecture} />
            </FadeContent>
          ))}
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-cosmicCobalt dark:text-AntiFlashWhite">
              Khóa học nổi bật
            </h2>
            <Button
              variant="link"
              className="text-majorelleBlue hover:text-majorelleBlue70"
              onClick={() => router.push("/courses")}
            >
              Xem tất cả <ChevronRight className="ml-1 w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dataCourse.slice(0, 4).map((course, index) => (
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

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-majorelleBlue to-persianIndigo dark:text-white text-majorelleBlue py-16">
        <div className="container mx-auto text-center" data-aos="zoom-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sẵn sàng nâng cao kỹ năng của bạn?
          </h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto text-darkSilver">
            Tham gia ngay hôm nay để trải nghiệm học tập chất lượng từ đội ngũ
            giảng viên hàng đầu.
          </p>
          <Button
            className="bg-yankeesBlue text-white hover:bg-yankeesBlue/80 rounded-full px-8 py-3 font-semibold"
            onClick={() => router.push("/signup")}
          >
            Bắt đầu ngay <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
