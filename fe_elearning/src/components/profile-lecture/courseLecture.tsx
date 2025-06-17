'use client';
import React, { useEffect, useState } from 'react';
import FilterBlock from '../filter/filter-block';
import AnimateWrapper from '../animations/animateWrapper';
import { useRouter } from 'next/navigation';
import { PlusIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/constants/store';
import { APIGetMyCourse } from '@/utils/course';
import MyCourseCard from '../block/courses-block-me';
import AddButton from '../button/addButton';

const CourseLecture = () => {
  const router = useRouter();
  useEffect(() => {
    // Scroll to top when the component mounts or route changes
    window.scrollTo(0, 0);
  }, []);

  const _userInfo = useSelector((state: RootState) => state.user.userInfo);
  const [dataCourseMe, setDataCourseMe] = useState<[]>([]);

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
    console.log(dataCourseMe);
  }, []);

  return (
    <AnimateWrapper delay={0.2} direction="up" amount={0}>
      <div className="w-full h-full flex flex-col gap-3 bg-white dark:bg-black50 font-sans font-medium text-majorelleBlue  overflow-auto  p-4 rounded-b-sm">
        <div className="w-full h-full flex items-center justify-end">
          <AddButton
            onClick={() => router.push('/profile/lecture/course')}
            label="Thêm khóa học"
            size="lg"
            className="bg-custom-gradient-button-violet flex flex-row hover:brightness-125 items-center justify-center dark:bg-custom-gradient-button-blue text-white px-4 py-2 rounded-md border-none"
          />
        </div>
        <div className="w-full h-full flex items-end justify-end">
          <FilterBlock />
        </div>{' '}
        <div className="w-full h-full px-6 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2 lg:grid-cols-4 md:grid-cols-2 ">
          {dataCourseMe &&
            dataCourseMe.length > 0 &&
            dataCourseMe.map((course: any, index: number) => (
              <MyCourseCard {...course} key={index} />
            ))}
        </div>
      </div>
    </AnimateWrapper>
  );
};

export default CourseLecture;
