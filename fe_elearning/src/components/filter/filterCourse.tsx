// src/components/CourseFilter.tsx
'use client';
import React from 'react';
import SelectFilter from '@/components/selectComponent/selectFilter';
import { dataLevel, priceRanges, stars } from '@/constants/selectData';

interface CourseFilterProps {
  paramsCourse: any;
  setParamsCourse: React.Dispatch<React.SetStateAction<any>>;
  router: any;
  category: any[];
}

const CourseFilter: React.FC<CourseFilterProps> = ({
  paramsCourse,
  setParamsCourse,
  router,
  category,
}) => {
  const handleLevelChange = (value: string) => {
    setParamsCourse((prev: any) => ({ ...prev, level: value }));
    const query = new URLSearchParams({
      ...(value && { level: value }),
      ...(paramsCourse.min_price !== undefined && {
        min_price: paramsCourse.min_price.toString(),
      }),
      ...(paramsCourse.max_price !== undefined && {
        max_price: paramsCourse.max_price.toString(),
      }),
      ...(paramsCourse.category_slug && {
        category_slug: paramsCourse.category_slug,
      }),
      ...(paramsCourse.min_rating && {
        min_rating: paramsCourse.min_rating.toString(),
      }),
    }).toString();
    router.push(`/course?${query}`);
  };

  const handlePriceChange = (value: string) => {
    const [min, max] = value.split(',').map(Number);
    setParamsCourse((prev: any) => ({
      ...prev,
      min_price: min,
      max_price: max,
    }));
    const query = new URLSearchParams({
      ...(paramsCourse.level && { level: paramsCourse.level }),
      ...(min !== undefined && { min_price: min.toString() }),
      ...(max !== undefined && { max_price: max.toString() }),
      ...(paramsCourse.category_slug && {
        category_slug: paramsCourse.category_slug,
      }),
      ...(paramsCourse.min_rating && {
        min_rating: paramsCourse.min_rating.toString(),
      }),
    }).toString();
    router.push(`/course?${query}`);
  };

  const handleRatingChange = (value: string) => {
    const ratingValue = value === 'all' ? undefined : value;
    setParamsCourse((prev: any) => ({ ...prev, min_rating: ratingValue }));
    const query = new URLSearchParams({
      ...(paramsCourse.level && { level: paramsCourse.level }),
      ...(paramsCourse.min_price !== undefined && {
        min_price: paramsCourse.min_price.toString(),
      }),
      ...(paramsCourse.max_price !== undefined && {
        max_price: paramsCourse.max_price.toString(),
      }),
      ...(paramsCourse.category_slug && {
        category_slug: paramsCourse.category_slug,
      }),
      ...(ratingValue && { min_rating: ratingValue }),
    }).toString();
    router.push(`/course?${query}`);
  };

  const handleCategoryChange = (value: string) => {
    setParamsCourse((prev: any) => ({ ...prev, category_slug: value }));
    const query = new URLSearchParams({
      ...(paramsCourse.level && { level: paramsCourse.level }),
      ...(paramsCourse.min_price !== undefined && {
        min_price: paramsCourse.min_price.toString(),
      }),
      ...(paramsCourse.max_price !== undefined && {
        max_price: paramsCourse.max_price.toString(),
      }),
      ...(value && { category_slug: value }),
      ...(paramsCourse.min_rating && {
        min_rating: paramsCourse.min_rating.toString(),
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
        value={paramsCourse.level || 'all'}
        onChange={handleLevelChange}
      />
      <SelectFilter
        data={initialDataFilterReview}
        label="Đánh giá"
        value={paramsCourse.min_rating !== undefined ? paramsCourse.min_rating.toString() : 'all'}
        onChange={handleRatingChange}
      />

      <SelectFilter
        data={priceRanges}
        label="Giá"
        value={paramsCourse.min_price || 'all'}
        onChange={handlePriceChange}
      />
      <SelectFilter
        data={initialDataFilterCategory}
        label="Danh mục"
        value={paramsCourse.category_slug || 'all'}
        onChange={handleCategoryChange}
      />
    </div>
  );
};

export default CourseFilter;
