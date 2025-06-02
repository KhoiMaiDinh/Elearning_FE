import { useForm, Resolver } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { APIInitSection, APIUpdateSection } from '@/utils/course';
import { CourseForm, Section } from '@/types/courseType';
import { useEffect, useState } from 'react';

export const sectionSchema = yup.object({
  id: yup.string().nullable(),
  title: yup.string().required('Tiêu đề phần không được để trống'),
  previous_section_id: yup.string().nullable().optional(),
  course: yup
    .object({
      id: yup.string().required(),
    })
    .optional(),
  description: yup.string().nullable(),
});

type SectionForm = {
  id: string | null;
  title: string;
  description: string | null;
  previous_section_id?: string;
  course?: { id: string };
};

export const useSectionForm = (
  course: CourseForm,
  initialValues: Section | null,
  onSave: (successMessage: string) => void,
  onFail: (errorMessage: string) => void
) => {
  const formMethods = useForm<SectionForm>({
    resolver: yupResolver(sectionSchema) as Resolver<SectionForm>,
    defaultValues: {
      id: initialValues?.id || null,
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      previous_section_id:
        course?.sections && course.sections.length > 0
          ? course.sections[course.sections.length - 1].id
          : undefined,
      course: { id: course.id },
    },
  });

  useEffect(() => {
    formMethods.reset({
      id: initialValues?.id || null,
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      previous_section_id:
        course?.sections && course.sections.length > 0
          ? course.sections[course.sections.length - 1].id
          : undefined,
      course: { id: course.id },
    });
  }, [initialValues, course]);

  const [submitting, setSubmitting] = useState(false);

  const handleCreateSection = async (data: SectionForm) => {
    setSubmitting(true);
    const payload = {
      title: data.title,
      description: data.description?.length === 0 ? null : data.description,
      course: data.course,
      previous_section_id: data.previous_section_id,
    };
    console.log('payload', payload);
    try {
      const response = await APIInitSection(payload);
      if (response?.status === 201) {
        onSave(`Tạo chương ${data.title} thành công`);
      }
    } catch (error) {
      console.log('Error creating section:', error);
      onFail('Không thể tạo chương mới');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateSection = async (data: SectionForm) => {
    setSubmitting(true);
    const payload = {
      title: data.title,
      description: data.description?.length === 0 ? null : data.description,
      previous_section_id: undefined,
    };
    try {
      const response = await APIUpdateSection(data.id!, payload);
      if (response?.status === 200) {
        onSave(`Cập nhật chương ${data.title}thành công`);
      }
    } catch (error) {
      console.log('Error updating section:', error);
      onFail('Không thể cập nhật chương');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    formMethods,
    submitting,
    handleCreateSection,
    handleUpdateSection,
  };
};
