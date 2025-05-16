'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setCourse } from '@/constants/course';
import { RootState } from '@/constants/store';
import { APIGetFullCourse } from '@/utils/course';
import BasicInfoForm from '@/components/uploadCourse/BasicInfoForm';
import SectionList from '@/components/uploadCourse/SectionList';
import AlertSuccess from '@/components/alert/AlertSuccess';
import AlertError from '@/components/alert/AlertError';
import { Section } from '@/types/courseType';
import AnimateWrapper from '@/components/animations/animateWrapper';
import ToggleSwitchButton from '@/components/button/toggleSwitchButton';
import { Ban, Loader2 } from 'lucide-react';
const CourseDetails: React.FC = () => {
  const courseInfo = useSelector((state: RootState) => state.course.courseInfo);
  const dispatch = useDispatch();
  const params = useParams();
  const courseId = params.id as string;
  const [sections, setSections] = useState<Section[]>([]);
  const [description, setDescription] = useState('');
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleGetCourseInfo = async (_targetSection?: string) => {
    try {
      setIsLoading(true);
      const response = await APIGetFullCourse(courseId);
      if (response?.status === 200) {
        const sortedSections = response.data.sections.sort((a: Section, b: Section) =>
          a.position.localeCompare(b.position)
        );
        setSections(sortedSections);
        dispatch(setCourse(response.data));
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching course details:', error);
      setShowAlertError(true);
      setDescription('Không thể tải thông tin khóa học');
      setTimeout(() => setShowAlertError(false), 3000);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetCourseInfo();
  }, [courseId, dispatch]);

  return (
    <div className="w-full h-full gap-4 flex flex-col p-4">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      ) : (
        <>
          <AnimateWrapper delay={0.2} direction="up" amount={0.01}>
            {courseInfo?.id && (
              <div className="flex items-end w-full justify-end p-4">
                {courseInfo?.status === 'BANNED' ? (
                  <div className="flex items-center gap-2">
                    <Ban className="w-4 h-4 text-redPigment" />
                    <p className="text-sm font-sans text-redPigment">Khóa học đã bị cấm</p>
                  </div>
                ) : (
                  <ToggleSwitchButton courseId={courseId} status={courseInfo?.status} />
                )}
              </div>
            )}
            <BasicInfoForm
              courseInfo={courseInfo}
              courseId={courseId}
              setShowAlertSuccess={setShowAlertSuccess}
              setShowAlertError={setShowAlertError}
              setDescription={setDescription}
            />
          </AnimateWrapper>
          <AnimateWrapper delay={0.2} direction="up" amount={0.01}>
            <SectionList
              sections={sections}
              setSections={setSections}
              courseId={courseId}
              handleGetCourseInfo={handleGetCourseInfo}
              setShowAlertSuccess={setShowAlertSuccess}
              setShowAlertError={setShowAlertError}
              setDescription={setDescription}
            />
          </AnimateWrapper>
          {showAlertSuccess && <AlertSuccess description={description} />}
          {showAlertError && <AlertError description={description} />}
        </>
      )}
    </div>
  );
};

export default CourseDetails;
