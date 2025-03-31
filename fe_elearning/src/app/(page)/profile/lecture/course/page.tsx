"use client";
import React, { useState } from "react";
import {
  useForm,
  Controller,
  useFieldArray,
  FieldValues,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputRegisterLecture from "@/components/inputComponent/inputRegisterLecture";
import TextAreaRegisterLecture from "@/components/inputComponent/textAreaRegisterLecture";
import { Button } from "@/components/ui/button";
import { CourseForm } from "@/types/courseType";
import { ConfirmDeleteDialog } from "@/components/alert/AlertOption";
import { Delete } from "lucide-react";
import dynamic from "next/dynamic";
import SelectRegister from "@/components/selectComponent/selectRegister";

const dataLevel = [
  { id: "BEGINNER", value: "Sơ cấp" },
  { id: "INTERMEDIATE", value: "Trung cấp" },
  { id: "ADVANCED", value: "Nâng cao" },
];

const dataCategory = [
  { id: "BEGINNER", value: "Sơ cấp" },
  { id: "INTERMEDIATE", value: "Trung cấp" },
  { id: "ADVANCED", value: "Nâng cao" },
];

// Schema validation với Yup
const lessonSchema = yup.object().shape({
  lesson_title: yup.string().required("Tiêu đề bài học không được để trống"),
  lesson_content: yup.string().required("Nội dung bài học không được để trống"),
  resources: yup
    .array()
    .of(yup.string().required("Tài liệu không được để trống"))
    .default([]),
  video_url: yup.string().default(""),
});

const sectionSchema = yup.object().shape({
  section_title: yup.string().required("Tiêu đề phần không được để trống"),
  content: yup.array().of(lessonSchema).default([]),
  section_video: yup.string().default(""),
  section_description: yup.string().required("Mô tả phần không được để trống"),
  section_resources: yup
    .array()
    .of(yup.string().required("Tài liệu không được để trống"))
    .default([]),
});

const schema = yup.object().shape({
  category_id: yup.string().required("Lĩnh vực không được để trống"),
  title: yup.string().required("Tiêu đề khóa học không được để trống"),
  level: yup.string().required("Cấp độ không được để trống"),
  price: yup
    .number()
    .min(0, "Giá phải lớn hơn hoặc bằng 0")
    .required("Giá không được để trống"),
  short_description: yup.string().required("Mô tả ngắn không được để trống"),
  course: yup
    .array()
    .of(sectionSchema)
    .min(1, "Phải có ít nhất 1 phần trong khóa học")
    .required("Khóa học phải có ít nhất 1 phần"),
  rating: yup.number().default(0),
  enrolled_students: yup.number().default(0),
  lecture: yup.string().default(""),
});

const UploadCourse: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseForm>({
    resolver: yupResolver<CourseForm>(schema),
    defaultValues: {
      category_id: "",
      title: "",
      level: "",
      price: 0,
      short_description: "",
      course: [
        {
          section_title: "",
          content: [
            {
              lesson_title: "",
              lesson_content: "",
              resources: [],
              video_url: "",
            },
          ],
          section_video: "",
          section_description: "",
          section_resources: [],
        },
      ],
      rating: 0,
      enrolled_students: 0,
      lecture: "",
    },
  });

  const {
    fields: sectionFields,
    append: appendSection,
    remove: removeSection,
  } = useFieldArray({
    control,
    name: "course",
  });

  const [isSectionDialogOpen, setIsSectionDialogOpen] =
    useState<boolean>(false);
  const [sectionToRemove, setSectionToRemove] = useState<number | null>(null);
  const [videoPreviews, setVideoPreviews] = useState<{
    [key: string]: string;
  }>({}); // Lưu URL preview của video

  const onSubmit = async (data: FieldValues): Promise<void> => {
    console.log("Course data to submit:", data);
    alert(
      "Tải lên khóa học thành công với thứ tự: " +
        JSON.stringify(data.course.map((s: any) => s.section_title))
    );
  };

  const confirmRemoveSection = (index: number): void => {
    setSectionToRemove(index);
    setIsSectionDialogOpen(true);
  };

  const handleRemoveSection = (): void => {
    if (sectionToRemove !== null) {
      removeSection(sectionToRemove);
      setIsSectionDialogOpen(false);
      setSectionToRemove(null);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-full gap-4 flex flex-col p-4"
    >
      <div className="bg-white dark:bg-eerieBlack shadow-md rounded-lg p-3 border">
        <h2 className="text-lg font-bold">Thông tin khóa học</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3">
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
            name="level"
            control={control}
            render={({ field }) => (
              <SelectRegister
                {...field}
                label="Cấp độ (Cơ bản/Trung cấp/Nâng cao)"
                error={errors.level?.message}
                data={dataLevel}
              />
            )}
          />
          <Controller
            name="category_id"
            control={control}
            render={({ field }) => (
              <SelectRegister
                {...field}
                label="Lĩnh vực"
                error={errors.level?.message}
                data={dataLevel}
              />
            )}
          />

          <div className="w-full md:col-span-2">
            <Controller
              name="short_description"
              control={control}
              render={({ field }) => (
                <TextAreaRegisterLecture
                  {...field}
                  labelText="Mô tả ngắn"
                  error={errors.short_description?.message}
                  onChange={(value) => field.onChange(value)}
                />
              )}
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-eerieBlack shadow-md rounded-lg p-3 border">
        <h2 className="text-lg font-bold">Nội dung khóa học</h2>
        {sectionFields.map((section, sectionIndex) => (
          <div key={section.id}>
            <span className="flex font-bold text-[16px] text-black dark:text-AntiFlashWhite">
              Phần {sectionIndex + 1}
            </span>
            <div className="border p-3 mb-3 rounded flex flex-col gap-3">
              <Controller
                name={`course.${sectionIndex}.section_title`}
                control={control}
                render={({ field }) => (
                  <InputRegisterLecture
                    {...field}
                    labelText={`Phần ${sectionIndex + 1}: Tiêu đề`}
                    error={
                      errors.course?.[sectionIndex]?.section_title?.message
                    }
                    name={field.name}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                )}
              />
              <Controller
                name={`course.${sectionIndex}.section_description`}
                control={control}
                render={({ field }) => (
                  <TextAreaRegisterLecture
                    {...field}
                    labelText={`Phần ${sectionIndex + 1}: Mô tả`}
                    error={
                      errors.course?.[sectionIndex]?.section_description
                        ?.message
                    }
                    name={field.name}
                    onChange={(value) => field.onChange(value)}
                  />
                )}
              />
              <Controller
                name={`course.${sectionIndex}.section_video`}
                control={control}
                render={({ field }) => (
                  <div>
                    <InputRegisterLecture
                      labelText={`Phần ${sectionIndex + 1}: Video`}
                      error={
                        errors.course?.[sectionIndex]?.section_video?.message
                      }
                      type="file"
                      accept="video/*"
                      name={field.name}
                      onChange={(e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          const videoUrl = URL.createObjectURL(file);
                          field.onChange(file.name);
                          setVideoPreviews((prev) => ({
                            ...prev,
                            [`section_${sectionIndex}`]: videoUrl,
                          }));
                        } else {
                          field.onChange("");
                          setVideoPreviews((prev) => {
                            const newPreviews = { ...prev };
                            delete newPreviews[`section_${sectionIndex}`];
                            return newPreviews;
                          });
                        }
                      }}
                    />
                    {videoPreviews[`section_${sectionIndex}`] && (
                      <video
                        src={videoPreviews[`section_${sectionIndex}`]}
                        controls
                        className="mt-2 w-full max-w-xs"
                      />
                    )}
                  </div>
                )}
              />
              <Controller
                name={`course.${sectionIndex}.section_resources`}
                control={control}
                render={({ field }) => (
                  <div>
                    <InputRegisterLecture
                      labelText={`Phần ${sectionIndex + 1}: Tài liệu`}
                      error={
                        errors.course?.[sectionIndex]?.section_resources
                          ?.message
                      }
                      type="file"
                      multiple
                      name={field.name}
                      onChange={(e) => {
                        const files = Array.from(
                          (e.target as HTMLInputElement).files || []
                        );
                        const fileNames = files.map((file: File) => file.name);
                        field.onChange([...(field.value || []), ...fileNames]);
                        (e.target as HTMLInputElement).value = "";
                      }}
                    />
                    {field.value && field.value.length > 0 && (
                      <ul className="text-sm text-gray-600 mt-1">
                        {field.value.map((fileName: string, index: number) => (
                          <li key={index} className="flex items-center">
                            {fileName}
                            <Button
                              type="button"
                              className="ml-2 hover:text-redPigment text-redPigment/50 items-center justify-center flex w-fit shadow-none bg-transparent hover:bg-transparent p-0"
                              onClick={() => {
                                const updatedResources = field.value.filter(
                                  (_: string, i: number) => i !== index
                                );
                                field.onChange(updatedResources);
                                const input = document.querySelector(
                                  `input[name="${field.name}"]`
                                ) as HTMLInputElement;
                                if (input) input.value = "";
                              }}
                            >
                              <Delete className="text-[12px]" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              />

              <SectionLessons
                control={control}
                sectionIndex={sectionIndex}
                errors={errors}
                videoPreviews={videoPreviews}
                setVideoPreviews={setVideoPreviews}
              />

              <Button
                type="button"
                className="mt-2 bg-redPigment w-fit py-2 px-4 text-white"
                onClick={() => confirmRemoveSection(sectionIndex)}
              >
                Xóa phần
              </Button>
            </div>
          </div>
        ))}
        <Button
          type="button"
          className="mt-2 bg-majorelleBlue70 text-white"
          onClick={() =>
            appendSection({
              section_title: "",
              content: [
                {
                  lesson_title: "",
                  lesson_content: "",
                  resources: [],
                  video_url: "",
                },
              ],
              section_video: "",
              section_description: "",
              section_resources: [],
            })
          }
        >
          Thêm phần mới
        </Button>
      </div>

      <div className="flex justify-center p-4">
        <Button
          type="submit"
          className="w-32 bg-majorelleBlue text-white hover:bg-black rounded-md"
        >
          Tải lên khóa học
        </Button>
      </div>

      <ConfirmDeleteDialog
        isOpen={isSectionDialogOpen}
        onOpenChange={setIsSectionDialogOpen}
        onConfirm={handleRemoveSection}
      />
    </form>
  );
};

interface SectionLessonsProps {
  control: any;
  sectionIndex: number;
  errors: any;
  videoPreviews: { [key: string]: string };
  setVideoPreviews: React.Dispatch<
    React.SetStateAction<{ [key: string]: string }>
  >;
}

const SectionLessons: React.FC<SectionLessonsProps> = ({
  control,
  sectionIndex,
  errors,
  videoPreviews,
  setVideoPreviews,
}) => {
  const {
    fields: lessonFields,
    append: appendLesson,
    remove: removeLesson,
  } = useFieldArray({
    control,
    name: `course.${sectionIndex}.content`,
  });

  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState<boolean>(false);
  const [lessonToRemove, setLessonToRemove] = useState<number | null>(null);

  const confirmRemoveLesson = (index: number): void => {
    setLessonToRemove(index);
    setIsLessonDialogOpen(true);
  };

  const handleRemoveLesson = (): void => {
    if (lessonToRemove !== null) {
      removeLesson(lessonToRemove);
      setIsLessonDialogOpen(false);
      setLessonToRemove(null);
    }
  };

  return (
    <div className="mt-3">
      <h3 className="text-md font-bold">Bài học</h3>
      {lessonFields.map((lesson, lessonIndex) => (
        <div key={lesson.id}>
          <span className="flex font-bold text-md text-black dark:text-AntiFlashWhite">
            Bài {lessonIndex + 1}
          </span>
          <div className="border p-2 mb-2 rounded gap-3 flex flex-col">
            <Controller
              name={`course.${sectionIndex}.content.${lessonIndex}.lesson_title`}
              control={control}
              render={({ field }) => (
                <InputRegisterLecture
                  {...field}
                  labelText={`Bài học ${lessonIndex + 1}: Tiêu đề`}
                  error={
                    errors.course?.[sectionIndex]?.content?.[lessonIndex]
                      ?.lesson_title?.message
                  }
                  name={field.name}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
            <Controller
              name={`course.${sectionIndex}.content.${lessonIndex}.lesson_content`}
              control={control}
              render={({ field }) => (
                <TextAreaRegisterLecture
                  {...field}
                  labelText={`Bài học ${lessonIndex + 1}: Nội dung`}
                  error={
                    errors.course?.[sectionIndex]?.content?.[lessonIndex]
                      ?.lesson_content?.message
                  }
                  name={field.name}
                  onChange={(value) => field.onChange(value)}
                />
              )}
            />
            <Controller
              name={`course.${sectionIndex}.content.${lessonIndex}.video_url`}
              control={control}
              render={({ field }) => (
                <div>
                  <InputRegisterLecture
                    labelText={`Bài học ${lessonIndex + 1}: Video`}
                    error={
                      errors.course?.[sectionIndex]?.content?.[lessonIndex]
                        ?.video_url?.message
                    }
                    type="file"
                    accept="video/*"
                    name={field.name}
                    onChange={(e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        const videoUrl = URL.createObjectURL(file);
                        field.onChange(file.name);
                        setVideoPreviews((prev) => ({
                          ...prev,
                          [`lesson_${sectionIndex}_${lessonIndex}`]: videoUrl,
                        }));
                      } else {
                        field.onChange("");
                        setVideoPreviews((prev) => {
                          const newPreviews = { ...prev };
                          delete newPreviews[
                            `lesson_${sectionIndex}_${lessonIndex}`
                          ];
                          return newPreviews;
                        });
                      }
                    }}
                  />
                  {videoPreviews[`lesson_${sectionIndex}_${lessonIndex}`] && (
                    <video
                      src={
                        videoPreviews[`lesson_${sectionIndex}_${lessonIndex}`]
                      }
                      controls
                      className="mt-2 w-full max-w-xs"
                    />
                  )}
                </div>
              )}
            />
            <Controller
              name={`course.${sectionIndex}.content.${lessonIndex}.resources`}
              control={control}
              render={({ field }) => (
                <div>
                  <InputRegisterLecture
                    labelText={`Bài học ${lessonIndex + 1}: Tài liệu`}
                    error={
                      errors.course?.[sectionIndex]?.content?.[lessonIndex]
                        ?.resources?.message
                    }
                    type="file"
                    multiple
                    name={field.name}
                    onChange={(e) => {
                      const files = Array.from(
                        (e.target as HTMLInputElement).files || []
                      );
                      const fileNames = files.map((file: File) => file.name);
                      field.onChange([...(field.value || []), ...fileNames]);
                      (e.target as HTMLInputElement).value = "";
                    }}
                  />
                  {field.value && field.value.length > 0 && (
                    <ul className="text-sm text-gray-600 mt-1">
                      {field.value.map((fileName: string, index: number) => (
                        <li key={index} className="flex items-center">
                          {fileName}
                          <Button
                            type="button"
                            className="ml-2 text-red-500 bg-transparent hover:bg-transparent p-0"
                            onClick={() => {
                              const updatedResources = field.value.filter(
                                (_: string, i: number) => i !== index
                              );
                              field.onChange(updatedResources);
                              const input = document.querySelector(
                                `input[name="${field.name}"]`
                              ) as HTMLInputElement;
                              if (input) input.value = "";
                            }}
                          >
                            Xóa
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            />
            <Button
              type="button"
              className="mt-2 w-fit py-2 px-4 bg-redPigment text-white"
              onClick={() => confirmRemoveLesson(lessonIndex)} // Thay đổi để mở popup
            >
              Xóa bài học
            </Button>
          </div>
        </div>
      ))}
      <Button
        type="button"
        className="mt-2 bg-majorelleBlue70 text-white"
        onClick={() =>
          appendLesson({
            lesson_title: "",
            lesson_content: "",
            resources: [],
            video_url: "",
          })
        }
      >
        Thêm bài học mới
      </Button>

      {/* Popup xác nhận xóa bài học */}
      <ConfirmDeleteDialog
        isOpen={isLessonDialogOpen}
        onOpenChange={setIsLessonDialogOpen}
        onConfirm={handleRemoveLesson}
      />
    </div>
  );
};

export default UploadCourse;
