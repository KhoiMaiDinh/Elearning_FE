'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { PlayCircle, CheckCircle, Clock, ChevronRight, Lock } from 'lucide-react';
import type { CourseForm, CourseItem, SectionType } from '@/types/courseType';
import { cn } from '@/lib/utils';
import { formatDuration } from '@/helpers/durationFormater';
import { useRouter } from 'next/navigation';

type CourseMainProps = {
  course: CourseForm;
  isRegistered?: boolean;
  isOwner?: boolean;
};

// Component chính
const CourseMain: React.FC<CourseMainProps> = ({
  course,
  isRegistered = false,
  isOwner = false,
}) => {
  const [sections, setSections] = useState<SectionType[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (course?.sections) {
      const sortedSections = course.sections.sort((a: SectionType, b: SectionType) =>
        a.position.localeCompare(b.position)
      );
      setSections(sortedSections);

      // Auto-expand the first section
      if (sortedSections.length > 0) {
        setExpandedSections([`section-0`]);
      }
    }
  }, [course?.sections]);

  // Determine if a lesson is completed or locked (mock logic - replace with actual logic)
  const getLessonStatus = (courseItem: CourseItem) => {
    // This is mock logic - replace with your actual logic to determine lesson status
    // For demo purposes: first lesson is completed, some are locked, rest are available

    if (
      courseItem.progresses &&
      courseItem.progresses[0]?.watch_time_in_percentage &&
      courseItem.progresses[0]?.watch_time_in_percentage > 80
    )
      return 'completed';

    return 'available';
  };

  const handleLessonClick = (courseItem: CourseItem) => {
    // Nếu là người đã đăng ký hoặc owner, cho phép truy cập tất cả bài học
    if (isRegistered || isOwner) {
      router.push(`/course-details/${course.id}?lecture=${courseItem.id}`);
      return;
    }

    // Nếu không phải người đăng ký hoặc owner, chỉ cho phép xem bài học preview
    if (courseItem.is_preview) {
      router.push(`/course-details/${course.id}?lecture=${courseItem.id}`);
      return;
    }
  };

  const isLessonAccessible = (courseItem: CourseItem) => {
    return isRegistered || isOwner || courseItem.is_preview;
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
      <Accordion
        type="multiple"
        value={expandedSections}
        onValueChange={setExpandedSections}
        className="divide-y divide-gray-100 dark:divide-gray-800"
      >
        {sections &&
          sections.length > 0 &&
          sections?.map((section, sectionIndex) => {
            const hasChild = section?.items?.some((item) => item?.video) || false;
            if (!section || !hasChild) return null;

            // Count completed lessons in this section
            const completedCount = section.items.filter(
              (course, idx) => getLessonStatus(course) === 'completed'
            ).length;

            return (
              <AccordionItem
                key={sectionIndex}
                value={`section-${sectionIndex}`}
                className="border-none"
              >
                {/* Section title */}
                <div className="bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex flex-col items-start text-left w-full">
                      <div className="flex items-center justify-between w-full">
                        <span className="font-semibold text-base text-gray-900 dark:text-white">
                          {section.title}
                        </span>

                        {completedCount > 0 && (
                          <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full ml-2">
                            {completedCount}/{section?.items?.length} hoàn thành
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {section?.items?.length} bài học
                      </span>
                    </div>
                  </AccordionTrigger>
                </div>

                {/* Lesson titles */}
                {section?.items?.length > 0 &&
                  section.items.map((courseItem) => {
                    if (!courseItem || !courseItem?.video) return null;
                    return (
                      <AccordionContent className="p-0">
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                          {section.items &&
                            section.items.length > 0 &&
                            section.items.map((lesson, lessonIndex) => {
                              if (!lesson || !lesson?.video) return null;
                              const status = getLessonStatus(lesson);
                              const isAccessible = isLessonAccessible(lesson);

                              return (
                                <div
                                  key={lessonIndex}
                                  onClick={() => handleLessonClick(lesson)}
                                  className={cn(
                                    'flex items-center p-4 transition-colors',
                                    isAccessible
                                      ? 'hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer'
                                      : 'cursor-not-allowed opacity-60',
                                    status === 'completed'
                                      ? 'bg-green-50/50 dark:bg-green-900/10'
                                      : ''
                                  )}
                                >
                                  <div className="flex items-center gap-3 flex-1">
                                    {/* Status icon */}
                                    <div className="flex-shrink-0">
                                      {status === 'completed' ? (
                                        <CheckCircle size={18} className="text-vividMalachite" />
                                      ) : isAccessible ? (
                                        <PlayCircle size={18} className="text-majorelleBlue" />
                                      ) : (
                                        <Lock size={18} className="text-gray-400" />
                                      )}
                                    </div>
                                    {/* Lesson content */}
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between">
                                        <p
                                          className={cn(
                                            'text-sm md:text-base font-medium',
                                            status === 'completed'
                                              ? 'text-green-700 dark:text-green-400'
                                              : isAccessible
                                                ? 'text-gray-900 dark:text-gray-100'
                                                : 'text-gray-500 dark:text-gray-400'
                                          )}
                                        >
                                          {lesson.title}
                                        </p>

                                        {/* Duration if available */}
                                        {lesson?.duration_in_seconds && (
                                          <div className="flex items-center gap-1 ml-2">
                                            <Clock size={12} className="text-gray-400" />
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                              {formatDuration(lesson.duration_in_seconds)}
                                            </span>
                                          </div>
                                        )}
                                      </div>

                                      {/* Preview text or additional info */}
                                      {lesson.description && (
                                        <p
                                          className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1"
                                          dangerouslySetInnerHTML={{
                                            __html: lesson.description,
                                          }}
                                        ></p>
                                      )}
                                    </div>
                                    {/* Action indicator */}
                                    {isAccessible && (
                                      <ChevronRight size={16} className="text-gray-400 ml-2" />
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </AccordionContent>
                    );
                  })}
              </AccordionItem>
            );
          })}
      </Accordion>

      {sections.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">Chưa có nội dung khóa học</p>
        </div>
      )}
    </div>
  );
};

export default CourseMain;
