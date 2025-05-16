import React, { useState, useEffect } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { PlayCircle } from 'lucide-react';
import { CourseForm, Section } from '@/types/courseType';

type CourseMainProps = {
  course: CourseForm;
};

// Component chính
const CourseMain: React.FC<CourseMainProps> = ({ course }) => {
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    if (course?.sections) {
      const sortedSections = course.sections.sort((a: Section, b: Section) =>
        a.position.localeCompare(b.position)
      );
      setSections(sortedSections);
    }
  }, [course?.sections]);
  return (
    <div className="p-4">
      <Accordion type="multiple" className="space-y-4 font-sans">
        {sections?.map((section, sectionIndex) => (
          <AccordionItem
            key={sectionIndex}
            value={`section-${sectionIndex}`}
            className="border rounded-lg overflow-hidden"
          >
            {/* Section title */}
            <div className="flex justify-between items-center md:p-4 p-2 bg-gray/10 hover:bg-gray/20">
              <span className="font-medium lg:text-[16px] md:text-[14px] text-[12px] text-black dark:text-AntiFlashWhite">
                {section.title}
              </span>
              {/* Hiển thị icon dropdown chỉ khi content có bài học */}
              {section.items.length > 0 && <AccordionTrigger className="ml-2"></AccordionTrigger>}
            </div>

            {/* Lesson titles */}
            {section.items.length > 0 && (
              <AccordionContent className="md:p-4 p-2">
                <div className="space-y-2">
                  {section.items.map((lesson, lessonIndex) => (
                    <div
                      key={lessonIndex}
                      className="lg:text-[14px] flex flex-row items-center gap-2 md:text-[12px] text-[10px] text-darkSilver font-sans font-medium p-2 bg-gray/5 hover:bg-gray/10 rounded-md"
                    >
                      <PlayCircle size={16} className="text-majorelleBlue shrink-0" />
                      {lesson.title}
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
