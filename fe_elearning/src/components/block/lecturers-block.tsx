"use client";
// components/TeacherCard.tsx
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Users, BookOpen } from "lucide-react";
import { useTheme } from "next-themes";

type lecturersBlock = {
  avatar?: string;
  name?: string;
  rating?: number;
  major?: string;
  description?: string;
  numberCourse?: number;
  numberStudent?: number;
};
const LecturersBlock: React.FC<lecturersBlock> = ({
  avatar,
  name,
  rating,
  major,
  description,
  numberCourse,
  numberStudent,
}) => {
  const { theme } = useTheme();
  return (
    <Card className="w-full max-w-sm rounded-2xl  duration-300 transform  hover:cursor-pointer hover:shadow-majorelleBlue shadow-md font-sans hover:shadow-md  transition-shadow bg-white dark:bg-eerieBlack">
      <CardHeader className="flex flex-col items-center gap-4">
        <Avatar className="w-24 h-24 shadow">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>
            {name
              ?.split(" ")
              .map((n) => n[0])
              .join("") || "GV"}
          </AvatarFallback>
        </Avatar>
        <div className="text-center space-y-1">
          <h3 className="font-semibold text-lg text-black/80 dark:text-white">
            {name || "Giảng viên"}
          </h3>
          <Badge
            variant="secondary"
            className="mt-1 bg-majorelleBlue20/50  dark:bg-majorelleBlue20 dark:text-white text-black/70"
          >
            {major || "Chưa xác định"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-darkSilver/70 dark:text-lightSilver/70 text-center line-clamp-3">
          {description || "Chưa có mô tả"}
        </p>
        <div className="flex justify-around text-sm text-darkSilver/70 dark:text-lightSilver/70">
          {rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-Sunglow" />
              <span>{rating.toFixed(1)}</span>
            </div>
          )}
          {numberCourse && (
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{numberCourse} khóa</span>
            </div>
          )}
          {numberStudent && (
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{numberStudent}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="justify-center">
        <button className="px-4 py-1.5 text-sm font-medium rounded-xl bg-majorelleBlue text-white hover:bg-majorelleBlue/90 transition">
          Xem chi tiết
        </button>
      </CardFooter>
    </Card>
  );
};

export default LecturersBlock;
