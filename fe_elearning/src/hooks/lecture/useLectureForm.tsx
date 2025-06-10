import { useEffect, useState } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CourseItem, ResourceType, Section } from '@/types/courseType';
import { APIInitCourseItem, APIUpdateCourseItem } from '@/utils/course';
import { uploadToMinIO } from '@/utils/storage';
import { MediaType } from '@/types/mediaType';
import { stripHtml } from '@/helpers';

const MAX_RESOURCES = 5;
const courseItemSchema = yup.object().shape({
  title: yup
    .string()
    .required('Tiêu đề bài học không được để trống')
    .max(60, 'Tiêu đề không được vượt quá 60 ký tự'),
  description: yup
    .string()
    .test('min-text-length', 'Nội dung bài học không được để trống', (value) => {
      const textOnly = stripHtml(value || '');
      return textOnly.length > 0;
    })
    .test('max-text-length', 'Nội dung không được vượt quá 1000 ký tự', (value) => {
      const textOnly = stripHtml(value || '');
      return textOnly.length <= 1000;
    }),
  video: yup
    .object()
    .shape({
      id: yup.string(),
      duration_in_seconds: yup.number(),
    })
    .required('Video không được để trống'),
  resources: yup
    .array()
    .of(
      yup.object().shape({
        resource_file: yup.object().shape({
          id: yup.string().required(),
        }),
        name: yup
          .string()
          .required('Tên tài liệu không được để trống')
          .max(60, 'Tên tài liệu không được vượt quá 60 ký tự'),
      })
    )
    .max(MAX_RESOURCES, `Chỉ được tải lên tối đa ${MAX_RESOURCES} tài liệu`),
  is_preview: yup.boolean().default(false),
  position: yup.string(),
  section_id: yup.string(),
  id: yup.string(),
  status: yup.string().optional(),
  previous_position: yup.string().optional(),
});

export const useLecture = (
  section: Section,
  initialValues: CourseItem | null,
  onSave: (successMessage: string) => void,
  onFail: (errorMessage: string) => void
) => {
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);

  const {
    reset,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
    getValues,
  } = useForm<CourseItem>({
    resolver: yupResolver(courseItemSchema) as unknown as Resolver<CourseItem>,
    defaultValues: {
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      video: initialValues?.video
        ? { ...initialValues.video, duration_in_seconds: initialValues.duration_in_seconds }
        : null,
      resources: initialValues?.resources || undefined,
      is_preview: initialValues?.is_preview || false,
      position: initialValues?.position || '',
      section_id: section?.id,
      id: initialValues?.id || '',
      status: initialValues?.status || 'ACTIVE',
      previous_position: undefined,
    },
  });

  useEffect(() => {
    if (!initialValues) return;

    reset({
      title: initialValues.series[0].title || '',
      description: initialValues.series[0].description || '',
      video: initialValues.series[0].video
        ? {
            ...initialValues.series[0].video,
            duration_in_seconds: initialValues.series[0].duration_in_seconds,
          }
        : null,
      resources: initialValues.series[0].resources || undefined,
      is_preview: initialValues.series[0].is_preview || false,
      position: initialValues.position || '',
      section_id: section?.id,
      id: initialValues.id || '',
      status: initialValues.series[0].status,
      previous_position: undefined,
    });
  }, [initialValues?.id]);

  // const currentVideo = watch('video');

  // useEffect(() => {
  //   if (initialValues?.video?.video?.key) {
  //     setVideoPreview(process.env.NEXT_PUBLIC_BASE_URL_VIDEO + initialValues.video.video.key);
  //   }

  //   if (initialValues?.resources?.length) {
  //     const previews = initialValues.resources.map((resource) => ({
  //       name: resource.name,
  //       url: `${process.env.NEXT_PUBLIC_BASE_URL_DOCUMENT}${resource.resource_file.id}`,
  //     }));
  //     setDocumentPreviews(previews);
  //   }
  // }, [initialValues]);

  // useEffect(() => {
  //   if (currentVideo?.video?.key) {
  //     setVideoPreview(process.env.NEXT_PUBLIC_BASE_URL_VIDEO + currentVideo.video.key);
  //   }
  // }, [currentVideo]);

  const handleAddCourseItem = async (data: CourseItem) => {
    setSubmitting(true);
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
        previous_position: section.items?.length
          ? section.items[section.items.length - 1].position
          : null,
        id: initialValues?.id,
      };

      const response = await APIInitCourseItem(payload);
      if (response?.status === 201 || response?.status === 200) {
        onSave(`Bài giảng "${data.title}" đã được thêm thành công!`);
        // setCreatedItem(response.data);
      }
    } catch (error) {
      console.log('Error handling course item:', error);
      onFail('Không thể thêm bài giảng');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateCourseItem = async (data: CourseItem) => {
    setSubmitting(true);
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
        resources: data.resources || undefined,
        previous_position: undefined,
        id: initialValues?.id,
      };

      const response = await APIUpdateCourseItem(data.id, payload);
      if (response?.status === 200) {
        onSave(`Bài giảng "${data.title}" đã được cập nhật thành công!`);
        // setCreatedItem(response.data);
      }
    } catch (error) {
      console.log('Error handling course item:', error);
      onFail('Không thể cập nhật bài giảng');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVideoUpload = async (mediaVideo: MediaType, duration: number) => {
    const video: Partial<MediaType & { duration_in_seconds: number }> = {
      id: mediaVideo.id,
      duration_in_seconds: duration,
    };

    setValue('video', video as MediaType & { duration_in_seconds: number });
  };

  const handleVideoRemove = () => {
    setValue('video', initialValues?.video || null);
  };

  const handleUploadAndTrack = async (file: File) => {
    const fileId = `${file.name}-${Date.now()}`;
    setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }));

    try {
      const media = await uploadToMinIO(file, 'resource', 'resource_file', (progress) => {
        setUploadProgress((prev) => ({ ...prev, [fileId]: progress }));
      });

      const currentResources = getValues('resources') || [];
      if (currentResources.length >= MAX_RESOURCES) {
        return;
      }

      const updatedResources = [
        ...currentResources,
        {
          resource_file: { id: media.id },
          name: file.name.replace(/\.[^/.]+$/, ''),
        } as ResourceType,
      ];
      console.log(updatedResources);
      setValue('resources', updatedResources, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } catch (error) {
      console.error('Upload failed', error);
    } finally {
      setUploadProgress((prev) => {
        const newProgress = { ...prev };
        delete newProgress[fileId];
        return newProgress;
      });
    }
  };

  const handleRemoveResource = (indexToRemove: number) => {
    const currentResources = getValues('resources') || [];
    const newResources = currentResources.filter((_, index) => index !== indexToRemove);
    setValue('resources', newResources, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleChangeResourceName = (index: number, newName: string) => {
    const currentResources = getValues('resources') || [];
    const updated = [...currentResources];
    updated[index] = { ...updated[index], name: newName };
    setValue('resources', updated, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return {
    isDirty,
    control,
    watch,
    handleSubmit,
    handleAddCourseItem,
    handleUpdateCourseItem,
    handleVideoUpload,
    handleVideoRemove,
    handleUploadAndTrack,
    setValue,
    handleRemoveResource,
    handleChangeResourceName,
    reset,
    // videoPreview,
    // documentPreviews,
    uploadProgress,
    errors,
    MAX_RESOURCES,
    submitting,
  };
};
