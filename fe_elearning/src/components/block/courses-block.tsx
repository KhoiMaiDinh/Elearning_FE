"use client";
import React from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Users, BookOpen } from "lucide-react";

type coursesBlock = {
  coverPhoto?: string;
  avatar?: string;
  title?: string;
  rating?: number;
  level?: string;
  numberStudent?: number;
  description?: string;
  name?: string;
  status?: string;
  progress?: number;
  price?: number;
  priceFinal?: number;
};
const CoursesBlock: React.FC<coursesBlock> = ({
  coverPhoto,
  rating,
  level,
  numberStudent,
  name,
  status,
  progress,
  title,
  avatar,
  description,
  price,
  priceFinal,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <Card className="w-full h-full max-w-sm hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative h-40 w-full">
          <img
            src={coverPhoto || "/placeholder-course.jpg"}
            alt={title}
            className="w-full h-full object-cover rounded-t-lg"
          />
          {status && (
            <Badge className="absolute top-2 right-2" variant="secondary">
              {status}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={avatar} />
            <AvatarFallback>{name?.[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{name}</span>
        </div>

        <h3 className="font-semibold line-clamp-2">{title}</h3>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>

        <div className="flex items-center gap-4 text-sm">
          {rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-Sunglow" />
              <span>{rating.toFixed(1)}</span>
            </div>
          )}
          {numberStudent && (
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{numberStudent}</span>
            </div>
          )}
          {level && (
            <Badge variant="outline" className="bg-teaGreen dark:text-black">
              {level}
            </Badge>
          )}
        </div>

        {progress !== undefined && (
          <div className="space-y-1">
            <div className="w-full bg-darkSilver rounded-full h-2">
              <div
                className="bg-vividMalachite h-2 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {progress}% hoàn thành
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between  items-end">
        <div className="space-x-2">
          {price && (
            <span className="text-muted-foreground line-through">
              {formatPrice(price)}
            </span>
          )}
          {priceFinal && (
            <span className="font-semibold text-primary">
              {formatPrice(priceFinal)}
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

export default CoursesBlock;
