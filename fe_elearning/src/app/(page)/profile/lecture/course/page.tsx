"use client";
import React, { useEffect, useState } from "react";
import {
  useForm,
  Controller,
  useFieldArray,
  FieldArrayWithId,
  Resolver,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import InputRegisterLecture from "@/components/inputComponent/inputRegisterLecture";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CourseForm, Section, CourseItem } from "@/types/courseType";
import { Delete } from "lucide-react";
import SelectRegister from "@/components/selectComponent/selectRegister";
import TextAreaRegisterLecture from "@/components/inputComponent/textAreaRegisterLecture";
import { APIGetPresignedUrl } from "@/utils/storage";
import { APIInitCourse } from "@/utils/course";
import AlertSuccess from "@/components/alert/AlertSuccess";
import AlertError from "@/components/alert/AlertError";
import { APIGetCategory } from "@/utils/category";
import { useRouter } from "next/navigation";
import { setCourse } from "@/constants/course";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/constants/store";
// Hàm upload file lên MinIO
const uploadToMinIO = async (
  file: File,
  entity: string,
  entity_property: string
): Promise<{ key: string; id: string }> => {
  try {
    const presignedData = await APIGetPresignedUrl({
      filename: file.name,
      entity: entity,
      entity_property: entity_property,
    });
    const { postURL, formData } = presignedData?.data?.result;
    const id = presignedData?.data?.id;

    const uploadFormData = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      uploadFormData.append(key, value as string)
    );
    uploadFormData.append("file", file);
    uploadFormData.append("id", id);

    const response = await axios.post(postURL, uploadFormData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.status === 204 || response.status === 200) {
      const key = uploadFormData.get("key");
      if (!key) throw new Error("Missing key in form data");
      return { key: key.toString(), id };
    } else {
      throw new Error("Upload thất bại");
    }
  } catch (error) {
    console.error("Error uploading to MinIO:", error);
    throw error;
  }
};

const data = [
  { id: "BEGINNER", value: "Sơ cấp" },
  { id: "INTERMEDIATE", value: "Trung cấp" },
  { id: "ADVANCED", value: "Nâng cao" },
];

// Schema cho thông tin cơ bản
const basicSchema = yup.object().shape({
  category: yup.object().shape({
    slug: yup.string().required("Danh mục không được để trống"),
  }),
  title: yup.string().required("Tiêu đề khóa học không được để trống"),
  subtitle: yup.string().required("Mô tả ngắn không được để trống"),
  description: yup.string(),
  level: yup.string().required("Cấp độ không được để trống"),
  price: yup
    .number()
    .min(0, "Giá phải lớn hơn hoặc bằng 0")
    .required("Giá không được để trống"),
  thumbnail: yup
    .object()
    .shape({
      key: yup.string().required("Key của ảnh bìa không được để trống"),
      id: yup.string().required("ID của ảnh bìa không được để trống"),
    })
    .nullable(),
});

// Schema cho section
const sectionSchema = yup.object().shape({
  title: yup.string().required("Tiêu đề phần không được để trống"),
  section_description: yup.string().required("Mô tả phần không được để trống"),
  position: yup.string().required("Thứ tự phần không được để trống"),
});

// Schema cho course item
const courseItemSchema = yup.object().shape({
  title: yup.string().required("Tiêu đề bài học không được để trống"),
  description: yup.string().required("Nội dung bài học không được để trống"),
  video_id: yup
    .object()
    .shape({
      key: yup.string().required("Key của video không được để trống"),
      id: yup.string().required("ID của video không được để trống"),
    })
    .nullable()
    .default(null),
  position: yup.string().required("Thứ tự bài học không được để trống"),
});

const UploadCourse: React.FC = () => {
  const [basicInfo, setBasicInfo] = useState<CourseForm | null>(null);
  const [isEditingBasic, setIsEditingBasic] = useState(true);
  const [description, setDescription] = useState("");
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);
  const [categoryData, setCategoryData] = useState<
    {
      id: string;
      value: string;
      children?: { id: string; value: string }[];
    }[]
  >([]);
  const [selectedParentCategory, setSelectedParentCategory] =
    useState<string>("");
  const [childCategories, setChildCategories] = useState<
    { id: string; value: string }[]
  >([]);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
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
      course: [],
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const { courseInfo } = useSelector((state: RootState) => state.course);
  const thumbnail = watch("thumbnail");

  useEffect(() => {
    if (thumbnail?.key) {
      if (
        thumbnail.key.startsWith("data:image") ||
        thumbnail.key.startsWith("blob:") ||
        thumbnail.key.includes("?")
      ) {
        setImagePreview(
          thumbnail.key.startsWith("data:image") ||
            thumbnail.key.startsWith("blob:")
            ? thumbnail.key
            : process.env.NEXT_PUBLIC_BASE_URL_IMAGE + thumbnail.key
        );
        setValue("thumbnail", {
          key: thumbnail.key,
          id: thumbnail.id,
        });
      }
    }
  }, [thumbnail]);

  // Submit thông tin cơ bản
  const onSubmitBasic = async (data: CourseForm) => {
    try {
      const dataCourse = {
        category: { slug: data.category.slug },
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
      const newCourseId = response?.data?.course_id;
      setBasicInfo({ ...data, course_id: newCourseId });
      setIsEditingBasic(false);
      reset();
      setShowAlertSuccess(true);
      setDescription("Khóa học đã được khởi tạo thành công");
      router.push(`/profile/lecture/course/${newCourseId}`);
      dispatch(setCourse(response?.data));

      // Redirect to the details page after 2 seconds
      setTimeout(() => {
        setShowAlertSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error initializing course:", error);
      setShowAlertError(true);
      setDescription("Khóa học đã được khởi tạo thất bại");

      setTimeout(() => {
        setShowAlertError(false);
      }, 3000);
    }
  };

  useEffect(() => {
    if (thumbnail?.key) {
      const previewUrl = URL.createObjectURL(
        new Blob([thumbnail.key], { type: "image/*" })
      );
      setImagePreview(previewUrl);
    }
  }, [thumbnail]);

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

  const handleParentCategoryChange = (value: string) => {
    setSelectedParentCategory(value);
    const selectedParent = categoryData.find((cat) => cat.id === value);
    setChildCategories(selectedParent?.children || []);
    setValue("category.slug", ""); // Reset child category when parent changes
  };

  useEffect(() => {
    handleGetCategory();
  }, []);

  return (
    <div className="w-full h-full gap-4 flex flex-col p-4">
      {/* Thông tin cơ bản */}
      <div className="bg-white dark:bg-eerieBlack shadow-md rounded-lg p-3 border">
        <h2 className="text-lg font-bold">Thông tin khóa học</h2>
        {basicInfo && !isEditingBasic ? (
          <div className="p-3">
            <p>
              <strong>Tiêu đề:</strong> {basicInfo.title}
            </p>
            <p>
              <strong>Mô tả ngắn:</strong> {basicInfo.subtitle}
            </p>
            <p>
              <strong>Cấp độ:</strong> {basicInfo.level}
            </p>
            <p>
              <strong>Lĩnh vực:</strong> {basicInfo.category.slug}
            </p>
            <p>
              <strong>Giá:</strong> {basicInfo.price} VND
            </p>
            <p>
              <strong>Mô tả:</strong> {basicInfo.description}
            </p>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Ảnh bìa"
                className="mt-2 w-full max-w-xs"
              />
            )}
            <Button
              type="button"
              className="mt-2 bg-majorelleBlue text-white"
              onClick={() => {
                setIsEditingBasic(true);
                reset(basicInfo);
              }}
            >
              Chỉnh sửa
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmitBasic)} className="p-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <InputRegisterLecture
                    {...field}
                    labelText="Tiêu đề khóa học"
                    error={errors.title?.message}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                )}
              />
              <Controller
                name="subtitle"
                control={control}
                render={({ field }) => (
                  <InputRegisterLecture
                    {...field}
                    labelText="Mô tả ngắn"
                    error={errors.subtitle?.message}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                )}
              />
              <Controller
                name="level"
                control={control}
                render={({ field }) => (
                  <SelectRegister
                    {...field}
                    label="Cấp độ"
                    error={errors.level?.message}
                    data={data}
                    onValueChange={(value) => field.onChange(value)}
                  />
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <SelectRegister
                    label="Chuyên ngành"
                    data={categoryData.map((cat) => ({
                      id: cat.id,
                      value: cat.value,
                    }))}
                    onValueChange={handleParentCategoryChange}
                    value={selectedParentCategory}
                  />
                </div>
                <div>
                  <SelectRegister
                    label="Lĩnh vực"
                    data={childCategories}
                    onValueChange={(value) => setValue("category.slug", value)}
                    disabled={!selectedParentCategory}
                  />
                </div>
              </div>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <InputRegisterLecture
                    {...field}
                    labelText="Giá (VND)"
                    type="number"
                    error={errors.price?.message}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />
              <Controller
                name="thumbnail"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-2">
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
                          setValue("thumbnail", { key, id });
                          setImagePreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Ảnh bìa"
                        className="mt-2 w-full max-w-xs"
                      />
                    )}
                  </div>
                )}
              />
              <div className="md:col-span-2">
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextAreaRegisterLecture
                      {...field}
                      labelText="Mô tả"
                      error={errors.description?.message}
                    />
                  )}
                />
              </div>
            </div>
            <Button type="submit" className="mt-2 bg-majorelleBlue text-white">
              Thêm
            </Button>
          </form>
        )}
      </div>

      {showAlertSuccess && <AlertSuccess description={description} />}
      {showAlertError && <AlertError description={description} />}
    </div>
  );
};

export default UploadCourse;
