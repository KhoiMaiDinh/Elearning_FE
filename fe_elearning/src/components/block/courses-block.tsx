'use client';
import React, { useEffect, useState } from 'react';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CourseForm } from '@/types/courseType';
import { formatPrice } from '../formatPrice';

const CoursesBlock: React.FC<CourseForm> = ({
  id,
  thumbnail,
  avg_rating,
  level,
  total_enrolled,
  title,
  // status,
  course_progress,
  instructor,
  description,
  price,
  // priceFinal,
}) => {
  const router = useRouter();

  const [levelShow, setLevelShow] = useState<string>('');
  useEffect(() => {
    switch (level) {
      case 'BEGINNER':
        setLevelShow('Cơ bản');
        break;
      case 'INTERMEDIATE':
        setLevelShow('Trung bình');
        break;
      case 'ADVANCED':
        setLevelShow('Nâng cao');
        break;
      default:
        setLevelShow('Không xác định');
    }
  }, [level]);
  return (
    <Card
      className="w-full h-full hover:cursor-pointer max-w-sm flex flex-col justify-between hover:shadow-md hover:shadow-cosmicCobalt transition-shadow"
      onClick={() => router.push(`/course/${id}`)}
    >
      <CardHeader className="p-0">
        <div className="relative h-40 w-full">
          <img
            src={process.env.NEXT_PUBLIC_BASE_URL_IMAGE + (thumbnail?.key || '')}
            alt={title}
            className="w-full h-full object-contain rounded-t-lg"
          />
          {/* {status && (
            <Badge className="absolute top-2 right-2" variant="secondary">
              {status}
            </Badge>
          )} */}
        </div>
      </CardHeader>

      {/* Nội dung chính, set grow để phần dưới đẩy xuống */}
      <CardContent className="pt-4 space-y-3 flex-grow">
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage
              alt={instructor?.user?.last_name || ''}
              src={
                process.env.NEXT_PUBLIC_BASE_URL_IMAGE +
                (instructor?.user?.profile_image?.key || '')
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
          className="text-sm text-muted-foreground line-clamp-2"
          dangerouslySetInnerHTML={{ __html: description || '' }}
        ></p>
      </CardContent>

      {/* Phần giá & button luôn ở dưới cùng */}
      <CardFooter className="flex flex-col justify-end w-full  pt-2">
        <div className="flex items-center gap-4 text-sm w-full">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-Sunglow" />
            <span>{avg_rating ? (Math.round(avg_rating * 10) / 10).toFixed(1) : 'N/A'}</span>
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

        <div className="flex  justify-between items-end mt-auto pt-2 w-full">
          <div className="space-x-2">
            {/* {price && (
            <span className="text-muted-foreground line-through">
              {formatPrice(price)}
            </span>
          )} */}
            {price && <span className="font-semibold text-primary">{formatPrice(price)}</span>}
          </div>
        </div>
        {course_progress !== undefined && (
          <div className="space-y-1 w-full py-2">
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
        )}
      </CardFooter>
    </Card>
  );
};

export default CoursesBlock;
