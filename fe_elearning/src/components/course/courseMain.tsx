"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { PlayCircle, Lock, CheckCircle, Clock, ChevronRight } from "lucide-react"
import type { CourseForm, Section } from "@/types/courseType"
import { cn } from "@/lib/utils"

type CourseMainProps = {
  course: CourseForm
}

// Component chính
const CourseMain: React.FC<CourseMainProps> = ({ course }) => {
  const [sections, setSections] = useState<Section[]>([])
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  useEffect(() => {
    if (course?.sections) {
      const sortedSections = course.sections.sort((a: Section, b: Section) => a.position.localeCompare(b.position))
      setSections(sortedSections)

      // Auto-expand the first section
      if (sortedSections.length > 0) {
        setExpandedSections([`section-0`])
      }
    }
  }, [course?.sections])

  // Format seconds to minutes and seconds
  const formatDuration = (seconds: number | undefined) => {
    if (!seconds) return null
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Determine if a lesson is completed or locked (mock logic - replace with actual logic)
  const getLessonStatus = (lessonIndex: number, sectionIndex: number) => {
    // This is mock logic - replace with your actual logic to determine lesson status
    // For demo purposes: first lesson is completed, some are locked, rest are available
    if (sectionIndex === 0 && lessonIndex === 0) return "completed"
    if ((sectionIndex + lessonIndex) % 5 === 0) return "locked"
    return "available"
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
      <Accordion
        type="multiple"
        value={expandedSections}
        onValueChange={setExpandedSections}
        className="divide-y divide-gray-100 dark:divide-gray-800"
      >
        {sections?.map((section, sectionIndex) => {
          // Count completed lessons in this section
          const completedCount = section.items.filter(
            (_, idx) => getLessonStatus(idx, sectionIndex) === "completed",
          ).length

          return (
            <AccordionItem key={sectionIndex} value={`section-${sectionIndex}`} className="border-none">
              {/* Section title */}
              <div className="bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex flex-col items-start text-left w-full">
                    <div className="flex items-center justify-between w-full">
                      <span className="font-semibold text-base text-gray-900 dark:text-white">{section.title}</span>

                      {completedCount > 0 && (
                        <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full ml-2">
                          {completedCount}/{section.items.length} hoàn thành
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {section.items.length} bài học
                    </span>
                  </div>
                </AccordionTrigger>
              </div>

              {/* Lesson titles */}
              {section.items.length > 0 && (
                <AccordionContent className="p-0">
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {section.items.map((lesson, lessonIndex) => {
                      const status = getLessonStatus(lessonIndex, sectionIndex)

                      return (
                        <div
                          key={lessonIndex}
                          className={cn(
                            "flex items-center p-4 transition-colors",
                            status === "locked"
                              ? "opacity-70 cursor-not-allowed"
                              : "hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer",
                            status === "completed" && "bg-green-50/50 dark:bg-green-900/10",
                          )}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            {/* Status icon */}
                            <div className="flex-shrink-0">
                              {status === "completed" ? (
                                <CheckCircle size={18} className="text-vividMalachite" />
                              ) : status === "locked" ? (
                                <Lock size={18} className="text-gray-400" />
                              ) : (
                                <PlayCircle size={18} className="text-majorelleBlue" />
                              )}
                            </div>

                            {/* Lesson content */}
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p
                                  className={cn(
                                    "text-sm md:text-base font-medium",
                                    status === "completed"
                                      ? "text-green-700 dark:text-green-400"
                                      : status === "locked"
                                        ? "text-gray-500 dark:text-gray-400"
                                        : "text-gray-900 dark:text-gray-100",
                                  )}
                                >
                                  {lesson.title}
                                </p>

                                {/* Duration if available */}
                                {lesson.video?.duration_in_seconds && (
                                  <div className="flex items-center gap-1 ml-2">
                                    <Clock size={12} className="text-gray-400" />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {formatDuration(lesson.video.duration_in_seconds)}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Preview text or additional info */}
                              {lesson.description && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                                  {lesson.description}
                                </p>
                              )}
                            </div>

                            {/* Action indicator */}
                            {status !== "locked" && <ChevronRight size={16} className="text-gray-400 ml-2" />}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </AccordionContent>
              )}
            </AccordionItem>
          )
        })}
      </Accordion>

      {sections.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">Chưa có nội dung khóa học</p>
        </div>
      )}
    </div>
  )
}

export default CourseMain
