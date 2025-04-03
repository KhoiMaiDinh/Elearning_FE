"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import SectionForm from "./SectionForm";
import CourseItemForm from "./CourseItemForm";
import { CourseItem, Section } from "@/types/courseType";

interface SectionListProps {
  sections: Section[];
  setSections: (sections: Section[]) => void;
  courseId: string;
  handleGetCourseInfo: (targetSection?: string) => void;
  setShowAlertSuccess: (value: boolean) => void;
  setShowAlertError: (value: boolean) => void;
  setDescription: (value: string) => void;
}

interface CourseItemProps {
  item: CourseItem;
  sectionIndex: number;
  onSave: () => void;
  onCancel: () => void;
}

const CourseItemDisplay: React.FC<CourseItemProps> = ({ item }) => {
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  return (
    <div className="ml-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-2">
      <p>
        <strong>Tiêu đề:</strong> {item.title}
      </p>
      <p>
        <strong>Nội dung:</strong>
        <span
          className="ql-content"
          dangerouslySetInnerHTML={{ __html: item.description }}
        />
      </p>
      {item.video && (
        <div className="mt-2">
          <p>
            <strong>Video:</strong>
          </p>
          {item.video.video.status === "VALIDATED" ? (
            <video
              src={`${process.env.NEXT_PUBLIC_BASE_URL_VIDEO}${item.video.video.key}`}
              controls
              className="w-full max-w-xs"
            />
          ) : item.video.video.status === "UPLOADED" ? (
            <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
              <p className="text-sm text-gray-600 mt-1">Đang xử lý video...</p>
            </div>
          ) : (
            <p className="text-sm text-red-600">Video đang được kiểm duyệt</p>
          )}
        </div>
      )}
      {item.resources && item.resources.length > 0 && (
        <div className="mt-2">
          <p>
            <strong>Tài liệu:</strong>
          </p>
          <ul className="list-disc pl-5">
            {item.resources.map((resource: { key: string }, idx: number) => (
              <li key={idx}>
                <a
                  href={`${process.env.NEXT_PUBLIC_BASE_URL_DOCUMENT}${resource.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {resource.key.split("/").pop()}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="mt-2">
        <strong>Xem trước:</strong> {item.is_preview ? "Có" : "Không"}
      </p>
    </div>
  );
};

const SectionList: React.FC<SectionListProps> = ({
  sections,
  setSections,
  courseId,
  handleGetCourseInfo,
  setShowAlertSuccess,
  setShowAlertError,
  setDescription,
}) => {
  const [isEditingSection, setIsEditingSection] = useState<boolean>(false);
  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(
    null
  );
  const [isAddingCourseItem, setIsAddingCourseItem] = useState<number | null>(
    null
  );

  return (
    <div className="bg-white dark:bg-eerieBlack shadow-md rounded-lg p-3 border">
      <h2 className="text-xl font-bold mb-4">Phần bài giảng</h2>
      {sections.length > 0 ? (
        sections.map((section, index) => (
          <div key={index} className="p-2 border-b">
            {editingSectionIndex === index ? (
              <SectionForm
                section={section as Section & { course?: { id: string } }}
                onSave={(updatedSection) => {
                  const updatedSections = [...sections];
                  updatedSections[index] = updatedSection;
                  setSections(updatedSections);
                  setEditingSectionIndex(null);
                  handleGetCourseInfo(updatedSection.id);
                  setShowAlertSuccess(true);
                  setDescription("Phần bài giảng đã được cập nhật thành công!");
                  setTimeout(() => setShowAlertSuccess(false), 3000);
                }}
                onCancel={() => setEditingSectionIndex(null)}
                courseId={courseId}
              />
            ) : (
              <div>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold">
                    Phần {index + 1}: {section.title}
                  </h3>
                  <Button
                    type="button"
                    className="bg-majorelleBlue text-white"
                    onClick={() => setEditingSectionIndex(index)}
                  >
                    Chỉnh sửa
                  </Button>
                </div>
                {section.description && (
                  <p>
                    <strong>Mô tả:</strong>
                    <span
                      className="ql-content"
                      dangerouslySetInnerHTML={{ __html: section.description }}
                    />
                  </p>
                )}
                {section.lectures && section.lectures.length > 0 && (
                  <div className="mt-3">
                    <h4 className="text-md font-bold">Bài giảng</h4>
                    {section.lectures.map(
                      (item: CourseItem, itemIndex: number) => (
                        <CourseItemDisplay
                          key={itemIndex}
                          item={item}
                          sectionIndex={index}
                          onSave={() => handleGetCourseInfo(section.id)}
                          onCancel={() => setIsAddingCourseItem(null)}
                        />
                      )
                    )}
                  </div>
                )}
                {isAddingCourseItem === index ? (
                  <CourseItemForm
                    sectionIndex={index}
                    section={section as Section & { course?: { id: string } }}
                    onSave={() => {
                      handleGetCourseInfo(section.id);
                      setIsAddingCourseItem(null);
                    }}
                    onCancel={() => setIsAddingCourseItem(null)}
                  />
                ) : (
                  <Button
                    type="button"
                    className="mt-2 bg-majorelleBlue text-white"
                    onClick={() => setIsAddingCourseItem(index)}
                  >
                    Thêm bài giảng
                  </Button>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <p>Chưa có phần bài giảng nào.</p>
      )}

      {isEditingSection ? (
        <SectionForm
          section={{
            title: "",
            description: "",
            position: (sections.length + 1).toString(),
            lectures: [],
            id: "",
            status: "ACTIVE",
            course_id: courseId,
            quizzes: [],
            articles: [],
          }}
          onSave={(newSection) => {
            setSections([...sections, newSection]);
            setIsEditingSection(false);
            handleGetCourseInfo(newSection.id);
            setShowAlertSuccess(true);
            setDescription("Phần bài giảng đã được thêm thành công!");
            setTimeout(() => setShowAlertSuccess(false), 3000);
          }}
          onCancel={() => setIsEditingSection(false)}
          courseId={courseId}
        />
      ) : (
        <Button
          type="button"
          className="mt-2 bg-majorelleBlue text-white"
          onClick={() => setIsEditingSection(true)}
        >
          Thêm phần bài giảng
        </Button>
      )}
    </div>
  );
};

export default SectionList;
