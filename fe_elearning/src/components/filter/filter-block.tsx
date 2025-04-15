"use client";
import { Filter, Star } from "lucide-react";
import React, { useEffect, useState } from "react";

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
import { APIGetCategory } from "@/utils/category";

const dataLevel = [
  { id: "BEGINNER", value: "Cơ bản" },
  { id: "INTERMEDIATE", value: "Trung bình" },
  { id: "ADVANCED", value: "Nâng cao" },
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
  const [category, setCategory] = useState([]);
  const [filterCategory, setFilterCategory] = useState({
    language: "vi",
    with_children: false,
  });

  const handleGetCategory = async () => {
    try {
      const response = await APIGetCategory(filterCategory);
      const data = response?.data?.map((item: any) => ({
        id: item.slug,
        value: item?.translations[0]?.name,
      }));
      setCategory(data);
    } catch (error) {
      console.log(error);
    }
  };

  const [filters, setFilters] = useState({
    reviewValue: "all",
    fieldValue: "all",
    levelValue: "all",
  });

  const initialDataFilterCategory = [
    { id: "all", value: "Tất cả" },
    ...category,
  ];
  const initialDataFilterLevel = [{ id: "all", value: "Tất cả" }, ...dataLevel];

  const initialDataFilterReview = [{ id: "all", value: "Tất cả" }, ...stars];

  useEffect(() => {
    handleGetCategory();
  }, [filterCategory]);

  return (
    <div className="flex flex-row items-center justify-between  py-3 px-4">
      <Sheet>
        <SheetTrigger asChild>
          <div className="flex flex-row items-center gap-2 text-black dark:text-white">
            <Filter
              color={theme === "light" ? "#000000" : "#ffffff"}
              fill={theme === "light" ? "#000000" : "#ffffff"}
              size={16}
            />
            <p className="text-sm font-medium">Bộ lọc</p>
          </div>
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
              data={initialDataFilterCategory}
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
            {/* <FilterRadioGroup
              title="Khoảng giá"
              data={initialDataFilterPrice}
              value={filters.priceValue}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, priceValue: value }))
              }
            /> */}
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
