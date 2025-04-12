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
    <div className="ml-6 mt-4 p-4 rounded-xl bg-AntiFlashWhite dark:bg-gray/90 border">
      <p className="mb-1">
        <strong>🎯 Tiêu đề:</strong> {item.title}
      </p>
      <p className="mb-1">
        <strong>📄 Nội dung:</strong>{" "}
        <span
          className="ql-content text-sm"
          dangerouslySetInnerHTML={{ __html: item.description }}
        />
      </p>

      {item.video && (
        <div className="mt-3">
          <p className="font-semibold mb-1">🎥 Video:</p>
          {item.video.video.status === "VALIDATED" ? (
            <video
              src={`${process.env.NEXT_PUBLIC_BASE_URL_VIDEO}${item.video.video.key}`}
              controls
              className="w-full max-w-sm rounded-lg shadow"
            />
          ) : item.video.video.status === "UPLOADED" ? (
            <div>
              <div className="w-full max-w-sm bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                ⏳ Đang xử lý video...
              </p>
            </div>
          ) : (
            <p className="text-sm text-red-600">
              ⛔ Video đang được kiểm duyệt
            </p>
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
                  href={`${process.env.NEXT_PUBLIC_BASE_URL_DOCUMENT}${resource.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-majorelleBlue hover:underline"
                >
                  {resource.key.split("/").pop()}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-3 text-sm">
        <strong>👁️ Xem trước:</strong> {item.is_preview ? "Có" : "Không"}
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
    <div className="bg-white dark:bg-eerieBlack text-cosmicCobalt dark:text-white shadow-md rounded-xl p-6 border">
      <h2 className="text-2xl font-bold mb-6">📚 Phần bài giảng</h2>

      {sections.length > 0 ? (
        sections.map((section, index) => (
          <div key={index} className="mb-6 pb-4 border-b">
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
                    <strong>Mô tả:</strong>{" "}
                    <span
                      className="ql-content"
                      dangerouslySetInnerHTML={{ __html: section.description }}
                    />
                  </p>
                )}

                {section.lectures?.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-md mb-2">📘 Bài giảng</h4>
                    {section.lectures.map((item, itemIndex) => (
                      <CourseItemDisplay
                        key={itemIndex}
                        item={item}
                        sectionIndex={index}
                        onSave={() => handleGetCourseInfo(section.id)}
                        onCancel={() => setIsAddingCourseItem(null)}
                      />
                    ))}
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
                    className="mt-3 bg-custom-gradient-button-violet text-white dark:bg-custom-gradient-button-blue hover:brightness-110"
                    onClick={() => setIsAddingCourseItem(index)}
                  >
                    ➕ Thêm bài giảng
                  </Button>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray italic">Chưa có phần bài giảng nào.</p>
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
          className="mt-3 bg-custom-gradient-button-violet text-white dark:bg-custom-gradient-button-blue hover:brightness-110"
          onClick={() => setIsEditingSection(true)}
        >
          + Thêm phần bài giảng
        </Button>
      )}
    </div>
  );
};

export default SectionList;
