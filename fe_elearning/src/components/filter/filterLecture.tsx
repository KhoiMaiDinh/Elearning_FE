// src/components/CourseFilter.tsx
'use client';
import React from 'react';
import SelectFilter from '@/components/selectComponent/selectFilter';
import { dataLevel, stars } from '@/constants/selectData';

interface LectureFilterProps {
  paramsLecture: any;
  setParamsLecture: React.Dispatch<React.SetStateAction<any>>;
  router: any;
  category: any[];
}

const LectureFilter: React.FC<LectureFilterProps> = ({
  paramsLecture,
  setParamsLecture,
  router,
  category,
}) => {
  const handleLevelChange = (value: string) => {
    setParamsLecture((prev: any) => ({ ...prev, level: value }));
    const query = new URLSearchParams({
      ...(value && { level: value }),

      ...(paramsLecture.category_slug && {
        category_slug: paramsLecture.category_slug,
      }),
      ...(paramsLecture.min_rating && {
        min_rating: paramsLecture.min_rating.toString(),
      }),
    }).toString();
    router.push(`/lecture?${query}`);
  };

  const handleRatingChange = (value: string) => {
    const ratingValue = value === 'all' ? undefined : value;
    setParamsLecture((prev: any) => ({ ...prev, min_rating: ratingValue }));
    const query = new URLSearchParams({
      ...(paramsLecture.level && { level: paramsLecture.level }),

      ...(paramsLecture.category_slug && {
        category_slug: paramsLecture.category_slug,
      }),
      ...(ratingValue && { min_rating: ratingValue }),
    }).toString();
    router.push(`/lecture?${query}`);
  };

  const handleCategoryChange = (value: string) => {
    setParamsLecture((prev: any) => ({ ...prev, category_slug: value }));
    const query = new URLSearchParams({
      ...(paramsLecture.level && { level: paramsLecture.level }),

      ...(value && { category_slug: value }),
      ...(paramsLecture.min_rating && {
        min_rating: paramsLecture.min_rating.toString(),
      }),
    }).toString();
    router.push(`/course?${query}`);
  };

  const initialDataFilterCategory = [{ id: 'all', value: 'Tất cả' }, ...category];
  const initialDataFilterLevel = [{ id: 'all', value: 'Tất cả' }, ...dataLevel];

  const initialDataFilterReview = [{ id: 'all', value: 'Tất cả' }, ...stars];

  return (
    <div className="flex flex-wrap text-black dark:text-white gap-2">
      <SelectFilter
        data={initialDataFilterLevel}
        label="Mức độ"
        value={paramsLecture.level || 'all'}
        onChange={handleLevelChange}
      />
      <SelectFilter
        data={initialDataFilterReview}
        label="Đánh giá"
        value={paramsLecture.min_rating !== undefined ? paramsLecture.min_rating.toString() : 'all'}
        onChange={handleRatingChange}
      />

      <SelectFilter
        data={initialDataFilterCategory}
        label="Danh mục"
        value={paramsLecture.category_slug || 'all'}
        onChange={handleCategoryChange}
      />
    </div>
  );
};

export default LectureFilter;
