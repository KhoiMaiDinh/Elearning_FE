import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import CourseItemForm from './CourseItemForm';
import { CourseForm, CourseItem, Section } from '@/types/courseType';
import VideoPlayer from '@/components/courseDetails/videoPlayer';
import {
  ChevronDown,
  ChevronRight,
  Edit,
  Eye,
  FileText,
  GripVertical,
  Play,
  Plus,
  Trash2,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/card';
import AddButton from '../button/addButton';
import LectureModal from '@/app/(page)/profile/(without-layout)/lecture/course/[id]/components/modals/lectureModal';
import SectionModal from '@/app/(page)/profile/(without-layout)/lecture/course/[id]/components/modals/sectionModal';
import SectionCard from '../cards/sectionCard';

interface SectionListProps {
  sections: Section[];
  setSections: (sections: Section[]) => void;
  course: CourseForm;
  handleGetCourseInfo: (targetSection?: string) => void;
  setShowAlertSuccess: (value: boolean) => void;
  setShowAlertError: (value: boolean) => void;
  setDescription: (value: string) => void;
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
  setShowAlertSuccess,
  setShowAlertError,
  setDescription,
}) => {
  const [isAddingSection, setIsAddingSection] = useState<boolean>(false);
  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(null);
  const [isAddingLecture, setIsAddingLecture] = useState<number | null>(null);
  const [openSectionIds, setOpenSections] = useState<Set<string>>(new Set());

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
    return sections.reduce((total, section) => total + (section?.items.length || 0), 0);
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

  return (
    <>
      {/* Lessons Section */}
      {/* <div className="bg-white dark:bg-black text-black dark:text-white rounded-lg shadow p-6">
        {sections.length > 0 ? (
          sections.map((section, index) => (
            <div key={index} className="mb-6 pb-4 border-b">
              {editingSectionIndex === index ? (
                <SectionForm
                  section={section}
                  onSave={(updatedSection) => {
                    const updatedSections = [...sections];
                    updatedSections[index] = updatedSection;
                    setSections(updatedSections);
                    setEditingSectionIndex(null);
                    handleGetCourseInfo(updatedSection.id);
                    setShowAlertSuccess(true);
                    setDescription('Phần bài giảng đã được cập nhật thành công!');
                    setTimeout(() => setShowAlertSuccess(false), 3000);
                  }}
                  onCancel={() => setEditingSectionIndex(null)}
                  courseId={courseId}
                />
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold">
                      Phần {index + 1}: {section.title}
                    </h3>
                    <Button
                      type="button"
                      className="bg-custom-gradient-button-violet dark:bg-custom-gradient-button-blue text-white hover:bg-black hover:text-white"
                      onClick={() => setEditingSectionIndex(index)}
                    >
                      ✍️ Chỉnh sửa
                    </Button>
                  </div>

                  {section.description && (
                    <p className="mb-2 text-sm">
                      <strong>Mô tả:</strong>{' '}
                      <span
                        className="ql-content"
                        dangerouslySetInnerHTML={{ __html: section.description }}
                      />
                    </p>
                  )}

                  {section.items?.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-md mb-2">📘 Bài giảng</h4>
                      {section.items.map((item, itemIndex) => (
                        <CourseItemDisplay
                          key={itemIndex}
                          item={item}
                          sectionIndex={index}
                          sections={sections}
                          onSave={() => handleGetCourseInfo(section.id)}
                          onCancel={() => setIsAddingLecture(null)}
                        />
                      ))}
                    </div>
                  )}

                  {isAddingLecture === index ? (
                    <CourseItemForm
                      sectionIndex={index}
                      section={section}
                      onSave={() => {
                        handleGetCourseInfo(section.id);
                        setIsAddingLecture(null);
                      }}
                      onCancel={() => setIsAddingLecture(null)}
                    />
                  ) : (
                    <Button
                      type="button"
                      className="mt-3 bg-custom-gradient-button-violet text-white dark:bg-custom-gradient-button-blue hover:brightness-110"
                      onClick={() => setIsAddingLecture(index)}
                    >
                      + Thêm bài giảng
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-gray-500 italic mb-6 p-4 bg-AntiFlashWhite dark:bg-eerieBlack rounded-lg border border-dashed border-gray-300 text-center">
            Chưa có bài học được thêm vào
          </div>
        )}
        {isAddingSection ? (
          <SectionForm
            section={{
              title: '',
              description: '',
              position: (sections.length + 1).toString(),
              items: [],
              id: '',
              status: 'ACTIVE',
              course_id: courseId,
              quizzes: [],
              articles: [],
            }}
            onSave={(newSection) => {
              setSections([...sections, newSection]);
              setIsAddingSection(false);
              handleGetCourseInfo(newSection.id);
              setShowAlertSuccess(true);
              setDescription('Phần bài giảng đã được thêm thành công!');
              setTimeout(() => setShowAlertSuccess(false), 3000);
            }}
            onCancel={() => setIsAddingSection(false)}
            courseId={courseId}
          />
        ) : (
          <Button
            variant="outline"
            className="bg-custom-gradient-button-violet text-white hover:text-white/90 hover:brightness-110 dark:bg-custom-gradient-button-blue"
            onClick={() => setIsAddingSection(true)}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Thêm Phầm Mới
          </Button>
        )}
      </div> */}
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

        {/* Section Modal */}
        <SectionModal
          open={isSectionModalOpen}
          onOpenChange={selectedSection ? handleCancelEditSection : handleCancelAddSection}
          course={course!}
          section={selectedSection!}
          onSubmitSuccess={handleGetCourseInfo}
          setShowAlertSuccess={setShowAlertSuccess}
          setShowAlertError={setShowAlertError}
          setDescription={setDescription}
        />

        {/* Lecture Modal */}
        <LectureModal
          open={isLectureModalOpen}
          onOpenChange={selectedLecture ? handleCancelEditLecture : handleCancelAddLecture}
          section={selectedSection!}
          lecture={selectedLecture!}
          onSubmitSuccess={handleGetCourseInfo}
          setShowAlertSuccess={setShowAlertSuccess}
          setShowAlertError={setShowAlertError}
          setDescription={setDescription}
        />
      </div>
    </>
  );
};

export default SectionList;
