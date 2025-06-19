'use client';

// ================== IMPORT LIBRARY ==================
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import { ChevronDown, Eye } from 'lucide-react';

// ================== IMPORT COMPONENTS ==================
import { DataTable } from '@/components/table/DataTable';
import SkeletonTable from '@/components/skeleton/SkeletonTable';
import { RootState } from '@/constants/store';
import { APIGetMyCourse } from '@/utils/course';
import { APIGetComment, APIGetReview } from '@/utils/comment';
import ColumnCourse from '../table/ColumnCourse';
import { clearCourse } from '@/constants/courseSlice';
import { setStatisticItemCourse } from '@/constants/statisticItemCourse';
import { clearStatisticItemCourse } from '@/constants/statisticItemCourse';
import StaticDetails from './staticDetails';
import { setComment } from '@/constants/comment';
import { clearComment } from '@/constants/comment';
import { formatPrice } from '../formatPrice';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Popup from '../courseDetails/popup';
import ReviewListUser from '../course/reviewListUser';
import { Section } from '@/types/courseType';

const Page = () => {
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
  const [sections, setSections] = useState<Section[]>([]);

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
      const sortedSections = [...course.sections].sort((a: Section, b: Section) =>
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
        console.log(err);
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

  // =============== RENDER ===============
  return (
    <div className="bg-white dark:bg-eerieBlack min-h-screen w-full space-y-8 rounded-xl p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className=" text-2xl font-bold text-majorelleBlue">Phân tích phản hồi</h1>
      </div>

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
          {/* Info Card */}
          {/* <div className="bg-gray-50 dark:bg-eerieBlack space-y-6 rounded-2xl p-6 shadow-md">
            <h2 className="text-xl font-semibold text-persianIndigo dark:text-white">
              Thông tin khóa học
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoRow label="Tên khóa học:" value={course?.title || 'Chưa có'} />
              <InfoRow
                label="Mức độ:"
                value={
                  course?.level === 'BEGINNER'
                    ? 'Cơ bản'
                    : course?.level === 'INTERMEDIATE'
                      ? 'Trung bình'
                      : course?.level === 'ADVANCED'
                        ? 'Khó'
                        : 'Không xác định'
                }
              />
              <InfoRow
                label="Giá:"
                value={course?.price ? `${formatPrice(course.price)}` : 'Miễn phí'}
              />
              <InfoRow
                label="Trạng thái:"
                value={
                  course?.status === 'PUBLISHED'
                    ? 'Hoạt động'
                    : course?.status === 'DRAFT'
                      ? 'Không hoạt động'
                      : course?.status === 'BAN'
                        ? 'Bị khóa'
                        : 'Không xác định'
                }
              />

              <InfoRow label="Số lượng học viên:" value={course?.total_enrolled} />
              <InfoRow label="Đánh giá trung bình:" value={`${course?.avg_rating} / 5`} />
            </div>

            <div className="flex flex-row gap-2">
              <Button
                variant="outline"
                className="bg-custom-gradient-button-violet text-white dark:bg-custom-gradient-button-blue hover:brightness-110"
                onClick={() => router.push(`/course-details/${course?.id}`)}
              >
                <Eye />
                Chế độ xem
              </Button>
              <Button
                variant="outline"
                className="bg-custom-gradient-button-violet text-white dark:bg-custom-gradient-button-blue hover:brightness-110"
                onClick={() => setShowReviews(true)} // Open reviews popup
              >
                Xem đánh giá
              </Button>
              <Button
                variant="outline"
                className="bg-custom-gradient-button-violet text-white dark:bg-custom-gradient-button-blue hover:brightness-110"
                onClick={() => router.push(`/profile/lecture/course/${course?.id}`)}
              >
                Chỉnh sửa
              </Button>
            </div>
          </div> */}

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
