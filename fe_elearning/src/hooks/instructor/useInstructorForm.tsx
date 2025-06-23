import { useEffect, useRef, useState, useCallback } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/constants/store';
import { RegisterInstructorForm } from '@/types/instructorType';
import * as yup from 'yup';
import { uploadToMinIO } from '@/utils/storage';
import { APIRegisterInstructor, APIUpdateInstructor } from '@/utils/instructor';
import { setUser } from '@/constants/userSlice';
import { stripHtml } from '@/helpers';
import { MediaType } from '@/types/mediaType';

const MAX_CERTIFICATES = 5;
const schema = yup.object().shape({
  category: yup.object().shape({
    slug: yup.string().required('Lĩnh vực chuyên môn không được để trống'),
  }),
  biography: yup
    .string()
    .test('min-text-length', 'Mô tả kinh nghiệm không được để trống', (value) => {
      const textOnly = stripHtml(value || '');
      return textOnly.length > 0;
    })
    .test('max-text-length', 'Mô tả kinh nghiệm không được vượt quá 1000 ký tự', (value) => {
      const textOnly = stripHtml(value || '');
      return textOnly.length <= 1000;
    }),
  certificates: yup
    .array()
    .of(
      yup.object().shape({
        key: yup.string().required('Key của chứng chỉ không được để trống'),
        id: yup.string().required('ID của chứng chỉ không được để trống'),
      })
    )
    .required('Bằng cấp/chứng chỉ không được để trống')
    .min(1, 'Bằng cấp/chứng chỉ không được để trống')
    .max(MAX_CERTIFICATES, `Chỉ được phép upload tối đa ${MAX_CERTIFICATES} chứng chỉ`),
  headline: yup.string().required('Tiêu đề không được để trống'),
  resume: yup
    .object({
      id: yup.string().required('ID của CV không được để trống'),
      key: yup.string().required('Key của CV không được để trống'),
    })
    .test('not-empty', 'CV không được để trống', function (value) {
      return !!value?.id?.trim() && !!value?.key?.trim();
    })
    .required('CV không được để trống'),
  website_url: yup.string().nullable().notRequired().url('URL không hợp lệ'),
  facebook_url: yup
    .string()
    .nullable()
    .notRequired()
    .url('URL không hợp lệ')
    .test(
      'is-facebook-url',
      'Liên kết Facebook phải thuộc tên miền facebook.com',
      (value) => !value || /^https?:\/\/(www\.)?facebook\.com\/.+/i.test(value)
    ),
  linkedin_url: yup
    .string()
    .nullable()
    .notRequired()
    .url('URL không hợp lệ')
    .test(
      'is-linkedin-url',
      'Liên kết LinkedIn phải thuộc tên miền linkedin.com',
      (value) => !value || /^https?:\/\/(www\.)?linkedin\.com\/.+/i.test(value)
    ),
  user: yup
    .object()
    .shape({
      first_name: yup.string().required('Họ không được để trống'),
      last_name: yup.string().required('Tên không được để trống'),
    })
    .required('Thông tin cá nhân không được để trống'),
}) as yup.ObjectSchema<RegisterInstructorForm>;

export const useInstructorForm = (
  initialValues: RegisterInstructorForm | null,
  onSave: (successMessage: string) => void,
  onFail: (errorMessage: string) => void
) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  const initialFormValues: RegisterInstructorForm = {
    category: userInfo?.instructor_profile?.category || { slug: '' },
    biography: userInfo?.instructor_profile?.biography || '',
    headline: userInfo?.instructor_profile?.headline || '',
    resume: userInfo?.instructor_profile?.resume || { key: '', id: '' },
    certificates:
      userInfo?.instructor_profile?.certificates?.map(
        (certificate: any) => certificate.certificate_file
      ) || [],
    website_url: null,
    facebook_url: userInfo?.instructor_profile?.facebook_url || null,
    linkedin_url: userInfo?.instructor_profile?.linkedin_url || null,
    user: {
      first_name: userInfo?.first_name || '',
      last_name: userInfo?.last_name || '',
    },
  };

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors, isDirty },
    setValue,
    trigger,
    watch,
  } = useForm<RegisterInstructorForm>({
    resolver: yupResolver(schema),
    defaultValues: initialFormValues,
  });

  const [loading, setLoading] = useState(false);
  const [resumeUploadProgress, setResumeUploadProgress] = useState<number | null>(null);
  const [certificateUploadProgress, setCertificateUploadProgress] = useState<
    Record<string, number>
  >({});
  const [certificatePreviews, setCertificatePreviews] = useState<
    Array<{ url: string; name: string; file: File; key: string; id: string }>
  >([]);

  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const resume = watch('resume');
  const certificates = watch('certificates');
  const categorySlug = watch('category.slug');
  const certificateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (categorySlug) trigger('category.slug');
  }, [categorySlug, trigger]);

  useEffect(() => {
    if (resume.id !== '') trigger('resume');
  }, [resume, trigger]);

  useEffect(() => {
    if (certificates.length > 0) trigger('certificates');
  }, [certificates, trigger]);

  const handleSelectSpecialty = (val: string) => {
    setValue('category.slug', val);
    trigger('category.slug');
  };

  const handleUploadResume = async (file: File) => {
    setResumeUploadProgress(0);
    try {
      const media = await uploadToMinIO(file, 'instructor', 'resume', setResumeUploadProgress);
      setValue('resume', { id: media.id, key: media.key });
    } catch {
      setAlert({ type: 'error', message: 'Không thể upload CV' });
    } finally {
      setResumeUploadProgress(null);
    }
  };

  const handleUploadCertificate = async (file: File) => {
    const fileId = `${file.name}-${Date.now()}`;
    setCertificateUploadProgress((prev) => ({ ...prev, [fileId]: 0 }));
    try {
      const media = await uploadToMinIO(file, 'certificate', 'certificate_file', (progress) => {
        setCertificateUploadProgress((prev) => ({ ...prev, [fileId]: progress }));
      });
      const current = getValues('certificates') || [];
      setValue('certificates', [...current, { id: media.id, key: media.key }]);
    } catch {
      setAlert({ type: 'error', message: 'Không thể upload chứng chỉ' });
    } finally {
      setCertificateUploadProgress((prev) => {
        const updated = { ...prev };
        delete updated[fileId];
        return updated;
      });
    }
  };

  const removeCertificate = (index: number) => {
    const updatedPreviews = certificatePreviews.filter((_, i) => i !== index);
    setCertificatePreviews(updatedPreviews);
    setValue(
      'certificates',
      updatedPreviews.map((preview) => preview)
    );
    trigger('certificates');
    if (certificateInputRef.current) certificateInputRef.current.value = '';
  };

  const handleRegisterInstructor = async (data: FieldValues) => {
    setLoading(true);
    try {
      const response = await APIRegisterInstructor(data);
      if (response?.status === 201) {
        onSave('Đăng ký thành công');
        setLoading(false);

        setTimeout(() => {
          dispatch(
            setUser({
              ...userInfo,
              instructor_profile: response?.data,
            })
          );
        }, 3000);
      } else {
        onFail('Đăng ký thất bại');
        setLoading(false);
      }
    } catch (err) {
      onFail('Đăng ký thất bại');
      setLoading(false);
    }
  };

  const handleUpdateInstructor = async (data: FieldValues) => {
    setLoading(true);
    try {
      const response = await APIUpdateInstructor(userInfo.username, data);
      if (response?.status === 200) {
        onSave('Cập nhật thành công');
        setLoading(false);

        setTimeout(() => {
          dispatch(
            setUser({
              ...userInfo,
              instructor_profile: response?.data,
            })
          );
        }, 3000);
      } else {
        onFail('Cập nhật thất bại');
        setLoading(false);
      }
    } catch (err) {
      onFail('Cập nhật thất bại');
      setLoading(false);
    }
  };

  return {
    MAX_CERTIFICATES,
    isDirty,
    watch,
    control,
    errors,
    loading,
    alert,
    certificateUploadProgress,
    certificatePreviews,
    certificateInputRef,
    resumeUploadProgress,
    handleSubmit,
    handleSelectSpecialty,
    handleUploadResume,
    handleUploadCertificate,
    handleRegisterInstructor,
    handleUpdateInstructor,
    removeCertificate,
    setCertificatePreviews,
  };
};
