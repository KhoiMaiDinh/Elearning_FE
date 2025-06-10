import { useForm, useFieldArray, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo } from 'react';
import { CourseForm } from '@/types/courseType';
import * as yup from 'yup';
import { CourseLevel } from '@/constants/courseLevel';
import _ from 'lodash';

export const courseBasicSchema = yup.object().shape({
  title: yup.string().required('Tiêu đề khóa học không được để trống'),
  subtitle: yup.string().required('Mô tả ngắn không được để trống'),
  description: yup.string().required(),
  level: yup.string().oneOf(Object.values(CourseLevel)).required('Cấp độ không được để trống'),
  price: yup
    .number()
    .required('Giá không được để trống')
    .typeError('Giá phải là một số')
    .integer('Giá phải là số nguyên')
    .positive('Giá phải lớn hơn 0'),
  thumbnail: yup
    .object()
    .shape({
      id: yup.string().required(),
      key: yup.string().required(),
    })
    .nullable(),
  category: yup.object().shape({
    slug: yup.string().required('Lĩnh vực không được để trống'),
  }),
  requirements: yup
    .array()
    .of(yup.string().min(1, 'Ít nhất một ký tự').max(160, 'Tối đa 160 ký tự'))
    .required('Bạn phải nhập ít nhất một yêu cầu trước khóa học'),

  outcomes: yup
    .array()
    .of(yup.string().min(1, 'Ít nhất một ký tự').max(160, 'Tối đa 160 ký tự'))
    .required('Bạn phải nhập ít nhất một kết quả đạt được'),
});

export function useCourseForm(courseInfo?: CourseForm) {
  console.log('courseInfo', courseInfo);
  const initValues = {
    category: { slug: courseInfo?.category?.slug || '' },
    title: courseInfo?.title || '',
    subtitle: courseInfo?.subtitle || '',
    description: courseInfo?.description || '',
    level: courseInfo?.level || '',
    price: courseInfo?.price || 0,
    thumbnail: courseInfo?.thumbnail || null,
    outcomes: courseInfo?.outcomes || [],
    requirements: courseInfo?.requirements || [],
  };

  const {
    control,
    watch,
    setValue,
    getValues,
    formState: { errors, isDirty },
    handleSubmit,
  } = useForm<CourseForm>({
    resolver: yupResolver(courseBasicSchema) as unknown as Resolver<CourseForm>,
    defaultValues: initValues,
  });

  const {
    fields: requirementFields,
    append: appendRequirements,
    remove: removeRequirements,
  } = useFieldArray({
    control,
    name: 'requirements' as any,
  });

  const {
    fields: outcomeFields,
    append: appendOutcomes,
    remove: removeOutcomes,
  } = useFieldArray({
    control,
    name: 'outcomes' as any,
  });

  const values = watch();

  const hasFormChanged = useMemo(() => {
    if (!courseInfo) return true;
    const current = getValues();
    return !_.isEqual(current, courseInfo);
  }, [courseInfo, getValues]);

  return {
    control,
    errors,
    isDirty,
    values,
    hasFormChanged,
    requirementFields,
    outcomeFields,
    handleSubmit,
    watch,
    appendRequirements,
    removeRequirements,
    appendOutcomes,
    removeOutcomes,
    setValue,
  };
}
