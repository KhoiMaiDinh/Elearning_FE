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
import { useRouter } from "next/navigation";
type lecturersBlock = {
  avatar?: string;
  name?: string;
  rating?: number;
  major?: string;
  description?: string;
  numberCourse?: number;
  numberStudent?: number;
  username?: string;
};
const LecturersBlock: React.FC<lecturersBlock> = ({
  avatar,
  name,
  rating,
  major,
  description,
  numberCourse,
  numberStudent,
  username,
}) => {
  const { theme } = useTheme();
  const router = useRouter();
  return (
    <Card
      className="w-full max-w-sm rounded-2xl  duration-300 transform  hover:cursor-pointer hover:shadow-cosmicCobalt shadow-md font-sans hover:shadow-md  transition-shadow bg-white dark:bg-eerieBlack"
      onClick={() => router.push(`/lecture/${username}`)}
    >
      <CardHeader className="flex flex-col items-center gap-4">
        <Avatar className="w-24 h-24 shadow">
          <AvatarImage
            src={process.env.NEXT_PUBLIC_BASE_URL_IMAGE + (avatar || "")}
            alt={name}
            className="object-cover"
          />
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
            className="mt-1 bg-LavenderIndigo/80 dark:bg-LavenderIndigo/50 text-white hover:bg-LavenderIndigo/80 dark:hover:bg-LavenderIndigo/50"
          >
            {major || "Chưa xác định"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col justify-between space-y-4 h-40">
        <p
          className="text-sm text-darkSilver/70 ql-content dark:text-lightSilver/70 text-center line-clamp-3"
          dangerouslySetInnerHTML={{
            __html: description || "Chưa có mô tả",
          }}
        ></p>
        <div className="flex justify-around text-sm text-darkSilver/70 dark:text-lightSilver/70">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-Sunglow" />
            <span>{rating || rating === 0 ? rating : "N/A"}</span>
          </div>

          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>
              {numberCourse || numberCourse === 0 ? numberCourse : "N/A"} khóa
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>
              {numberStudent || numberStudent === 0 ? numberStudent : "N/A"}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="">{/* Footer content goes here */}</CardFooter>
    </Card>
  );
};

export default LecturersBlock;
