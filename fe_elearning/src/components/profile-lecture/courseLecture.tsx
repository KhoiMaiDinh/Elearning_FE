'use client';
import React, { useEffect, useState } from 'react';
import FilterBlock from '../filter/filter-block';
import AnimateWrapper from '../animations/animateWrapper';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/constants/store';
import { APIGetMyCourse } from '@/utils/course';
import MyCourseCard from '../block/courses-block-me';
import AddButton from '../button/addButton';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { BookOpenCheck } from 'lucide-react';
import { CourseForm } from '@/types/courseType';

const CourseLecture = () => {
  const router = useRouter();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const _userInfo = useSelector((state: RootState) => state.user.userInfo);
  const [tab, setTab] = useState<'PUBLISHED' | 'DRAFT' | 'BANNED' | 'ALL'>('ALL');
  const [dataCourseMe, setDataCourseMe] = useState<CourseForm[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<CourseForm[]>([]);
  const [sortedCourses, setSortedCourses] = useState<CourseForm[]>([]);

  const searchParams = useSearchParams();

  const handleGetCourseMe = async () => {
    try {
      const response = await APIGetMyCourse();
      if (response?.status === 200) {
        setDataCourseMe(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetCourseMe();
  }, []);

  useEffect(() => {
    if (tab === 'ALL') {
      setFilteredCourses(dataCourseMe);
    } else {
      setFilteredCourses(dataCourseMe.filter((course: any) => course.status === tab) as []);
    }
  }, [tab, dataCourseMe]);

  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');

  useEffect(() => {
    // Create a new array to avoid mutating state directly
    const sorted = [...filteredCourses];

    switch (sortBy) {
      case 'newest':
        sorted.sort(
          (a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
        );
        break;
      case 'oldest':
        sorted.sort(
          (a, b) => new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime()
        );
        break;
      case 'recently_updated':
        sorted.sort(
          (a, b) => new Date(b.updatedAt || '').getTime() - new Date(a.updatedAt || '').getTime()
        );
        break;
      case 'least_updated':
        sorted.sort(
          (a, b) => new Date(a.updatedAt || '').getTime() - new Date(b.updatedAt || '').getTime()
        );
        break;
      case 'recently_published':
        sorted.sort(
          (a, b) =>
            new Date(b.published_at || '').getTime() - new Date(a.published_at || '').getTime()
        );
        break;
      case 'least_published':
        sorted.sort(
          (a, b) =>
            new Date(a.published_at || '').getTime() - new Date(b.published_at || '').getTime()
        );
        break;
      case 'highest_revenue':
        sorted.sort((a, b) => (b.total_revenue || 0) - (a.total_revenue || 0));
        break;
      case 'lowest_revenue':
        sorted.sort((a, b) => (a.total_revenue || 0) - (b.total_revenue || 0));
        break;
      case 'highest_rating':
        sorted.sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0));
        break;
      case 'lowest_rating':
        sorted.sort((a, b) => (a.avg_rating || 0) - (b.avg_rating || 0));
        break;
      case 'most_popular':
        sorted.sort((a, b) => (b.total_enrolled || 0) - (a.total_enrolled || 0));
        break;
      case 'least_popular':
        sorted.sort((a, b) => (a.total_enrolled || 0) - (b.total_enrolled || 0));
        break;
      default:
        break;
    }

    setSortedCourses(sorted);
  }, [filteredCourses, sortBy]);

  return (
    <AnimateWrapper delay={0.2} direction="up" amount={0}>
      <div className="w-full h-full flex flex-col gap-3 bg-white dark:bg-eerieBlack font-sans font-medium text-majorelleBlue  overflow-auto  p-4 rounded-b-sm">
        <div className="w-full h-full flex items-center justify-end">
          <AddButton
            onClick={() => router.push('/profile/lecture/course/new')}
            label="Thêm khóa học"
            size="lg"
            className="bg-custom-gradient-button-violet flex flex-row hover:brightness-125 items-center justify-center dark:bg-custom-gradient-button-blue text-white px-4 py-2 rounded-md border-none"
          />
        </div>
        <div className="w-full h-full flex items-end justify-between ">
          <Tabs
            defaultValue="ALL"
            onValueChange={(value) => setTab(value as any)}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="ALL">Tất cả</TabsTrigger>
                <TabsTrigger value="PUBLISHED">Xuất bản</TabsTrigger>
                <TabsTrigger value="DRAFT">Bản nháp</TabsTrigger>
                <TabsTrigger value="BANNED">Bị Khóa</TabsTrigger> {/* Use real status */}
              </TabsList>
            </div>
          </Tabs>
          <FilterBlock sortBy={sortBy} onSortChange={setSortBy} currentStatusTab={tab} />
        </div>{' '}
        <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-8 md:gap-4 lg:grid-cols-3 xl:grid-cols-4 place-items-center">
          {sortedCourses && sortedCourses.length > 0 ? (
            sortedCourses.map((course: any, index: number) => (
              <MyCourseCard {...course} key={index} />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center text-gray-500 mt-10">
              <BookOpenCheck className="w-12 h-12 mb-4 text-muted-foreground" />
              <p className="text-lg font-semibold">Bạn chưa có khóa học nào</p>
            </div>
          )}
        </div>
      </div>
    </AnimateWrapper>
  );
};

export default CourseLecture;
