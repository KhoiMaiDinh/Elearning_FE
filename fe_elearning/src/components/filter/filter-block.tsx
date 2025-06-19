'use client';
import { Filter } from 'lucide-react';
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type FilterBlockProps = {
  sortBy: string;
  onSortChange: (value: string) => void;
  currentStatusTab: 'PUBLISHED' | 'DRAFT' | 'BANNED' | 'ALL';
};

const FilterBlock = ({ sortBy, onSortChange, currentStatusTab }: FilterBlockProps) => {
  return (
    <div className="flex gap-2 items-center text-black dark:text-white">
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-60">
          <div className="flex flex-row items-center gap-2 flex-1">
            <Filter className="w-3.5 h-3.5" />
            <SelectValue className="w-full text-center bg-redPigment" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Mới nhất</SelectItem>
          <SelectItem value="oldest">Cũ nhất</SelectItem>
          <SelectItem value="recently_updated">Chỉnh sửa gần đây</SelectItem>
          <SelectItem value="least_updated">Đã lâu chưa chỉnh sửa</SelectItem>

          {currentStatusTab !== 'DRAFT' && currentStatusTab !== 'ALL' && (
            <>
              <SelectItem value="recently_published">Xuất bản gần đây</SelectItem>
              <SelectItem value="least_published">Đã lâu chưa xuất bản</SelectItem>

              <SelectItem value="highest_revenue">Doanh thu thấp đến cao</SelectItem>
              <SelectItem value="lowest_revenue">Doanh thu cao đến thấp</SelectItem>
              <SelectItem value="highest_rating">Đánh giá cao nhất</SelectItem>
              <SelectItem value="lowest_rating">Đánh giá thấp nhất</SelectItem>
              <SelectItem value="most_popular">Phổ biến nhất</SelectItem>
              <SelectItem value="least_popular">Ít phổ biến</SelectItem>
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterBlock;
