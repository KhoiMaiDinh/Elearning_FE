"use client";
import React, { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Users, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { CourseForm, CourseItem } from "@/types/courseType";
import { formatPrice } from "../formatPrice";

const CoursesBlockMe: React.FC<CourseForm> = ({
  level,
  status,
  title,
  description,
  price,
  instructor,
  course_progress,
  avg_rating,
  total_enrolled,
  thumbnail,
  id,
  priceFinal,
}) => {
  const router = useRouter();

  const [levelShow, setLevelShow] = useState<string>("");
  const [statusShow, setStatusShow] = useState<string>("");
  useEffect(() => {
    level === "BEGINNER"
      ? setLevelShow("Cơ bản")
      : level === "INTERMEDIATE"
      ? setLevelShow("Trung bình")
      : setLevelShow("Nâng cao");
    status === "DRAFT"
      ? setStatusShow("Chưa duyệt")
      : status === "PUBLISHED"
      ? setStatusShow("Đã duyệt")
      : setStatusShow("Đã bị cấm");
  }, [level, status]);
  return (
    <Card
      className="w-full h-full hover:cursor-pointer max-w-sm flex flex-col justify-between hover:shadow-md hover:shadow-cosmicCobalt transition-shadow"
      onClick={() => router.push(`/profile/lecture/course/${id}`)}
    >
      <CardHeader className="p-0">
        <div className="relative h-40 w-full">
          <img
            src={
              process.env.NEXT_PUBLIC_BASE_URL_IMAGE + (thumbnail?.key || "")
            }
            alt={title}
            className="w-full h-full object-contain rounded-t-lg"
          />
          {status && (
            <Badge
              className={`absolute top-2 right-2 bg-white dark:bg-eerieBlack ${
                status === "PUBLISHED"
                  ? " text-vividMalachite"
                  : " text-carminePink"
              }`}
              variant="secondary"
            >
              {statusShow}
            </Badge>
          )}
        </div>
      </CardHeader>

      {/* Nội dung chính, set grow để phần dưới đẩy xuống */}
      <CardContent className="pt-4 space-y-3 flex-grow">
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage
              alt={instructor?.user?.last_name || ""}
              src={
                process.env.NEXT_PUBLIC_BASE_URL_IMAGE +
                (instructor?.user?.profile_image?.key || "")
              }
              className="object-cover"
            />
            <AvatarFallback>{instructor?.user?.last_name?.[0]}</AvatarFallback>

            {/* <AvatarFallback>{name?.[0]}</AvatarFallback> */}
          </Avatar>
          <span className="text-sm text-muted-foreground">
            {instructor?.user?.first_name} {instructor?.user?.last_name}
          </span>
        </div>

        <h3 className="font-semibold line-clamp-2">{title}</h3>

        <p
          className="text-sm text-muted-foreground line-clamp-2 ql-content"
          dangerouslySetInnerHTML={{ __html: description || "" }}
        ></p>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-Sunglow" />
            <span>{avg_rating ? avg_rating.toFixed(1) : "N/A"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{total_enrolled || 0}</span>
          </div>
          {level && (
            <Badge variant="outline" className="bg-teaGreen dark:text-black">
              {levelShow}
            </Badge>
          )}
        </div>

        {/* {course_progress !== undefined && (
          <div className="space-y-1">
            <div className="w-full bg-darkSilver rounded-full h-2">
              <div
                className="bg-vividMalachite h-2 rounded-full"
                style={{ width: `${course_progress?.progress}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {course_progress?.progress}% hoàn thành
            </span>
          </div>
        )} */}
      </CardContent>

      {/* Phần giá & button luôn ở dưới cùng */}
      <CardFooter className="flex justify-between items-end mt-auto pt-2">
        <div className="space-x-2">
          {/* {price && (
            <span className="text-muted-foreground line-through">
              {formatPrice(price)}
            </span>
          )} */}
          {price && (
            <span className="font-semibold text-primary">
              {formatPrice(price)}
            </span>
          )}
        </div>
        <Badge variant="outline" className="text-[10px]">
          Xem chi tiết
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default CoursesBlockMe;
