'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setCourse } from '@/constants/course';
import { RootState } from '@/constants/store';
import { APIGetFullCourse } from '@/utils/course';
import BasicInfoForm from '@/components/uploadCourse/BasicInfoForm';
import SectionList from '@/components/uploadCourse/SectionList';
import { Section } from '@/types/courseType';
import AnimateWrapper from '@/components/animations/animateWrapper';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProgressBar from './components/progressBar';
import { Button } from '@/components/ui/button';
import { steps } from '@/helpers/step';
import ToastNotify from '@/components/ToastNotify/toastNotify';
import { toast, ToastContainer } from 'react-toastify';
import { styleError } from '@/components/ToastNotify/toastNotifyStyle';
import { useTheme } from 'next-themes';
const CourseDetails: React.FC = () => {
  const courseInfo = useSelector((state: RootState) => state.course.courseInfo);
  const dispatch = useDispatch();
  const params = useParams();
  const courseId = params.id as string;
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const handleGetCourseInfo = async () => {
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
      toast.error(<ToastNotify status={-1} message="Không thể tải thông tin khóa học" />, {
        style: styleError,
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetCourseInfo();
  }, [courseId, dispatch]);

  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const nextStep = () => {
    setCompletedSteps([...completedSteps, currentStep]);
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <AnimateWrapper delay={0.2} direction="up" amount={0.01}>
            <BasicInfoForm
              mode="edit"
              courseInfo={courseInfo}
              setCourseInfo={handleGetCourseInfo}
            />
          </AnimateWrapper>
        );
      case 2:
        return (
          <AnimateWrapper delay={0.2} direction="up" amount={0.01}>
            <SectionList
              sections={sections}
              setSections={setSections}
              course={courseInfo}
              handleGetCourseInfo={handleGetCourseInfo}
            />
          </AnimateWrapper>
        );
      case 3:
        return null;
      default:
        return null;
    }
  };

  const handlePageBack = () => {
    router.back();
  };

  return (
    <>
      <div className="w-full h-full gap-4 flex flex-col p-4 ">
        <Button
          className="bg-majorelleBlue hover:bg-majorelleBlue hover:brightness-125 text-white w-fit font-medium"
          onClick={handlePageBack}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
        <ProgressBar steps={steps} completedSteps={completedSteps} currentStep={currentStep} />
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">{steps[currentStep - 1].title}</CardTitle>
          </CardHeader>
          <CardContent>{renderStepContent()}</CardContent>
        </Card>
      </div>
    </>
  );
};

export default CourseDetails;
