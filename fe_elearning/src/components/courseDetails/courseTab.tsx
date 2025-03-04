import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, MessageSquare, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/types/courseType";

interface CourseTabsProps {
  description: string;
  sections: Section[];
  lecture?: string;
  rating?: number;
  enrolledStudents?: number;
  price: number;
  priceFinal?: number;
}

const CourseTabs: React.FC<CourseTabsProps> = ({
  description,
  sections,
  lecture,
  rating,
  enrolledStudents,
  price,
  priceFinal,
}) => {
  const [activeTab, setActiveTab] = useState("description");

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  // Dữ liệu mẫu cho cộng đồng và đánh giá
  const communityPosts = [
    {
      user: "Nguyễn Văn A",
      content: "Bài học rất dễ hiểu!",
      date: "2025-03-01",
    },
  ];
  const reviews = [
    {
      user: "Lê Thị C",
      rating: 4.8,
      comment: "Khóa học rất chi tiết!",
      date: "2025-02-28",
    },
  ];

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4 bg-majorelleBlue20 dark:bg-majorelleBlue/10">
        <TabsTrigger
          value="description"
          className="text-majorelleBlue data-[state=active]:bg-majorelleBlue data-[state=active]:text-white"
        >
          Mô tả
        </TabsTrigger>
        <TabsTrigger
          value="resources"
          className="text-majorelleBlue data-[state=active]:bg-majorelleBlue data-[state=active]:text-white"
        >
          Tài liệu
        </TabsTrigger>
        <TabsTrigger
          value="community"
          className="text-majorelleBlue data-[state=active]:bg-majorelleBlue data-[state=active]:text-white"
        >
          Cộng đồng
        </TabsTrigger>
        <TabsTrigger
          value="reviews"
          className="text-majorelleBlue data-[state=active]:bg-majorelleBlue data-[state=active]:text-white"
        >
          Đánh giá
        </TabsTrigger>
      </TabsList>

      <TabsContent
        value="description"
        className="p-4 bg-white dark:bg-richBlack rounded-b-lg shadow-md"
      >
        <h3 className="text-lg font-semibold text-cosmicCobalt dark:text-AntiFlashWhite mb-2">
          Mô tả khóa học
        </h3>
        <p className="text-darkSilver dark:text-lightSilver">{description}</p>
        <p className="mt-2 text-darkSilver dark:text-lightSilver">
          Giảng viên: <span className="text-majorelleBlue">{lecture}</span>
        </p>
        <div className="flex gap-4 mt-2 items-center">
          {rating && (
            <div className="flex items-center gap-1">
              <Star size={16} className="text-Sunglow fill-Sunglow" />
              <span className="text-darkSilver dark:text-lightSilver">
                {rating}
              </span>
            </div>
          )}
          {enrolledStudents && (
            <div className="flex items-center gap-1">
              <Users size={16} className="text-majorelleBlue" />
              <span className="text-darkSilver dark:text-lightSilver">
                {enrolledStudents > 1000
                  ? `${(enrolledStudents / 1000).toFixed(1)}k+`
                  : `${enrolledStudents}+`}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            {priceFinal && priceFinal !== price ? (
              <>
                <span className="text-darkSilver dark:text-lightSilver line-through">
                  {formatPrice(price)}
                </span>
                <span className="text-beautyGreen font-semibold">
                  {formatPrice(priceFinal)}
                </span>
              </>
            ) : (
              <span className="text-beautyGreen font-semibold">
                {formatPrice(price)}
              </span>
            )}
          </div>
        </div>
      </TabsContent>

      <TabsContent
        value="resources"
        className="p-4 bg-white dark:bg-richBlack rounded-b-lg shadow-md"
      >
        <h3 className="text-lg font-semibold text-cosmicCobalt dark:text-AntiFlashWhite mb-2">
          Tài liệu
        </h3>
        <ul className="space-y-2">
          {sections.flatMap((section) =>
            section.section_resources.map((resource, index) => (
              <li key={index} className="flex items-center justify-between">
                <span className="text-darkSilver dark:text-lightSilver">
                  {resource}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-majorelleBlue hover:text-majorelleBlue70"
                >
                  <Download size={16} />
                </Button>
              </li>
            ))
          )}
        </ul>
      </TabsContent>

      <TabsContent
        value="community"
        className="p-4 bg-white dark:bg-richBlack rounded-b-lg shadow-md"
      >
        <h3 className="text-lg font-semibold text-cosmicCobalt dark:text-AntiFlashWhite mb-2">
          Cộng đồng
        </h3>
        <ul className="space-y-4">
          {communityPosts.map((post, index) => (
            <li key={index} className="flex items-start gap-2">
              <MessageSquare size={20} className="text-majorelleBlue" />
              <div>
                <p className="font-medium text-richBlack dark:text-AntiFlashWhite">
                  {post.user}
                </p>
                <p className="text-darkSilver dark:text-lightSilver">
                  {post.content}
                </p>
                <p className="text-sm text-darkSilver/70 dark:text-lightSilver/70">
                  {new Date(post.date).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </TabsContent>

      <TabsContent
        value="reviews"
        className="p-4 bg-white dark:bg-richBlack rounded-b-lg shadow-md"
      >
        <h3 className="text-lg font-semibold text-cosmicCobalt dark:text-AntiFlashWhite mb-2">
          Đánh giá
        </h3>
        <ul className="space-y-4">
          {reviews.map((review, index) => (
            <li key={index} className="flex items-start gap-2">
              <Star size={20} className="text-Sunglow fill-Sunglow" />
              <div>
                <p className="font-medium text-richBlack dark:text-AntiFlashWhite">
                  {review.user} - {review.rating}/5
                </p>
                <p className="text-darkSilver dark:text-lightSilver">
                  {review.comment}
                </p>
                <p className="text-sm text-darkSilver/70 dark:text-lightSilver/70">
                  {new Date(review.date).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </TabsContent>
    </Tabs>
  );
};

export default CourseTabs;
