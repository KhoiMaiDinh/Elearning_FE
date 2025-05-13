"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Mail, Star, BookOpen } from "lucide-react";
import CoursesBlock from "@/components/block/courses-block"; // Đảm bảo import đúng đường dẫn
import { Badge } from "@/components/ui/badge";
import AnimateWrapper from "@/components/animations/animateWrapper";
import { useParams } from "next/navigation";
import { APIGetLectureByUserName } from "@/utils/lecture";
import { useEffect, useState } from "react";
import { Lecture } from "@/types/registerLectureFormType";
import { APIGetListCourse } from "@/utils/course";
import { CourseForm } from "@/types/courseType";
// Dữ liệu giả như gọi từ API

const TeacherProfile = () => {
  const { username } = useParams();
  const [teacherData, setTeacherData] = useState<Lecture>();
  const handleGetLectureByUserName = async () => {
    try {
      const response = await APIGetLectureByUserName(username as string);
      if (response && response.data) {
        setTeacherData(response.data);
      }
    } catch (error) {
      console.error("Error fetching lecture data:", error);
    }
  };

  const [dataCourse, setDataCourse] = useState<CourseForm[]>([]);
  const handleGetCourseByLectureUserName = async () => {
    try {
      const params = {
        instructor_username: username as string,
        with_instructor: true,
      };
      const response = await APIGetListCourse(params);
      if (response && response.data) {
        setDataCourse(response.data);
      }
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  };

  useEffect(() => {
    handleGetLectureByUserName();
    handleGetCourseByLectureUserName();
  }, [username]);

  return (
    <div className="container bg-white dark:bg-chineseBlack rounded-xl overflow-hidden mx-auto space-y-10">
      <Card className=" mx-auto bg-white dark:bg-chineseBlack shadow-md ">
        <AnimateWrapper delay={0.2} direction="up">
          <CardHeader className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="w-32 h-32">
              <AvatarImage
                src={
                  process.env.NEXT_PUBLIC_BASE_URL_IMAGE +
                  (teacherData?.user.profile_image?.key || "")
                }
                alt={
                  teacherData?.user.first_name +
                  " " +
                  teacherData?.user.last_name
                }
                className="object-cover"
              />
            </Avatar>
            <div className="space-y-2 text-center md:text-left">
              <CardTitle className="text-3xl font-bold">
                {teacherData?.user.first_name +
                  " " +
                  teacherData?.user.last_name}
              </CardTitle>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Mail className="w-4 h-4" />
                <span className="text-muted-foreground">
                  {teacherData?.user.email}
                </span>
              </div>
              <div className="flex gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{teacherData?.total_courses} bài giảng</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>
                    {teacherData?.avg_rating || teacherData?.avg_rating === 0
                      ? teacherData?.avg_rating?.toFixed(1)
                      : "N/A "}
                    /5
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
        </AnimateWrapper>
        <AnimateWrapper delay={0.2} direction="up">
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Giới thiệu</h3>
              <p
                className="text-muted-foreground ql-content"
                dangerouslySetInnerHTML={{
                  __html: teacherData?.biography || "",
                }}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Chuyên môn</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  {teacherData?.category?.translations[0]?.name}
                </Badge>
              </div>
            </div>

            {/* <div className="">
              <h3 className="text-lg font-semibold mb-2">Khoá học tiêu biểu</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {dataCourse.slice(0, 2).map((course, index) => (
                  <Card key={index} className="p-2">
                    <img
                      src={`${process.env.NEXT_PUBLIC_BASE_URL_IMAGE || ""}${
                        course.thumbnail?.key || ""
                      }`}
                      alt={course.title}
                      className="w-full h-40 object-cover rounded-md"
                    />
                    <div className="mt-2 space-y-1">
                      <h4 className="font-semibold text-base">
                        {course.title}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {course.description}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div> */}
          </CardContent>
        </AnimateWrapper>
      </Card>

      {/* Danh sách khóa học */}
      <AnimateWrapper delay={0.2} direction="up" amount={0.01}>
        <div className="max-w-6xl mx-auto space-y-6 p-2">
          <h2 className="text-2xl font-bold">Các khóa học của giảng viên</h2>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
            {dataCourse.map((course, index) => (
              <CoursesBlock key={index} {...course} />
            ))}
          </div>
        </div>
      </AnimateWrapper>
    </div>
  );
};

export default TeacherProfile;
