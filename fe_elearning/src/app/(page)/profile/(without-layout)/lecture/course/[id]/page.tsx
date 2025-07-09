'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCourse } from '@/constants/courseSlice';
import { RootState } from '@/constants/store';

import { useParams, useSearchParams, useRouter } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import SectionList from '@/components/uploadCourse/SectionList';
import BasicInfoForm from '@/components/uploadCourse/BasicInfoForm';

import AddButton from '@/components/button/addButton';
import AnimateWrapper from '@/components/animations/animateWrapper';

import { toast } from 'react-toastify';
import ToastNotify from '@/components/ToastNotify/toastNotify';
import { styleError } from '@/components/ToastNotify/toastNotifyStyle';

import ProgressBar from './components/progressBar';
import UnbanRequestModal from './components/modals/unbanRequestModal';

import { AlertCircle, Ban, CheckCircle, ChevronRight, Clock, ListEnd, X } from 'lucide-react';

import { APIGetFullCourse } from '@/utils/course';
import { APIGetCourseUnbanRequests } from '@/utils/unbanRequest';

import { UnbanRequestType } from '@/types/unbanRequestType';
import { CourseForm, SectionType } from '@/types/courseType';

import { steps } from '@/helpers/step';
import { formatDate } from '@/helpers';

const CourseDetails: React.FC = () => {
  const courseInfo = useSelector((state: RootState) => state.course.courseInfo);
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const [sections, setSections] = useState<SectionType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isNewlyCreated, setIsNewlyCreated] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [isBasicInfoOpen, setBasicInfoOpen] = useState(true);
  const [isSectionListOpen, setSectionListOpen] = useState(true);
  const [unbanRequests, setUnbanRequests] = useState<UnbanRequestType[]>([]);
  const previousShowDeletedRef = useRef(showDeleted);
  const mode: 'create' | 'edit' = courseId === 'new' ? 'create' : 'edit';

  useEffect(() => {
    const stepParam = searchParams.get('step');
    if (stepParam) {
      const step = parseInt(stepParam, 10);
      if (!isNaN(step)) setCurrentStep(step);
    }
  }, [searchParams]);

  // Optional: clean up the `?step=2` from the URL
  useEffect(() => {
    if (searchParams.get('step')) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('step');
      router.replace(`?${newParams.toString()}`, { scroll: false });
    }
  }, [searchParams, router]);

  const handleGetCourseInfo = async () => {
    try {
      setIsLoading(true);
      previousShowDeletedRef.current = showDeleted;

      const response = await APIGetFullCourse(courseId, {
        include_deleted_lectures: showDeleted,
        is_show_hidden: true,
      });

      if (response?.status === 200) {
        const sortedSections = response.data.sections.sort((a: SectionType, b: SectionType) =>
          a.position.localeCompare(b.position)
        );
        setSections(sortedSections);
        dispatch(setCourse(response.data));
      }
    } catch (error) {
      if (previousShowDeletedRef.current !== showDeleted) {
        setShowDeleted(previousShowDeletedRef.current);
      }

      toast.error(<ToastNotify status={-1} message="Không thể tải thông tin khóa học" />, {
        style: styleError,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetUnbanRequests = async () => {
    try {
      const response = await APIGetCourseUnbanRequests(courseId);
      if (response?.status === 200) {
        setUnbanRequests(response.data);
      }
    } catch {
      toast.error(<ToastNotify status={-1} message="Không thể tải thông tin yêu cầu mở khóa" />, {
        style: styleError,
      });
    }
  };

  useEffect(() => {
    if (mode == 'edit') handleGetCourseInfo();
  }, [courseId, showDeleted, dispatch]);

  useEffect(() => {
    handleGetUnbanRequests();
  }, [courseId, dispatch]);

  useEffect(() => {
    if (isNewlyCreated) {
      setIsNewlyCreated(false);
      setCurrentStep(2);
    }
  }, [isNewlyCreated]);

  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    if (currentStep === 3) {
      setShowDeleted(false);
    }
  }, [currentStep]);

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

  const handleGoBack = () => {
    router.push('../?tab=khoa-hoc');
  };

  const handleCreateSuccess = (course: CourseForm | null) => {
    if (course) {
      setIsNewlyCreated(true);
      router.replace(`./${course.id}?step=2`);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          !isLoading && (
            <AnimateWrapper delay={0.2} direction="up" amount={0.01}>
              <BasicInfoForm
                mode={mode}
                courseInfo={mode == 'edit' ? courseInfo : undefined}
                setCourseInfo={
                  mode == 'edit'
                    ? () => {
                        setShowDeleted(false);
                        handleGetCourseInfo();
                      }
                    : handleCreateSuccess
                }
                handleNextStep={() => {
                  setShowDeleted(false);
                  nextStep();
                }}
              />
            </AnimateWrapper>
          )
        );
      case 2:
        return (
          <AnimateWrapper delay={0.2} direction="up" amount={0.01}>
            <SectionList
              mode="edit"
              sections={sections}
              setSections={setSections}
              course={courseInfo}
              handleGetCourseInfo={handleGetCourseInfo}
              showDeleted={showDeleted}
              setShowDeleted={setShowDeleted}
              handlePrevStep={prevStep}
              handleNextStep={nextStep}
            />
          </AnimateWrapper>
        );
      case 3:
        return (
          <AnimateWrapper delay={0.2} direction="up" amount={0.01}>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-start gap-3 mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setBasicInfoOpen(!isBasicInfoOpen)}
                    className="p-0 h-auto"
                  >
                    <div
                      className={`transform transition-transform duration-200 ${
                        isBasicInfoOpen ? 'rotate-90' : 'rotate-0'
                      }`}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </Button>
                  <h3 className="text-lg font-semibold">Thông tin cơ bản</h3>
                </div>
                {isBasicInfoOpen && (
                  <AnimateWrapper delay={0.2} direction="down" amount={0.01}>
                    <BasicInfoForm
                      mode="view"
                      courseInfo={courseInfo}
                      setCourseInfo={handleGetCourseInfo}
                      handleNextStep={nextStep}
                    />
                  </AnimateWrapper>
                )}
              </div>

              <div>
                <div className="flex items-center justify-start gap-3 mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSectionListOpen(!isSectionListOpen)}
                    className="p-0 h-auto"
                  >
                    <div
                      className={`transform transition-transform duration-200 ${
                        isSectionListOpen ? 'rotate-90' : 'rotate-0'
                      }`}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </Button>
                  <h3 className="text-lg font-semibold">Nội dung khóa học</h3>
                </div>
                {isSectionListOpen && (
                  <AnimateWrapper delay={0.2} direction="down" amount={0.01}>
                    <SectionList
                      mode="view"
                      sections={sections}
                      setSections={setSections}
                      course={courseInfo}
                      handleGetCourseInfo={handleGetCourseInfo}
                      showDeleted={showDeleted}
                      setShowDeleted={setShowDeleted}
                      handlePrevStep={prevStep}
                      handleNextStep={nextStep}
                    />
                  </AnimateWrapper>
                )}
              </div>

              <div className="flex justify-center">
                <AddButton
                  icon={ListEnd}
                  label="Về lại danh sách khóa học"
                  iconPosition="right"
                  onClick={handleGoBack}
                />
              </div>
            </div>
          </AnimateWrapper>
        );
      default:
        return null;
    }
  };

  const hasPendingRequest = () => unbanRequests.some((request) => !request.is_reviewed);
  const handleSubmitRequestSuccess = () => {
    handleGetUnbanRequests();
  };

  const getStatusBadge = (request: UnbanRequestType) => {
    if (!request.is_reviewed) {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Pending Review
        </Badge>
      );
    }
    if (request.is_approved) {
      return (
        <Badge variant="default" className="flex items-center gap-1 bg-green-500">
          <CheckCircle className="w-3 h-3" />
          Approved
        </Badge>
      );
    }
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <X className="w-3 h-3" />
        Rejected
      </Badge>
    );
  };

  return (
    <>
      <div className="w-full h-full gap-4 flex flex-col p-4 ">
        <ProgressBar steps={steps} completedSteps={completedSteps} currentStep={currentStep} />
        {courseInfo.status === 'BANNED' && (courseInfo as any).warnings?.length > 0 && (
          <>
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-3xl text-red-700">
                  <AlertCircle className="w-5 h-5" />
                  Những vi phạm được báo cáo
                </CardTitle>
                <CardDescription className="text-red-600">
                  Khóa học của bạn đã bị cấm vì những lý do sau. Vui lòng giải quyết những vấn đề
                  này trong yêu cầu mở khóa.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {(courseInfo as any).warnings.map(
                    (warning: { report: { reason: string } }, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-red-700">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                        {warning.report.reason}
                      </li>
                    )
                  )}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row item-end justify-between">
                <div>
                  <CardTitle>Lịch sử yêu cầu mở khóa</CardTitle>
                  <CardDescription>
                    Xem trạng thái và chi tiết các yêu cầu mở khóa trước đây của bạn.
                  </CardDescription>
                </div>
                <UnbanRequestModal
                  courseId={courseId}
                  hasPendingRequest={hasPendingRequest()}
                  handleSubmitSuccess={handleSubmitRequestSuccess}
                />
              </CardHeader>
              <CardContent>
                {unbanRequests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Ban className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No unban requests found.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {[...unbanRequests]
                      .sort(
                        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                      )
                      .map((request, index) => (
                        <div key={index}>
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  {getStatusBadge(request)}
                                  <span className="text-sm text-muted-foreground">
                                    Gửi vào {formatDate(request.createdAt)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div>
                                <h4 className="font-medium text-sm">Lý do yêu cầu:</h4>
                                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                                  {request.reason}
                                </p>
                              </div>

                              {request.is_reviewed &&
                                !request.is_approved &&
                                request.disapproval_reason && (
                                  <div>
                                    <h4 className="font-medium text-sm text-red-600">
                                      Lý do từ chối:
                                    </h4>
                                    <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                                      {request.disapproval_reason}
                                    </p>
                                  </div>
                                )}
                            </div>
                          </div>

                          {index < unbanRequests.length - 1 && <Separator className="mt-4" />}
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
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
