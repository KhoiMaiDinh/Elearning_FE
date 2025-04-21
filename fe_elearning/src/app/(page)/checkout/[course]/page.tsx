"use client";
import CheckoutPage from "@/components/checkout/checkoutPage";
import { RootState } from "@/constants/store";
import { useEffect } from "react";
import { CourseForm } from "@/types/courseType";
import { UserType } from "@/types/userType";
import { APIGetFullCourse } from "@/utils/course";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";

export default function CheckoutSinglePage({
  params,
}: {
  params: { course: string };
}) {
  const [loading, setLoading] = useState(false);
  const [dataCourse, setDataCourse] = useState<CourseForm | null>(null);

  const handleGetDetailCourse = async () => {
    setLoading(true);
    const response = await APIGetFullCourse(params.course || "");
    if (response?.status === 200) {
      const course = response.data;
      setDataCourse(course);
      setLoading(false);
    }
  };
  useEffect(() => {
    handleGetDetailCourse();
  }, []);

  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  return !loading ? (
    <CheckoutPage
      mode="single"
      products={[
        {
          id: dataCourse?.id || "",
          title: dataCourse?.title || "",
          price: dataCourse?.price || 0,
        },
      ]}
      student={userInfo as UserType}
    />
  ) : (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="w-10 h-10 animate-spin" />
    </div>
  );
}
