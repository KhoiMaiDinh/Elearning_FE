"use client";
import React, { useState, useEffect } from "react";
import { useForm, Controller, FieldValues } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputRegisterLecture from "../inputComponent/inputRegisterLecture";
import TextAreaRegisterLecture from "../inputComponent/textAreaRegisterLecture";
import { Button } from "../ui/button";
import { RegisterLectureForm, Lecture } from "@/types/registerLectureFormType";
import { X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/constants/store";
import { APIRegisterLecture } from "@/utils/lecture";
import { APIGetPresignedUrl } from "@/utils/storage";
import axios from "axios";
import { APIGetCategory } from "@/utils/category";
import { Category } from "@/types/categoryType";
import SelectRegister from "../selectComponent/selectRegister";
import AlertSuccess from "../alert/AlertSuccess";
import AlertError from "../alert/AlertError";
import { setUser } from "@/constants/userSlice";

// Schema validation với Yup
const schema = yup.object().shape({
  category: yup.object().shape({
    slug: yup.string().required("Lĩnh vực chuyên môn không được để trống"),
  }),
  biography: yup.string().required("Mô tả kinh nghiệm không được để trống"),
  certificates: yup
    .array()
    .of(yup.string().nullable())
    .required()
    .min(1, "Bằng cấp/chứng chỉ không được để trống"),
  headline: yup.string().required("Tiêu đề không được để trống"),
  resume: yup.string().required("CV không được để trống"),
  website_url: yup.string().nullable().optional(),
  facebook_url: yup.string().nullable().optional(),
  linkedin_url: yup.string().nullable().optional(),
  bankAccount: yup.string().required("Số tài khoản không được để trống"),
  bankName: yup.string().required("Ngân hàng không được để trống"),
  accountHolder: yup.string().required("Tên chủ tài khoản không được để trống"),
}) as yup.ObjectSchema<RegisterLectureForm>;

interface FilePreview {
  url: string;
  name: string;
  file?: File;
}

interface FileData {
  certificate_file: {
    key: string;
    bucket: string;
    status: string;
    rejected_reason: string | null;
  };
}

const ProfileLecture = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegisterLectureForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      category: {
        slug: "",
      },
      biography: "",
      headline: "",
      resume: "",
      website_url: null,
      certificates: [],
      bankAccount: "",
      bankName: "",
      accountHolder: "",
      facebook_url: null,
      linkedin_url: null,
    },
  });

  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);
  const [alertDescription, setAlertDescription] = useState("");
  const [category, setCategory] = useState<{ id: string; value: string }[]>([]);
  const [certificatePreviews, setCertificatePreviews] = useState<FilePreview[]>(
    []
  );
  const [resumePreview, setResumePreview] = useState<FilePreview | null>(null);

  const certificateNames = watch("certificates");
  const resumeName = watch("resume");

  // Load initial data from instructor profile
  useEffect(() => {
    if (userInfo?.instructor_profile) {
      const profile = userInfo.instructor_profile as Lecture;

      setValue("category.slug", profile.category.slug);
      setValue("biography", profile.biography);
      setValue("headline", profile.headline);
      setValue(
        "resume",
        process.env.NEXT_PUBLIC_BASE_URL_DOCUMENT + profile.resume?.key || ""
      );
      setValue("website_url", profile.website_url);
      setValue("facebook_url", profile.facebook_url);
      setValue("linkedin_url", profile.linkedin_url);
      setValue("bankAccount", profile.bankAccount);
      setValue("bankName", profile.bankName);
      setValue("accountHolder", profile.accountHolder);

      // Set certificates
      const certKeys =
        profile.certificates?.map(
          (cert: FileData) => cert.certificate_file.key
        ) || [];
      setValue(
        "certificates",
        certKeys.map(
          (key) => `${process.env.NEXT_PUBLIC_BASE_URL_DOCUMENT || ""}${key}`
        )
      );

      // Set previews
      setCertificatePreviews(
        profile.certificates?.map((cert: FileData) => ({
          url:
            process.env.NEXT_PUBLIC_BASE_URL_DOCUMENT +
            cert.certificate_file.key,
          name: cert.certificate_file.key,
        })) || []
      );

      // Set resume preview
      if (profile.resume?.key) {
        setResumePreview({
          url: process.env.NEXT_PUBLIC_BASE_URL_DOCUMENT + profile.resume.key,
          name: profile.resume.key,
        });
      }
      console.log("🚀 ~ useEffect ~ setResumePreview:", resumePreview);
    }
  }, [userInfo?.instructor_profile, setValue]);

  // Get categories
  useEffect(() => {
    handleGetCategory();
  }, []);

  const handleGetCategory = async () => {
    const response = await APIGetCategory({ language: "vi" });
    if (response?.status === 200) {
      const data = response?.data?.map((item: Category) => ({
        id: item.slug,
        value: item?.translations[0]?.name,
      }));
      setCategory(data);
    }
  };

  // Upload file to MinIO
  const uploadToMinIO = async (
    file: File,
    entity_property: string
  ): Promise<string> => {
    try {
      const presignedData = await APIGetPresignedUrl({
        filename: file.name,
        entity: "instructor",
        entity_property: entity_property,
      });
      const { postURL, formData } = presignedData?.data;

      const uploadFormData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        uploadFormData.append(key, value as string);
      });
      uploadFormData.append("file", file);

      const response = await axios.post(postURL, uploadFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 204 || response.status === 200) {
        const key = uploadFormData.get("key");
        if (!key) throw new Error("Missing key in form data");
        return key.toString();
      } else {
        throw new Error("Upload thất bại");
      }
    } catch (error) {
      console.error("Error uploading to MinIO:", error);
      throw error;
    }
  };

  // Handle resume file change
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
        setValue("resume", file.name);
      };
      reader.readAsDataURL(file);

      // Upload when file is selected
      const resumeUrl = await uploadToMinIO(file, "resume");
      setValue("resume", resumeUrl);
    } catch (error) {
      setAlertDescription("Không thể upload CV");
      setShowAlertError(true);
      setTimeout(() => setShowAlertError(false), 3000);
    }
  };

  // Handle certificate files change
  const handleCertificatesChange = async (files: FileList) => {
    const fileArray = Array.from(files);
    const currentCertificates = [...(certificateNames || [])];

    for (const file of fileArray) {
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          setCertificatePreviews((prev) => [
            ...prev,
            {
              url: e.target?.result as string,
              name: file.name,
              file: file,
            },
          ]);
        };
        reader.readAsDataURL(file);

        // Upload when file is selected
        const fileUrl = await uploadToMinIO(file, "certificates");
        currentCertificates.push(fileUrl);
      } catch (error) {
        setAlertDescription("Không thể upload chứng chỉ");
        setShowAlertError(true);
        setTimeout(() => setShowAlertError(false), 3000);
        return;
      }
    }
    setValue("certificates", currentCertificates);
  };

  // Remove certificate
  const removeFile = (index: number) => {
    const updatedPreviews = certificatePreviews.filter((_, i) => i !== index);
    setCertificatePreviews(updatedPreviews);
    const updatedNames = certificateNames.filter((_, i) => i !== index);
    setValue("certificates", updatedNames);
  };

  // Remove resume
  const removeResume = () => {
    setResumePreview(null);
    setValue("resume", "");
  };

  const onSubmit = async (data: FieldValues) => {
    if (!disable) {
      setLoading(true);
      try {
        const response = await APIRegisterLecture(data);
        if (response?.status === 200) {
          setAlertDescription("Cập nhật thành công");
          setShowAlertSuccess(true);
          setLoading(false);
          setDisable(true);

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
          setAlertDescription("Cập nhật thất bại");
          setShowAlertError(true);
          setTimeout(() => {
            setShowAlertError(false);
          }, 3000);
          setLoading(false);
        }
      } catch (err) {
        setAlertDescription("Cập nhật thất bại");
        setShowAlertError(true);
        setTimeout(() => {
          setShowAlertError(false);
        }, 3000);
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-black50 w-full p-4 rounded-b-sm">
      {userInfo?.instructor_profile?.is_approved !== undefined && (
        <div className="mb-4 flex justify-end">
          {userInfo.instructor_profile.is_approved ? (
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-vividMalachite/10 text-vividMalachite/80  border border-vividMalachite/20">
              <span className="w-2 h-2 mr-2 rounded-full bg-vividMalachite"></span>
              Đã xét duyệt thành công
            </span>
          ) : (
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-Sunglow/10 text-redPigment/80 border border-Sunglow/20">
              <span className="w-2 h-2 mr-2 rounded-full bg-redPigment animate-pulse"></span>
              Đang xét duyệt
            </span>
          )}
        </div>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full h-full gap-2 flex flex-col"
      >
        {/* Thông tin cá nhân */}
        <div className="bg-white dark:bg-black50 shadow-md rounded-lg p-3 border">
          <p className="text-[16px] font-sans font-medium text-black dark:text-AntiFlashWhite">
            Thông tin cá nhân
          </p>
          <div className="grid lg:grid-cols-2 grid-cols-1 md:grid-cols-2 w-full p-3 gap-3">
            <InputRegisterLecture
              labelText="Họ và tên"
              value={userInfo?.first_name + " " + userInfo?.last_name}
              disabled={true}
            />
            <InputRegisterLecture
              labelText="Email"
              value={userInfo?.email}
              disabled={true}
            />
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
                    disabled={disable}
                    value={field.value}
                    onValueChange={(e) => {
                      setValue("category.slug", e);
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
                    disabled={disable}
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
                  disabled={disable}
                  className="min-h-[180px]"
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
                      disabled={disable}
                      onChange={(e) => {
                        const files = (e.target as HTMLInputElement).files;
                        if (files?.length) {
                          handleResumeChange(files);
                        }
                      }}
                    />
                    {resumePreview && !disable && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:bg-red-100"
                        onClick={removeResume}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  {resumePreview && (
                    <div className="mt-2 border rounded p-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">
                          {resumePreview.name}
                        </span>
                      </div>
                      <iframe
                        src={resumePreview.url}
                        className="md:w-1/2 w-full md:h-[200px] h-[100px] rounded"
                        title="CV Preview"
                      />
                    </div>
                  )}
                </div>
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
                    disabled={disable}
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
                        <div
                          key={index}
                          className="relative border rounded p-2"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600 truncate max-w-[150px]">
                              {preview.name}
                            </span>
                            {!disable && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:bg-red-100"
                                onClick={() => removeFile(index)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          <iframe
                            src={preview.url}
                            className="w-full md:h-[400px] h-[100px] rounded"
                            title={`Certificate ${index + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Controller
                name="website_url"
                control={control}
                render={({ field }) => (
                  <InputRegisterLecture
                    {...field}
                    labelText="Website"
                    error={errors.website_url?.message}
                    disabled={disable}
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
                    disabled={disable}
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
                    disabled={disable}
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* Thông tin tài khoản */}
        <div className="bg-white dark:bg-black50 shadow-md rounded-lg p-3 border">
          <p className="text-[16px] font-sans font-medium text-black dark:text-AntiFlashWhite">
            Thông tin tài khoản
          </p>
          <div className="grid lg:grid-cols-2 grid-cols-1 md:grid-cols-2 w-full p-3 gap-3">
            <Controller
              name="bankAccount"
              control={control}
              render={({ field }) => (
                <InputRegisterLecture
                  {...field}
                  labelText="Số tài khoản"
                  error={errors.bankAccount?.message}
                  disabled={disable}
                />
              )}
            />
            <Controller
              name="bankName"
              control={control}
              render={({ field }) => (
                <InputRegisterLecture
                  {...field}
                  labelText="Ngân hàng"
                  error={errors.bankName?.message}
                  disabled={disable}
                />
              )}
            />
            <Controller
              name="accountHolder"
              control={control}
              render={({ field }) => (
                <InputRegisterLecture
                  {...field}
                  labelText="Tên chủ tài khoản"
                  error={errors.accountHolder?.message}
                  disabled={disable}
                />
              )}
            />
          </div>
        </div>

        {/* Nút điều khiển */}
        <div className="w-full flex items-center justify-center p-4">
          {disable ? (
            <Button
              type="button"
              className="w-32 bg-custom-gradient-button-violet hover:shadow-md hover:scale-105 transition-all duration-300 text-white dark:hover:shadow-sm dark:hover:shadow-white hover:bg-majorelleBlue70 rounded-md font-sans font-medium text-[16px] p-2"
              onClick={() => setDisable(false)}
            >
              Chỉnh sửa
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-32 bg-custom-gradient-button-violet hover:shadow-md hover:scale-105 transition-all duration-300 text-white dark:hover:shadow-sm dark:hover:shadow-white hover:bg-majorelleBlue70 rounded-md font-sans font-medium text-[16px] p-2"
              disabled={loading}
            >
              {loading ? "Đang gửi..." : "Gửi xét duyệt"}
            </Button>
          )}
        </div>
      </form>
      {showAlertSuccess && <AlertSuccess description={alertDescription} />}
      {showAlertError && <AlertError description={alertDescription} />}
    </div>
  );
};

export default ProfileLecture;
