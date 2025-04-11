"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Mail, Star, BookOpen } from "lucide-react";
import CoursesBlock from "@/components/block/courses-block"; // Đảm bảo import đúng đường dẫn
import { Badge } from "@/components/ui/badge";

// Dữ liệu giả như gọi từ API
const teacherData = {
  name: "Nguyễn Văn A",
  postCount: 25,
  rating: 4.8,
  email: "nguyenvana@example.com",
  description:
    "Tôi là một giáo viên với 10 năm kinh nghiệm trong lĩnh vực giảng dạy tiếng Anh và kỹ năng mềm. Tôi luôn tận tâm giúp học viên đạt được mục tiêu học tập của mình.",
  expertise: ["Tiếng Anh", "Kỹ năng mềm", "Giao tiếp", "IELTS"],
  avatarUrl: "https://github.com/shadcn.png",
};

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

const TeacherProfile = () => {
  return (
    <div className="container bg-white dark:bg-chineseBlack rounded-xl overflow-hidden mx-auto space-y-10">
      <Card className=" mx-auto bg-white dark:bg-chineseBlack shadow-md ">
        <CardHeader className="flex flex-col md:flex-row items-center gap-6">
          <Avatar className="w-32 h-32">
            <AvatarImage src={teacherData.avatarUrl} alt={teacherData.name} />
          </Avatar>
          <div className="space-y-2 text-center md:text-left">
            <CardTitle className="text-3xl font-bold">
              {teacherData.name}
            </CardTitle>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <Mail className="w-4 h-4" />
              <span className="text-muted-foreground">{teacherData.email}</span>
            </div>
            <div className="flex gap-4 justify-center md:justify-start">
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{teacherData.postCount} bài giảng</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>{teacherData.rating.toFixed(1)}/5</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Giới thiệu</h3>
            <p className="text-muted-foreground">{teacherData.description}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Chuyên môn</h3>
            <div className="flex flex-wrap gap-2">
              {teacherData.expertise.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div className="">
            <h3 className="text-lg font-semibold mb-2">Khoá học tiêu biểu</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {dataCourse.slice(0, 2).map((course, index) => (
                <Card key={index} className="p-2">
                  <img
                    src={course.coverPhoto}
                    alt={course.title}
                    className="w-full h-40 object-cover rounded-md"
                  />
                  <div className="mt-2 space-y-1">
                    <h4 className="font-semibold text-base">{course.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {course.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danh sách khóa học */}
      <div className="max-w-6xl mx-auto space-y-6 p-2">
        <h2 className="text-2xl font-bold">Các khóa học của giảng viên</h2>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
          {dataCourse.slice(2, 10).map((course, index) => (
            <CoursesBlock
              key={index}
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
    </div>
  );
};

export default TeacherProfile;
