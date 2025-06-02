'use client';
import React, { useEffect, useState } from 'react';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Ban,
  BarChart3,
  Clock,
  Edit,
  Eye,
  Globe,
  MoreHorizontal,
  PencilRuler,
  Star,
  Trash2,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CourseForm } from '@/types/courseType';
import { formatPrice } from '../formatPrice';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import CourseLevelBadge from '../badge/courseLevelBadge';
import CourseStatusBadge from '../badge/courseStatusBadge';

const MyCourseCard: React.FC<CourseForm> = ({
  level,
  status,
  title,
  description,
  price,
  instructor,
  avg_rating,
  total_enrolled,
  total_revenue,
  category,
  thumbnail,
  id,
  updatedAt,
  // priceFinal,
}) => {
  const router = useRouter();

  return (
    <>
      <Card
        key={id}
        className="overflow-hidden hover:cursor-pointer max-w-sm flex flex-col justify-between hover:shadow-md hover:shadow-cosmicCobalt transition-shadow"
        onClick={() => router.push(`/profile/lecture/course/${id}`)}
      >
        <div className="relative">
          <img
            src={
              process.env.NEXT_PUBLIC_BASE_URL_IMAGE + (thumbnail?.key || '') || '/placeholder.svg'
            }
            alt={title}
            className="h-48 w-full object-cover"
          />
          <CourseStatusBadge status={status!} />
        </div>
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="px-2 py-0 text-xs">
              {category?.translations[0].name}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit Course</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" />
                  <span>Preview</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  <span>Analytics</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardTitle className="line-clamp-2 mt-2 text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-2 pt-0">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex flex-col">
              <span className="text-muted-foreground">Học viên</span>
              <span className="font-medium">{total_enrolled}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Đánh giá</span>
              <span className="flex items-center font-medium">
                {avg_rating ? (
                  <>
                    {avg_rating}
                    <Star className="ml-1 h-3 w-3 fill-yellow-500 text-yellow-500" />
                  </>
                ) : (
                  'N/A'
                )}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Doanh thu</span>
              <span className="font-medium">
                {total_revenue ? `${formatPrice(total_revenue)}` : 'N/A'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Cấp độ</span>
              <CourseLevelBadge level={level} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t p-4">
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="mr-1 h-3 w-3" />
            <span>Cập nhật {updatedAt && new Date(updatedAt).toLocaleDateString()}</span>
          </div>
          <Button variant="outline" size="sm" className="h-8">
            Manage
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default MyCourseCard;
