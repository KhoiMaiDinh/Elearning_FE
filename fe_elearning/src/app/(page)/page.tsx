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
  Film,
  GraduationCap,
  Headset,
  IdCard,
  UsersRound,
} from "lucide-react";
import { useEffect } from "react";
import AOS from "aos";

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
  useEffect(() => {
    AOS.init({
      duration: 500, // Thời gian animation (mặc định là 1000ms)
      once: true, // Chỉ chạy animation một lần khi cuộn đến
    });
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-3 bg-AntiFlashWhite dark:bg-eerieBlack dark:text-AntiFlashWhite font-sans font-medium text-majorelleBlue overflow-auto">
      <div className="flex flex-col w-full gap-4">
        {/* Ảnh nền với animation fade-up */}
        <div
          data-aos="fade-up"
          className="bg-contain md:bg-right bg-center gap-2 bg-no-repeat w-full lg:h-[500px] md:h-[450px] h-[400px] rounded-md overflow-hidden"
          style={{ backgroundImage: `url(${"/images/dashboard_bg.png"})` }}
        >
          <div className="flex flex-col justify-center w-3/5 gap-2 items-center h-full md:w-2/5 md:text-left px-4  text-white md:text-majorelleBlue font-sans text-center z-20">
            <h1 className="lg:text-[38px] md:text-[24px] text-[20px] font-bold">
              Học các kỹ năng từ những giảng viên hàng đầu của chúng tôi
            </h1>
            <p className="mt-2 lg:text-[16px] md:text-[14px] text-[12px] md:text-black70 dark:text-white text-white">
              Giảng viên & chuyên gia chất lượng cao, uy tín, kinh nghiệm; Mô
              hình học tập đa dạng & định hướng kết quả đầu ra, tích hợp công
              nghệ tiên tiến.
            </p>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
              <button className="button transform transition hover:scale-110 duration-300 ease-in-out">
                Tìm khóa học
                <ArrowRightCircle className="icon" color="#fff" />
              </button>
              <div className="flex flex-row gap-2 items-center justify-center">
                <Headset size={32} className="text-majorelleBlue font-bold" />
                <div className="flex flex-col font-sans font-medium text-[16px]">
                  <span className="text-majorelleBlue70">Hotline LH</span>
                  <span className="text-majorelleBlue font-bold">
                    1900 1008
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nội dung nằm trên lớp phủ với animation flip-down */}
        <div
          data-aos="flip-down"
          className="flex flex-col items-center justify-center gap-4"
        >
          <text className="font-sans font-bold text-[28px] text-gray-900 dark:text-AntiFlashWhite">
            Giới thiệu chung
          </text>
          <text className="font-sans font-medium text-[16px] text-darkSilver text-center md:w-1/2 w-4/5">
            Các khóa học của chúng tôi đều được xây dựng kết hợp giữa lý thuyết
            nền tảng và tính ứng dụng thực tế. Đội ngũ tư vấn và giảng viên là
            chuyên gia nhiều năm kinh nghiệm trong lĩnh vực đào tạo và tư vấn.
            Ngoài các khóa đào tạo cho cá nhân, doanh nghiệp trên nền tảng
            offline và online, triển khai hệ thống cho doanh nghiệp. Đào tạo và
            cung cấp nhân sự chất lượng cao đến các doanh nghiệp có nhu cầu. Mục
            tiêu của trung tâm là mang lại những dịch vụ có giá trị thực tiễn
            đến doanh nghiệp.
          </text>
          <div
            data-aos="fade-up"
            className="grid grid-cols-2 md:grid-cols-4 w-full gap-4 items-center justify-center"
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
              number={1000}
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
        </div>
      </div>
      <hr className="py-4" />

      <div data-aos="fade-up" className="w-full flex flex-col gap-2">
        <div className="w-full flex flex-row items-center justify-between">
          <text className="text-[20px] text-gray-900 dark:text-AntiFlashWhite">
            Top giảng viên tại E-Learning
          </text>
          <text className="text-[12px] text-lightSilver dark:text-gray-400">
            Xem thêm
          </text>
        </div>
        <div className="w-full h-full px-6 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-2 lg:grid-cols-4 md:grid-cols-2">
          {dataLecture.map((lecture: lectureBlock, index: number) => (
            <div data-aos="fade-up" key={index}>
              <LecturersBlock
                avatar={lecture.avatar}
                name={lecture.name}
                rating={lecture.rating}
                major={lecture.major}
                numberCourse={lecture.numberCourse}
                numberStudent={lecture.numberStudent}
                description={lecture.description}
              />
            </div>
          ))}
        </div>
      </div>

      <div data-aos="fade-up" className="w-full flex flex-col gap-2">
        <div className="w-full flex flex-row items-center justify-between">
          <text className="text-[20px] text-gray-900 dark:text-AntiFlashWhite">
            Top Khóa học tại E-Learning
          </text>
          <text className="text-[12px] text-lightSilver dark:text-gray-400">
            Xem thêm
          </text>
        </div>
        <div className="w-full h-full px-6 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2 lg:grid-cols-4 md:grid-cols-2">
          {dataCourse.map((course: courseBlock, index: number) => (
            <div data-aos="fade-up" key={index}>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
