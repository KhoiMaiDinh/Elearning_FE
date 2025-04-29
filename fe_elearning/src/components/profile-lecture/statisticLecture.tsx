"use client";

// ================== IMPORT LIBRARY ==================
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

// ================== IMPORT COMPONENTS ==================
import { DataTable } from "@/components/table/DataTable";
import SkeletonTable from "@/components/skeleton/SkeletonTable";
import { RootState } from "@/constants/store";
import { APIGetMyCourse } from "@/utils/course";
import { APIGetComment } from "@/utils/comment";
import ColumnCourse from "../table/ColumnCourse";
import { clearCourse } from "@/constants/course";
import { setStatisticItemCourse } from "@/constants/statisticItemCourse";
import { clearStatisticItemCourse } from "@/constants/statisticItemCourse";
import StaticDetails from "./staticDetails";
import { setComment } from "@/constants/comment";
import { clearComment } from "@/constants/comment";
// ================== PAGE COMPONENT ==================
const Page = () => {
  // =============== DECLARE ===============
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const course = useSelector((state: RootState) => state.course.courseInfo);
  const comments = useSelector((state: RootState) => state.comment.comment);
  console.log("🚀 ~ Page ~ comments:", comments);

  const [dataTable, setDataTable] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // =============== FUNCTION ===============
  const handleGetCourseMe = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await APIGetMyCourse();
      if (response?.status === 200 && Array.isArray(response.data)) {
        setDataTable(response.data);
      } else {
        setError("Dữ liệu khoá học không hợp lệ.");
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Không thể tải dữ liệu khoá học.");
    } finally {
      setLoading(false);
    }
  };

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
      const formElement = document.getElementById("formProduct");
      if (formElement) {
        const offsetTop =
          formElement.getBoundingClientRect().top + window.pageYOffset - 100;
        window.scrollTo({ top: offsetTop, behavior: "smooth" });
      }
    }
  }, [course?.id]);

  // =============== RENDER ===============
  return (
    <div className="bg-white dark:bg-eerieBlack min-h-screen w-full space-y-8 rounded-xl p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-gray-800 text-2xl font-bold">Quản lý khóa học</h1>
      </div>

      {/* Data Table */}
      <div className="flex flex-col gap-4">
        {loading ? (
          <SkeletonTable />
        ) : error ? (
          <div className="text-red-500 font-semibold">{error}</div>
        ) : (
          <DataTable
            columns={ColumnCourse}
            data={dataTable}
            loading={loading}
          />
        )}
      </div>

      {/* Course Detail */}
      {course?.id && (
        <div id="formProduct" className="flex flex-col gap-6">
          {/* Info Card */}
          <div className="bg-gray-50 space-y-6 rounded-2xl p-6 shadow-md">
            <h2 className="text-xl font-semibold text-persianIndigo dark:text-white">
              Thông tin khóa học
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoRow
                label="Tên khóa học:"
                value={course?.title || "Chưa có"}
              />
              <InfoRow
                label="Mức độ:"
                value={
                  course?.level === "BEGINNER"
                    ? "Cơ bản"
                    : course?.level === "INTERMEDIATE"
                    ? "Trung bình"
                    : course?.level === "ADVANCED"
                    ? "Khó"
                    : "Không xác định"
                }
              />
              <InfoRow
                label="Giá:"
                value={course?.price ? `${course.price} đ` : "Miễn phí"}
              />
              <InfoRow
                label="Trạng thái:"
                value={
                  course?.status === "PUBLISHED"
                    ? "Hoạt động"
                    : course?.status === "DRAFT"
                    ? "Không hoạt động"
                    : course?.status === "BAN"
                    ? "Bị khóa"
                    : "Không xác định"
                }
              />
            </div>
          </div>

          {/* Courses Detail */}
          <div className="bg-gray-50 space-y-6 rounded-2xl p-6 shadow-md">
            <h2 className="text-xl font-semibold text-persianIndigo dark:text-white">
              Chi tiết khoá học
            </h2>

            <div className="space-y-6">
              {course.sections?.length > 0 ? (
                course.sections.map((section) => (
                  <div key={section.id} className="space-y-4">
                    <h2 className="text-lg font-bold text-persianIndigo/80 dark:text-white/80">
                      {section.title}
                    </h2>
                    <div className="space-y-2">
                      {section.items?.length > 0 ? (
                        section.items.map((item) => (
                          <div
                            key={item.id}
                            className="border rounded-md p-4 space-y-2"
                          >
                            <div
                              className="flex items-center justify-between cursor-pointer"
                              onClick={() => toggleItem(item.id)}
                            >
                              <span className="font-medium">{item.title}</span>
                              <div className="flex items-center gap-1 text-sm text-blueberry dark:text-lightSilver">
                                <span>Chi tiết</span>
                                <ChevronDown
                                  className={`w-4 h-4 transition-transform ${
                                    openItemId === item.id ? "rotate-180" : ""
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
                        <div className="text-gray-500 italic">
                          Chưa có bài học nào.
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 italic">
                  Chưa có phần học nào.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ================== REUSABLE COMPONENTS ==================
const InfoRow = ({ label, value }: { label: string; value: any }) => (
  <div className="flex gap-2">
    <span className="text-persianIndigo/80 dark:text-white/80 w-40 font-semibold">
      {label}
    </span>
    <span className="text-persianIndigo/80 dark:text-white/80 font-normal">
      {value}
    </span>
  </div>
);

export default Page;
