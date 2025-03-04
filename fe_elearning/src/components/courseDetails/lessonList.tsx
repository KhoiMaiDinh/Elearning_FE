import React from "react";
import { PlayCircle } from "lucide-react";
import { Lesson, Section } from "@/types/courseType";

interface LessonListProps {
  sections: Section[];
  currentLessonId: string;
  onLessonSelect: (lesson: Lesson) => void;
  isExpanded: boolean;
}

const LessonList: React.FC<LessonListProps> = ({
  sections,
  currentLessonId,
  onLessonSelect,
  isExpanded,
}) => {
  return (
    <div className="h-full overflow-y-auto">
      <h3
        className={`p-4 text-lg font-semibold text-majorelleBlue ${
          !isExpanded && "text-center"
        }`}
      >
        {isExpanded ? "Danh mục bài học" : ""}
      </h3>
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-4">
          {isExpanded && (
            <h4 className="p-2 text-sm font-medium text-cosmicCobalt dark:text-AntiFlashWhite bg-majorelleBlue20 dark:bg-majorelleBlue/10">
              {section.section_title}
            </h4>
          )}
          <ul className="space-y-2">
            {section.content.map((lesson) => (
              <li
                key={lesson.lesson_title}
                onClick={() => onLessonSelect(lesson)}
                className={`p-4 flex items-center gap-2 cursor-pointer hover:bg-majorelleBlue20 dark:hover:bg-majorelleBlue/10 transition-colors ${
                  lesson.lesson_title === currentLessonId
                    ? "bg-majorelleBlue50 dark:bg-majorelleBlue/20"
                    : ""
                }`}
              >
                <PlayCircle
                  size={20}
                  className="text-majorelleBlue flex-shrink-0"
                />
                {isExpanded && (
                  <div className="flex-1">
                    <p className="text-darkSilver dark:text-lightSilver">
                      {lesson.lesson_title}
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default LessonList;
