'use client';
import React, { useEffect, useState } from 'react';
import { useForm, Controller, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import InputRegisterLecture from '@/components/inputComponent/inputRegisterLecture';
import { Button } from '@/components/ui/button';
import { CourseForm } from '@/types/courseType';
import SelectRegister from '@/components/selectComponent/selectRegister';
import TextAreaRegisterLecture from '@/components/inputComponent/textAreaRegisterLecture';
import { APIGetPresignedUrl } from '@/utils/storage';
import { APIInitCourse } from '@/utils/course';

import { APIGetCategory } from '@/utils/category';
import { useRouter } from 'next/navigation';
import { setCourse } from '@/constants/course';
import { useDispatch } from 'react-redux';
import AnimateWrapper from '@/components/animations/animateWrapper';
import BasicInfoForm from '@/components/uploadCourse/BasicInfoForm';
import { steps } from '@/helpers/step';
import ProgressBar from './[id]/components/progressBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import ToastNotify from '@/components/ToastNotify/toastNotify';
import { toast, ToastContainer } from 'react-toastify';
import { styleError, styleSuccess } from '@/components/ToastNotify/toastNotifyStyle';
import { useTheme } from 'next-themes';
// Hàm upload file lên MinIO

const basicSchema = yup.object().shape({
  category: yup.object().shape({
    slug: yup.string().required('Danh mục không được để trống'),
  }),
  title: yup.string().required('Tiêu đề khóa học không được để trống'),
  subtitle: yup.string().required('Mô tả ngắn không được để trống'),
  description: yup.string(),
  level: yup.string().required('Cấp độ không được để trống'),
  price: yup.number().min(0, 'Giá phải lớn hơn hoặc bằng 0').required('Giá không được để trống'),
  thumbnail: yup
    .object()
    .shape({
      key: yup.string().required('Key của ảnh bìa không được để trống'),
      id: yup.string().required('ID của ảnh bìa không được để trống'),
    })
    .nullable(),
});

// Schema cho section
const _sectionSchema = yup.object().shape({
  title: yup.string().required('Tiêu đề phần không được để trống'),
  section_description: yup.string().required('Mô tả phần không được để trống'),
  position: yup.string().required('Thứ tự phần không được để trống'),
});

// Schema cho course item
const _courseItemSchema = yup.object().shape({
  title: yup.string().required('Tiêu đề bài học không được để trống'),
  description: yup.string().required('Nội dung bài học không được để trống'),
  video_id: yup
    .object()
    .shape({
      key: yup.string().required('Key của video không được để trống'),
      id: yup.string().required('ID của video không được để trống'),
    })
    .nullable()
    .default(null),
  position: yup.string().required('Thứ tự bài học không được để trống'),
});

const UploadCourse: React.FC = () => {
  const [categoryData, setCategoryData] = useState<
    {
      id: string;
      value: string;
      children?: { id: string; value: string }[];
    }[]
  >([]);
  const [selectedParentCategory, setSelectedParentCategory] = useState<string>('');
  const [childCategories, setChildCategories] = useState<{ id: string; value: string }[]>([]);

  const {
    control,
    handleSubmit,
    setValue,
    // watch,
    // reset,
    formState: { errors },
  } = useForm<CourseForm>({
    resolver: yupResolver(basicSchema) as unknown as Resolver<CourseForm>,
    defaultValues: {
      category: { slug: '' },
      title: '',
      subtitle: '',
      description: '',
      level: '',
      price: 0,
      thumbnail: null,
      sections: [],
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useTheme();
  // Submit thông tin cơ bản
  const onSubmitBasic = async (data: CourseForm) => {
    try {
      const dataCourse = {
        category: { slug: data.category?.slug },
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        level: data.level,
        price: data.price,
        thumbnail: {
          ...data.thumbnail,
          key: data.thumbnail?.key,
          id: data.thumbnail?.id,
        },
      };
      const response = await APIInitCourse(dataCourse);
      if (response?.status === 201) {
        dispatch(setCourse(response?.data));

        toast.success(<ToastNotify status={1} message="Khóa học đã được khởi tạo thành công" />, {
          style: styleSuccess,
        });
        router.push(`/profile/lecture/course/${response?.data.id}`);
        dispatch(setCourse(response?.data));

        // Redirect to the details page after 2 seconds
      }

      // console.log("🚀 ~ onSubmitBasic ~ newCourseId:", newCourseId);
    } catch (error) {
      toast.error(<ToastNotify status={-1} message="Khóa học đã được khởi tạo thất bại" />, {
        style: styleError,
      });
    }
  };

  const handleGetCategory = async () => {
    const response = await APIGetCategory({
      language: 'vi',
      with_children: true,
    });
    if (response?.status === 200) {
      const formattedData = response.data.map((item: any) => ({
        id: item.slug,
        value: item?.translations[0]?.name,
        children: item.children?.map((child: any) => ({
          id: child.slug,
          value: child?.translations[0]?.name,
        })),
      }));
      setCategoryData(formattedData);
    }
  };

  const handleParentCategoryChange = (value: string) => {
    setSelectedParentCategory(value);
    const selectedParent = categoryData.find((cat) => cat.id === value);
    setChildCategories(selectedParent?.children || []);
    setValue('category.slug', ''); // Reset child category when parent changes
  };

  useEffect(() => {
    handleGetCategory();
  }, []);

  const handleSetCourse = async (data: CourseForm) => {
    dispatch(setCourse(data));
  };

  const handlePageBack = () => {
    router.back();
  };

  return (
    <div className="w-full h-full gap-4 flex flex-col p-4 ">
      <Button
        className="bg-majorelleBlue hover:bg-majorelleBlue hover:brightness-125 text-white w-fit font-medium"
        onClick={handlePageBack}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Quay lại
      </Button>
      <ProgressBar steps={steps} completedSteps={[]} currentStep={1} />
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl">{steps[1 - 1].title}</CardTitle>
        </CardHeader>
        <CardContent>
          <AnimateWrapper delay={0.2} direction="up" amount={0.01}>
            <BasicInfoForm
              mode="create"
              setCourseInfo={(data) => handleSetCourse(data as CourseForm)}
              handleNextStep={() => {}}
            />
          </AnimateWrapper>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadCourse;
