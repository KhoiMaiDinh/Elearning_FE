'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useForm, Controller, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import InputRegisterLecture from '../inputComponent/inputRegisterLecture';
import TextAreaRegisterLecture from '../inputComponent/textAreaRegisterLecture';
import { Button } from '../ui/button';
import { RegisterLectureForm } from '@/types/registerLectureFormType';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/constants/store';
import { X } from 'lucide-react';
import { APIRegisterLecture } from '@/utils/lecture';
import { APIGetPresignedUrl } from '@/utils/storage';
import axios from 'axios';
import { APIGetCategory } from '@/utils/category';
import { Category } from '@/types/categoryType';
import SelectRegister from '../selectComponent/selectRegister';
import AlertSuccess from '../alert/AlertSuccess';
import AlertError from '../alert/AlertError';
import { setUser } from '@/constants/userSlice';
import RegisteredLecture from './registeredLecture';
// Schema validation với Yup
const schema = yup.object().shape({
  category: yup.object().shape({
    slug: yup.string().required('Lĩnh vực chuyên môn không được để trống'),
  }),
  biography: yup.string().required('Mô tả kinh nghiệm không được để trống'),
  certificates: yup
    .array()
    .of(
      yup.object().shape({
        key: yup.string().required('Key của chứng chỉ không được để trống'),
        id: yup.string().required('ID của chứng chỉ không được để trống'),
      })
    )
    .required('Bằng cấp/chứng chỉ không được để trống')
    .min(1, 'Bằng cấp/chứng chỉ không được để trống'),
  headline: yup.string().required('Tiêu đề không được để trống'),
  resume: yup
    .object()
    .shape({
      key: yup.string().required('Key của CV không được để trống'),
      id: yup.string().required('ID của CV không được để trống'),
    })
    .required('CV không được để trống'),
  website_url: yup.string().nullable(),
  facebook_url: yup.string().nullable(),
  linkedin_url: yup.string().nullable(),
}) as yup.ObjectSchema<RegisterLectureForm>;

const RegisterLecture = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    watch,
  } = useForm<RegisterLectureForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      category: {
        slug: '',
      },
      biography: '',
      headline: '',
      resume: { key: '', id: '' },
      website_url: null,
      certificates: [] as Array<{ key: string; id: string }>,

      facebook_url: null,
      linkedin_url: null,
    },
  });

  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);
  const [alertDescription, setAlertDescription] = useState('');
  const [category, setCategory] = useState<{ id: string; value: string }[]>([]);
  const [resumePreview, setResumePreview] = useState<{
    url: string;
    name: string;
    file?: File;
  } | null>(null);
  const [certificatePreviews, setCertificatePreviews] = useState<
    Array<{ url: string; name: string; file: File; key: string; id: string }>
  >([]);
  const certificateNames = watch('certificates');
  const resumeName = watch('resume');

  const categorySlug = watch('category.slug');

  const resumeInputRef = useRef<HTMLInputElement>(null);

  const certificateInputRef = useRef<HTMLInputElement>(null);

  // Validate lại khi category.slug thay đổi
  useEffect(() => {
    if (categorySlug) {
      trigger('category.slug');
    }
  }, [categorySlug, trigger]);

  // Validate lại khi resume thay đổi
  useEffect(() => {
    if (resumePreview?.file) {
      trigger('resume');
    }
  }, [resumePreview, trigger]);

  // Validate lại khi certificates thay đổi
  useEffect(() => {
    if (certificatePreviews.length > 0) {
      trigger('certificates');
    }
  }, [certificatePreviews, trigger]);

  // Xóa file certificate
  const removeCertificate = (index: number) => {
    const updatedPreviews = certificatePreviews.filter((_, i) => i !== index);
    setCertificatePreviews(updatedPreviews);
    setValue(
      'certificates',
      updatedPreviews.map((preview) => preview)
    );
    trigger('certificates');
    if (certificateInputRef.current) {
      certificateInputRef.current.value = ''; // Reset giá trị input file
    }
  };

  // Xóa file resume
  const removeResume = () => {
    setResumePreview(null);
    setValue('resume', { key: '', id: '' });
    trigger('resume');
    if (resumeInputRef.current) {
      resumeInputRef.current.value = ''; // Reset giá trị input file
    }
  };

  // Upload file lên MinIO bằng presigned URL với axios
  const uploadToMinIO = async (
    file: File,
    entity: string,
    entity_property: string
  ): Promise<{ key: string; id: string }> => {
    try {
      const presignedData = await APIGetPresignedUrl({
        filename: file.name,
        entity: entity, // Tên entity
        entity_property: entity_property, // Tên thuộc tính của entity
      });
      const { postURL, formData } = presignedData?.data?.result ?? {};
      const id = presignedData?.data?.id; // Lấy id từ API

      const uploadFormData = new FormData();
      // Thêm các field từ formData
      Object.entries(formData).forEach(([key, value]) => {
        uploadFormData.append(key, value as string);
      });
      uploadFormData.append('file', file);
      uploadFormData.append('id', id);

      const response = await axios.post(postURL, uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 204 || response.status === 200) {
        const key = uploadFormData.get('key');
        if (!key) throw new Error('Missing key in form data');
        return { key: key.toString(), id }; // Trả về cả key và id
      } else {
        throw new Error('Upload thất bại');
      }
    } catch (error) {
      console.error('Error uploading to MinIO:', error);
      throw error;
    }
  };

  const handleResumeChange = async (files: FileList) => {
    const file = files[0];
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        setResumePreview({
          url: e.target?.result as string,
          name: file.name,
          file: file,
        });
      };
      reader.readAsDataURL(file);

      // Upload file và lấy cả key và id
      const { key, id } = await uploadToMinIO(file, 'instructor', 'resume');
      // Lưu cả key và id vào form
      setValue('resume', { key, id }); // Lưu dưới dạng chuỗi JSON
      trigger('resume');
    } catch (error) {
      console.log(error);
      setAlertDescription('Không thể upload CV');
      setShowAlertError(true);
      setTimeout(() => setShowAlertError(false), 3000);
    }
  };

  const handleCertificatesChange = async (files: FileList) => {
    const fileArray = Array.from(files);
    const currentCertificates = [...(certificateNames || [])];

    for (const file of fileArray) {
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const { key, id } = await uploadToMinIO(file, 'certificate', 'certificate_file');
          // Thêm object chứa key và id vào mảng certificates
          currentCertificates.push({ key, id });
          setValue('certificates', currentCertificates);
          setCertificatePreviews((prev) => [
            ...prev,
            {
              url: e.target?.result as string,
              name: file.name,
              file: file,
              key: key,
              id: id,
            },
          ]);
          trigger('certificates');
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.log(error);
        setAlertDescription('Không thể upload chứng chỉ');
        setShowAlertError(true);
        setTimeout(() => setShowAlertError(false), 3000);
        return;
      }
    }
  };

  const handleGetCategory = async () => {
    const response = await APIGetCategory({ language: 'vi' });
    if (response?.status === 200) {
      const data = response?.data?.map((item: Category) => ({
        id: item.slug,
        value: item?.translations[0]?.name,
      }));
      setCategory(data);
    }
  };

  const handleRegisterLecture = async (data: FieldValues) => {
    setLoading(true);
    try {
      const response = await APIRegisterLecture(data);
      if (response?.status === 200) {
        setAlertDescription('Đăng ký thành công');
        setShowAlertSuccess(true);
        setLoading(false);

        dispatch(
          setUser({
            ...userInfo,
            instructor_profile: response?.data,
          })
        );
        setTimeout(() => {
          setShowAlertSuccess(false);
        }, 3000);
      } else {
        setAlertDescription('Đăng ký thất bại');
        setShowAlertError(true);
        setTimeout(() => {
          setShowAlertError(false);
        }, 3000);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      setAlertDescription('Đăng ký thất bại');
      setShowAlertError(true);
      setTimeout(() => {
        setShowAlertError(false);
      }, 3000);
      setLoading(false);
    }
  };

  const onSubmit = async (data: FieldValues) => {
    if (!resumeName || certificateNames.length === 0) {
      if (!resumeName) {
        setAlertDescription('Vui lòng upload CV');
        setShowAlertError(true);
        setTimeout(() => setShowAlertError(false), 3000);
      }
      if (certificateNames.length === 0) {
        setAlertDescription('Vui lòng upload ít nhất một chứng chỉ');
        setShowAlertError(true);
        setTimeout(() => setShowAlertError(false), 3000);
      }
      return;
    }

    setLoading(true);
    try {
      const dataSubmit = {
        ...data,
        website_url: data.website_url || null,
        facebook_url: data.facebook_url || null,
        linkedin_url: data.linkedin_url || null,
      };

      await handleRegisterLecture(dataSubmit);
    } catch (error) {
      console.log(error);
      setAlertDescription('Đăng ký thất bại');
      setShowAlertError(true);
      setTimeout(() => setShowAlertError(false), 3000);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetCategory();
  }, []);

  return !userInfo.instructor_profile ? (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full h-full gap-2 flex flex-col ">
      {/* Thông tin cá nhân */}
      <div className="bg-white dark:bg-black50 shadow-md rounded-lg p-3 border">
        <p className="text-[16px] font-sans font-medium text-black dark:text-AntiFlashWhite">
          Thông tin cá nhân
        </p>
        <div className="grid lg:grid-cols-2 grid-cols-1 md:grid-cols-2 w-full p-3 gap-3">
          <InputRegisterLecture
            labelText="Họ và tên"
            value={userInfo?.first_name + ' ' + userInfo?.last_name}
            disabled={true}
          />
          <InputRegisterLecture labelText="Email" value={userInfo?.email} disabled={true} />
        </div>
      </div>

      {/* Thông tin chuyên môn */}
      <div className="bg-white dark:bg-black50 shadow-md rounded-lg p-3 border">
        <p className="text-[16px] font-sans font-medium text-black dark:text-AntiFlashWhite">
          Thông tin chuyên môn
        </p>
        <div className="grid w-full p-3 gap-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Controller
              name="category.slug"
              control={control}
              render={({ field }) => (
                <SelectRegister
                  {...field}
                  label="Lĩnh vực chuyên môn"
                  error={errors.category?.slug?.message}
                  data={category}
                  onValueChange={(e) => {
                    setValue('category.slug', e);
                    trigger('category.slug');
                  }}
                />
              )}
            />

            <Controller
              name="headline"
              control={control}
              render={({ field }) => (
                <InputRegisterLecture
                  {...field}
                  labelText="Tiêu đề"
                  error={errors.headline?.message}
                />
              )}
            />
            <Controller
              name="resume"
              control={control}
              render={({ field }) => (
                <div>
                  <div className="flex items-center gap-2">
                    <InputRegisterLecture
                      {...field}
                      type="file"
                      accept=".pdf"
                      labelText="CV (PDF)"
                      error={errors.resume?.message}
                      onChange={(e) => {
                        const files = (e.target as HTMLInputElement).files;
                        if (files?.length) {
                          handleResumeChange(files);
                        }
                      }}
                    />
                    {resumePreview && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-redPigment hover:bg-redPigment/10"
                        onClick={removeResume}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  {resumePreview && (
                    <div className="mt-2 border rounded p-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">{resumePreview.name}</span>
                      </div>
                      <iframe
                        src={resumePreview.url}
                        className="md:w-1/2 w-full md:h-[200px] h-[100px]  rounded"
                        title="CV Preview"
                      />
                    </div>
                  )}
                </div>
              )}
            />
            <Controller
              name="website_url"
              control={control}
              render={({ field }) => (
                <InputRegisterLecture
                  {...field}
                  labelText="Website"
                  error={errors.website_url?.message}
                />
              )}
            />
            <Controller
              name="facebook_url"
              control={control}
              render={({ field }) => (
                <InputRegisterLecture
                  {...field}
                  labelText="Facebook"
                  error={errors.facebook_url?.message}
                />
              )}
            />
            <Controller
              name="linkedin_url"
              control={control}
              render={({ field }) => (
                <InputRegisterLecture
                  {...field}
                  labelText="Linkedin"
                  error={errors.linkedin_url?.message}
                />
              )}
            />
          </div>

          <Controller
            name="biography"
            control={control}
            render={({ field }) => (
              <TextAreaRegisterLecture
                {...field}
                labelText="Mô tả kinh nghiệm"
                error={errors.biography?.message}
                className="min-h-[180px]"
              />
            )}
          />

          <Controller
            name="certificates"
            control={control}
            render={({ field }) => (
              <div>
                <InputRegisterLecture
                  {...field}
                  labelText="Chứng chỉ/bằng cấp (PDF)"
                  type="file"
                  accept=".pdf"
                  multiple
                  error={errors.certificates?.message}
                  onChange={(e) => {
                    const files = (e.target as HTMLInputElement).files;
                    if (files?.length) {
                      handleCertificatesChange(files);
                    }
                  }}
                />
                {certificatePreviews.length > 0 && (
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {certificatePreviews.map((preview, index) => (
                      <div key={index} className="relative border rounded p-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600 truncate max-w-[150px]">
                            {preview.name}
                          </span>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:bg-red-100"
                              onClick={() => removeCertificate(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <iframe
                          src={preview.url}
                          className="w-full md:h-[400px] h-[100px]  rounded"
                          title={`Certificate ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          />
        </div>
      </div>

      <div className="w-full h-full items-center justify-center flex p-4">
        <Button
          type="submit"
          className="w-32 bg-custom-gradient-button-violet  dark:shadow-majorelleBlue50 dark:shadow-md text-white hover:bg-majorelleBlue70 rounded-md font-sans font-medium text-[16px] p-2"
        >
          {loading ? 'Đang gửi...' : 'Gửi xét duyệt'}
        </Button>
      </div>
      {showAlertSuccess && <AlertSuccess description={alertDescription} />}
      {showAlertError && <AlertError description={alertDescription} />}
    </form>
  ) : (
    <RegisteredLecture />
  );
};

export default RegisterLecture;
