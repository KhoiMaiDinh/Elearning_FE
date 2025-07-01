'use client';
import CheckoutPage from '@/components/checkout/checkoutPage';
import { RootState } from '@/constants/store';
import { useCallback, useEffect } from 'react';
import { CourseForm } from '@/types/courseType';
import { UserType } from '@/types/userType';
import { APIGetCourseById } from '@/utils/course';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
export default function CheckoutSinglePage({ params }: { params: Promise<{ course: string }> }) {
  const [loading, setLoading] = useState(false);
  const [dataCourse, setDataCourse] = useState<CourseForm | null>(null);

  const handleGetDetailCourse = useCallback(async () => {
    setLoading(true);
    const response = await APIGetCourseById((await params).course || '', {
      with_sections: true,
      with_thumbnail: true,
    });
    if (response?.status === 200) {
      const course = response.data;
      setDataCourse(course);
    }
    setLoading(false);
  }, [params]);

  const router = useRouter();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  useEffect(() => {
    if (userInfo.id) {
      handleGetDetailCourse();
    } else {
      router.push('/login');
    }
  }, [userInfo.id, handleGetDetailCourse, router]);
  return !loading ? (
    <CheckoutPage
      mode="single"
      products={dataCourse ? [dataCourse] : []}
      student={userInfo as UserType}
    />
  ) : (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="w-10 h-10 animate-spin" />
    </div>
  );
}
