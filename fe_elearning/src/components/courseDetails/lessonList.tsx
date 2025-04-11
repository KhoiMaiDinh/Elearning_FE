"use client";

import React, { useState } from "react";
import { PlayCircle, ChevronDown, ChevronRight } from "lucide-react";
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
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({});

  const toggleSection = (index: number) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Check nếu có bài con đang active thì section cha cũng sáng
  const isChildActive = (section: Section) =>
    section.lectures?.some((item) => item.title === currentCourseItemId);

  return (
    <div className="h-full overflow-y-auto px-2 pb-6">
      <h3
        className={`py-4 px-3 text-lg font-semibold text-majorelleBlue ${
          !isExpanded ? "text-center" : ""
        }`}
      >
        {isExpanded ? "Danh mục bài học" : ""}
      </h3>

      <div className="space-y-4">
        {sections.map((section, sectionIndex) => {
          const isOpen = openSections[sectionIndex] ?? true;
          const sectionActive = isChildActive(section);

          return (
            <div key={sectionIndex}>
              {isExpanded && (
                <div
                  onClick={() => toggleSection(sectionIndex)}
                  className={`flex items-center justify-between cursor-pointer px-3 py-2 rounded-md transition-colors ${
                    sectionActive
                      ? "bg-majorelleBlue/20 dark:bg-majorelleBlue/30"
                      : "bg-majorelleBlue/10 dark:bg-majorelleBlue/10 hover:bg-majorelleBlue/20"
                  }`}
                >
                  <h4 className="text-sm font-medium text-cosmicCobalt dark:text-AntiFlashWhite">
                    {section.title}
                  </h4>
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4 text-majorelleBlue" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-majorelleBlue" />
                  )}
                </div>
              )}

              {isOpen && (
                <ul className="space-y-1 mt-2">
                  {section.lectures?.map((courseItem) => {
                    const isActive = courseItem.title === currentCourseItemId;

                    return (
                      <li
                        key={courseItem.title}
                        onClick={() => onCourseItemSelect(courseItem)}
                        className={`group px-3 py-2 flex items-center gap-3 rounded-md cursor-pointer transition-colors ${
                          isActive
                            ? "bg-majorelleBlue/20 dark:bg-majorelleBlue/30"
                            : "hover:bg-majorelleBlue/10 dark:hover:bg-majorelleBlue/10"
                        }`}
                      >
                        <PlayCircle
                          size={20}
                          className={`text-majorelleBlue flex-shrink-0 transition-opacity group-hover:opacity-90 ${
                            isActive ? "opacity-100" : "opacity-80"
                          }`}
                        />
                        {isExpanded && (
                          <span
                            className={`text-sm ${
                              isActive
                                ? "font-semibold text-majorelleBlue"
                                : "text-darkSilver dark:text-lightSilver"
                            }`}
                          >
                            {courseItem.title}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseItemList;
