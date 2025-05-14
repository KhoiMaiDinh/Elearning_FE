import { Star } from "lucide-react";

export const dataLevel = [
  { id: "BEGINNER", value: "Cơ bản" },
  { id: "INTERMEDIATE", value: "Trung bình" },
  { id: "ADVANCED", value: "Nâng cao" },
];

export const stars = Array.from({ length: 5 }, (_, index) => ({
  id: String(index + 1),
  value: (
    <div className="flex flex-row gap-1">
      {Array.from({ length: index + 1 }).map((_, i) => (
        <Star key={i} size={8} color="#FFCD29" fill="#FFCD29" />
      ))}
    </div>
  ),
}));

export const priceRanges = [
  { id: "all", value: "Tất cả" },
  { id: "0,500000", value: "0đ - 500,000đ" },
  { id: "500000,1000000", value: "500,000đ - 1,000,000đ" },
  { id: "1000000,2000000", value: "1,000,000đ - 2,000,000đ" },
  { id: "2000000,", value: "Trên 2,000,000đ" },
];
