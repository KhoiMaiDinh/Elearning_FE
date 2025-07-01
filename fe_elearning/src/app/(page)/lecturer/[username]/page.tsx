'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Mail, Star, BookOpen, Users, Globe, Facebook, Linkedin } from 'lucide-react';
import CoursesBlock from '@/components/block/courses-block';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AnimateWrapper from '@/components/animations/animateWrapper';
import { useParams } from 'next/navigation';
import { APIGetInstructorByUserName } from '@/utils/instructor';
import { useEffect, useState } from 'react';
import type { InstructorType } from '@/types/instructorType';
import { APIGetFavoriteCourse, APIGetListCourse } from '@/utils/course';
import type { CourseForm } from '@/types/courseType';
import Link from 'next/link';
import LecturerProfileSkeleton from '@/components/skeleton/lecturerProfileSkeleton';

const TeacherProfile = () => {
  const { username } = useParams();
  const [teacherData, setTeacherData] = useState<InstructorType>();
  const [dataCourse, setDataCourse] = useState<CourseForm[]>([]);
  const [favoriteCourse, setFavoriteCourse] = useState<CourseForm[]>([]);
  const [loading, setLoading] = useState(true);

  const handleGetLectureByUserName = async () => {
    try {
      const response = await APIGetInstructorByUserName(username as string);
      if (response && response.data) {
        setTeacherData(response.data);
      }
    } catch (error) {
      console.error('Error fetching lecture data:', error);
    }
  };

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
      console.error('Error fetching course data:', error);
    }
  };

  const handleGetFavoriteCourse = async () => {
    try {
      const response = await APIGetFavoriteCourse();
      if (response && response.data) {
        setFavoriteCourse(response.data);
      }
    } catch (error) {
      console.error('Error fetching favorite course data:', error);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        handleGetLectureByUserName(),
        handleGetCourseByLectureUserName(),
        handleGetFavoriteCourse(),
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      fetchAllData();
    }
  }, [username]);

  // Show skeleton while loading
  if (loading) {
    return <LecturerProfileSkeleton />;
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const formatRating = (rating: number | null | undefined) => {
    if (rating === null || rating === undefined) {
      return 'N/A';
    }
    return rating === 0 ? '0' : rating.toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Teacher Profile Card */}
        <AnimateWrapper delay={0.2} direction="up">
          <Card className="mb-8 overflow-hidden border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Avatar Section */}
                <div className="flex flex-col items-center lg:items-start">
                  <Avatar className="w-32 h-32 mb-4">
                    <AvatarImage
                      src={
                        teacherData?.user?.profile_image?.key
                          ? `${process.env.NEXT_PUBLIC_BASE_URL_IMAGE}${teacherData?.user?.profile_image?.key}`
                          : ''
                      }
                      alt={teacherData?.user.first_name + ' ' + teacherData?.user.last_name}
                      className="object-cover"
                    />
                  </Avatar>
                  {/* <div className="w-8 h-8 bg-green-500 rounded-full border-4 border-white -mt-6 ml-20 lg:ml-20" /> */}
                </div>

                {/* Info Section */}
                <div className="flex-1 space-y-6">
                  {/* Name and Title */}
                  <div className="text-center lg:text-left">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {teacherData?.user.first_name + ' ' + teacherData?.user.last_name}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                      {teacherData?.headline || 'Giảng viên chuyên nghiệp'}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <BookOpen className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          {teacherData?.total_courses || 0}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Khóa học</p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Users className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          {teacherData?.total_students || 0}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Học viên</p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <div className="flex mr-2">{renderStars(teacherData?.avg_rating || 0)}</div>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          {formatRating(teacherData?.avg_rating)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Đánh giá</p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          {teacherData?.approved_at
                            ? new Date(teacherData.approved_at).getFullYear()
                            : '2024'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Tham gia</p>
                    </div>
                  </div>

                  {/* Contact and Social */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center justify-center lg:justify-start">
                      <Mail className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-gray-600 dark:text-gray-300">
                        {teacherData?.user.email}
                      </span>
                    </div>

                    <div className="flex items-center justify-center lg:justify-end space-x-3">
                      {teacherData?.website_url && (
                        <Link href={teacherData.website_url} target="_blank">
                          <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                            <Globe className="w-4 h-4" />
                          </Button>
                        </Link>
                      )}
                      {teacherData?.facebook_url && (
                        <Link href={teacherData.facebook_url} target="_blank">
                          <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                            <Facebook className="w-4 h-4" />
                          </Button>
                        </Link>
                      )}
                      {teacherData?.linkedin_url && (
                        <Link href={teacherData.linkedin_url} target="_blank">
                          <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                            <Linkedin className="w-4 h-4" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimateWrapper>

        {/* About and Expertise */}
        <div className="mb-8">
          <AnimateWrapper delay={0.3} direction="up">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="grid lg:grid-cols-4 gap-6">
                  {/* About - Takes more space */}
                  <div className="lg:col-span-3">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-blue-600" />
                      Giới thiệu về giảng viên
                    </h2>
                    <div
                      className="prose prose-gray dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 ql-content"
                      dangerouslySetInnerHTML={{
                        __html: teacherData?.biography || 'Chưa có thông tin giới thiệu.',
                      }}
                    />
                  </div>

                  {/* Expertise - Compact sidebar */}
                  <div className="lg:col-span-1">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <BookOpen className="w-4 h-4 mr-2 text-purple-600" />
                      Chuyên môn
                    </h3>
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-0 px-3 py-2 text-sm w-full justify-center"
                    >
                      {teacherData?.category?.translations[0]?.name || 'Chưa xác định'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimateWrapper>
        </div>

        {/* Courses Section */}
        <AnimateWrapper delay={0.5} direction="up">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Các khóa học của giảng viên
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Khám phá những khóa học chất lượng cao được thiết kế bởi giảng viên
              </p>
            </div>

            {dataCourse && dataCourse.length > 0 ? (
              <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
                {Array.isArray(dataCourse) &&
                  dataCourse.length > 0 &&
                  dataCourse.map((course, index) => (
                    <CoursesBlock
                      key={index}
                      {...course}
                      is_favorite={
                        favoriteCourse?.some((favorite) => favorite?.id === course?.id) || false
                      }
                    />
                  ))}
              </div>
            ) : (
              <Card className="border-0 shadow-lg">
                <CardContent className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Chưa có khóa học nào
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Giảng viên đang chuẩn bị những khóa học tuyệt vời. Hãy quay lại sau nhé!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </AnimateWrapper>
      </div>
    </div>
  );
};

export default TeacherProfile;
