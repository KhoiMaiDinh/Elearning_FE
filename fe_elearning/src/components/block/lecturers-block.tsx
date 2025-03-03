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
    <Card className="w-full max-w-sm hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-col items-center gap-4">
        <Avatar className="w-24 h-24">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>
            {name
              ?.split(" ")
              .map((n) => n[0])
              .join("") || "GV"}
          </AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h3 className="font-semibold text-lg">{name || "Giảng viên"}</h3>
          <Badge
            variant="secondary"
            className="mt-1 bg-pinkLace dark:text-black"
          >
            {major || "Chưa xác định"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground text-center line-clamp-3">
          {description || "Chưa có mô tả"}
        </p>
        <div className="flex justify-around text-sm">
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
        <Badge variant="outline" className="cursor-pointer">
          Xem chi tiết
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default LecturersBlock;
