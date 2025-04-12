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
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [selectedParentCategory, setSelectedParentCategory] =
    useState<string>("");
  const [childCategories, setChildCategories] = useState<any[]>([]);

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
      setSelectedParentCategory(courseInfo.category?.slug || "");
      setChildCategories(
        courseInfo.category?.children?.map((child) => ({
          id: child.slug,
          value: child.slug,
        })) || []
      );
      setValue("category.slug", courseInfo.category?.slug || "");
      if (courseInfo.thumbnail?.key) {
        setImagePreview(
          process.env.NEXT_PUBLIC_BASE_URL_IMAGE + courseInfo.thumbnail.key
        );
      }
    }
  }, [courseInfo, setValue]);

  const handleGetCategory = async () => {
    const response = await APIGetCategory({
      language: "vi",
      with_children: true,
    });
    if (response?.status === 200) {
      const formattedData = response.data.map((item: any) => ({
        id: item.slug,
        value: item.translations[0].name,
        children: item.children?.map((child: any) => ({
          id: child.slug,
          value: child.translations[0].name,
        })),
      }));
      setCategoryData(formattedData);
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
    const selectedParent = categoryData.find((cat) => cat.id === value);
    setChildCategories(selectedParent?.children || []);
    setValue("category.slug", "");
  };

  return (
    <div className="bg-white dark:bg-eerieBlack shadow-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-cosmicCobalt dark:text-white">
          Thông tin khóa học
        </h2>
        <Button
          type="button"
          className={`text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:text-white dark:hover:text-black ${
            isEditingBasic ? "bg-redPigment" : "bg-cosmicCobalt"
          }`}
          onClick={() => setIsEditingBasic(!isEditingBasic)}
        >
          {isEditingBasic ? "Hủy" : "✍️ Chỉnh sửa"}
        </Button>
      </div>
      {courseInfo && !isEditingBasic ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3 text-cosmicCobalt dark:text-white/90">
            <p>
              <strong>Tiêu đề:</strong> {courseInfo.title}
            </p>
            <p>
              <strong>Mô tả ngắn:</strong> {courseInfo.subtitle}
            </p>
            <p>
              <strong>Cấp độ:</strong> {courseInfo.level}
            </p>
            <p>
              <strong>Lĩnh vực:</strong> {courseInfo?.category?.slug}
            </p>
            <p>
              <strong>Giá:</strong> {courseInfo.price} VND
            </p>
            <p>
              <strong>Mô tả:</strong>
              <div
                className="ql-content"
                dangerouslySetInnerHTML={{
                  __html: courseInfo.description || "",
                }}
              />
            </p>
          </div>
          <div className="flex items-start justify-center">
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Ảnh bìa"
                className="w-full max-w-xs rounded-xl shadow-lg"
              />
            )}
          </div>
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
                  onValueChange={field.onChange}
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
          <Button
            type="submit"
            className="bg-custom-gradient-button-violet dark:bg-custom-gradient-button-blue hover:brightness-110 text-white"
          >
            💡Lưu
          </Button>
        </form>
      )}
    </div>
  );
};

export default BasicInfoForm;
