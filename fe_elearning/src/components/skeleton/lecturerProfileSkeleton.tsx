import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const LecturerProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Teacher Profile Card Skeleton */}
        <Card className="mb-8 overflow-hidden border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Avatar Section Skeleton */}
              <div className="flex flex-col items-center lg:items-start">
                <Skeleton className="w-32 h-32 rounded-full mb-4" />
              </div>

              {/* Info Section Skeleton */}
              <div className="flex-1 space-y-6">
                {/* Name and Title Skeleton */}
                <div className="text-center lg:text-left">
                  <Skeleton className="h-8 w-64 mb-2 mx-auto lg:mx-0" />
                  <Skeleton className="h-5 w-48 mx-auto lg:mx-0" />
                </div>

                {/* Stats Skeleton */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Skeleton className="w-5 h-5 mr-2" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                      <Skeleton className="h-4 w-16 mx-auto" />
                    </div>
                  ))}
                </div>

                {/* Contact and Social Skeleton */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-center justify-center lg:justify-start">
                    <Skeleton className="w-4 h-4 mr-2" />
                    <Skeleton className="h-4 w-48" />
                  </div>

                  <div className="flex items-center justify-center lg:justify-end space-x-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <Skeleton key={index} className="h-9 w-9 rounded" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About and Expertise Skeleton */}
        <div className="mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="grid lg:grid-cols-4 gap-6">
                {/* About Section Skeleton */}
                <div className="lg:col-span-3">
                  <div className="flex items-center mb-4">
                    <Skeleton className="w-5 h-5 mr-2" />
                    <Skeleton className="h-6 w-48" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>

                {/* Expertise Section Skeleton */}
                <div className="lg:col-span-1">
                  <div className="flex items-center mb-3">
                    <Skeleton className="w-4 h-4 mr-2" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                  <Skeleton className="h-10 w-full rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Courses Section Skeleton */}
        <div className="space-y-6">
          <div className="text-center">
            <Skeleton className="h-8 w-64 mx-auto mb-2" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>

          {/* Course Cards Skeleton */}
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="border-0 shadow-lg overflow-hidden">
                <CardContent className="p-0">
                  {/* Course Image Skeleton */}
                  <Skeleton className="w-full h-48" />

                  <div className="p-4 space-y-3">
                    {/* Course Title */}
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-3/4" />

                    {/* Course Info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Skeleton className="w-4 h-4" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-4 w-12" />
                    </div>

                    {/* Course Stats */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: 5 }).map((_, starIndex) => (
                          <Skeleton key={starIndex} className="w-4 h-4" />
                        ))}
                      </div>
                      <Skeleton className="h-4 w-8" />
                    </div>

                    {/* Price and Button */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="space-y-1">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <Skeleton className="h-8 w-8 rounded" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturerProfileSkeleton;
