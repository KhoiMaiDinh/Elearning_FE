import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/button';
import { CourseForm } from '@/types/courseType';
import { Badge } from '../ui/badge';

interface AspectData {
  positive: number;
  neutral: number;
  negative: number;
  conflict: number;
  none: number;
}

interface LectureStatistics {
  content_quality?: AspectData;
  instructor_quality?: AspectData;
  teaching_pace?: AspectData;
  study_materials?: AspectData;
  technology?: AspectData;
  assignments_practice?: AspectData;
  other?: AspectData;
}

interface LectureData {
  lecture_id: string;
  lecture_title: string;
  statistics: LectureStatistics;
}

interface SentimentDistributionProps {
  data: LectureData[];
  onViewDetails?: () => void;
}

export function SentimentDistribution({ data }: SentimentDistributionProps) {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isOpen, setIsOpen] = useState(false);

  // Calculate overall statistics
  const calculateOverallStats = () => {
    let totalResponses = 0;
    let totalPositive = 0;
    let totalNegative = 0;
    let totalNeutral = 0;
    let totalConflict = 0;

    data.forEach((lecture) => {
      Object.values(lecture.statistics).forEach((aspect) => {
        if (aspect) {
          const aspectTotal = aspect.positive + aspect.negative + aspect.neutral + aspect.conflict;
          totalResponses += aspectTotal;
          totalPositive += aspect.positive;
          totalNegative += aspect.negative;
          totalNeutral += aspect.neutral;
          totalConflict += aspect.conflict;
        }
      });
    });

    const overallTotal = totalPositive + totalNegative + totalNeutral + totalConflict;

    const positivePercentage = overallTotal > 0 ? (totalPositive / overallTotal) * 100 : 0;

    return {
      positivePercentage: Math.round(positivePercentage),
      totalPositive,
      totalNegative,
      totalNeutral,
      totalConflict,
      overallTotal,
    };
  };

  // Calculate sentiment percentages for a lecture
  const calculateLectureStats = (lecture: LectureData) => {
    let positive = 0;
    let negative = 0;
    let neutral = 0;
    let conflict = 0;

    Object.values(lecture.statistics).forEach((aspect) => {
      if (aspect) {
        positive += aspect.positive;
        negative += aspect.negative;
        neutral += aspect.neutral;
        conflict += aspect.conflict;
      }
    });

    const total = positive + negative + neutral + conflict;

    if (total === 0) {
      return {
        positive: 0,
        negative: 0,
        neutral: 0,
        conflict: 0,
        total: 0,
        positiveCount: 0,
        negativeCount: 0,
        neutralCount: 0,
        conflictCount: 0,
      };
    }

    return {
      positive: Math.round((positive / total) * 100),
      negative: Math.round((negative / total) * 100),
      neutral: Math.round((neutral / total) * 100),
      conflict: Math.round((conflict / total) * 100),
      total,
      positiveCount: positive,
      negativeCount: negative,
      neutralCount: neutral,
      conflictCount: conflict,
    };
  };

  const overallStats = calculateOverallStats();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Phân tích cảm xúc theo bài học
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {overallStats.overallTotal} phản hồi
            </p>
          </div>
          <Button
            onClick={() => setIsOpen(!isOpen)}
            variant="outline"
            className="flex items-center gap-2"
          >
            {isOpen ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {isOpen ? 'Thu gọn' : 'Xem chi tiết'}
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Overall Sentiment Bar */}
        {data && data.length > 0 ? (
          <>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-medium text-gray-900 dark:text-white">
                  Tổng quan cảm xúc
                </h4>
                <Badge className="text-sm w-fit font-bold bg-vividMalachite/10 text-vividMalachite">
                  {overallStats.positivePercentage}% tích cực
                </Badge>
              </div>

              <div className="relative">
                <div
                  className="flex h-6 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 cursor-pointer"
                  onMouseMove={(e) => {
                    setMousePosition({ x: e.clientX, y: e.clientY });
                  }}
                  onMouseLeave={() => setHoveredSegment(null)}
                >
                  {overallStats.overallTotal > 0 && (
                    <>
                      <div
                        className="bg-vividMalachite hover:bg-vividMalachite/80 transition-colors"
                        style={{
                          width: `${(overallStats.totalPositive / overallStats.overallTotal) * 100}%`,
                        }}
                        onMouseEnter={() => setHoveredSegment('positive')}
                      />
                      <div
                        className="bg-red-500 hover:bg-red-600 transition-colors"
                        style={{
                          width: `${(overallStats.totalNegative / overallStats.overallTotal) * 100}%`,
                        }}
                        onMouseEnter={() => setHoveredSegment('negative')}
                      />
                      <div
                        className="bg-gray-500 hover:bg-gray-600 transition-colors"
                        style={{
                          width: `${(overallStats.totalNeutral / overallStats.overallTotal) * 100}%`,
                        }}
                        onMouseEnter={() => setHoveredSegment('neutral')}
                      />
                      <div
                        className="bg-amber-500 hover:bg-amber-600 transition-colors"
                        style={{
                          width: `${(overallStats.totalConflict / overallStats.overallTotal) * 100}%`,
                        }}
                        onMouseEnter={() => setHoveredSegment('conflict')}
                      />
                    </>
                  )}
                </div>

                {/* Tooltip */}
                {hoveredSegment && (
                  <div
                    className="fixed z-50 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm shadow-lg pointer-events-none"
                    style={{
                      left: mousePosition.x + 10,
                      top: mousePosition.y - 40,
                    }}
                  >
                    {hoveredSegment === 'positive' && (
                      <div>
                        <div className="font-medium">Tích cực</div>
                        <div>
                          {overallStats.totalPositive} phản hồi (
                          {Math.round(
                            (overallStats.totalPositive / overallStats.overallTotal) * 100
                          )}
                          %)
                        </div>
                      </div>
                    )}
                    {hoveredSegment === 'negative' && (
                      <div>
                        <div className="font-medium">Tiêu cực</div>
                        <div>
                          {overallStats.totalNegative} phản hồi (
                          {Math.round(
                            (overallStats.totalNegative / overallStats.overallTotal) * 100
                          )}
                          %)
                        </div>
                      </div>
                    )}
                    {hoveredSegment === 'neutral' && (
                      <div>
                        <div className="font-medium">Trung tính</div>
                        <div>
                          {overallStats.totalNeutral} phản hồi (
                          {Math.round(
                            (overallStats.totalNeutral / overallStats.overallTotal) * 100
                          )}
                          %)
                        </div>
                      </div>
                    )}
                    {hoveredSegment === 'conflict' && (
                      <div>
                        <div className="font-medium">Mâu thuẫn</div>
                        <div>
                          {overallStats.totalConflict} phản hồi (
                          {Math.round(
                            (overallStats.totalConflict / overallStats.overallTotal) * 100
                          )}
                          %)
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-vividMalachite rounded-full"></div>
                  <span className="text-vividMalachite dark:text-vividMalachite">
                    Tích cực (
                    {Math.round((overallStats.totalPositive / overallStats.overallTotal) * 100)}%)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-500 dark:text-red-500">
                    Tiêu cực (
                    {Math.round((overallStats.totalNegative / overallStats.overallTotal) * 100)}%)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-gray-500 dark:text-gray-500">
                    Trung tính (
                    {Math.round((overallStats.totalNeutral / overallStats.overallTotal) * 100)}%)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span className="text-amber-500 dark:text-amber-500">
                    Mâu thuẫn (
                    {Math.round((overallStats.totalConflict / overallStats.overallTotal) * 100)}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Individual Lectures */}
            {isOpen && (
              <div className="space-y-4">
                <h4 className="text-base font-medium text-gray-900 dark:text-white">
                  Chi tiết từng bài học ({data.length})
                </h4>

                <div className="space-y-3">
                  {data.map((lecture, index) => {
                    const stats = calculateLectureStats(lecture);

                    return (
                      <div
                        key={lecture.lecture_id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                            Bài {index + 1}: {lecture.lecture_title}
                          </h5>
                          <Badge className="text-sm w-fit font-bold bg-vividMalachite/5 text-vividMalachite/70">
                            {stats.positive}% tích cực
                          </Badge>
                        </div>

                        <div className="relative">
                          <div
                            className="flex h-4 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 cursor-pointer"
                            onMouseMove={(e) => {
                              setMousePosition({ x: e.clientX, y: e.clientY });
                            }}
                            onMouseLeave={() => setHoveredSegment(null)}
                          >
                            {stats.total > 0 && (
                              <>
                                <div
                                  className="bg-vividMalachite/30 hover:bg-vividMalachite/50 transition-colors"
                                  style={{ width: `${stats.positive}%` }}
                                  onMouseEnter={() =>
                                    setHoveredSegment(`lecture-${lecture.lecture_id}-positive`)
                                  }
                                />
                                <div
                                  className="bg-red-200 hover:bg-red-300 transition-colors"
                                  style={{ width: `${stats.negative}%` }}
                                  onMouseEnter={() =>
                                    setHoveredSegment(`lecture-${lecture.lecture_id}-negative`)
                                  }
                                />
                                <div
                                  className="bg-gray-200 hover:bg-gray-300 transition-colors"
                                  style={{ width: `${stats.neutral}%` }}
                                  onMouseEnter={() =>
                                    setHoveredSegment(`lecture-${lecture.lecture_id}-neutral`)
                                  }
                                />
                                <div
                                  className="bg-amber-200 hover:bg-amber-300 transition-colors"
                                  style={{ width: `${stats.conflict}%` }}
                                  onMouseEnter={() =>
                                    setHoveredSegment(`lecture-${lecture.lecture_id}-conflict`)
                                  }
                                />
                              </>
                            )}
                          </div>

                          {/* Tooltip for individual lecture */}
                          {hoveredSegment?.startsWith(`lecture-${lecture.lecture_id}`) && (
                            <div
                              className="fixed z-50 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm shadow-lg pointer-events-none"
                              style={{
                                left: mousePosition.x + 10,
                                top: mousePosition.y - 40,
                              }}
                            >
                              {hoveredSegment === `lecture-${lecture.lecture_id}-positive` && (
                                <div>
                                  <div className="font-medium">Tích cực</div>
                                  <div>
                                    {stats.positiveCount} phản hồi ({stats.positive}%)
                                  </div>
                                </div>
                              )}
                              {hoveredSegment === `lecture-${lecture.lecture_id}-negative` && (
                                <div>
                                  <div className="font-medium">Tiêu cực</div>
                                  <div>
                                    {stats.negativeCount} phản hồi ({stats.negative}%)
                                  </div>
                                </div>
                              )}
                              {hoveredSegment === `lecture-${lecture.lecture_id}-neutral` && (
                                <div>
                                  <div className="font-medium">Trung tính</div>
                                  <div>
                                    {stats.neutralCount} phản hồi ({stats.neutral}%)
                                  </div>
                                </div>
                              )}
                              {hoveredSegment === `lecture-${lecture.lecture_id}-conflict` && (
                                <div>
                                  <div className="font-medium">Mâu thuẫn</div>
                                  <div>
                                    {stats.conflictCount} phản hồi ({stats.conflict}%)
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-2">
                          <span>Tích cực: {stats.positive}%</span>
                          <span>Tiêu cực: {stats.negative}%</span>
                          <span>Trung tính: {stats.neutral}%</span>
                          <span>Mâu thuẫn: {stats.conflict}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              Chưa có dữ liệu phân tích cho khóa học này
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Dữ liệu sẽ xuất hiện khi có phản hồi từ học viên
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
