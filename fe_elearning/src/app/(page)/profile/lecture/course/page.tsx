"use client";
import React from "react";
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
import { CourseForm, Lesson, Section } from "@/types/courseType";

// Schema validation với Yup
const lessonSchema = yup.object().shape({
  lesson_title: yup.string().required("Tiêu đề bài học không được để trống"),
  lesson_content: yup.string().required("Nội dung bài học không được để trống"),
  resources: yup
    .array()
    .of(yup.string().required("Tài liệu không được để trống"))
    .min(1, "Phải có ít nhất 1 tài liệu")
    .default([]), // Giá trị mặc định là mảng rỗng
  video_url: yup
    .string()
    .url("URL video không hợp lệ")
    .required("URL video không được để trống"),
});

const sectionSchema = yup.object().shape({
  section_title: yup.string().required("Tiêu đề phần không được để trống"),
  content: yup
    .array()
    .of(lessonSchema)
    .min(1, "Phải có ít nhất 1 bài học trong phần")
    .default([]), // Giá trị mặc định là mảng rỗng
  section_video: yup
    .string()
    .url("URL video không hợp lệ")
    .required("URL video phần không được để trống"),
  section_description: yup.string().required("Mô tả phần không được để trống"),
  section_resources: yup
    .array()
    .of(yup.string().required("Tài liệu không được để trống"))
    .min(1, "Phải có ít nhất 1 tài liệu cho phần")
    .default([]), // Giá trị mặc định là mảng rỗng
});

const schema = yup.object().shape({
  title: yup.string().required("Tiêu đề khóa học không được để trống"),
  rating: yup
    .number()
    .min(0, "Điểm đánh giá phải từ 0 đến 5")
    .max(5, "Điểm đánh giá phải từ 0 đến 5")
    .required("Điểm đánh giá không được để trống"),
  enrolled_students: yup
    .number()
    .min(0, "Số học viên phải lớn hơn hoặc bằng 0")
    .required("Số học viên không được để trống"),
  level: yup.string().required("Cấp độ không được để trống"),
  price: yup
    .number()
    .min(0, "Giá phải lớn hơn hoặc bằng 0")
    .required("Giá không được để trống"),
  lecture: yup.string().required("Tên giảng viên không được để trống"),
  short_description: yup.string().required("Mô tả ngắn không được để trống"),
  course: yup
    .array()
    .of(sectionSchema)
    .min(1, "Phải có ít nhất 1 phần trong khóa học")
    .default([]), // Giá trị mặc định là mảng rỗng
});

const UploadCourse = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      rating: 0,
      enrolled_students: 0,
      level: "",
      price: 0,
      lecture: "",
      short_description: "",
      course: [], // course luôn là mảng rỗng
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

  const onSubmit = (data: FieldValues) => {
    console.log("Course data:", data);
    alert("Tải lên khóa học thành công!");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-full gap-4 flex flex-col p-4"
    >
      {/* Thông tin cơ bản khóa học */}
      <div className="bg-white dark:bg-eerieBlack shadow-md rounded-lg p-3 border">
        <h2 className="text-lg font-medium">Thông tin khóa học</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3">
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <InputRegisterLecture
                {...field}
                labelText="Tiêu đề khóa học"
                error={errors.title?.message}
              />
            )}
          />
          <Controller
            name="rating"
            control={control}
            render={({ field }) => (
              <InputRegisterLecture
                {...field}
                labelText="Điểm đánh giá (0-5)"
                type="number"
                error={errors.rating?.message}
              />
            )}
          />
          <Controller
            name="enrolled_students"
            control={control}
            render={({ field }) => (
              <InputRegisterLecture
                {...field}
                labelText="Số học viên"
                type="number"
                error={errors.enrolled_students?.message}
              />
            )}
          />
          <Controller
            name="level"
            control={control}
            render={({ field }) => (
              <InputRegisterLecture
                {...field}
                labelText="Cấp độ (Cơ bản/Trung cấp/Nâng cao)"
                error={errors.level?.message}
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
              />
            )}
          />
          <Controller
            name="lecture"
            control={control}
            render={({ field }) => (
              <InputRegisterLecture
                {...field}
                labelText="Giảng viên"
                error={errors.lecture?.message}
              />
            )}
          />
          <Controller
            name="short_description"
            control={control}
            render={({ field }) => (
              <TextAreaRegisterLecture
                {...field}
                labelText="Mô tả ngắn"
                error={errors.short_description?.message}
              />
            )}
          />
        </div>
      </div>

      {/* Các phần của khóa học */}
      <div className="bg-white dark:bg-eerieBlack shadow-md rounded-lg p-3 border">
        <h2 className="text-lg font-medium">Nội dung khóa học</h2>
        {sectionFields.map((section, sectionIndex) => (
          <div key={section.id} className="border p-3 mb-3 rounded">
            <Controller
              name={`course.${sectionIndex}.section_title`}
              control={control}
              render={({ field }) => (
                <InputRegisterLecture
                  {...field}
                  labelText={`Tiêu đề phần ${sectionIndex + 1}`}
                  error={errors.course?.[sectionIndex]?.section_title?.message}
                />
              )}
            />
            <Controller
              name={`course.${sectionIndex}.section_description`}
              control={control}
              render={({ field }) => (
                <TextAreaRegisterLecture
                  {...field}
                  labelText="Mô tả phần"
                  error={
                    errors.course?.[sectionIndex]?.section_description?.message
                  }
                />
              )}
            />
            <Controller
              name={`course.${sectionIndex}.section_video`}
              control={control}
              render={({ field }) => (
                <InputRegisterLecture
                  {...field}
                  labelText="URL video phần"
                  error={errors.course?.[sectionIndex]?.section_video?.message}
                />
              )}
            />
            <Controller
              name={`course.${sectionIndex}.section_resources`}
              control={control}
              render={({ field }) => (
                <InputRegisterLecture
                  {...field}
                  labelText="Tài liệu phần (cách nhau bằng dấu phẩy)"
                  onChange={(e) => field.onChange(e.target.value.split(","))}
                  error={
                    errors.course?.[sectionIndex]?.section_resources?.message
                  }
                />
              )}
            />

            {/* Bài học trong phần */}
            <SectionLessons
              control={control}
              sectionIndex={sectionIndex}
              errors={errors}
            />

            <Button
              type="button"
              className="mt-2 bg-redPigment text-white"
              onClick={() => removeSection(sectionIndex)}
            >
              Xóa phần
            </Button>
          </div>
        ))}
        <Button
          type="button"
          className="mt-2 bg-majorelleBlue text-white"
          onClick={() =>
            appendSection({
              section_title: "",
              content: [], // content luôn là mảng rỗng
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
          className="w-32 bg-majorelleBlue text-white hover:bg-majorelleBlue70 rounded-md"
        >
          Tải lên khóa học
        </Button>
      </div>
    </form>
  );
};

// Component phụ để quản lý bài học trong mỗi phần
const SectionLessons = ({ control, sectionIndex, errors }: any) => {
  const {
    fields: lessonFields,
    append: appendLesson,
    remove: removeLesson,
  } = useFieldArray({
    control,
    name: `course.${sectionIndex}.content`,
  });

  return (
    <div className="mt-3">
      <h3 className="text-md font-medium">Bài học</h3>
      {lessonFields.map((lesson, lessonIndex) => (
        <div key={lesson.id} className="border p-2 mb-2 rounded">
          <Controller
            name={`course.${sectionIndex}.content.${lessonIndex}.lesson_title`}
            control={control}
            render={({ field }) => (
              <InputRegisterLecture
                {...field}
                labelText={`Tiêu đề bài học ${lessonIndex + 1}`}
                error={
                  errors.course?.[sectionIndex]?.content?.[lessonIndex]
                    ?.lesson_title?.message
                }
              />
            )}
          />
          <Controller
            name={`course.${sectionIndex}.content.${lessonIndex}.lesson_content`}
            control={control}
            render={({ field }) => (
              <TextAreaRegisterLecture
                {...field}
                labelText="Nội dung bài học"
                error={
                  errors.course?.[sectionIndex]?.content?.[lessonIndex]
                    ?.lesson_content?.message
                }
              />
            )}
          />
          <Controller
            name={`course.${sectionIndex}.content.${lessonIndex}.video_url`}
            control={control}
            render={({ field }) => (
              <InputRegisterLecture
                {...field}
                labelText="URL video bài học"
                error={
                  errors.course?.[sectionIndex]?.content?.[lessonIndex]
                    ?.video_url?.message
                }
              />
            )}
          />
          <Controller
            name={`course.${sectionIndex}.content.${lessonIndex}.resources`}
            control={control}
            render={({ field }) => (
              <InputRegisterLecture
                {...field}
                labelText="Tài liệu bài học (cách nhau bằng dấu phẩy)"
                onChange={(e) => field.onChange(e.target.value.split(","))}
                error={
                  errors.course?.[sectionIndex]?.content?.[lessonIndex]
                    ?.resources?.message
                }
              />
            )}
          />
          <Button
            type="button"
            className="mt-2 bg-redPigment text-white"
            onClick={() => removeLesson(lessonIndex)}
          >
            Xóa bài học
          </Button>
        </div>
      ))}
      <Button
        type="button"
        className="mt-2 bg-majorelleBlue text-white"
        onClick={() =>
          appendLesson({
            lesson_title: "",
            lesson_content: "",
            resources: [], // resources luôn là mảng rỗng
            video_url: "",
          })
        }
      >
        Thêm bài học mới
      </Button>
    </div>
  );
};

export default UploadCourse;
