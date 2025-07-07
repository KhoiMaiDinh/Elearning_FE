'use client';

// ================== IMPORT LIBRARY ==================
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'next/navigation';
import { ChevronDown, Eye, RefreshCw, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';
import { styleSuccess, styleError } from '@/components/ToastNotify/toastNotifyStyle';

// ================== IMPORT COMPONENTS ==================
import { DataTable } from '@/components/table/DataTable';
import SkeletonTable from '@/components/skeleton/SkeletonTable';
import { RootState } from '@/constants/store';
import { APIGetFullCourse, APIGetMyCourse } from '@/utils/course';
import {
  APIGetAspectSegmentTrendOverTime,
  APIGetComment,
  APIGetCommentsForInstructorAnalysis,
  APIGetCommentsForInstructorAspectDistribution,
  APIGetReview,
} from '@/utils/comment';
import ColumnCourse from '../table/ColumnCourse';
import { clearCourse, setCourse } from '@/constants/courseSlice';
import { setStatisticItemCourse } from '@/constants/statisticItemCourse';
import { clearStatisticItemCourse } from '@/constants/statisticItemCourse';
import StaticDetails from './staticDetails';
import { setComment } from '@/constants/comment';
import { clearComment } from '@/constants/comment';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import Popup from '../courseDetails/popup';
import ReviewListUser from '../course/reviewListUser';
import { SectionType } from '@/types/courseType';
import { InstructorOverviewStats } from '../aspect/instructor-overview-stats';
import { EmotionTrendChart, EmotionTrendLineChart } from '../aspect/emotion-trend-chart';
import { SentimentDistribution } from '../aspect/sentiment-distribution';

const Page = () => {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1))
    .toISOString()
    .split('T')[0];
  const monthAgo = new Date(new Date().setMonth(new Date().getMonth() - 1))
    .toISOString()
    .split('T')[0];
  const twoMonthAgo = new Date(new Date().setMonth(new Date().getMonth() - 2))
    .toISOString()
    .split('T')[0];
  const dispatch = useDispatch();
  const _searchParams = useSearchParams();
  const course = useSelector((state: RootState) => state.course.courseInfo);
  const comments = useSelector((state: RootState) => state.comment.comment);
  const router = useRouter();
  const [dataTable, setDataTable] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showReviews, setShowReviews] = useState(false);
  const [sections, setSections] = useState<SectionType[]>([]);
  const [instructorStats, setInstructorStats] = useState<any>(null);
  const [previousStats, setPreviousStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState<boolean>(false);
  const [emotionTrendData, setEmotionTrendData] = useState<any[]>([]);
  const [trendLoading, setTrendLoading] = useState<boolean>(false);
  const [filterSentiment, setFilterSentiment] = useState<{
    unit: string;
    count: number;
    course_id: string | undefined;
  }>({
    unit: 'day',
    count: 10,
    course_id: undefined,
  });
  const [aspectDistributionData, setAspectDistributionData] = useState<any[]>([]);

  const { id } = useParams();
  const { tab } = useParams();

  const handleGetCourse = async (id: string) => {
    const response = await APIGetFullCourse(id);
    if (response?.status === 200) {
      dispatch(setCourse(response?.data));
    }
  };

  useEffect(() => {
    if (tab === 'phan-tich-phan-hoi' && id) {
      handleGetCourse(id as string);
    }
  }, [tab, id]);

  // =============== FUNCTION ===============
  const handleGetCourseMe = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await APIGetMyCourse();
      if (response?.status === 200 && Array.isArray(response.data)) {
        const validCourses = response.data.filter((course: any) => course.status != 'DRAFT');
        setDataTable(validCourses);
      } else {
        setError('Dữ liệu khoá học không hợp lệ.');
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Không thể tải dữ liệu khoá học.');
    } finally {
      setLoading(false);
    }
  };

  const [reviews, setReviews] = useState<any[]>([]);
  const handleGetReviews = async (id: string) => {
    try {
      const response = await APIGetReview(id);
      if (response?.status === 200) {
        setReviews(response.data);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  useEffect(() => {
    if (course?.sections) {
      // Create a new sorted array instead of sorting in place
      const sortedSections = [...course.sections].sort((a: SectionType, b: SectionType) =>
        a.position.localeCompare(b.position)
      );
      setSections(sortedSections);
    }
  }, [course?.sections]);

  const toggleItem = async (itemId: string) => {
    const isOpen = openItemId === itemId;
    if (!isOpen) {
      // Luôn gọi API để lấy bình luận mỗi khi mở mục
      try {
        const response = await APIGetComment(itemId);
        if (response?.status === 200 && Array.isArray(response.data)) {
          dispatch(clearStatisticItemCourse({}));
          dispatch(clearComment({}));
          dispatch(setStatisticItemCourse(response.aspect));
          dispatch(setComment(response.data));
        } else {
          dispatch(setStatisticItemCourse({}));
          dispatch(setComment([]));
        }
      } catch (err) {
        dispatch(setStatisticItemCourse({}));
        dispatch(setComment([]));
      }
    }
    setOpenItemId(isOpen ? null : itemId);
  };
  // =============== USE EFFECT ===============
  useEffect(() => {
    dispatch(clearCourse({}));
    handleGetCourseMe();
  }, []);

  useEffect(() => {
    if (course?.id) {
      const formElement = document.getElementById('formProduct');
      if (formElement) {
        const offsetTop = formElement.getBoundingClientRect().top + window.pageYOffset - 100;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
      handleGetReviews(course.id);
    }
  }, [course?.id]);

  // =============== API aspect ===============
  const handleGetAspect = async () => {
    setStatsLoading(true);
    try {
      // Lấy dữ liệu khoảng thời gian hiện tại
      const currentResponse = await APIGetCommentsForInstructorAnalysis(monthAgo, tomorrow);

      // Lấy dữ liệu khoảng thời gian trước đó
      const previousResponse = await APIGetCommentsForInstructorAnalysis(twoMonthAgo, monthAgo);

      if (currentResponse?.status === 200) {
        setInstructorStats(currentResponse.data);
      }

      if (previousResponse?.status === 200) {
        setPreviousStats(previousResponse.data);
      }
    } catch (error) {
      console.error('Error fetching instructor analysis:', error);
      setInstructorStats(null);
      setPreviousStats(null);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleGetSentiment = async () => {
    setTrendLoading(true);
    try {
      const response = await APIGetAspectSegmentTrendOverTime(filterSentiment);
      if (response?.status === 200) {
        setEmotionTrendData(response.data);
      }
    } catch (error) {
      console.error('Error fetching emotion trend:', error);
      setEmotionTrendData([]);
    } finally {
      setTrendLoading(false);
    }
  };

  const handleGetAspectDistribution = async () => {
    const response = await APIGetCommentsForInstructorAspectDistribution(course?.id);
    if (response?.status === 200) {
      setAspectDistributionData(response.data);
    }
  };

  useEffect(() => {
    handleGetAspect();
    handleGetSentiment();
  }, []);

  useEffect(() => {
    if (course?.id) {
      handleGetAspectDistribution();
    }
  }, [course?.id]);

  // =============== RENDER ===============
  return (
    <div className="bg-white dark:bg-eerieBlack min-h-screen w-full space-y-8 rounded-xl p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-majorelleBlue">Phân tích phản hồi</h1>
      </div>

      {/* Instructor Overview Stats */}
      <InstructorOverviewStats
        data={instructorStats}
        previousData={previousStats}
        dateRange={{ startDate: monthAgo, endDate: today }}
        loading={statsLoading}
      />

      {/* Emotion Trend Chart */}
      <div className="grid grid-cols-1  gap-6">
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-eerieBlack rounded-xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-persianIndigo dark:text-white mb-4">
              Cài đặt biểu đồ xu hướng
            </h3>

            {/* Quick Presets */}
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <span className="text-sm font-medium text-muted-foreground">Nhanh:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilterSentiment({ unit: 'day', count: 7, course_id: undefined })}
                className="h-8"
              >
                7 ngày
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilterSentiment({ unit: 'day', count: 30, course_id: undefined })}
                className="h-8"
              >
                30 ngày
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilterSentiment({ unit: 'week', count: 8, course_id: undefined })}
                className="h-8"
              >
                8 tuần
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setFilterSentiment({ unit: 'month', count: 6, course_id: undefined })
                }
                className="h-8"
              >
                6 tháng
              </Button>
            </div>

            <div className="grid grid-cols-1 md:w-1/2 w-full  sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Đơn vị thời gian
                </label>
                <select
                  value={filterSentiment.unit}
                  onChange={(e) =>
                    setFilterSentiment((prev) => ({ ...prev, unit: e.target.value }))
                  }
                  className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 text-sm"
                >
                  <option value="day">Ngày</option>
                  <option value="week">Tuần</option>
                  <option value="month">Tháng</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Số kỳ
                </label>
                <Input
                  type="number"
                  min="1"
                  max="30"
                  value={filterSentiment.count}
                  onChange={(e) =>
                    setFilterSentiment((prev) => ({
                      ...prev,
                      count: parseInt(e.target.value) || 10,
                    }))
                  }
                  className="text-sm"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleGetSentiment}
                  disabled={trendLoading}
                  className="w-full bg-custom-gradient-button-violet text-white dark:bg-custom-gradient-button-blue hover:brightness-110"
                >
                  {trendLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  Cập nhật
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4">
            {trendLoading ? (
              <div className="h-[350px] w-full bg-gray-50 dark:bg-eerieBlack rounded-xl flex items-center justify-center">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : emotionTrendData.length > 0 ? (
              <EmotionTrendChart
                data={emotionTrendData}
                timeFormat={filterSentiment.unit as 'day' | 'week' | 'month'}
              />
            ) : (
              <div className=" bg-gray-50 dark:bg-eerieBlack rounded-xl flex items-center justify-center">
                <p className="text-muted-foreground">Chưa có dữ liệu xu hướng cảm xúc</p>
              </div>
            )}

            {trendLoading ? (
              <div className="w-full h-[350px] bg-gray-50 dark:bg-eerieBlack rounded-xl flex items-center justify-center">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : emotionTrendData.length > 0 ? (
              <EmotionTrendLineChart
                data={emotionTrendData}
                timeFormat={filterSentiment.unit as 'day' | 'week' | 'month'}
                title="Xu hướng Chi tiết"
              />
            ) : (
              <div className=" bg-gray-50 dark:bg-eerieBlack rounded-xl flex items-center justify-center">
                <p className="text-muted-foreground">Chưa có dữ liệu xu hướng cảm xúc</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">{/* <SentimentChart data={comments} /> */}</div>

      {/* Data Table */}
      <div className="flex flex-col gap-4">
        {loading ? (
          <SkeletonTable />
        ) : error ? (
          <div className="text-red-500 font-semibold">{error}</div>
        ) : (
          <DataTable columns={ColumnCourse} data={dataTable} loading={loading} />
        )}
      </div>

      {/* Course Detail */}
      {course?.id && (
        <div id="formProduct" className="flex flex-col gap-6">
          {/* Sentiment Distribution by Lecture */}
          <SentimentDistribution data={aspectDistributionData} />

          {/* Courses Detail */}
          <div className="bg-gray-50 dark:bg-eerieBlack space-y-6 rounded-2xl p-6 shadow-md">
            <h2 className="text-xl font-semibold text-persianIndigo dark:text-white">
              Chi tiết khoá học
            </h2>

            <div className="space-y-6">
              {sections?.length > 0 ? (
                sections &&
                sections.length > 0 &&
                sections.map((section) => (
                  <div key={section.id} className="space-y-4">
                    <h2 className="text-lg font-bold text-persianIndigo/80 dark:text-white/80">
                      {section.title}
                    </h2>
                    <div className="space-y-2">
                      {section.items?.length > 0 ? (
                        section.items &&
                        section.items.length > 0 &&
                        section.items.map((item) => (
                          <div key={item.id} className="border rounded-md p-4 space-y-2">
                            <div
                              className="flex items-center justify-between cursor-pointer"
                              onClick={() => toggleItem(item.id)}
                            >
                              <span className="font-medium">{item.title}</span>
                              <div className="flex items-center gap-1 text-sm text-blueberry dark:text-lightSilver">
                                <span>Chi tiết</span>
                                <ChevronDown
                                  className={`w-4 h-4 transition-transform ${
                                    openItemId === item.id ? 'rotate-180' : ''
                                  }`}
                                />
                              </div>
                            </div>

                            {openItemId === item.id && (
                              <div className="bg-gray/5 p-3 rounded-md text-sm text-darkSilver dark:text-lightSilver">
                                {comments?.length > 0 ? (
                                  <StaticDetails />
                                ) : (
                                  <p>Không có bình luận.</p>
                                )}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-500 italic">Chưa có bài học nào.</div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 italic">Chưa có phần học nào.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {showReviews && (
        <Popup onClose={() => setShowReviews(false)}>
          <h3 className="text-lg font-semibold">Tất cả đánh giá</h3>
          <div className="flex flex-col gap-4">
            {reviews &&
              reviews.length > 0 &&
              reviews.map((review, index) => <ReviewListUser key={index} reviews={review} />)}
          </div>
        </Popup>
      )}
    </div>
  );
};

// ================== REUSABLE COMPONENTS ==================
const InfoRow = ({ label, value }: { label: string; value: any }) => (
  <div className="flex gap-2">
    <span className="text-persianIndigo/80 dark:text-white/80 w-40 font-semibold">{label}</span>
    <span className="text-persianIndigo/80 dark:text-white/80 font-normal">{value}</span>
  </div>
);

export default Page;
