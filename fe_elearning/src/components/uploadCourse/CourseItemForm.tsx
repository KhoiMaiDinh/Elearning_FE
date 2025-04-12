"use client";

import React, { useState } from "react";
import { useForm, Controller, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputRegisterLecture from "@/components/inputComponent/inputRegisterLecture";
import TextAreaRegisterLecture from "@/components/inputComponent/textAreaRegisterLecture";
import { Button } from "@/components/ui/button";
import { APIInitCourseItem } from "@/utils/course";
import { uploadToMinIO, getVideoDuration } from "@/utils/storage";
import AlertSuccess from "@/components/alert/AlertSuccess";
import AlertError from "@/components/alert/AlertError";
import { CourseItem, Section } from "@/types/courseType";
import { MediaType } from "@/types/mediaType";

// ===== VALIDATION SCHEMA =====
const courseItemSchema = yup.object().shape({
  title: yup.string().required("Tiêu đề bài học không được để trống"),
  description: yup.string().required("Nội dung bài học không được để trống"),
  video: yup
    .object()
    .shape({
      id: yup.string().required("ID của video không được để trống"),
      key: yup.string().required(),
    })
    .nullable(),
  resource_id: yup.array().of(
    yup.object().shape({
      id: yup.string().required(),
      key: yup.string().required(),
    })
  ),
  is_preview: yup.boolean().default(false),
  video_duration: yup.number().nullable().default(null),
});

interface CourseItemFormProps {
  sectionIndex: number;
  section: Section;
  onSave: () => void;
  onCancel: () => void;
}

const CourseItemForm: React.FC<CourseItemFormProps> = ({
  sectionIndex,
  section,
  onSave,
  onCancel,
}) => {
  const { control, handleSubmit, setValue } = useForm<CourseItem>({
    resolver: yupResolver(courseItemSchema) as Resolver<CourseItem>,
    defaultValues: {
      title: "",
      description: "",
      video: null,
      resources: [],
      is_preview: false,
      video_duration: undefined,
    },
  });

  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);
  const [description, setDescription] = useState("");
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [documentPreviews, setDocumentPreviews] = useState<
    Array<{ name: string; url: string }>
  >([]);
  const [createdItem, setCreatedItem] = useState<CourseItem | null>(null);

  const handleAddCourseItem = async (data: CourseItem) => {
    try {
      const payload = {
        title: data.title,
        is_preview: data.is_preview,
        section: { id: section.id },
        video: data.video ? { id: data.video.id } : null,
        video_duration: data.video_duration || null,
        description: data.description,
        resources: data.resources,
        previous_position: section.lectures?.length
          ? section.lectures[section.lectures.length - 1].position
          : null,
      };

      const response = await APIInitCourseItem(payload);
      if (response?.status === 201) {
        setShowAlertSuccess(true);
        setDescription("Bài giảng đã được thêm thành công!");
        setTimeout(() => setShowAlertSuccess(false), 3000);
        setCreatedItem(response.data);
        onSave();
      }
    } catch (error) {
      console.error("Error adding course item:", error);
      setShowAlertError(true);
      setDescription("Không thể thêm bài giảng");
      setTimeout(() => setShowAlertError(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {createdItem && (
        <div className="bg-AntiFlashWhite dark:bg-gray/80 p-4 rounded-xl border border-gray/20 dark:border-gray/70 shadow-sm">
          <h4 className="font-semibold text-lg mb-3">📝 Bài giảng vừa tạo:</h4>
          <div className="space-y-3 text-sm">
            <p>
              <strong className="text-eerieBlack dark:text-white/80">
                Tiêu đề:
              </strong>{" "}
              {createdItem.title}
            </p>
            <p>
              <strong className="text-eerieBlack dark:text-white/80">
                Nội dung:
              </strong>{" "}
              <span
                className="ql-content"
                dangerouslySetInnerHTML={{
                  __html: createdItem.description,
                }}
              />
            </p>
            {createdItem.video?.video?.key && (
              <div>
                <p className="font-semibold">🎥 Video:</p>
                <video
                  src={`${process.env.NEXT_PUBLIC_BASE_URL_VIDEO}${createdItem.video.video.key}`}
                  controls
                  className="w-full max-w-sm rounded-lg shadow"
                />
              </div>
            )}
            {createdItem.resources?.length > 0 && (
              <div>
                <p className="font-semibold">📄 Tài liệu:</p>
                <ul className="list-disc pl-5">
                  {createdItem.resources.map((res, i) => (
                    <li key={i}>
                      <a
                        href={`${process.env.NEXT_PUBLIC_BASE_URL_DOCUMENT}${res.key}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-LavenderIndigo/80 hover:underline"
                      >
                        {res.key?.split("/").pop()}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p>
              <strong className="text-eerieBlack dark:text-white/80">
                Xem trước:
              </strong>{" "}
              {createdItem.is_preview ? "✅ Có" : "❌ Không"}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(handleAddCourseItem)} className="space-y-6">
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <InputRegisterLecture
              {...field}
              labelText={`Tiêu đề bài ${
                (section.lectures?.length || 0) + 1
              } (Phần ${section.position})`}
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextAreaRegisterLecture
              {...field}
              labelText={`Nội dung bài ${
                (section.lectures?.length || 0) + 1
              } (Phần ${section.position})`}
            />
          )}
        />

        <Controller
          name="video"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <InputRegisterLecture
                labelText={`Video bài ${
                  (section.lectures?.length || 0) + 1
                } (Phần ${section.position})`}
                type="file"
                accept="video/*"
                onChange={async (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    const { id, key } = await uploadToMinIO(
                      file,
                      "lecture-video",
                      "video"
                    );
                    const duration = await getVideoDuration(file);
                    const video: MediaType = { id, key, bucket: "video" };
                    setValue("video", video);
                    setValue("video_duration", Math.round(duration));
                    setVideoPreview(
                      process.env.NEXT_PUBLIC_BASE_URL_VIDEO + key
                    );
                    field.onChange(video);
                  }
                }}
              />
              {videoPreview && (
                <video
                  src={videoPreview}
                  controls
                  className="w-full max-w-sm rounded-md border"
                />
              )}
            </div>
          )}
        />

        <Controller
          name="resources"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <InputRegisterLecture
                labelText="Tài liệu bài giảng"
                type="file"
                accept=".pdf,.doc,.docx"
                multiple
                onChange={async (e) => {
                  const files = Array.from(
                    (e.target as HTMLInputElement).files || []
                  );
                  const uploadedResources: MediaType[] = [];
                  const newPreviews = [];

                  for (const file of files) {
                    const { id, key } = await uploadToMinIO(
                      file,
                      "resource",
                      "resource_file"
                    );
                    uploadedResources.push({ id, key });
                    newPreviews.push({
                      name: file.name,
                      url: URL.createObjectURL(file),
                    });
                  }

                  const currentResources = field.value || [];
                  field.onChange([...currentResources, ...uploadedResources]);
                  setDocumentPreviews([...documentPreviews, ...newPreviews]);
                }}
              />
              {documentPreviews.length > 0 && (
                <div>
                  <p className="font-medium">📎 Tài liệu đã tải lên:</p>
                  <ul className="list-disc pl-5">
                    {documentPreviews.map((doc, index) => (
                      <li key={index}>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-LavenderIndigo/80 hover:underline"
                        >
                          {doc.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        />

        <Controller
          name="is_preview"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_preview"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                className="accent-majorelleBlue w-4 h-4"
              />
              <label htmlFor="is_preview" className="text-sm">
                Cho phép xem trước
              </label>
            </div>
          )}
        />

        <div className="flex gap-2">
          <Button
            type="submit"
            className="bg-custom-gradient-button-violet dark:bg-custom-gradient-button-blue hover:brightness-110 text-white"
          >
            💡Lưu
          </Button>
          <Button
            type="button"
            className="bg-redPigment text-white hover:text-white dark:hover:text-black"
            variant="outline"
            onClick={onCancel}
          >
            Hủy
          </Button>
        </div>

        {showAlertSuccess && <AlertSuccess description={description} />}
        {showAlertError && <AlertError description={description} />}
      </form>
    </div>
  );
};

export default CourseItemForm;
