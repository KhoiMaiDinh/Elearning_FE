import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

// Định nghĩa kiểu cho dữ liệu
type Lesson = {
  lesson_title: string;
  lesson_content: string;
  resources: string[];
  video_url: string;
};

type Section = {
  section_title: string;
  content: Lesson[];
  section_video: string;
  section_description: string;
  section_resources: string[];
};

type Course = {
  sections: Section[];
};

// Dữ liệu mẫu
const course: Course = {
  sections: [
    {
      section_title: "Giới thiệu về JavaScript",
      content: [
        {
          lesson_title: "JavaScript là gì?",
          lesson_content: "",
          resources: [],
          video_url: "",
        },
        {
          lesson_title: "Thiết lập môi trường làm việc",
          lesson_content: "",
          resources: [],
          video_url: "",
        },
      ],
      section_video: "",
      section_description: "",
      section_resources: [],
    },
    {
      section_title: "Lập trình cơ bản với JavaScript",
      content: [],
      section_video: "",
      section_description: "",
      section_resources: [],
    },
  ],
};

// Component chính
const CourseMain: React.FC = () => {
  return (
    <div className="p-4">
      <Accordion type="multiple" className="space-y-4 font-sans">
        {course.sections.map((section, sectionIndex) => (
          <AccordionItem
            key={sectionIndex}
            value={`section-${sectionIndex}`}
            className="border rounded-lg"
          >
            {/* Section title */}
            <div className="flex justify-between items-center p-4 bg-gray-100 hover:bg-gray-200">
              <span className="font-medium text-[16px] text-black dark:text-AntiFlashWhite">
                {section.section_title}
              </span>
              {/* Hiển thị icon dropdown chỉ khi content có bài học */}
              {section.content.length > 0 && (
                <AccordionTrigger className="ml-2"></AccordionTrigger>
              )}
            </div>

            {/* Lesson titles */}
            {section.content.length > 0 && (
              <AccordionContent className="p-4">
                <div className="space-y-2">
                  {section.content.map((lesson, lessonIndex) => (
                    <div
                      key={lessonIndex}
                      className="text-[14px] text-darkSilver font-sans font-medium p-2 bg-gray-50 hover:bg-gray-100 rounded-md"
                    >
                      {lesson.lesson_title}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            )}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default CourseMain;
