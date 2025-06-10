'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProgressBar from './components/progressBar';

export const steps = [
  {
    id: 1,
    title: 'Thông Tin Khóa Học',
    description: 'Tiêu đề, mô tả và thông tin khóa học',
  },
  {
    id: 2,
    title: 'Chương trình học',
    description: 'Tạo các chương và bài học',
  },
  {
    id: 3,
    title: 'Xem lại & Xuất bản',
    description: 'Kiểm tra và xuất bản khóa học',
  },
];

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
  const [showDeleted, setShowDeleted] = useState(false);
  const previousShowDeletedRef = useRef(showDeleted);

  const handleGetCourseInfo = async () => {
    try {
      setIsLoading(true);
      previousShowDeletedRef.current = showDeleted;

      const response = await APIGetFullCourse(courseId, {
        include_deleted_lectures: showDeleted,
      });

      if (response?.status === 200) {
        const sortedSections = response.data.sections.sort((a: Section, b: Section) =>
          a.position.localeCompare(b.position)
        );
        setSections(sortedSections);
        dispatch(setCourse(response.data));
      }
    } catch (error) {
      if (previousShowDeletedRef.current !== showDeleted) {
        setShowDeleted(previousShowDeletedRef.current);
      }

      setShowAlertError(true);
      setDescription('Không thể tải thông tin khóa học');
      setTimeout(() => setShowAlertError(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetCourseInfo();
  }, [courseId, showDeleted, dispatch]);

  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const nextStep = () => {
    setCompletedSteps([...completedSteps, currentStep]);
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          !isLoading && (
            <AnimateWrapper delay={0.2} direction="up" amount={0.01}>
              <BasicInfoForm
                mode="edit"
                courseInfo={courseInfo}
                setCourseInfo={handleGetCourseInfo}
                setShowAlertSuccess={setShowAlertSuccess}
                setShowAlertError={setShowAlertError}
                setDescription={setDescription}
                handleNextStep={nextStep}
              />
            </AnimateWrapper>
          )
        );
      case 2:
        return (
          <AnimateWrapper delay={0.2} direction="up" amount={0.01}>
            <SectionList
              sections={sections}
              setSections={setSections}
              course={courseInfo}
              handleGetCourseInfo={handleGetCourseInfo}
              setShowAlertSuccess={setShowAlertSuccess}
              setShowAlertError={setShowAlertError}
              setDescription={setDescription}
              showDeleted={showDeleted}
              setShowDeleted={setShowDeleted}
              handlePrevStep={prevStep}
              handleNextStep={nextStep}
            />
          </AnimateWrapper>
        );
      case 3:
        return null;
      default:
        return null;
    }
  };

  return (
    <>
      {/* <div className="w-full h-full gap-4 flex flex-col p-4 ">
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
                isEditingBasic={true}
                courseInfo={courseInfo}
                setCourseInfo={handleGetCourseInfo}
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
      </div> */}
      <div className="w-full h-full gap-4 flex flex-col p-4 ">
        <ProgressBar steps={steps} completedSteps={completedSteps} currentStep={currentStep} />
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">{steps[currentStep - 1].title}</CardTitle>
          </CardHeader>
          <CardContent>{renderStepContent()}</CardContent>
        </Card>
        {showAlertSuccess && <AlertSuccess description={description} />}
        {showAlertError && <AlertError description={description} />}
      </div>
    </>
  );
};

export default CourseDetails;
