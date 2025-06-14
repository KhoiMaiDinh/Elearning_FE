'use client';
import React, { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import InputRegisterLecture from '../inputComponent/inputRegisterLecture';
import TextAreaRegisterLecture from '../inputComponent/textAreaRegisterLecture';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import { RootState } from '@/constants/store';
import { Facebook, FileCheck, Globe, Linkedin, Trash2Icon } from 'lucide-react';
import { APIGetCategory } from '@/utils/category';
import { Category } from '@/types/categoryType';
import SelectRegister from '../selectComponent/selectRegister';
import RegisteredLecture, { TABS } from './registeredLecture';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import FilesPicker from '../inputComponent/filesPicker';
import Asterisk from '../asterisk/asterisk';
import { useInstructorForm } from '@/hooks/instructor/useInstructorForm';
import ToastNotify from '../ToastNotify/toastNotify';
import { toast, ToastContainer } from 'react-toastify';
import { styleSuccess } from '../ToastNotify/toastNotifyStyle';
import { styleError } from '../ToastNotify/toastNotifyStyle';
import { useTheme } from 'next-themes';

type Props = {
  mode: 'create' | 'update';
};

const UpsertInstructor: React.FC<Props> = ({ mode }) => {
  const theme = useTheme();
  const onSave = () => {
    toast.success(<ToastNotify status={1} message="Thêm tài khoản thành công" />, {
      style: styleSuccess,
    });
  };

  const onFail = () => {
    toast.error(<ToastNotify status={-1} message="Thêm tài khoản thất bại" />, {
      style: styleError,
    });
  };

  const {
    MAX_CERTIFICATES,
    isDirty,
    control,
    errors,
    loading,
    watch,
    handleSubmit,
    handleSelectSpecialty,
    handleUploadResume,
    handleUploadCertificate,
    handleRegisterInstructor,
    handleUpdateInstructor,
    removeCertificate,
    certificateUploadProgress,
    resumeUploadProgress,
  } = useInstructorForm(null, onSave, onFail);

  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const [category, setCategory] = useState<{ id: string; value: string }[]>([]);
  const [isViewMode, setViewMode] = useState(true);

  const resume = watch('resume');
  const certificates = watch('certificates');

  const pageDisabled = React.useCallback(
    () => loading || (isViewMode && mode == 'update'),
    [loading, isViewMode, mode]
  );

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

  const handdlePresssView = () => {
    const currentViewMode = isViewMode;
    setViewMode(!currentViewMode);
    if (currentViewMode) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 500);
    }
  };

  useEffect(() => {
    handleGetCategory();
  }, []);

  const inputClassName = 'dark:bg-gray-900 dark:border-gray-600 dark:border rounded-md';

  return (
    <>
      <div className=" px-6 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-majorelleBlue">
          {mode === 'create' ? 'Tạo Hồ sơ' : isViewMode ? 'Hồ sơ' : 'Cập nhật hồ sơ'}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6 ">
            {/* Personal Information */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white tracking-wide">Thông tin cá nhân</CardTitle>
              </CardHeader>
              <CardContent>
                <InputRegisterLecture
                  labelText="Email"
                  value={userInfo?.email}
                  disabled={true}
                  inputClassName={inputClassName}
                />
                <div className="flex gap-4">
                  <Controller
                    name="user.last_name"
                    control={control}
                    render={({ field }) => (
                      <InputRegisterLecture
                        {...field}
                        labelText="Họ và Đệm"
                        disabled={mode == 'create' || pageDisabled()}
                        inputClassName={inputClassName}
                        error={errors.user?.last_name?.message}
                        isRequired
                      />
                    )}
                  />
                  <Controller
                    name="user.first_name"
                    control={control}
                    render={({ field }) => (
                      <InputRegisterLecture
                        {...field}
                        labelText="Tên"
                        disabled={mode == 'create' || pageDisabled()}
                        inputClassName={inputClassName}
                        error={errors.user?.first_name?.message}
                        isRequired
                      />
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-black dark:text-white tracking-wide">
                  Thông tin chuyên môn
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Controller
                  name="headline"
                  control={control}
                  render={({ field }) => (
                    <InputRegisterLecture
                      {...field}
                      labelText="Chức danh chuyên môn"
                      error={errors.headline?.message}
                      isRequired={true}
                      placeholder="e.g . Senior Web Developer"
                      inputClassName={inputClassName}
                      maxLength={60}
                      disabled={pageDisabled()}
                    />
                  )}
                />
                <div>
                  <Controller
                    name="category.slug"
                    control={control}
                    render={({ field }) => (
                      <SelectRegister
                        {...field}
                        label="Lĩnh vực chuyên môn"
                        error={errors.category?.slug?.message}
                        data={category}
                        onValueChange={handleSelectSpecialty}
                        placeholder="--Chọn lĩnh vực chuyên môn--"
                        isRequired={true}
                        inputClassName={'dark:bg-gray-900 dark:border-gray-700'}
                        disabled={pageDisabled()}
                      />
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* CV Upload */}
            <Card className="dark:bg-gray-800 dark:border-gray-700 ">
              <CardHeader>
                <CardTitle className="dark:text-white tracking-wide">
                  Chứng chỉ, bằng cấp (PDF) <Asterisk />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-1 flex-col self-start">
                  <FilesPicker
                    dropzoneClassName="dark:bg-gray-800"
                    boxLabel="Chọn chứng chỉ, bằng cấp"
                    onChange={handleUploadCertificate}
                    disabled={certificates.length >= MAX_CERTIFICATES || pageDisabled()}
                    loading={Object.keys(certificateUploadProgress).length > 0}
                    error={errors.certificates?.message}
                    acceptedExtensions={['.pdf']}
                    maxSize={5 * 1024 * 1024}
                  />

                  <div className="grid gap-0 p-0 overflow-y-auto relative">
                    <div className="text-[10px] text-muted-foreground text-end">
                      Tối đa: {certificates.length}/{MAX_CERTIFICATES} file
                    </div>
                    <div className="gap-3 grid">
                      {certificates &&
                        certificates.length > 0 &&
                        certificates.map((certificate, index) => (
                          <div
                            className="overflow-hidden rounded-md p-0 shadow-sm w-full flex flex-row items-center border pt-1 gap-2 border-black/40 dark:border-white"
                            key={certificate.id}
                          >
                            <div className="flex items-center justify-between w-full rounded-md gap-2 px-3">
                              <div className="flex items-center gap-2">
                                <FileCheck className="w-4 h-4 text-black dark:text-white" />
                                <p>Bằng cấp số {index + 1}</p>
                              </div>

                              <Button
                                variant="ghost"
                                className="hover:text-destructive"
                                onClick={() => removeCertificate(index)}
                                disabled={pageDisabled()}
                              >
                                <Trash2Icon className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white tracking-wide">Mạng xã hội</CardTitle>
              </CardHeader>
              <CardContent className="">
                <Controller
                  name="facebook_url"
                  control={control}
                  render={({ field }) => (
                    <InputRegisterLecture
                      {...field}
                      labelText="Facebook"
                      placeholder="https://www.facebook.com/sample-id"
                      error={errors.facebook_url?.message}
                      inputClassName={inputClassName}
                      icon={Facebook}
                      iconColor="text-blue-500"
                      disabled={pageDisabled()}
                    />
                  )}
                />
                <Controller
                  name="website_url"
                  control={control}
                  render={({ field }) => (
                    <InputRegisterLecture
                      {...field}
                      labelText="Website của bạn"
                      placeholder="https://www.your-website.com"
                      error={errors.website_url?.message}
                      inputClassName={inputClassName}
                      icon={Globe}
                      iconColor="text-greenCrayola"
                      disabled={pageDisabled()}
                    />
                  )}
                />
                <Controller
                  name="linkedin_url"
                  control={control}
                  render={({ field }) => (
                    <InputRegisterLecture
                      {...field}
                      labelText="LinkedIn"
                      placeholder="https://www.linkedin.com/in/sample-id"
                      error={errors.linkedin_url?.message}
                      inputClassName={inputClassName}
                      icon={Linkedin}
                      iconColor="text-blue-400"
                      disabled={pageDisabled()}
                    />
                  )}
                />
              </CardContent>
            </Card>

            {/* Experience Description */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">
                  Mô tả kinh nghiệm <Asterisk />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Controller
                  name="biography"
                  control={control}
                  render={({ field }) => (
                    <TextAreaRegisterLecture
                      {...field}
                      error={errors.biography?.message}
                      className="min-h-[180px] max-h-[280px] "
                      disabled={pageDisabled()}
                    />
                  )}
                />
              </CardContent>
            </Card>

            {/* Certificates Upload - Modified to allow 5 files */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">
                  Resume (PDF) <Asterisk />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-1 flex-col self-start">
                  <FilesPicker
                    dropzoneClassName="dark:bg-gray-800"
                    boxLabel="Chọn resume"
                    onChange={handleUploadResume}
                    disabled={resume.id !== '' || pageDisabled()}
                    loading={resumeUploadProgress != null}
                    error={errors.resume?.message}
                    acceptedExtensions={['.pdf']}
                    maxSize={5 * 1024 * 1024}
                  />

                  <div className="grid gap-0 p-0 max-h-20 overflow-y-auto relative">
                    <div className="text-[10px] text-muted-foreground text-end">
                      Resume: {resume?.id ? 1 : 0}/1 file
                    </div>
                    <div className="gap-3 grid">
                      {resume.id && (
                        <div
                          className="overflow-hidden rounded-md p-0 shadow-sm w-full flex flex-row items-center border pt-1 gap-2 border-black/40 dark:border-white"
                          key={resume.id}
                        >
                          <div className="flex items-center justify-between w-full rounded-md gap-2 px-3 py-2">
                            <div className="flex items-center gap-2">
                              <FileCheck className="w-4 h-4 text-black dark:text-white" />
                              <p>CV/ Resume</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-8 gap-2">
          {mode == 'update' && (
            <Button
              disabled={loading}
              onClick={handdlePresssView}
              className={` shadow-majorelleBlue50 shadow-md text-white hover:brightness-110 rounded-md font-sans font-medium text-[13px] px-8 py-2.5 transition-all duration-300 w-32 ${
                isViewMode
                  ? loading
                    ? 'translate-x-[calc(50%+16px)] bg-custom-gradient-button-violet hover:bg-custom-gradient-button-violet shadow-majorelleBlue50'
                    : 'translate-x-[calc(50%+16px)] bg-majorelleBlue hover:bg-majorelleBlue shadow-majorelleBlue50'
                  : 'bg-redPigment hover:bg-redPigment shadow-redPigment/50'
              }`}
            >
              {isViewMode ? (loading ? 'Đang lưu ...' : 'Chỉnh sửa') : 'Hủy'}
            </Button>
          )}

          <Button
            onClick={() => {
              setViewMode(true);
              handleSubmit(mode === 'create' ? handleRegisterInstructor : handleUpdateInstructor)();
            }}
            disabled={pageDisabled() || !isDirty}
            className={`
              bg-custom-gradient-button-violet shadow-majorelleBlue50 shadow-md text-white hover:bg-majorelleBlue70
              rounded-md font-sans font-medium text-[13px] px-8 py-2 w-32 transition-all duration-300 ease-in-out
              transform
              ${isViewMode && mode == 'update' ? 'opacity-0 scale-0 pointer-events-none' : 'opacity-100 scale-100'}
            `}
          >
            {loading ? 'Đang gửi...' : 'Gửi xét duyệt'}
          </Button>
        </div>
      </div>
    </>
  );
};

export default UpsertInstructor;
