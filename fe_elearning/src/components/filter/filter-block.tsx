"use client";
import { Filter, Star } from "lucide-react";
import React, { useState } from "react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import FilterRadioGroup from "./filter-radioGroup";
import SelectFilter from "../selectComponent/selectFilter";
import { useTheme } from "next-themes";

const dataField = [
  { id: "Công nghệ thông tin", value: "Công nghệ thông tin" },
  { id: "Toán", value: "Toán" },
  { id: "Văn", value: "Văn" },
  { id: "Khoa học", value: "Khoa học" },
];

const dataLevel = [
  { id: "Cơ bản", value: "Cơ bản" },
  { id: "Trung bình", value: "Trung bình" },
  { id: "Nâng cao", value: "Nâng cao" },
];

const stars = Array.from({ length: 5 }, (_, index) => ({
  id: String(index + 1),
  value: (
    <div className="flex flex-row gap-1">
      {Array.from({ length: index + 1 }).map((_, i) => (
        <Star key={i} size={8} color="#FFCD29" fill="#FFCD29" />
      ))}
    </div>
  ),
}));

const FilterBlock = () => {
  const { theme, setTheme } = useTheme(); // Sử dụng hook từ `next-themes`

  const [filters, setFilters] = useState({
    reviewValue: "all",
    fieldValue: "all",
    levelValue: "all",
  });

  const initialDataFilterField = [{ id: "all", value: "Tất cả" }, ...dataField];
  const initialDataFilterLevel = [{ id: "all", value: "Tất cả" }, ...dataLevel];

  const initialDataFilterReview = [{ id: "all", value: "Tất cả" }, ...stars];

  return (
    <div className="flex flex-row items-center justify-between  py-3 px-4">
      <Sheet>
        <SheetTrigger asChild>
          <Filter
            color={theme === "light" ? "#000000" : "#ffffff"}
            fill={theme === "light" ? "#000000" : "#ffffff"}
            size={16}
          />
        </SheetTrigger>
        <SheetContent className="flex flex-col gap-2 lg:gap-4 md:gap-4">
          <SheetHeader>
            <SheetTitle>Bộ lọc</SheetTitle>
            <SheetDescription>Thêm bộ lọc tại đây.</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4">
            <FilterRadioGroup
              title="Đánh giá"
              data={initialDataFilterReview}
              value={filters.reviewValue}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, reviewValue: value }))
              }
            />

            <SelectFilter
              data={initialDataFilterField}
              label="Lĩnh vực"
              placeholder="Chọn lĩnh vực..."
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, fieldValue: value }))
              }
            />

            <SelectFilter
              data={initialDataFilterLevel}
              label="Cấp độ"
              placeholder="Chọn cấp độ..."
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, levelValue: value }))
              }
            />
          </div>
          <SheetFooter className="flex ">
            <SheetClose asChild>
              <Button type="submit">Lưu</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default FilterBlock;
