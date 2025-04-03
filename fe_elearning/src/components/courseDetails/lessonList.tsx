import React from "react";
import { PlayCircle } from "lucide-react";
import { CourseItem, Section } from "@/types/courseType";

interface CourseItemListProps {
  sections: Section[];
  currentCourseItemId: string;
  onCourseItemSelect: (courseItem: CourseItem) => void;
  isExpanded: boolean;
}

const CourseItemList: React.FC<CourseItemListProps> = ({
  sections,
  currentCourseItemId,
  onCourseItemSelect,
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
              {section.title}
            </h4>
          )}
          <ul className="space-y-2">
            {section.content &&
              section?.content.map((courseItem) => (
                <li
                  key={courseItem.title}
                  onClick={() => onCourseItemSelect(courseItem)}
                  className={`p-4 flex items-center gap-2 cursor-pointer hover:bg-majorelleBlue20 dark:hover:bg-majorelleBlue/10 transition-colors ${
                    courseItem.title === currentCourseItemId
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
                        {courseItem.title}
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

export default CourseItemList;
