'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  BookCheck,
  ChevronRight,
  Film,
  GraduationCap,
  Headset,
  BadgeIcon as IdCard,
  Loader2,
  Clock,
  TrendingUp,
  Star,
  BookOpen,
  Search,
  Bookmark,
  BarChart3,
  Calendar,
  PlayCircle,
} from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';

// Components
import CoursesBlock from '@/components/block/courses-block';
import InfoDashboard from '@/components/block/infoDashboard';
import LecturersBlock from '@/components/block/lecturers-block';
import { Button } from '@/components/ui/button';
import SplitText from '@/components/text/splitText';
import FadeContent from '@/components/animations/fadeContent';
import AnimateWrapper from '@/components/animations/animateWrapper';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

// API and Types
import { APIGetListInstructor } from '@/utils/instructor';
import { APIGetEnrolledCourse, APIGetListCourse } from '@/utils/course';
import type { CourseForm } from '@/types/courseType';
import type { Lecture } from '@/types/registerLectureFormType';
import EnrolledCourseBlock from '@/components/block/enrolled-course-block';
import APIGetRecommendation from '@/utils/recommendation';
import { useSelector } from 'react-redux';
import { RootState } from '@/constants/store';

// Mock data for categories
const categories = [
  { id: 1, name: 'Lập trình web', icon: '💻', count: 24 },
  { id: 2, name: 'Khoa học dữ liệu', icon: '📊', count: 18 },
  { id: 3, name: 'Thiết kế UI/UX', icon: '🎨', count: 15 },
  { id: 4, name: 'Marketing số', icon: '📱', count: 12 },
  { id: 5, name: 'Phát triển cá nhân', icon: '🚀', count: 10 },
  { id: 6, name: 'Ngoại ngữ', icon: '🌎', count: 20 },
];

// Mock data for testimonials
const testimonials = [
  {
    id: 1,
    name: 'Nguyễn Văn Minh',
    role: 'Sinh viên IT',
    avatar: 'images/avt1.jpg',
    content:
      'Các khóa học ở đây rất chất lượng và thực tế. Tôi đã học được nhiều kỹ năng mới và tìm được việc làm tốt sau khi hoàn thành khóa học.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Trần Thị Hương',
    role: 'Nhân viên Marketing',
    avatar: 'images/avt2.jpg',
    content:
      'Giảng viên rất tâm huyết và chuyên nghiệp. Nội dung khóa học được cập nhật thường xuyên theo xu hướng mới nhất.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Lê Hoàng Nam',
    role: 'Freelancer',
    avatar: 'images/avt3.jpg',
    content:
      'Tôi đã thử nhiều nền tảng học trực tuyến khác nhau, nhưng đây là nơi tôi thấy hiệu quả nhất. Giao diện dễ sử dụng và hỗ trợ rất tốt.',
    rating: 4,
  },
];

export default function Page() {
  const router = useRouter();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  const [listLecture, setListLecture] = useState<Lecture[]>([]);
  const [listCourse, setListCourse] = useState<CourseForm[]>([]);
  const [enrolledCourse, setEnrolledCourse] = useState<CourseForm[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [_error, setError] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<CourseForm[]>([]);

  const [paramsLecture, _setParamsLecture] = useState({
    page: 1,
    limit: 10,
    search: undefined,
    specialty: undefined,
    is_approved: true,
  });

  const [paramsCourse, _setParamsCourse] = useState({
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
      const response = await APIGetListInstructor(paramsLecture);
      if (response && response.data) {
        setIsLoading(false);
        setListLecture(response.data);
      } else {
        setIsLoading(false);
        setError('Không tìm thấy dữ liệu');
      }
    } catch (err) {
      setIsLoading(false);
      console.error('Error during get list lecture:', err);
    }
  };

  // Fetch learning progress
  const handleGetEnrolledCourse = async () => {
    const response = await APIGetEnrolledCourse();
    if (response?.status === 200) {
      setEnrolledCourse(response?.data || []);
    }
  };

  const handleGetRecommendation = async () => {
    const response = await APIGetRecommendation({ amount: 3 });
    if (response?.status === 200) {
      setRecommendation(response?.data || []);
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
        setError('Không tìm thấy dữ liệu');
      }
    } catch (err) {
      setIsLoading(false);
      console.error('Error during get list course:', err);
    }
  };

  useEffect(() => {
    handleGetListLecture();
    handleGetListCourse();
    handleGetEnrolledCourse();
    handleGetRecommendation();
  }, []);

  return isLoading ? (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        <p className="text-lg font-medium text-gray-600">Đang tải dữ liệu...</p>
      </div>
    </div>
  ) : (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 pt-8 pb-24 lg:pt-16 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
                <Star className="w-4 h-4 mr-2" />
                Nền tảng học trực tuyến hàng đầu
              </div>

              <div>
                <SplitText
                  text="Học các kỹ năng từ những chuyên gia hàng đầu"
                  className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight"
                  delay={15}
                  animationFrom={{
                    opacity: 0,
                    transform: 'translate3d(0,50px,0)',
                  }}
                  animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
                  threshold={0.2}
                  rootMargin="-50px"
                />

                <SplitText
                  text="Nâng cao kỹ năng, mở rộng kiến thức và phát triển sự nghiệp của bạn với các khóa học chất lượng cao."
                  className="mt-6 text-lg text-gray-600 dark:text-gray-300"
                  delay={10}
                  animationFrom={{
                    opacity: 0,
                    transform: 'translate3d(0,50px,0)',
                  }}
                  animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
                  threshold={0.2}
                  rootMargin="-50px"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Tìm kiếm khóa học..."
                    className="pl-10 pr-4 py-1 rounded-full border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 w-full sm:w-80"
                  />
                </div>

                <Button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white dark:text-black rounded-full px-8 py-6 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => router.push('/course')}
                >
                  Khám phá ngay
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Headset className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Hỗ trợ 24/7</p>
                    <p className="font-bold text-gray-900 dark:text-white">1900 1008</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Học mọi lúc</p>
                    <p className="font-bold text-gray-900 dark:text-white">Truy cập 24/7</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
              <img
                src="/images/home_bg.png"
                alt="Học trực tuyến"
                className="relative w-full h-auto object-cover rounded-3xl shadow-2xl"
              />

              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Học viên đạt kết quả</p>
                    <p className="font-bold text-gray-900 dark:text-white">95% thành công</p>
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Star className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Đánh giá trung bình</p>
                    <p className="font-bold text-gray-900 dark:text-white">4.8/5 sao</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimateWrapper direction="up" amount={0.5} delay={0.1}>
            <InfoDashboard
              number={listLecture.length || 10}
              title={'Giảng viên'}
              Icon={IdCard}
              color="#1568DF"
              bgColor="#1568DF"
            />
          </AnimateWrapper>

          <AnimateWrapper direction="up" amount={0.5} delay={0.2}>
            <InfoDashboard
              number={2000}
              title={'Bài học'}
              Icon={BookCheck}
              color="#219653"
              bgColor="#219653"
            />
          </AnimateWrapper>

          <AnimateWrapper direction="up" amount={0.5} delay={0.3}>
            <InfoDashboard
              number={100}
              title={'Sinh viên'}
              Icon={GraduationCap}
              color="#9B51DF"
              bgColor="#9B51DF"
            />
          </AnimateWrapper>

          <AnimateWrapper direction="up" amount={0.5} delay={0.4}>
            <InfoDashboard
              number={10}
              title={'Video'}
              Icon={Film}
              color="#FF2E2E"
              bgColor="#FF2E2E"
            />
          </AnimateWrapper>
        </div>
      </section>

      {/* My recommendation Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <AnimateWrapper delay={0.3} direction="up">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Khóa học được đề xuất
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Khóa học được đề xuất dựa trên sở thích của bạn
                </p>
              </div>

              {/* <Button
                variant="outline"
                className="border-2 border-blue-200 hover:border-blue-300 text-blue-700 dark:text-blue-400"
                onClick={() => router.push('/my-courses')}
              >
                Xem tất cả <ChevronRight className="ml-1 w-4 h-4" />
              </Button> */}
            </div>

            {recommendation.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6">
                {recommendation.map((course) => (
                  <CoursesBlock key={course.id} {...course} />
                ))}
              </div>
            ) : (
              <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
                    <BookOpen className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Bạn chưa đăng ký khóa học nào
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">
                    Khám phá các khóa học chất lượng cao và bắt đầu hành trình học tập của bạn ngay
                    hôm nay.
                  </p>
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white dark:text-black px-8"
                    onClick={() => router.push('/course')}
                  >
                    Khám phá khóa học
                  </Button>
                </CardContent>
              </Card>
            )}
          </AnimateWrapper>
        </div>
      </section>

      {/* My Courses Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <AnimateWrapper delay={0.3} direction="up">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Khóa học của tôi
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Tiếp tục hành trình học tập của bạn
                </p>
              </div>

              <Button
                variant="outline"
                className="border-2 border-blue-200 hover:border-blue-300 text-blue-700 dark:text-blue-400"
                onClick={() => router.push('/my-courses')}
              >
                Xem tất cả <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
            </div>

            {enrolledCourse.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {enrolledCourse.map((course) => (
                  <EnrolledCourseBlock key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
                    <BookOpen className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Bạn chưa đăng ký khóa học nào
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">
                    Khám phá các khóa học chất lượng cao và bắt đầu hành trình học tập của bạn ngay
                    hôm nay.
                  </p>
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white dark:text-black px-8"
                    onClick={() => router.push('/course')}
                  >
                    Khám phá khóa học
                  </Button>
                </CardContent>
              </Card>
            )}
          </AnimateWrapper>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-100 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <AnimateWrapper delay={0.3} direction="up">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Danh mục khóa học
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Khám phá các lĩnh vực học tập đa dạng với nội dung chất lượng cao từ các chuyên gia
                hàng đầu
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((category) => (
                <Card
                  key={category.id}
                  className="border-0 shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer"
                  onClick={() => router.push(`/course?category=${category.id}`)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {category.count} khóa học
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </AnimateWrapper>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <AnimateWrapper delay={0.3} direction="up">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Khóa học nổi bật
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Những khóa học được yêu thích nhất
                </p>
              </div>

              <Button
                variant="outline"
                className="border-2 border-blue-200 hover:border-blue-300 text-blue-700 dark:text-blue-400"
                onClick={() => router.push('/course')}
              >
                Xem tất cả <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
            </div>

            <Tabs defaultValue="all" className="mb-8">
              <TabsContent value="all" className="mt-6">
                <div className="relative">
                  <Carousel
                    opts={{
                      align: 'start',
                      loop: true,
                    }}
                    plugins={[
                      Autoplay({
                        delay: 4000,
                        stopOnInteraction: true,
                      }),
                    ]}
                    className="w-full"
                  >
                    <CarouselContent className="-ml-2 md:-ml-4">
                      {listCourse.slice(0, 8).map((course, index) => (
                        <CarouselItem
                          key={index}
                          className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
                        >
                          <FadeContent
                            blur={true}
                            duration={100}
                            easing="ease-out"
                            initialOpacity={0}
                            className="transform transition-all hover:-translate-y-2 p-2"
                          >
                            <CoursesBlock {...course} />
                          </FadeContent>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </div>
              </TabsContent>
            </Tabs>
          </AnimateWrapper>
        </div>
      </section>

      {/* Featured Instructors Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <AnimateWrapper delay={0.3} direction="up">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Giảng viên tiêu biểu
                </h2>
                <p className="text-gray-600 dark:text-gray-400">Học từ những chuyên gia hàng đầu</p>
              </div>

              <Button
                variant="outline"
                className="border-2 border-blue-200 hover:border-blue-300 text-blue-700 dark:text-blue-400"
                onClick={() => router.push('/lecture')}
              >
                Xem tất cả <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
            </div>

            <div className="relative">
              <Carousel
                opts={{
                  align: 'start',
                  loop: true,
                }}
                plugins={[
                  Autoplay({
                    delay: 5000,
                    stopOnInteraction: true,
                  }),
                ]}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {listLecture.slice(0, 6).map((lecture, index) => (
                    <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                      <FadeContent
                        blur={true}
                        duration={100}
                        easing="ease-out"
                        initialOpacity={0}
                        className="transform transition-all hover:-translate-y-2 p-2"
                      >
                        <LecturersBlock
                          avatar={lecture?.user?.profile_image?.key}
                          name={lecture?.user?.first_name + ' ' + lecture?.user?.last_name}
                          rating={lecture?.avg_rating}
                          major={lecture?.category?.translations[0]?.name}
                          numberCourse={lecture?.total_courses}
                          numberStudent={lecture?.total_students}
                          description={lecture?.biography}
                          username={lecture?.user?.username}
                        />
                      </FadeContent>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </AnimateWrapper>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <AnimateWrapper delay={0.3} direction="up">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Học viên nói gì về chúng tôi
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Khám phá trải nghiệm học tập từ những học viên đã tham gia các khóa học của chúng
                tôi
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <Card
                  key={testimonial.id}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
                      "{testimonial.content}"
                    </p>

                    <div className="flex items-center">
                      <img
                        src={testimonial.avatar || '/placeholder.svg'}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </AnimateWrapper>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <AnimateWrapper delay={0.3} direction="up">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Tại sao chọn chúng tôi
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Chúng tôi cam kết mang đến trải nghiệm học tập tốt nhất với những ưu điểm vượt trội
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Nội dung chất lượng
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Khóa học được thiết kế bởi các chuyên gia hàng đầu với nội dung cập nhật và thực
                    tiễn
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Headset className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Hỗ trợ 24/7
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Đội ngũ hỗ trợ luôn sẵn sàng giải đáp mọi thắc mắc và giúp đỡ bạn trong quá
                    trình học tập
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BarChart3 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Theo dõi tiến độ
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Dễ dàng theo dõi quá trình học tập và đánh giá kết quả của bạn qua các bài kiểm
                    tra
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Bookmark className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Chứng chỉ có giá trị
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Nhận chứng chỉ được công nhận sau khi hoàn thành khóa học để nâng cao hồ sơ của
                    bạn
                  </p>
                </CardContent>
              </Card>
            </div>
          </AnimateWrapper>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-black dark:text-white">
        <div className="container mx-auto px-4">
          <AnimateWrapper delay={0.3} direction="up">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Sẵn sàng nâng cao kỹ năng của bạn?
              </h2>
              <p className="text-xl text-blueberry mb-8">
                Tham gia ngay hôm nay để trải nghiệm học tập chất lượng từ đội ngũ giảng viên hàng
                đầu.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {!userInfo && (
                  <Button
                    className="bg-white text-blue-600 hover:bg-gray-100 rounded-full px-8 py-6 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => router.push('/signup')}
                  >
                    Đăng ký ngay
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="border-2 border-white text-black dark:text-white hover:bg-white/10 rounded-full px-8 py-6 font-semibold"
                  onClick={() => router.push('/course')}
                >
                  Khám phá khóa học
                </Button>
              </div>
            </div>
          </AnimateWrapper>
        </div>
      </section>
    </div>
  );
}
