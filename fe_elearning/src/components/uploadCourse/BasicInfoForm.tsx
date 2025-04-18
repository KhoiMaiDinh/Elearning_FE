"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputRegisterLecture from "@/components/inputComponent/inputRegisterLecture";
import { Button } from "@/components/ui/button";
import SelectRegister from "@/components/selectComponent/selectRegister";
import TextAreaRegisterLecture from "@/components/inputComponent/textAreaRegisterLecture";
import { APIUpdateCourse } from "@/utils/course";
import { uploadToMinIO } from "@/utils/storage";
import { CourseForm } from "@/types/courseType";
import { MediaType } from "@/types/mediaType";
import { APIGetCategory } from "@/utils/category";

// Define interfaces for category data
interface CategoryChild {
  id: string;
  value: string;
}

interface CategoryData {
  id: string;
  value: string;
  children?: CategoryChild[];
}

// 🧩 Tạo component hiển thị dòng nội dung
const InfoRow: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => {
  return (
    <div className="flex flex-col gap-2 py-2">
      <div className="font-semibold text-base text-cosmicCobalt dark:text-white ">
        {label}
      </div>
      <div className="text-sm text-black dark:text-white/80">{children}</div>
    </div>
  );
};

const data = [
  { id: "BEGINNER", value: "Sơ cấp" },
  { id: "INTERMEDIATE", value: "Trung cấp" },
  { id: "ADVANCED", value: "Nâng cao" },
];

const basicSchema = yup.object().shape({
  title: yup.string().required("Tiêu đề khóa học không được để trống"),
  subtitle: yup.string().required("Mô tả ngắn không được để trống"),
  description: yup.string().required(),
  level: yup.string().required("Cấp độ không được để trống"),
  price: yup.number().required("Giá không được để trống"),
  thumbnail: yup
    .object()
    .shape({
      id: yup.string().required(),
      key: yup.string().required(),
    })
    .nullable(),
  category: yup.object().shape({
    slug: yup.string().required("Lĩnh vực không được để trống"),
  }),
});

interface BasicInfoFormProps {
  courseInfo: CourseForm;
  courseId: string;
  setShowAlertSuccess: (value: boolean) => void;
  setShowAlertError: (value: boolean) => void;
  setDescription: (value: string) => void;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
  courseInfo,
  courseId,
  setShowAlertSuccess,
  setShowAlertError,
  setDescription,
}) => {
  const [isEditingBasic, setIsEditingBasic] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [selectedParentCategory, setSelectedParentCategory] =
    useState<string>("");
  const [childCategories, setChildCategories] = useState<CategoryChild[]>([]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CourseForm>({
    resolver: yupResolver(basicSchema) as unknown as Resolver<CourseForm>,
    defaultValues: {
      category: { slug: "" },
      title: "",
      subtitle: "",
      description: "",
      level: "",
      price: 0,
      thumbnail: null,
      outcomes: [],
      requirements: [],
    },
  });

  useEffect(() => {
    if (courseInfo.course_id) {
      setValue("title", courseInfo.title);
      setValue("subtitle", courseInfo.subtitle);
      setValue("level", courseInfo.level);
      setValue("price", courseInfo.price);
      setValue("description", courseInfo.description || "");
      setValue("thumbnail", courseInfo.thumbnail);

      if (courseInfo.category?.parent?.slug) {
        setSelectedParentCategory(courseInfo.category.parent.slug);

        const parentCategory = categoryData.find(
          (cat: CategoryData) => cat.id === courseInfo.category?.parent?.slug
        );

        if (parentCategory) {
          setChildCategories(parentCategory.children || []);
        }
      }

      if (courseInfo.category?.slug) {
        setValue("category.slug", courseInfo.category.slug);
      }

      if (courseInfo.thumbnail?.key) {
        setImagePreview(
          process.env.NEXT_PUBLIC_BASE_URL_IMAGE + courseInfo.thumbnail.key
        );
      }
    }
  }, [courseInfo, setValue, categoryData]);

  const handleGetCategory = async () => {
    try {
      const response = await APIGetCategory({
        language: "vi",
        with_children: true,
      });
      if (response?.status === 200) {
        const formattedData = response.data.map((item: any) => ({
          id: item.slug,
          value: item.translations[0]?.name || item.slug,
          children:
            item.children?.map((child: any) => ({
              id: child.slug,
              value: child.translations[0]?.name || child.slug,
            })) || [],
        }));
        setCategoryData(formattedData);

        // If we already have course info, update the child categories
        if (courseInfo.course_id && courseInfo.category?.parent?.slug) {
          const parentCategory = formattedData.find(
            (cat: CategoryData) => cat.id === courseInfo.category?.parent?.slug
          );

          if (parentCategory) {
            setChildCategories(parentCategory.children || []);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    handleGetCategory();
  }, []);

  const onSubmit = async (data: CourseForm) => {
    try {
      const response = await APIUpdateCourse(courseId, data);
      if (response?.status === 200) {
        setIsEditingBasic(false);
        setShowAlertSuccess(true);
        setDescription("Thông tin khóa học đã được cập nhật thành công!");
        setTimeout(() => setShowAlertSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error updating course:", error);
      setShowAlertError(true);
      setDescription("Không thể cập nhật thông tin khóa học");
      setTimeout(() => setShowAlertError(false), 3000);
    }
  };

  const handleParentCategoryChange = (value: string) => {
    setSelectedParentCategory(value);
    const selectedParent = categoryData.find(
      (cat: CategoryData) => cat.id === value
    );
    setChildCategories(selectedParent?.children || []);
    setValue("category.slug", "");
  };

  const handleChildCategoryChange = (value: string) => {
    setValue("category.slug", value);
  };

  return (
    <div className="bg-white dark:bg-eerieBlack shadow-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center ">
        {courseInfo && !isEditingBasic && (
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-cosmicCobalt dark:text-white">
              {courseInfo.title}
            </h2>

            {courseInfo.subtitle && (
              <text
                className="font-sans text-xs text-cosmicCobalt/80 dark:text-white/80 ql-content"
                dangerouslySetInnerHTML={{
                  __html: courseInfo.subtitle,
                }}
              />
            )}
          </div>
        )}
        <div className="flex h-full items-start justify-start">
          <Button
            type="button"
            className={`text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:text-white dark:hover:text-black ${
              isEditingBasic ? " hidden" : "bg-cosmicCobalt"
            }`}
            onClick={() => setIsEditingBasic(true)}
          >
            ✍️ Chỉnh sửa
          </Button>
        </div>
      </div>

      {courseInfo && !isEditingBasic ? (
        <div className="space-y-1 text-cosmicCobalt dark:text-white/90">
          {imagePreview && (
            <InfoRow label="Ảnh bìa:">
              <img
                src={imagePreview}
                alt="Ảnh bìa"
                className="w-full max-w-xs rounded-xl shadow-lg"
              />
            </InfoRow>
          )}
          <InfoRow label="Cấp độ:">{courseInfo.level}</InfoRow>
          <InfoRow label="Lĩnh vực:">{courseInfo?.category?.slug}</InfoRow>
          <InfoRow label="Giá:">{courseInfo.price} VND</InfoRow>
          <InfoRow label="Mô tả:">
            <div
              className="ql-content"
              dangerouslySetInnerHTML={{
                __html: courseInfo.description || "",
              }}
            />
          </InfoRow>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <InputRegisterLecture {...field} labelText="Tiêu đề khóa học" />
            )}
          />
          <Controller
            name="subtitle"
            control={control}
            render={({ field }) => (
              <InputRegisterLecture {...field} labelText="Mô tả ngắn" />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextAreaRegisterLecture {...field} labelText="Mô tả" />
            )}
          />
          <Controller
            name="level"
            control={control}
            render={({ field }) => (
              <SelectRegister {...field} label="Cấp độ" data={data} />
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectRegister
              label="Chuyên ngành"
              data={categoryData.map((cat) => ({
                id: cat.id,
                value: cat.value,
              }))}
              onValueChange={handleParentCategoryChange}
              value={selectedParentCategory}
            />
            <Controller
              name="category.slug"
              control={control}
              render={({ field }) => (
                <SelectRegister
                  label="Lĩnh vực"
                  data={childCategories}
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleChildCategoryChange(value);
                  }}
                  disabled={!selectedParentCategory}
                />
              )}
            />
          </div>
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <InputRegisterLecture
                {...field}
                labelText="Giá (VND)"
                type="number"
              />
            )}
          />
          <Controller
            name="thumbnail"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <InputRegisterLecture
                  {...field}
                  labelText="Ảnh bìa"
                  type="file"
                  accept="image/*"
                  error={errors.thumbnail?.message}
                  onChange={async (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      const { key, id } = await uploadToMinIO(
                        file,
                        "course",
                        "thumbnail"
                      );
                      const thumbnail: MediaType = { id, key };
                      setValue("thumbnail", thumbnail);
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Ảnh bìa"
                    className="w-full max-w-xs rounded-lg shadow"
                  />
                )}
              </div>
            )}
          />
          <div className="flex flex-row gap-4">
            <Button
              type="submit"
              className="bg-custom-gradient-button-violet rounded-lg dark:bg-custom-gradient-button-blue hover:brightness-125 text-white"
            >
              <img
                src="/icons/icon_save.png"
                alt="save"
                className="w-5 h-5 object-fill"
              />
              Lưu
            </Button>

            <Button
              type="button"
              className={`text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:text-white dark:hover:text-black bg-redPigment`}
              onClick={() => setIsEditingBasic(false)}
            >
              Hủy
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BasicInfoForm;
