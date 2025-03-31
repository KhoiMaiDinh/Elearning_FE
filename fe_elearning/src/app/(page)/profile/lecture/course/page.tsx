"use client";
import React, { useState } from "react";
import {
  useForm,
  Controller,
  useFieldArray,
  FieldArrayWithId,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputRegisterLecture from "@/components/inputComponent/inputRegisterLecture";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CourseForm, Section, Lesson } from "@/types/courseType";
import { Delete } from "lucide-react";

const schema = yup.object().shape({
  title: yup.string().required("Tiêu đề khóa học không được để trống"),
  level: yup.string().required("Cấp độ không được để trống"),
  price: yup
    .number()
    .min(0, "Giá phải lớn hơn hoặc bằng 0")
    .required("Giá không được để trống"),
  short_description: yup.string().required("Mô tả ngắn không được để trống"),
  category_id: yup.string().required("Danh mục không được để trống"),
  course: yup
    .array()
    .of(
      yup.object().shape({
        section_title: yup
          .string()
          .required("Tiêu đề phần không được để trống"),
        section_description: yup
          .string()
          .required("Mô tả phần không được để trống"),
        section_video: yup.string().default(""),
        section_resources: yup.array().of(yup.string()).default([]),
        content: yup
          .array()
          .of(
            yup.object().shape({
              lesson_title: yup
                .string()
                .required("Tiêu đề bài học không được để trống"),
              lesson_content: yup
                .string()
                .required("Nội dung bài học không được để trống"),
              resources: yup.array().of(yup.string()).default([]),
              video_url: yup.string().default(""),
            })
          )
          .default([]),
      })
    )
    .default([]),
  priceFinal: yup
    .number()
    .min(0, "Giá cuối phải lớn hơn hoặc bằng 0")
    .nullable(),
  rating: yup.number().default(0),
  enrolled_students: yup.number().default(0),
  lecture: yup.string().default(""),
  coverPhoto: yup.string().nullable(),
});

const UploadCourse: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseForm>({
    resolver: yupResolver<CourseForm>(schema),
    defaultValues: {
      title: "",
      level: "",
      price: 0,
      short_description: "",
      category_id: "",
      course: [],
      priceFinal: undefined,
      rating: 0,
      enrolled_students: 0,
      lecture: "",
      coverPhoto: undefined,
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

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editSectionIndex, setEditSectionIndex] = useState<number | null>(null);
  const [videoPreviews, setVideoPreviews] = useState<{ [key: string]: string }>(
    {}
  );

  const onSubmit = (data: CourseForm) => {
    console.log("Course data to submit:", data);
    alert("Tải lên khóa học thành công!");
  };

  const openPopup = (index?: number) => {
    setEditSectionIndex(index !== undefined ? index : null);
    setIsPopupOpen(true);
  };

  const handleSaveSection = (sectionData: Section) => {
    if (editSectionIndex !== null) {
      const updatedCourse: FieldArrayWithId<CourseForm, "course", "id">[] = [
        ...sectionFields,
      ];
      updatedCourse[editSectionIndex] = {
        ...sectionData,
        id: sectionFields[editSectionIndex].id,
      };
      control._updateFieldArray("course", updatedCourse);
    } else {
      appendSection(sectionData);
    }
    setIsPopupOpen(false);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-full gap-4 flex flex-col p-4"
    >
      {/* Thông tin cơ bản */}
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
            name="level"
            control={control}
            render={({ field }) => (
              <InputRegisterLecture
                {...field}
                labelText="Cấp độ"
                error={errors.level?.message}
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
            name="priceFinal"
            control={control}
            render={({ field }) => (
              <InputRegisterLecture
                {...field}
                labelText="Giá cuối (VND)"
                type="number"
                error={errors.priceFinal?.message}
                onChange={(e) =>
                  field.onChange(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
              />
            )}
          />
          <Controller
            name="short_description"
            control={control}
            render={({ field }) => (
              <InputRegisterLecture
                {...field}
                labelText="Mô tả ngắn"
                error={errors.short_description?.message}
                onChange={(e) => field.onChange(e.target.value)}
              />
            )}
          />
          <Controller
            name="category_id"
            control={control}
            render={({ field }) => (
              <InputRegisterLecture
                {...field}
                labelText="Danh mục (ID)"
                error={errors.category_id?.message}
                onChange={(e) => field.onChange(e.target.value)}
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
                onChange={(e) => field.onChange(e.target.value)}
              />
            )}
          />
          <Controller
            name="coverPhoto"
            control={control}
            render={({ field }) => (
              <InputRegisterLecture
                labelText="Ảnh bìa"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) field.onChange(file.name);
                }}
              />
            )}
          />
        </div>
      </div>

      {/* Danh sách phần (trạng thái xem) */}
      <div className="bg-white dark:bg-eerieBlack shadow-md rounded-lg p-3 border">
        <h2 className="text-lg font-bold">Nội dung khóa học</h2>
        {sectionFields.length === 0 ? (
          <p>Chưa có phần nào.</p>
        ) : (
          sectionFields.map((section, index) => (
            <div key={section.id} className="p-2 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-md font-bold">{section.section_title}</h3>
                <div>
                  <Button
                    type="button"
                    className="mr-2 bg-majorelleBlue text-white"
                    onClick={() => openPopup(index)}
                  >
                    Chỉnh sửa
                  </Button>
                  <Button
                    type="button"
                    className="bg-redPigment text-white"
                    onClick={() => removeSection(index)}
                  >
                    Xóa
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                {section.section_description}
              </p>
              {section.section_video && (
                <video
                  src={videoPreviews[`section_${index}`]}
                  controls
                  className="mt-2 w-full max-w-xs"
                />
              )}
              {section.section_resources.length > 0 && (
                <ul className="text-sm text-gray-600 mt-1">
                  {section.section_resources.map((resource, i) => (
                    <li key={i}>{resource}</li>
                  ))}
                </ul>
              )}
              {section.content.length > 0 && (
                <div className="mt-2">
                  <h4 className="text-sm font-semibold">Bài học:</h4>
                  {section.content.map((lesson, lessonIndex) => (
                    <div key={lessonIndex} className="ml-4">
                      <p className="text-sm font-medium">
                        {lesson.lesson_title}
                      </p>
                      <p className="text-sm text-gray-600">
                        {lesson.lesson_content}
                      </p>
                      {lesson.video_url && (
                        <video
                          src={videoPreviews[`lesson_${index}_${lessonIndex}`]}
                          controls
                          className="mt-2 w-full max-w-xs"
                        />
                      )}
                      {lesson.resources.length > 0 && (
                        <ul className="text-sm text-gray-600 mt-1">
                          {lesson.resources.map((resource, i) => (
                            <li key={i}>{resource}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
        <Button
          type="button"
          className="mt-2 bg-majorelleBlue70 text-white"
          onClick={() => openPopup()}
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

      {/* Popup thêm/chỉnh sửa phần */}
      {isPopupOpen && (
        <SectionPopup
          onSave={handleSaveSection}
          onClose={() => setIsPopupOpen(false)}
          initialData={
            editSectionIndex !== null
              ? sectionFields[editSectionIndex]
              : undefined
          }
          videoPreviews={videoPreviews}
          setVideoPreviews={setVideoPreviews}
          sectionIndex={
            editSectionIndex !== null ? editSectionIndex : sectionFields.length
          }
        />
      )}
    </form>
  );
};

// Component Popup để thêm/chỉnh sửa phần
interface SectionPopupProps {
  onSave: (data: Section) => void;
  onClose: () => void;
  initialData?: Section;
  videoPreviews: { [key: string]: string };
  setVideoPreviews: React.Dispatch<
    React.SetStateAction<{ [key: string]: string }>
  >;
  sectionIndex: number;
}

const SectionPopup: React.FC<SectionPopupProps> = ({
  onSave,
  onClose,
  initialData,
  videoPreviews,
  setVideoPreviews,
  sectionIndex,
}) => {
  const { register, handleSubmit, control, reset } = useForm<Section>({
    defaultValues: initialData || {
      section_title: "",
      section_description: "",
      section_video: "",
      section_resources: [],
      content: [],
    },
  });

  const {
    fields: lessonFields,
    append: appendLesson,
    remove: removeLesson,
  } = useFieldArray({
    control,
    name: "content",
  });

  const onSubmitPopup = (data: Section) => {
    onSave(data);
    reset();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Chỉnh sửa phần" : "Thêm phần mới"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitPopup)} className="space-y-4">
          <InputRegisterLecture
            labelText="Tiêu đề phần"
            {...register("section_title")}
          />
          <InputRegisterLecture
            labelText="Mô tả phần"
            {...register("section_description")}
          />
          <Controller
            name="section_video"
            control={control}
            render={({ field }) => (
              <InputRegisterLecture
                labelText="Video phần"
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    const videoUrl = URL.createObjectURL(file);
                    field.onChange(file.name);
                    setVideoPreviews((prev) => ({
                      ...prev,
                      [`section_${sectionIndex}`]: videoUrl,
                    }));
                  }
                }}
              />
            )}
          />
          {videoPreviews[`section_${sectionIndex}`] && (
            <video
              src={videoPreviews[`section_${sectionIndex}`]}
              controls
              className="mt-2 w-full max-w-xs"
            />
          )}
          <Controller
            name="section_resources"
            control={control}
            render={({ field }) => (
              <div>
                <InputRegisterLecture
                  labelText="Tài liệu phần"
                  type="file"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(
                      (e.target as HTMLInputElement).files || []
                    );
                    const fileNames = files.map((file) => file.name);
                    field.onChange([...(field.value || []), ...fileNames]);
                    (e.target as HTMLInputElement).value = "";
                  }}
                />
                {field.value.length > 0 && (
                  <ul className="text-sm text-gray-600 mt-1">
                    {field.value.map((resource, i) => (
                      <li key={i} className="flex items-center">
                        {resource}
                        <div
                          type="button"
                          className="ml-2 text-red-500 bg-transparent hover:bg-transparent p-0"
                          onClick={() => {
                            const updatedResources = field.value.filter(
                              (_, index) => index !== i
                            );
                            field.onChange(updatedResources);
                          }}
                        >
                          <Delete className="text-redPigment w-5 h-5 hover:cursor-pointer" />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          />

          {/* Danh sách bài học */}
          <SectionLessons
            control={control}
            sectionIndex={sectionIndex}
            lessonFields={lessonFields}
            appendLesson={appendLesson}
            removeLesson={removeLesson}
            videoPreviews={videoPreviews}
            setVideoPreviews={setVideoPreviews}
          />

          <div className="flex justify-end gap-2">
            <Button type="button" onClick={onClose} variant="outline">
              Hủy
            </Button>
            <Button type="submit" className="bg-majorelleBlue text-white">
              Lưu
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Component quản lý bài học trong popup
interface SectionLessonsProps {
  control: any;
  sectionIndex: number;
  lessonFields: any[];
  appendLesson: (data: Lesson) => void;
  removeLesson: (index: number) => void;
  videoPreviews: { [key: string]: string };
  setVideoPreviews: React.Dispatch<
    React.SetStateAction<{ [key: string]: string }>
  >;
}

const SectionLessons: React.FC<SectionLessonsProps> = ({
  control,
  sectionIndex,
  lessonFields,
  appendLesson,
  removeLesson,
  videoPreviews,
  setVideoPreviews,
}) => {
  return (
    <div className="mt-3">
      <h3 className="text-md font-bold">Bài học</h3>
      {lessonFields.length === 0 ? (
        <p>Chưa có bài học nào.</p>
      ) : (
        lessonFields.map((lesson, lessonIndex) => (
          <div
            key={lesson.id}
            className="border p-2 mb-2 rounded gap-3 flex flex-col"
          >
            <Controller
              name={`content.${lessonIndex}.lesson_title`}
              control={control}
              render={({ field }) => (
                <InputRegisterLecture
                  {...field}
                  labelText={`Bài học ${lessonIndex + 1}: Tiêu đề`}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
            <Controller
              name={`content.${lessonIndex}.lesson_content`}
              control={control}
              render={({ field }) => (
                <InputRegisterLecture
                  {...field}
                  labelText={`Bài học ${lessonIndex + 1}: Nội dung`}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
            <Controller
              name={`content.${lessonIndex}.video_url`}
              control={control}
              render={({ field }) => (
                <InputRegisterLecture
                  labelText={`Bài học ${lessonIndex + 1}: Video`}
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      const videoUrl = URL.createObjectURL(file);
                      field.onChange(file.name);
                      setVideoPreviews((prev) => ({
                        ...prev,
                        [`lesson_${sectionIndex}_${lessonIndex}`]: videoUrl,
                      }));
                    }
                  }}
                />
              )}
            />
            {videoPreviews[`lesson_${sectionIndex}_${lessonIndex}`] && (
              <video
                src={videoPreviews[`lesson_${sectionIndex}_${lessonIndex}`]}
                controls
                className="mt-2 w-full max-w-xs"
              />
            )}
            <Controller
              name={`content.${lessonIndex}.resources`}
              control={control}
              render={({ field }) => (
                <div>
                  <InputRegisterLecture
                    labelText={`Bài học ${lessonIndex + 1}: Tài liệu`}
                    type="file"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(
                        (e.target as HTMLInputElement).files || []
                      );
                      const fileNames = files.map((file) => file.name);
                      field.onChange([...(field.value || []), ...fileNames]);
                      (e.target as HTMLInputElement).value = "";
                    }}
                  />
                  {field.value.length > 0 && (
                    <ul className="text-sm text-gray-600 mt-1">
                      {field.value.map((resource, i) => (
                        <li key={i} className="flex items-center">
                          {resource}
                          <div
                            className="ml-2 text-red-500 bg-transparent hover:bg-transparent p-0"
                            onClick={() => {
                              const updatedResources = field.value.filter(
                                (_, index) => index !== i
                              );
                              field.onChange(updatedResources);
                            }}
                          >
                            <Delete className="text-redPigment w-5 h-5 hover:cursor-pointer" />
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
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
        ))
      )}
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
    </div>
  );
};

export default UploadCourse;
