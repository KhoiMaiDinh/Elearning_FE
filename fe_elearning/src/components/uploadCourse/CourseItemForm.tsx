'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import InputRegisterLecture from '@/components/inputComponent/inputRegisterLecture';
import TextAreaRegisterLecture from '@/components/inputComponent/textAreaRegisterLecture';
import { Button } from '@/components/ui/button';
import { APIInitCourseItem } from '@/utils/course';
import { uploadToMinIO } from '@/utils/storage';
import { CourseItem, SectionType, VideoType, ResourceType } from '@/types/courseType';
import VideoPlayer from '@/components/courseDetails/videoPlayer';
import { Trash2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';
import { z } from 'zod';
import ToastNotify from '../ToastNotify/toastNotify';
import { toast, ToastContainer } from 'react-toastify';
import { styleSuccess } from '../ToastNotify/toastNotifyStyle';
import { styleError } from '../ToastNotify/toastNotifyStyle';
import { useTheme } from 'next-themes';
import { MediaType } from '@/types/mediaType';

const courseItemSchema = yup.object().shape({
  title: yup.string().required('Tiêu đề bài học không được để trống'),
  description: yup.string().required('Nội dung bài học không được để trống'),
  video: yup
    .object()
    .shape({
      id: yup.string().required('ID của video không được để trống'),
      duration_in_seconds: yup.number().nullable(),
      video: yup.object().shape({
        key: yup.string().required(),
        status: yup.string().oneOf(['uploaded', 'validated', 'pending']),
        bucket: yup.string(),
        rejection_reason: yup.string().nullable(),
      }),
      version: yup.number(),
    })
    .nullable(),
  resources: yup.array().of(
    yup.object().shape({
      resource_file: yup.object().shape({
        id: yup.string().required(),
      }),
      name: yup.string().required(),
    })
  ),
  is_preview: yup.boolean().default(false),
  position: yup.string(),
  section_id: yup.string(),
  id: yup.string(),
  status: yup.string().optional(),
  previous_position: yup.string().optional(),
});

// --- Khai báo schema với Zod ---
const _CourseItemSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được bỏ trống'),
  description: z.string().optional(),
  video: z
    .any()
    .refine((file) => typeof file === 'string' || file instanceof File, 'Video là bắt buộc'),
  resources: z.array(z.any()).optional(),
});

interface CourseItemFormProps {
  sectionIndex: number;
  section: SectionType;
  onSave: () => void;
  onCancel: () => void;
  initialValues?: CourseItem | null;
}

const CourseItemForm = ({
  // _sectionIndex,
  section,
  onSave,
  onCancel,
  initialValues,
}: CourseItemFormProps): JSX.Element => {
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [documentPreviews, setDocumentPreviews] = useState<Array<{ name: string; url: string }>>(
    []
  );
  const [createdItem, setCreatedItem] = useState<CourseItem | null>(null);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [documentUploadProgress, setDocumentUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [uploadingDocuments, setUploadingDocuments] = useState<string[]>([]);
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CourseItem>({
    resolver: yupResolver(courseItemSchema) as unknown as Resolver<CourseItem>,
    defaultValues: {
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      video: initialValues?.video || null,
      resources: initialValues?.resources || [],
      is_preview: initialValues?.is_preview || false,
      position: initialValues?.position || '',
      section_id: section.id,
      id: initialValues?.id || '',
      status: initialValues?.status || 'ACTIVE',
      previous_position: initialValues?.previous_position || undefined,
    },
  });

  // Watch for video changes
  const currentVideo = watch('video');

  useEffect(() => {
    // Set initial video preview if exists
    if (initialValues?.video?.key && initialValues?.video?.key) {
      setVideoPreview(process.env.NEXT_PUBLIC_BASE_URL_VIDEO + initialValues.video.key);
    }

    // Set initial document previews if exists
    if (initialValues?.resources?.length) {
      const previews = initialValues.resources.map((resource) => ({
        name: resource.name,
        url: `${process.env.NEXT_PUBLIC_BASE_URL_DOCUMENT}${resource.resource_file.id}`,
      }));
      setDocumentPreviews(previews);
    }
  }, [initialValues]);

  // Update video preview when video changes
  useEffect(() => {
    if (currentVideo?.key) {
      setVideoPreview(process.env.NEXT_PUBLIC_BASE_URL_VIDEO + currentVideo.key);
    }
  }, [currentVideo]);

  const handleAddCourseItem = async (data: CourseItem) => {
    try {
      const payload = {
        title: data.title,
        is_preview: data.is_preview,
        section: { id: section.id },
        video: data.video
          ? {
              id: data.video.id,
              duration_in_seconds: data.video.duration_in_seconds,
            }
          : null,
        description: data.description,
        resources: data.resources || [],
        previous_position:
          initialValues?.position ||
          (section.items?.length ? section.items[section.items.length - 1].position : null),
        id: initialValues?.id, // Include id for editing mode
      };

      const response = await APIInitCourseItem(payload);
      if (response?.status === 201 || response?.status === 200) {
        toast.success(<ToastNotify status={1} message="Bài giảng đã được cập nhật thành công!" />, {
          style: styleSuccess,
        });
        setCreatedItem(response.data);
        onSave();
      }
    } catch (error) {
      toast.error(<ToastNotify status={-1} message="Không thể cập nhật bài giảng" />, {
        style: styleError,
      });
    }
  };

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration); // duration in seconds
      };

      video.onerror = (_e) => {
        reject('Không thể đọc thời lượng video');
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const handleVideoUpload = async (file: File): Promise<void> => {
    try {
      setIsVideoUploading(true);
      setVideoUploadProgress(0);

      // Show immediate preview using local URL
      const localPreviewUrl = URL.createObjectURL(file);
      setVideoPreview(localPreviewUrl);

      const progressInterval = setInterval(() => {
        setVideoUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const { id, key } = await uploadToMinIO(file, 'lecture-video', 'video');
      const duration = await getVideoDuration(file);

      clearInterval(progressInterval);
      setVideoUploadProgress(100);

      const video: VideoType = {
        id,
        duration_in_seconds: Math.round(duration),
        video: {
          key,
          status: 'uploaded',
          bucket: 'video',
          rejection_reason: null,
        },
        version: 1,
      };

      setValue('video', video as MediaType & { duration_in_seconds: number });
      setValue('video.duration_in_seconds', Math.round(duration));
      setVideoPreview(process.env.NEXT_PUBLIC_BASE_URL_VIDEO + key);
      URL.revokeObjectURL(localPreviewUrl);

      setTimeout(() => {
        setIsVideoUploading(false);
        setVideoUploadProgress(0);
      }, 1000);
    } catch (error) {
      console.error('Error uploading video:', error);
      setIsVideoUploading(false);
      setVideoUploadProgress(0);
      toast.error(<ToastNotify status={-1} message="Lỗi khi tải lên video" />, {
        style: styleError,
      });
    }
  };

  const handleDocumentUpload = async (
    files: File[],
    field: { value: ResourceType[]; onChange: (value: ResourceType[]) => void }
  ): Promise<void> => {
    const uploadedResources: ResourceType[] = [];
    const newPreviews: Array<{ name: string; url: string }> = [];
    const fileNames = files.map((f) => f.name);
    setUploadingDocuments(fileNames);

    for (const file of files) {
      try {
        setDocumentUploadProgress((prev) => ({
          ...prev,
          [file.name]: 0,
        }));

        const progressInterval = setInterval(() => {
          setDocumentUploadProgress((prev) => ({
            ...prev,
            [file.name]: prev[file.name] >= 90 ? 90 : prev[file.name] + 10,
          }));
        }, 300);

        const { id } = await uploadToMinIO(file, 'resource', 'resource_file');

        clearInterval(progressInterval);
        setDocumentUploadProgress((prev) => ({
          ...prev,
          [file.name]: 100,
        }));

        uploadedResources.push({
          resource_file: { id },
          name: file.name,
        });
        newPreviews.push({
          name: file.name,
          url: URL.createObjectURL(file),
        });
      } catch (error) {
        console.error(`Error uploading document ${file.name}:`, error);
        toast.error(<ToastNotify status={-1} message={`Lỗi khi tải lên tài liệu ${file.name}`} />, {
          style: styleError,
        });
      }
    }

    field.onChange([...field.value, ...uploadedResources]);
    setDocumentPreviews([...documentPreviews, ...newPreviews]);

    setTimeout(() => {
      setUploadingDocuments([]);
      setDocumentUploadProgress({});
    }, 1000);
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'video' | 'resources'
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (field === 'video') {
        await handleVideoUpload(file);
      } else {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
          const currentResources = watch('resources') || [];
          await handleDocumentUpload(files, {
            value: currentResources,
            onChange: (value: ResourceType[]) => {
              setValue('resources', value);
            },
          });
        }
      }
    } catch (error) {
      console.error('Error handling file change:', error);
      toast.error(<ToastNotify status={-1} message="Lỗi khi tải lên file" />, {
        style: styleError,
      });
    }
  };

  return (
    <>
      <div className="space-y-6">
        {createdItem && (
          <div className="bg-AntiFlashWhite dark:bg-gray/80 p-4 rounded-xl border border-gray/20 dark:border-gray/70 shadow-sm">
            <h4 className="font-semibold text-lg mb-3">📝 Bài giảng vừa tạo:</h4>
            <div className="space-y-3 text-sm">
              <p>
                <strong className="text-eerieBlack dark:text-white/80">Tiêu đề:</strong>{' '}
                {createdItem.title}
              </p>
              <p>
                <strong className="text-eerieBlack dark:text-white/80">Nội dung:</strong>{' '}
                <span
                  className="ql-content"
                  dangerouslySetInnerHTML={{
                    __html: createdItem.description,
                  }}
                />
              </p>
              {createdItem.video?.key && (
                <div>
                  <p className="font-semibold">🎥 Video:</p>
                  <VideoPlayer
                    videoUrl={`${process.env.NEXT_PUBLIC_BASE_URL_VIDEO}${createdItem.video.key}`}
                    title={createdItem.title}
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
                          href={`${process.env.NEXT_PUBLIC_BASE_URL_DOCUMENT}${res.resource_file.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-LavenderIndigo/80 hover:underline"
                        >
                          {res.resource_file.id?.split('/').pop()}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <p>
                <strong className="text-eerieBlack dark:text-white/80">Xem trước:</strong>{' '}
                {createdItem.is_preview ? '✅ Có' : '❌ Không'}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(handleAddCourseItem)} className="space-y-6 py-4">
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <InputRegisterLecture
                {...field}
                labelText={`Tiêu đề bài ${
                  (section.items?.length || 0) + 1
                } (Phần ${section.position})`}
                error={errors.title?.message}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextAreaRegisterLecture
                {...field}
                label={`Nội dung bài ${
                  (section.items?.length || 0) + 1
                } (Phần ${section.position})`}
                error={errors.description?.message}
              />
            )}
          />

          <Controller
            name="video"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                {currentVideo && (
                  <div className="mb-4">
                    <p className="font-medium mb-2">Video hiện tại:</p>
                    {currentVideo.status === 'validated' && videoPreview && (
                      <>
                        <VideoPlayer
                          videoUrl={process.env.NEXT_PUBLIC_BASE_URL_VIDEO + videoPreview}
                          title="Video Preview"
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            setValue('video', null);
                            setVideoPreview(null);
                          }}
                          className="mt-2 bg-redPigment text-white hover:bg-redPigment/80"
                        >
                          Xóa video
                        </Button>
                      </>
                    )}

                    {currentVideo.status === 'pending' && (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-2 text-yellow-700">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <p>Video đang được xử lý...</p>
                        </div>
                        <Button
                          type="button"
                          onClick={() => {
                            setValue('video', null);
                            setVideoPreview(null);
                          }}
                          className="mt-2 bg-redPigment text-white hover:bg-redPigment/80"
                        >
                          Xóa video
                        </Button>
                      </div>
                    )}

                    {currentVideo.status === 'rejected' && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2 text-red-700">
                          <p className="text-sm text-red-600">⛔ Video đã bị từ chối</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <InputRegisterLecture
                  {...field}
                  error={errors.video?.message}
                  labelText={`${
                    currentVideo
                      ? currentVideo.status === 'rejected'
                        ? 'Upload lại video'
                        : 'Thay thế video'
                      : 'Thêm video'
                  } bài ${(section.items?.length || 0) + 1} (Phần ${section.position})`}
                  type="file"
                  accept="video/*"
                  disabled={isVideoUploading}
                  onChange={(e) => handleFileChange(e, 'video')}
                />

                {isVideoUploading ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Đang tải lên video...</span>
                    </div>
                    <Progress value={videoUploadProgress} className="h-2" />
                    <p className="text-sm text-gray-500">{videoUploadProgress}%</p>
                  </div>
                ) : (
                  <VideoPlayer
                    videoUrl={process.env.NEXT_PUBLIC_BASE_URL_VIDEO + (videoPreview || '')}
                    title="Video Preview"
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
                  {...field}
                  labelText={`${field.value?.length ? 'Thêm tài liệu' : 'Tài liệu bài giảng'}`}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  multiple
                  disabled={uploadingDocuments.length > 0}
                  onChange={(e) => handleFileChange(e, 'resources')}
                />

                {uploadingDocuments.map((fileName) => (
                  <div key={fileName} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Đang tải lên {fileName}...</span>
                    </div>
                    <Progress value={documentUploadProgress[fileName] || 0} className="h-2" />
                    <p className="text-sm text-gray-500">
                      {documentUploadProgress[fileName] || 0}%
                    </p>
                  </div>
                ))}

                {field.value?.length > 0 && (
                  <div>
                    <p className="font-medium">📎 Tài liệu đã tải lên:</p>
                    <ul className="list-disc pl-5">
                      {field.value.map((resource, index) => (
                        <li key={index} className="flex justify-between items-center">
                          <a
                            href={`${process.env.NEXT_PUBLIC_BASE_URL_DOCUMENT}${resource.resource_file.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-LavenderIndigo/80 hover:underline"
                          >
                            {resource.name}
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              const updatedResources = field.value.filter((_, i) => i !== index);
                              field.onChange(updatedResources);
                              const updatedPreviews = documentPreviews.filter(
                                (_, i) => i !== index
                              );
                              setDocumentPreviews(updatedPreviews);
                            }}
                            className="text-redPigment ml-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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
              className="bg-custom-gradient-button-violet rounded-lg dark:bg-custom-gradient-button-blue hover:brightness-125 text-white"
            >
              <img src="/icons/icon_save.png" alt="save" className="w-5 h-5 object-fill" />
              Lưu
            </Button>

            <Button
              type="button"
              className="w-32 bg-custom-gradient-button-red text-white  hover:brightness-125 rounded-md font-sans font-medium text-[16px] p-2"
              variant="outline"
              onClick={onCancel}
            >
              Hủy
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CourseItemForm;
