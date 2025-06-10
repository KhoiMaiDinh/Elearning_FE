'use client';
import React, { useState } from 'react';
import { useForm, Controller, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/constants/store';
import { setCourse } from '@/constants/course';
import InputRegisterLecture from '@/components/inputComponent/inputRegisterLecture';
import TextAreaRegisterLecture from '@/components/inputComponent/textAreaRegisterLecture';
import { Button } from '@/components/ui/button';
import { APIInitSection, APIUpdateSection, APIGetFullCourse } from '@/utils/course';
import { Section } from '@/types/courseType';
import ToastNotify from '../ToastNotify/toastNotify';
import { toast, ToastContainer } from 'react-toastify';
import { styleSuccess } from '../ToastNotify/toastNotifyStyle';
import { styleError } from '../ToastNotify/toastNotifyStyle';
import { useTheme } from 'next-themes';

const sectionSchema = yup.object().shape({
  title: yup.string().required('Tiêu đề phần không được để trống'),
  description: yup.string().required(),
  position: yup.string().required('Thứ tự phần không được để trống'),
});

interface SectionFormProps {
  section: Section;
  onSave: (data: Section) => void;
  onCancel: () => void;
  courseId: string;
}

const SectionForm: React.FC<SectionFormProps> = ({ section, onSave, onCancel, courseId }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Section>({
    resolver: yupResolver(sectionSchema) as unknown as Resolver<Section>,
    defaultValues: {
      title: section.title || '',
      description: section.description || '',
      position: section.position || '',
    },
  });

  const sections = useSelector((state: RootState) => state.course.courseInfo?.sections || []);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isNewSection = !section.id;

  const handleGetCourseInfo = async () => {
    try {
      const response = await APIGetFullCourse(courseId);
      if (response?.status === 200) {
        dispatch(setCourse(response.data));
      }
    } catch (error) {
      console.error('Error fetching course details:', error);
    }
  };

  const handleCreateSection = async (data: Section) => {
    try {
      const payload = {
        title: data.title,
        description: data.description,
        course: { id: courseId },
        previous_section_id:
          sections.length > 0 && sections[sections.length - 1].id
            ? sections[sections.length - 1].id
            : null,
      };
      const response = await APIInitSection(payload);
      if (response?.status === 201) {
        const newSection: Section = {
          ...section,
          id: response.data.id,
          title: data.title,
          description: data.description,
          position: section.position,
          items: [],
        };
        onSave(newSection);
        toast.success(<ToastNotify status={1} message="Tạo phần bài giảng thành công" />, {
          style: styleSuccess,
        });
        await handleGetCourseInfo();
      }
    } catch (error) {
      console.error('Error creating section:', error);
      toast.error(<ToastNotify status={-1} message="Không thể tạo phần bài giảng" />, {
        style: styleError,
      });
      throw error;
    }
  };

  const handleUpdateSection = async (data: Section) => {
    try {
      const response = await APIUpdateSection(section.id || '', {
        title: data.title,
        description: data.description,
      });
      if (response?.status === 200) {
        const updatedSection: Section = {
          ...section,
          title: data.title,
          description: data.description,
        };
        onSave(updatedSection);
        await handleGetCourseInfo();
      }
    } catch (error) {
      console.error('Error updating section:', error);
      toast.error(<ToastNotify status={-1} message="Không thể cập nhật phần bài giảng" />, {
        style: styleError,
      });
      throw error;
    }
  };

  const onSubmit = async (data: Section) => {
    if (isNewSection) {
      await handleCreateSection(data);
    } else {
      await handleUpdateSection(data);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <InputRegisterLecture
              {...field}
              labelText={`Tiêu đề phần ${section.position}`}
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
              labelText={`Mô tả phần ${section.position}`}
              error={errors.description?.message}
              onChange={(e) => field.onChange(e)}
            />
          )}
        />
        <div className="flex gap-2">
          <Button
            type="submit"
            className="bg-custom-gradient-button-violet dark:bg-custom-gradient-button-blue hover:brightness-110 text-white"
          >
            {isNewSection ? '💡Tạo mới' : '💡Cập nhật'}
          </Button>
          <Button
            type="button"
            className="w-32 bg-custom-gradient-button-red text-white  hover:brightness-125 rounded-md font-sans font-medium text-[16px] p-2"
            onClick={onCancel}
          >
            Hủy
          </Button>
        </div>
      </form>
    </>
  );
};

export default SectionForm;
