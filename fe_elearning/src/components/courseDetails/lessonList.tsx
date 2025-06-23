'use client';

import React, { useState } from 'react';
import { PlayCircle, ChevronDown, ChevronRight, CheckCircle, Lock } from 'lucide-react';
import { CourseItem, SectionType } from '@/types/courseType';
import { useSelector } from 'react-redux';
import { RootState } from '@/constants/store';
interface CourseItemListProps {
  sections: SectionType[];
  currentCourseItemId: string;
  onCourseItemSelect: (courseItem: CourseItem) => void;
  isExpanded: boolean;
  isRegistered: boolean;
  isOwner: boolean;
}

const CourseItemList: React.FC<CourseItemListProps> = ({
  sections = [],
  currentCourseItemId,
  onCourseItemSelect,
  isExpanded,
  isRegistered,
  isOwner,
}) => {
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({});
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  const toggleSection = (index: number) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Check nếu có bài con đang active thì section cha cũng sáng
  const isChildActive = (section: SectionType) =>
    section?.items?.some((item) => item?.title === currentCourseItemId) || false;

  if (!sections || sections.length === 0) {
    return (
      <div className="h-full overflow-y-auto px-2 pb-6">
        <h3 className="py-4 px-3 text-lg font-semibold text-majorelleBlue dark:text-white/80">
          Không có bài học nào
        </h3>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto px-2 pb-6">
      <h3
        className={`py-4 px-3 text-lg font-semibold text-majorelleBlue dark:text-white/80 ${
          !isExpanded ? 'text-center' : ''
        }`}
      >
        {isExpanded ? 'Danh mục bài học' : ''}
      </h3>

      <div className="space-y-4">
        {sections &&
          sections.length > 0 &&
          sections.map((section, sectionIndex) => {
            if (!section) return null;

            const isOpen = openSections[sectionIndex] ?? true;
            const sectionActive = isChildActive(section);

            return (
              <div key={sectionIndex}>
                {isExpanded && (
                  <div
                    onClick={() => toggleSection(sectionIndex)}
                    className={`flex items-center justify-between cursor-pointer px-3 py-2 rounded-md transition-colors ${
                      sectionActive
                        ? 'bg-majorelleBlue/20 dark:bg-majorelleBlue/30'
                        : 'bg-majorelleBlue/10 dark:bg-majorelleBlue/10 hover:bg-majorelleBlue/20'
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

                {isOpen && section.items && section.items.length > 0 && (
                  <ul className="space-y-1 mt-2">
                    {section.items &&
                      section.items.length > 0 &&
                      section.items.map((courseItem) => {
                        if (!courseItem) return null;

                        const isActive = courseItem.title === currentCourseItemId;
                        const isLocked = !isRegistered && !courseItem.is_preview && !isOwner;

                        return (
                          <li
                            key={courseItem.title}
                            onClick={() => !isLocked && onCourseItemSelect(courseItem)}
                            className={`group px-3 py-2 flex items-center justify-between rounded-md ${
                              isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                            } transition-colors ${
                              isActive
                                ? 'bg-majorelleBlue/20 dark:bg-majorelleBlue/30'
                                : !isLocked
                                  ? 'hover:bg-majorelleBlue/10 dark:hover:bg-majorelleBlue/10'
                                  : ''
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <PlayCircle
                                size={20}
                                className={`text-majorelleBlue flex-shrink-0 transition-opacity group-hover:opacity-90 ${
                                  isActive ? 'opacity-100' : 'opacity-80'
                                }`}
                              />
                              {isExpanded && (
                                <span
                                  className={`text-sm ${
                                    isActive
                                      ? 'font-semibold text-majorelleBlue'
                                      : 'text-darkSilver dark:text-lightSilver'
                                  }`}
                                >
                                  {courseItem.title}
                                </span>
                              )}
                            </div>
                            {/* ✅ Green checkmark if progress > 80% */}
                            {isExpanded &&
                              isRegistered &&
                              courseItem.progresses &&
                              courseItem.progresses[0]?.watch_time_in_percentage &&
                              courseItem.progresses[0]?.watch_time_in_percentage > 80 && (
                                <CheckCircle
                                  size={16}
                                  className="text-vividMalachite flex-shrink-0"
                                />
                              )}
                            {/* 🔒 Lock icon for non-preview lessons when not registered */}
                            {isExpanded && isLocked && !isOwner && (
                              <Lock size={16} className="text-gray-400 flex-shrink-0" />
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
