import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import CourseItemForm from './CourseItemForm';
import { CourseForm, CourseItem, Section } from '@/types/courseType';
import VideoPlayer from '@/components/courseDetails/videoPlayer';

import { Card, CardContent } from '../ui/card';
import AddButton from '../button/addButton';
import LectureModal from '@/app/(page)/profile/(without-layout)/lecture/course/[id]/components/modals/lectureModal';
import SectionModal from '@/app/(page)/profile/(without-layout)/lecture/course/[id]/components/modals/sectionModal';
import SectionCard from '../cards/sectionCard';
import { ArrowLeft, Eye, EyeOff, Globe } from 'lucide-react';
import { APIChangeCourseStatus } from '@/utils/course';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { AxiosError } from 'axios';
import ToastNotify from '../ToastNotify/toastNotify';
import { toast, ToastContainer } from 'react-toastify';
import { styleError, styleSuccess } from '../ToastNotify/toastNotifyStyle';
import { useTheme } from 'next-themes';

interface SectionListProps {
  sections: Section[];
  course: CourseForm;
  showDeleted: boolean;
  setSections: (sections: Section[]) => void;
  setShowAlertSuccess: (value: boolean) => void;
  setShowAlertError: (value: boolean) => void;
  setDescription: (value: string) => void;
  setShowDeleted: (value: boolean) => void;
  handleGetCourseInfo: () => void;
  handleNextStep: () => void;
  handlePrevStep: () => void;
}

interface CourseItemProps {
  item: CourseItem;
  sectionIndex: number;
  sections: Section[];
  onSave: () => void;
  onCancel: () => void;
}

const SectionList: React.FC<SectionListProps> = ({
  course,
  sections,
  showDeleted,
  setSections,
  setShowAlertSuccess,
  setShowAlertError,
  setDescription,
  setShowDeleted,
  handleGetCourseInfo,
  handleNextStep,
  handlePrevStep,
}) => {
  const [openSectionIds, setOpenSections] = useState<Set<string>>(new Set());
  const theme = useTheme();
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [isLectureModalOpen, setIsLectureModalOpen] = useState(false);

  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [selectedLecture, setSelectedLecture] = useState<CourseItem | null>(null);

  const toggleSection = (sectionId: string) => {
    setOpenSections((prevOpenSections) => {
      const newOpenSections = new Set(prevOpenSections);
      if (newOpenSections.has(sectionId)) {
        newOpenSections.delete(sectionId);
      } else {
        newOpenSections.add(sectionId);
      }
      return newOpenSections;
    });
  };

  const getTotalLectures = () => {
    return sections.reduce((total, section) => total + (section?.items?.length || 0), 0);
  };

  const getTotalDuration = () => {
    return sections.reduce((total, section) => {
      const sectionDuration = section.items.reduce((sectionTotal, item) => {
        return sectionTotal + (item.duration_in_seconds || 0);
      }, 0);
      return total + sectionDuration;
    }, 0);
  };

  const handleEditLecture = (section: Section, lecture: CourseItem) => {
    setSelectedSection(section);
    setSelectedLecture(lecture);
    setIsLectureModalOpen(true);
  };

  const handleCancelEditLecture = (open: boolean) => {
    setSelectedSection(null);
    setSelectedLecture(null);
    setIsLectureModalOpen(open);
  };

  const handleAddLecture = (section: Section) => {
    setSelectedSection(section);
    setIsLectureModalOpen(true);
  };

  const handleCancelAddLecture = (open: boolean) => {
    setSelectedSection(null);
    setIsLectureModalOpen(open);
  };

  const handleAddSection = () => {
    setIsSectionModalOpen(true);
  };

  const handleCancelAddSection = (open: boolean) => {
    setIsSectionModalOpen(open);
  };

  const handleEditSection = (section: Section) => {
    setSelectedSection(section);
    setIsSectionModalOpen(true);
  };

  const handleCancelEditSection = (open: boolean) => {
    setSelectedSection(null);
    setIsSectionModalOpen(open);
  };

  const handlePublicCourse = async () => {
    try {
      const response = await APIChangeCourseStatus(course.id!, {
        status: 'PUBLISHED',
      });
      if (response) {
        toast.success(
          <ToastNotify status={1} message="Bạn đã cập nhật trạng thái khóa học thành công" />,
          { style: styleSuccess }
        );
      }
      handleNextStep();
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        toast.error(<ToastNotify status={-1} message={error.response?.data.message} />, {
          style: styleError,
        });
      }
      toast.error(<ToastNotify status={-1} message="Cập nhật trạng thái khóa học thất bại" />, {
        style: styleError,
      });
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Summary */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Tổng quan chương trình</h3>
                <p className="text-sm text-muted-foreground">
                  {sections.length} chương • {getTotalLectures()} bài học • {getTotalDuration()}{' '}
                  thời lượng
                </p>
              </div>
              <div className="flex justify-between items-center gap-5 ">
                <div className="flex items-center space-x-2 hover:ring-1 ring-majorelleBlue rounded-sm h-8 px-3 text-xs">
                  <Switch
                    id="show-deleted"
                    checked={showDeleted}
                    onCheckedChange={setShowDeleted}
                    className="data-[state=checked]:bg-red-600"
                  />
                  <div className="flex items-center space-x-1">
                    {showDeleted ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    <Label htmlFor="show-deleted" className="text-sm">
                      Hiển thị đã xóa
                    </Label>
                  </div>
                </div>
                <AddButton onClick={handleAddSection} label="Thêm Chương Mới" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section, sectionIndex) => (
            <SectionCard
              section={section}
              sectionIndex={sectionIndex}
              openSectionIds={openSectionIds}
              toggleSection={toggleSection}
              handleAddLecture={handleAddLecture}
              handleEditSection={handleEditSection}
              handleEditLecture={handleEditLecture}
              handleGetCourseInfo={handleGetCourseInfo}
            />
          ))}
        </div>

        <div className="flex justify-between">
          <AddButton label={'Quay lại'} icon={ArrowLeft} onClick={handlePrevStep} />
          <AddButton
            label={'Xuất bản'}
            icon={Globe}
            onClick={handlePublicCourse}
            className="bg-custom-gradient-button-violet"
          />
        </div>

        {/* Section Modal */}
        <SectionModal
          open={isSectionModalOpen}
          onOpenChange={selectedSection ? handleCancelEditSection : handleCancelAddSection}
          course={course!}
          section={selectedSection!}
          onSubmitSuccess={handleGetCourseInfo}
        />

        {/* Lecture Modal */}
        <LectureModal
          open={isLectureModalOpen}
          onOpenChange={selectedLecture ? handleCancelEditLecture : handleCancelAddLecture}
          section={selectedSection!}
          lecture={selectedLecture!}
          onSubmitSuccess={handleGetCourseInfo}
        />
      </div>
    </>
  );
};

export default SectionList;
