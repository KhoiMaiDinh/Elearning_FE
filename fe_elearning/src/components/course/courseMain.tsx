import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { PlayCircle } from "lucide-react";

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
            className="border rounded-lg overflow-hidden"
          >
            {/* Section title */}
            <div className="flex justify-between items-center md:p-4 p-2 bg-gray/10 hover:bg-gray/20">
              <span className="font-medium lg:text-[16px] md:text-[14px] text-[12px] text-black dark:text-AntiFlashWhite">
                {section.section_title}
              </span>
              {/* Hiển thị icon dropdown chỉ khi content có bài học */}
              {section.content.length > 0 && (
                <AccordionTrigger className="ml-2"></AccordionTrigger>
              )}
            </div>

            {/* Lesson titles */}
            {section.content.length > 0 && (
              <AccordionContent className="md:p-4 p-2">
                <div className="space-y-2">
                  {section.content.map((lesson, lessonIndex) => (
                    <div
                      key={lessonIndex}
                      className="lg:text-[14px] flex flex-row items-center gap-2 md:text-[12px] text-[10px] text-darkSilver font-sans font-medium p-2 bg-gray/5 hover:bg-gray/10 rounded-md"
                    >
                      <PlayCircle
                        size={16}
                        className="text-majorelleBlue shrink-0"
                      />
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
