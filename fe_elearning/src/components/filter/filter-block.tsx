"use client";
import { Filter, Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

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

const priceRanges = [
  { id: "all", value: "Tất cả" },
  { id: "0,500000", value: "0đ - 500,000đ" },
  { id: "500000,1000000", value: "500,000đ - 1,000,000đ" },
  { id: "1000000,2000000", value: "1,000,000đ - 2,000,000đ" },
  { id: "2000000,", value: "Trên 2,000,000đ" },
];

interface CategoryOption {
  id: string;
  value: string;
}

const FilterBlock = () => {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const [category, setCategory] = useState<CategoryOption[]>([]);
  const [filterCategory, setFilterCategory] = useState({
    language: "vi",
    with_children: true,
  });

  const [filters, setFilters] = useState({
    reviewValue: searchParams.get("min_rating") || "all",
    fieldValue: searchParams.get("category_slug") || "all",
    levelValue: searchParams.get("level") || "all",
    priceRange:
      getPriceRangeFromParams(
        searchParams.get("min_price"),
        searchParams.get("max_price")
      ) || "all",
  });

  // Function to get price range from URL parameters
  function getPriceRangeFromParams(
    minPrice: string | null,
    maxPrice: string | null
  ): string {
    if (!minPrice && !maxPrice) return "all";

    const min = minPrice ? parseInt(minPrice) : undefined;
    const max = maxPrice ? parseInt(maxPrice) : undefined;

    // Match with our price range options
    if (min === 0 && max === 500000) return "0,500000";
    if (min === 500000 && max === 1000000) return "500000,1000000";
    if (min === 1000000 && max === 2000000) return "1000000,2000000";
    if (min === 2000000 && !max) return "2000000,";

    return "all";
  }

  const handleGetCategory = async () => {
    try {
      const response = await APIGetCategory(filterCategory);

      // Function to flatten categories and their children
      const flattenCategories = (categories: any[]): CategoryOption[] => {
        let result: CategoryOption[] = [];
        categories.forEach((category) => {
          // Add parent category
          result.push({
            id: category.slug,
            value: category.translations[0]?.name,
          });

          // Add children categories if they exist
          if (category.children && category.children.length > 0) {
            const childrenCategories = flattenCategories(category.children);
            result = [...result, ...childrenCategories];
          }
        });
        return result;
      };

      const flattenedCategories = flattenCategories(response?.data || []);
      setCategory(flattenedCategories);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to update URL parameters
  const updateURLParams = (params: any) => {
    const url = new URL(window.location.href);
    Object.keys(params).forEach((key) => {
      if (params[key] === undefined) {
        url.searchParams.delete(key);
      } else {
        url.searchParams.set(key, params[key]);
      }
    });
    window.history.pushState({}, "", url);
  };

  // Function to handle filter changes and emit to parent
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);

    // Convert filters to API parameters
    const apiParams: {
      min_rating?: number;
      category_slug?: string;
      level?: string;
      min_price?: number;
      max_price?: number;
    } = {
      min_rating:
        newFilters.reviewValue === "all"
          ? undefined
          : parseInt(newFilters.reviewValue),
      category_slug:
        newFilters.fieldValue === "all" ? undefined : newFilters.fieldValue,
      level:
        newFilters.levelValue === "all" ? undefined : newFilters.levelValue,
    };

    // Handle price range
    if (newFilters.priceRange !== "all") {
      const [min, max] = newFilters.priceRange.split(",");
      apiParams.min_price = min ? parseInt(min) : undefined;
      apiParams.max_price = max ? parseInt(max) : undefined;
    }

    // Update URL parameters
    updateURLParams(apiParams);

    // Emit filter changes to parent component
    if (window) {
      const event = new CustomEvent("filterChange", { detail: apiParams });
      window.dispatchEvent(event);
    }
  };

  useEffect(() => {
    handleGetCategory();
  }, [filterCategory]);

  const initialDataFilterCategory = [
    { id: "all", value: "Tất cả" },
    ...category,
  ];
  const initialDataFilterLevel = [{ id: "all", value: "Tất cả" }, ...dataLevel];

  const initialDataFilterReview = [{ id: "all", value: "Tất cả" }, ...stars];

  return (
    <div className="flex flex-row items-center justify-between py-3 px-4">
      <Sheet>
        <SheetTrigger asChild>
          <div className="flex flex-row items-center gap-2 text-black dark:text-white cursor-pointer">
            <Filter
              color={theme === "light" ? "#000000" : "#ffffff"}
              fill={theme === "light" ? "#000000" : "#ffffff"}
              size={16}
            />
            <p className="text-sm font-medium">Bộ lọc</p>
          </div>
        </SheetTrigger>
        <SheetContent className="overflow-y-auto">
          <SheetHeader className="mb-2">
            <SheetTitle>Bộ lọc</SheetTitle>
            <SheetDescription>Thêm bộ lọc tại đây.</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-3 py-2">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Đánh giá</h3>
              <FilterRadioGroup
                title=""
                data={initialDataFilterReview}
                value={filters.reviewValue}
                onChange={(value) => {
                  const newFilters = { ...filters, reviewValue: value };
                  handleFilterChange(newFilters);
                }}
              />
            </div>

            <div className="space-y-2">
              <SelectFilter
                data={initialDataFilterCategory}
                label="Lĩnh vực"
                placeholder="Chọn lĩnh vực..."
                onChange={(value) => {
                  const newFilters = { ...filters, fieldValue: value };
                  handleFilterChange(newFilters);
                }}
              />
            </div>

            <div className="space-y-2">
              <SelectFilter
                data={initialDataFilterLevel}
                label="Cấp độ"
                placeholder="Chọn cấp độ..."
                onChange={(value) => {
                  const newFilters = { ...filters, levelValue: value };
                  handleFilterChange(newFilters);
                }}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Khoảng giá</h3>
              <FilterRadioGroup
                title=""
                data={priceRanges}
                value={filters.priceRange}
                onChange={(value) => {
                  const newFilters = { ...filters, priceRange: value };
                  handleFilterChange(newFilters);
                }}
              />
            </div>
          </div>

          <SheetFooter className="absolute bottom-4 right-4">
            <SheetClose asChild>
              <Button type="submit">Áp dụng</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default FilterBlock;
