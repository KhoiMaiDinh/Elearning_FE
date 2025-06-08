import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import CourseItemForm from './CourseItemForm';
import { CourseForm, CourseItem, Section } from '@/types/courseType';
import VideoPlayer from '@/components/courseDetails/videoPlayer';

import { Card, CardContent } from '../ui/card';
import AddButton from '../button/addButton';
import LectureModal from '@/app/(page)/profile/(without-layout)/lecture/course/[id]/components/modals/lectureModal';
import SectionModal from '@/app/(page)/profile/(without-layout)/lecture/course/[id]/components/modals/sectionModal';
import SectionCard from '../cards/sectionCard';
import { Globe } from 'lucide-react';
import { APIChangeCourseStatus } from '@/utils/course';
import ToastNotify from '../ToastNotify/toastNotify';
import { toast, ToastContainer } from 'react-toastify';
import { styleError, styleSuccess } from '../ToastNotify/toastNotifyStyle';
import { useTheme } from 'next-themes';

interface SectionListProps {
  sections: Section[];
  setSections: (sections: Section[]) => void;
  course: CourseForm;
  handleGetCourseInfo: (targetSection?: string) => void;
}

interface CourseItemProps {
  item: CourseItem;
  sectionIndex: number;
  sections: Section[];
  onSave: () => void;
  onCancel: () => void;
}

const CourseItemDisplay: React.FC<CourseItemProps> = ({
  item,
  sectionIndex,
  sections,
  onSave,
  onCancel,
}) => {
  const [uploadProgress, _setUploadProgress] = useState<number>(0);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const theme = useTheme();
  return (
    <div className="ml-6 mt-4 p-4  rounded-xl bg-AntiFlashWhite dark:bg-gray/20 border">
      {!isEditing ? (
        <>
          <div className="flex justify-between items-center mb-2">
            <p className="mb-1">
              <strong>🎯 Tiêu đề:</strong> {item.title}
            </p>
            <Button
              type="button"
              className="bg-custom-gradient-button-violet dark:bg-custom-gradient-button-blue text-white hover:bg-black hover:text-white"
              onClick={() => setIsEditing(true)}
            >
              ✍️ Chỉnh sửa
            </Button>
          </div>
          <p className="mb-1">
            <strong>📄 Nội dung:</strong>{' '}
            <span
              className="ql-content text-sm"
              dangerouslySetInnerHTML={{ __html: item.description }}
            />
          </p>
          {item.video && (
            <div className="mt-3">
              <p className="font-semibold mb-1">🎥 Video:</p>
              {item.video.video.status === 'validated' ? (
                <VideoPlayer
                  videoUrl={`${process.env.NEXT_PUBLIC_BASE_URL_VIDEO}${item.video.video.key}`}
                  title={item.title}
                />
              ) : item.video.video.status === 'uploaded' ? (
                <div>
                  <div className="w-full max-w-sm bg-gray/20 rounded-full h-2.5">
                    <div
                      className="bg-majorelleBlue h-2.5 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray/60 mt-1">⏳ Đang xử lý video...</p>
                </div>
              ) : (
                <p className="text-sm text-red-600">⛔ Video đã bị từ chối</p>
              )}
            </div>
          )}
          {item.resources?.length > 0 && (
            <div className="mt-3">
              <p className="font-semibold mb-1">📎 Tài liệu:</p>
              <ul className="list-disc pl-6 text-sm space-y-1">
                {item.resources.map((resource, idx) => (
                  <li key={idx}>
                    <a
                      href={`${process.env.NEXT_PUBLIC_BASE_URL_DOCUMENT}${resource.resource_file.key}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-majorelleBlue hover:underline"
                    >
                      {resource.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="mt-3 text-sm">
            <strong>👁️ Xem trước:</strong> {item.is_preview ? 'Có' : 'Không'}
          </p>
        </>
      ) : (
        <CourseItemForm
          sectionIndex={sectionIndex}
          section={sections[sectionIndex]}
          initialValues={item} // Truyền dữ liệu hiện tại vào form
          onSave={() => {
            onSave();
            setIsEditing(false);
          }}
          onCancel={() => {
            setIsEditing(false);
            onCancel();
          }}
        />
      )}
    </div>
  );
};

const SectionList: React.FC<SectionListProps> = ({
  sections,
  setSections,
  course,
  handleGetCourseInfo,
}) => {
  const [isAddingSection, setIsAddingSection] = useState<boolean>(false);
  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(null);
  const [isAddingLecture, setIsAddingLecture] = useState<number | null>(null);
  const [openSectionIds, setOpenSections] = useState<Set<string>>(new Set());
  const theme = useTheme();
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [isLectureModalOpen, setIsLectureModalOpen] = useState(false);

  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [selectedLecture, setSelectedLecture] = useState<CourseItem | null>(null);

  console.log('sections', sections);

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
        return sectionTotal + (item.video?.duration_in_seconds || 0);
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

  const publicCourse = async () => {
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
    } catch (error) {
      console.log(error);
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
              <AddButton onClick={handleAddSection} label="Thêm Chương Mới" />
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
            />
          ))}
        </div>

        <AddButton label={'Xuất bản'} icon={Globe} onClick={publicCourse} />

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
