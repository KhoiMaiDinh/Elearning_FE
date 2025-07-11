'use client';
import React, { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import Asterisk from '@/components/asterisk/asterisk';
import AddButton from '@/components/button/addButton';
import { ConfirmDialog } from '@/components/alert/AlertConfirm';
import SelectRegister from '@/components/selectComponent/selectRegister';
import CourseLevelBadge from '@/components/badge/courseLevelBadge';

import ImagePicker from '@/components/inputComponent/imagePicker';
import InputRegisterLecture from '@/components/inputComponent/inputRegisterLecture';
import TextAreaRegisterLecture from '@/components/inputComponent/textAreaRegisterLecture';

import EmptyInfoBox from '@/components/courseDetails/emptyInfoBox';
import CourseOutcomes from '@/components/courseDetails/courseOutcomes';
import CourseRequirements from '@/components/courseDetails/courseRequirements';

import { toast } from 'react-toastify';
import ToastNotify from '@/components/ToastNotify/toastNotify';
import { styleSuccess } from '@/components/ToastNotify/toastNotifyStyle';
import { styleError } from '@/components/ToastNotify/toastNotifyStyle';

import { APIInitCourse, APIUpdateCourse } from '@/utils/course';
import { CourseForm } from '@/types/courseType';

import {
  ArrowLeft,
  ArrowRight,
  DiamondPlus,
  DollarSign,
  LayoutGrid,
  Plus,
  Text,
  Trash2,
  Type,
} from 'lucide-react';

import { formatPrice } from '@/helpers/formatPrice';

import { useCourseForm } from '@/hooks/course/useCourseForm';
import { useCategoryFetcher } from '@/hooks/course/useCategoryFetcher';

const data = [
  { id: 'BEGINNER', value: 'Sơ cấp' },
  { id: 'INTERMEDIATE', value: 'Trung cấp' },
  { id: 'ADVANCED', value: 'Nâng cao' },
];

interface BasicInfoFormProps {
  mode: 'edit' | 'create' | 'view';
  courseInfo?: CourseForm;
  setCourseInfo: (courseInfo: CourseForm | null) => void;
  handleNextStep?: () => void;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
  mode,
  courseInfo,
  setCourseInfo,
  handleNextStep,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    isDirty,
    control,
    errors,
    handleSubmit,
    hasFormChanged,
    values,
    requirementFields,
    appendRequirements,
    removeRequirements,
    outcomeFields,
    appendOutcomes,
    removeOutcomes,
    setValue,
  } = useCourseForm(courseInfo);
  const router = useRouter();

  useEffect(() => {
    if (courseInfo?.id) {
      if (courseInfo?.thumbnail?.key) {
        setImagePreview(process.env.NEXT_PUBLIC_BASE_URL_IMAGE + courseInfo?.thumbnail?.key);
      }
    }
  }, [courseInfo, setValue]);

  const { categoryData, selectedParentCategory, childCategories, handleParentCategoryChange } =
    useCategoryFetcher({
      parentSlugOfDefaultCategory: courseInfo?.category?.parent?.slug,
    });

  const handleUpdateCourse = async (data: CourseForm) => {
    if (!courseInfo?.id) return;

    if (isDirty) {
      const response = await APIUpdateCourse(courseInfo.id, data);
      if (response?.status === 200) {
        setCourseInfo(response.data);
        toast.success(
          <ToastNotify status={1} message="Thông tin khóa học đã được cập nhật thành công!" />,
          { style: styleSuccess }
        );
      } else {
        toast.error(<ToastNotify status={-1} message="Không thể cập nhật thông tin khóa học" />, {
          style: styleError,
        });
      }
    }

    if (handleNextStep) {
      handleNextStep();
    }
  };

  const handleCreateCourse = async (data: CourseForm) => {
    const response = await APIInitCourse(data);
    if (response?.status === 201) {
      setCourseInfo(response.data);
      toast.success(<ToastNotify status={1} message="Khóa học đã được tạo thành công!" />, {
        style: styleSuccess,
      });
    }
  };

  const onSubmit = async (data: CourseForm) => {
    setLoading(true);
    try {
      if (mode == 'edit') {
        await handleUpdateCourse(data);
      } else if (mode == 'create') {
        await handleCreateCourse(data);
      }
    } catch (error) {
      console.error('Error saving course:', error);
      toast.error(<ToastNotify status={-1} message="Không thể lưu thông tin khóa học" />, {
        style: styleError,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChildCategoryChange = (value: string) => {
    setValue('category.slug', value);
  };

  const handleClickBack = () => {
    if (isDirty) {
      setIsConfirmOpen(true);
    } else {
      router.back();
    }
  };

  const handleConfirm = () => {
    router.back();
  };

  interface LabelWithIconProps {
    icon: React.ReactNode;
    label: string;
    required?: boolean;
  }

  const titleClassName = 'text-lg font-semibold text-gray-800 dark:text-white pb-3 mb-4 border-b';

  const LabelWithIcon: React.FC<LabelWithIconProps> = ({ icon, label, required }) => {
    return (
      <div className="flex flex-row gap-2 items-center mb-1 text-darkSilver">
        {icon}
        <h4 className="font-medium text-sm">{label}</h4>
        {required && <Asterisk />}
      </div>
    );
  };
  return (
    <>
      <div className="bg-AntiFlashWhite dark:bg-background/95 text-black dark:text-white mx-auto border-gray-200 dark:border-gray-700 rounded-xl relative">
        {/* Course Header Card */}
        <div className="bg-white dark:bg-black rounded-lg shadow p-6 mb-6 border border-black/20 dark:shadow-white/50">
          <div className="flex justify-between items-start">
            <div className="space-y-3 w-full">
              <div className="w-[85%]">
                <LabelWithIcon
                  icon={<Text className="w-3 h-3" />}
                  label="Tiêu Đề Khóa Học"
                  required={true}
                />
                {mode == 'view' ? (
                  <h1 className="text-2xl font-bold">{courseInfo?.title}</h1>
                ) : (
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <InputRegisterLecture
                        {...field}
                        maxLength={60}
                        error={errors.title?.message}
                      />
                    )}
                  />
                )}
              </div>
              <div className="w-[95%]">
                <LabelWithIcon
                  icon={<Type className="w-3 h-3" />}
                  label="Mô Tả Ngắn Khóa Học"
                  required={true}
                />

                {mode == 'view' ? (
                  <p className="dark:text-white/70">{courseInfo?.subtitle}</p>
                ) : (
                  <Controller
                    name="subtitle"
                    control={control}
                    render={({ field }) => (
                      <InputRegisterLecture
                        {...field}
                        maxLength={120}
                        error={errors.subtitle?.message}
                      />
                    )}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Course Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 ">
          <div className="bg-white dark:bg-black rounded-lg shadow p-6 border border-black/20 dark:shadow-white/50">
            <h3 className={titleClassName}>Thông Tin Cơ Bản</h3>
            <div className="space-y-4 text-darkSilver">
              <div>
                <LabelWithIcon
                  icon={<DiamondPlus className="w-3 h-3" />}
                  label="Cấp độ"
                  required={true}
                />
                {mode == 'edit' || mode == 'create' ? (
                  <Controller
                    name="level"
                    control={control}
                    render={({ field }) => (
                      <SelectRegister
                        {...field}
                        label="Cấp độ"
                        data={data}
                        className="w-full"
                        placeholder="--Lựa chọn cấp độ--"
                        value={field.value}
                        error={errors.level?.message}
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                      />
                    )}
                  />
                ) : courseInfo?.level ? (
                  <CourseLevelBadge
                    level={courseInfo.level}
                    className="w-full flex justify-center py-2"
                  />
                ) : (
                  <EmptyInfoBox message="Chưa điền cấp độ của khóa học" />
                )}
              </div>

              <div>
                <LabelWithIcon
                  icon={<LayoutGrid className="w-3 h-3" />}
                  label="Lĩnh vực"
                  required={true}
                />
                {mode == 'edit' || mode == 'create' ? (
                  <div className="flex flex-col gap-2">
                    <SelectRegister
                      label="Chuyên ngành"
                      data={categoryData.map((cat) => ({
                        id: cat.id,
                        value: cat.value,
                      }))}
                      onValueChange={handleParentCategoryChange}
                      value={selectedParentCategory}
                      placeholder="--Lựa chọn lĩnh vực--"
                    />
                    <Controller
                      name="category.slug"
                      control={control}
                      render={({ field }) => (
                        <SelectRegister
                          label="Lĩnh vực"
                          data={childCategories}
                          value={field.value}
                          error={errors.category?.slug?.message}
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleChildCategoryChange(value);
                          }}
                          disabled={!selectedParentCategory}
                          placeholder="--Lựa chọn lĩnh vực--"
                        />
                      )}
                    />
                  </div>
                ) : courseInfo?.category ? (
                  <Badge variant="outline" className="px-2 w-full flex justify-center py-2">
                    {courseInfo.category?.translations?.[0].name}
                  </Badge>
                ) : (
                  <EmptyInfoBox message="Chưa điền lĩnh vực của khóa học" />
                )}
              </div>

              <div>
                <LabelWithIcon
                  icon={<DollarSign className="w-3 h-3" />}
                  label="Giá bán - VND"
                  required={true}
                />
                {mode == 'edit' || mode == 'create' ? (
                  <Controller
                    name="price"
                    control={control}
                    render={({ field }) => (
                      <InputRegisterLecture
                        {...field}
                        type="string"
                        placeholder="Nhập giá khóa học"
                        formatVND={true}
                        error={errors.price?.message}
                      />
                    )}
                  />
                ) : courseInfo?.price ? (
                  <p className="font-semibold text-sm text-white w-full text-center bg-money-gradient py-1 rounded-sm">
                    {formatPrice(courseInfo?.price)}
                  </p>
                ) : (
                  <EmptyInfoBox message="Chưa điền giá bán của khóa học" />
                )}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-black rounded-lg shadow p-6 col-span-2 border border-black/20 dark:shadow-white/50">
            <h3 className={titleClassName}>
              Ảnh Bìa
              <Asterisk className="ml-1" />
            </h3>
            <div className="relative justify-center h-[320px] rounded-lg overflow-hidden flex items-center flex-col aspect-video w-full ">
              {mode == 'edit' || mode == 'create' ? (
                <Controller
                  name="thumbnail"
                  control={control}
                  render={({ field }) => (
                    <ImagePicker
                      {...field}
                      limit={1}
                      ratio={16 / 9}
                      className="w-full"
                      previousMedia={
                        mode === 'edit' && courseInfo?.thumbnail ? courseInfo.thumbnail : undefined
                      }
                      onChange={(file) => {
                        setValue('thumbnail', file);
                      }}
                    />
                    // <InputRegisterLecture
                    //   {...field}
                    //   type="file"
                    //   accept="image/*"
                    //   onChange={async (e) => {
                    //     const file = (e.target as HTMLInputElement).files?.[0];
                    //     if (file) {
                    //       const { key, id } = await uploadToMinIO(file, 'course', 'thumbnail');
                    //       const thumbnail: MediaType = { id, key };
                    //       setValue('thumbnail', thumbnail);
                    //       setImagePreview(URL.createObjectURL(file));
                    //     }
                    //   }}
                    // />
                  )}
                />
              ) : (
                <div className="flex flex-col items-center gap-4 bg-transparent text-center text-sm rounded-md aspect-video h-full justify-center overflow-hidden relative">
                  <Image
                    src={imagePreview || '/images/placeholder.svg?height=320&width=569'}
                    alt="HTML CSS for beginners"
                    fill
                    className="object-contain overflow-hidden"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Course Description */}
        <div className="bg-white dark:bg-black rounded-lg shadow p-6 mb-6 border border-black/20 dark:shadow-white/50">
          <h3 className={titleClassName}>
            Mô Tả
            <Asterisk className="ml-1" />
          </h3>
          <div className="prose max-w-none">
            {mode == 'edit' || mode == 'create' ? (
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextAreaRegisterLecture
                    {...field}
                    placeholder="Nhập mô tả chi tiết khóa học..."
                    error={errors.description?.message}
                  />
                )}
              />
            ) : courseInfo?.description ? (
              <div
                className="ql-content"
                dangerouslySetInnerHTML={{
                  __html:
                    courseInfo?.description ||
                    `This HTML and CSS course for beginners helps you master the foundational knowledge
                    <strong>needed</strong> to develop web development skills. The course is designed to be simple and easy
                    to understand with plenty of practical exercises to reinforce your learning.`,
                }}
              />
            ) : (
              <EmptyInfoBox message="Chưa điền mô tả của khóa học" />
            )}
          </div>
        </div>

        {/* Course Requirements */}
        <div className="bg-white dark:bg-black rounded-lg shadow p-6 mb-6 border border-black/20 dark:shadow-white/50">
          <h3 className={titleClassName}>
            Kiến Thức Cần Có Trước Khi Tham Gia Khóa Học <Asterisk className="ml-1" />
          </h3>
          <div className="prose max-w-none">
            {mode == 'edit' || mode == 'create' ? (
              <div className="space-y-2">
                {Array.isArray(requirementFields) &&
                  requirementFields.length > 0 &&
                  requirementFields.map((field, index) => (
                    <div key={index} className="flex items-top gap-2 ">
                      <Controller
                        control={control}
                        name={`requirements.${index}`}
                        render={({ field }) => (
                          <InputRegisterLecture
                            {...field}
                            placeholder={`Yêu cầu ${index + 1}`}
                            className="flex-1"
                            maxLength={160}
                            error={errors.requirements?.[index]?.message}
                          />
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRequirements(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}

                <Button
                  variant="outline"
                  size="sm"
                  className="bg-majorelleBlue text-white hover:bg-majorelleBlue hover:brightness-110 hover:text-white"
                  onClick={() => appendRequirements('')}
                >
                  <Plus /> Thêm yêu cầu
                </Button>
              </div>
            ) : (
              <CourseRequirements requirements={courseInfo?.requirements} />
            )}
          </div>
        </div>

        {/* Course Outcomes */}
        <div className="bg-white dark:bg-black rounded-lg shadow p-6 mb-6 border border-black/20 dark:shadow-white/50">
          <h3 className={titleClassName}>
            Kiến Thức Có Được Sau Khóa Học <Asterisk className="ml-1" />
          </h3>
          <div className="prose max-w-none">
            {mode == 'edit' || mode == 'create' ? (
              <div className="space-y-2">
                {Array.isArray(outcomeFields) &&
                  outcomeFields.length > 0 &&
                  outcomeFields.map((field, index) => (
                    <div key={index} className="flex items-start gap-2 ">
                      <Controller
                        control={control}
                        name={`outcomes.${index}`}
                        render={({ field }) => (
                          <InputRegisterLecture
                            {...field}
                            placeholder={`Kết quả ${index + 1}`}
                            className="flex-1"
                            maxLength={160}
                            error={errors.outcomes?.[index]?.message}
                          />
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOutcomes(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}

                <Button
                  variant="outline"
                  size="sm"
                  className="bg-majorelleBlue text-white hover:bg-majorelleBlue hover:brightness-110 hover:text-white"
                  onClick={() => appendOutcomes('')}
                >
                  <Plus /> Thêm kết quả
                </Button>
              </div>
            ) : (
              <CourseOutcomes outcomes={courseInfo?.outcomes} />
            )}
          </div>
        </div>

        <div className="mt-6 text-right">
          {mode == 'edit' || mode == 'create' ? (
            <div className="flex flex-row gap-4 justify-between">
              <ConfirmDialog
                isOpen={isConfirmOpen}
                onOpenChange={setIsConfirmOpen}
                onConfirm={handleConfirm}
                title="Xác nhận thoát"
                description="
Bạn có chắc chắn muốn thoát? Mọi thay đổi chưa lưu sẽ bị mất."
                confirmText="Thoát"
              />
              <AddButton
                label={'Thoát'}
                icon={ArrowLeft}
                onClick={handleClickBack}
                className={
                  'bg-AntiFlashWhite border border-black text-black hover:bg-white hover:shadow-redPigment/20 hover:text-redPigment hover:border-redPigment'
                }
              />

              <Button
                className="bg-custom-gradient-button-violet hover:bg-majorelleBlue hover:brightness-125 text-white shadow-md shadow-majorelleBlue/60"
                onClick={handleSubmit(onSubmit)}
                // size={'lg'}
              >
                Tiếp theo
                {loading ? (
                  <Spinner className="text-white" />
                ) : (
                  <ArrowRight className="w-4 h-4 ml-2" />
                )}
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default BasicInfoForm;
