"use client";
import React, { useState, useEffect } from "react";
import { useForm, Controller, FieldValues } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputRegisterLecture from "../inputComponent/inputRegisterLecture";
import TextAreaRegisterLecture from "../inputComponent/textAreaRegisterLecture";
import { Button } from "../ui/button";
import { RegisterLectureForm } from "@/types/registerLectureFormType";
import { X } from "lucide-react";

// Schema validation với Yup
const schema = yup.object().shape({
  fullName: yup.string().required("Họ và tên không được để trống"),
  dob: yup.string().required("Ngày sinh không được để trống"),
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Email không được để trống"),
  bio: yup.string().required("Tiểu sử không được để trống"),
  address: yup.string().required("Địa chỉ không được để trống"),
  expertise: yup.string().required("Lĩnh vực chuyên môn không được để trống"),
  experience: yup.string().required("Mô tả kinh nghiệm không được để trống"),
  certificate: yup
    .array()
    .of(yup.string().required("Bằng cấp/chứng chỉ không được để trống"))
    .default([])
    .min(1, "Bằng cấp/chứng chỉ không được để trống"),
  bankAccount: yup.string().required("Số tài khoản không được để trống"),
  bankName: yup.string().required("Ngân hàng không được để trống"),
  accountHolder: yup.string().required("Tên chủ tài khoản không được để trống"),
});

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
      fullName: "",
      dob: "",
      email: "",
      bio: "",
      address: "",
      expertise: "",
      experience: "",
      certificate: [],
      bankAccount: "",
      bankName: "",
      accountHolder: "",
    },
  });

  const [disable, setDisable] = useState(true);
  const [filePreviews, setFilePreviews] = useState<
    { url: string; name: string }[]
  >([]); // Lưu cả URL và tên file
  const certificateNames = watch("certificate"); // Theo dõi giá trị certificate

  // Đồng bộ file previews khi certificate thay đổi
  useEffect(() => {
    if (certificateNames && certificateNames.length > 0) {
      const previews = certificateNames.map((name) => ({
        url: filePreviews.find((p) => p.name === name)?.url || "", // Giữ URL nếu đã có
        name,
      }));
      setFilePreviews(previews);
    } else {
      setFilePreviews([]);
    }
  }, [certificateNames]);

  // Xóa file khỏi danh sách
  const removeFile = (index: number) => {
    const updatedNames = certificateNames.filter((_, i) => i !== index);
    setValue("certificate", updatedNames);
  };

  const onSubmit = (data: FieldValues) => {
    console.log("Form data:", data);
    alert("Gửi xét duyệt chỉnh sửa thành công!");
  };

  return (
    <div className="bg-white dark:bg-black50 w-full p-4 rounded-b-sm">
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
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => (
                <InputRegisterLecture
                  {...field}
                  labelText="Họ và tên"
                  error={errors.fullName?.message}
                  disabled={disable}
                />
              )}
            />
            <Controller
              name="dob"
              control={control}
              render={({ field }) => (
                <InputRegisterLecture
                  {...field}
                  labelText="Ngày sinh"
                  type="date"
                  className="w-fit"
                  error={errors.dob?.message}
                  disabled={disable}
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <InputRegisterLecture
                  {...field}
                  labelText="Email"
                  error={errors.email?.message}
                  disabled={disable}
                />
              )}
            />
            <Controller
              name="bio"
              control={control}
              render={({ field }) => (
                <InputRegisterLecture
                  {...field}
                  labelText="Tiểu sử"
                  error={errors.bio?.message}
                  disabled={disable}
                />
              )}
            />
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <InputRegisterLecture
                  {...field}
                  labelText="Địa chỉ"
                  error={errors.address?.message}
                  disabled={disable}
                />
              )}
            />
          </div>
        </div>

        {/* Thông tin chuyên môn */}
        <div className="bg-white dark:bg-black50 shadow-md rounded-lg p-3 border">
          <p className="text-[16px] font-sans font-medium text-black dark:text-AntiFlashWhite">
            Thông tin chuyên môn
          </p>
          <div className="grid w-full p-3 gap-3">
            <Controller
              name="expertise"
              control={control}
              render={({ field }) => (
                <InputRegisterLecture
                  {...field}
                  labelText="Lĩnh vực chuyên môn"
                  error={errors.expertise?.message}
                  disabled={disable}
                />
              )}
            />
            <Controller
              name="experience"
              control={control}
              render={({ field }) => (
                <TextAreaRegisterLecture
                  {...field}
                  labelText="Mô tả kinh nghiệm"
                  error={errors.experience?.message}
                  disabled={disable}
                  className="min-h-[180px]"
                />
              )}
            />
            <Controller
              name="certificate"
              control={control}
              render={({ field }) => (
                <div>
                  <InputRegisterLecture
                    {...field}
                    labelText="Chứng chỉ/bằng cấp"
                    type="file"
                    multiple
                    error={errors.certificate?.message}
                    disabled={disable}
                    onChange={(e) => {
                      const files = Array.from(
                        (e.target as HTMLInputElement).files || []
                      );
                      const fileNames = files.map((file: File) => file.name);
                      field.onChange([...(field.value || []), ...fileNames]);
                    }}
                  />
                  {filePreviews.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {filePreviews.map((preview, index) => (
                        <div
                          key={index}
                          className="relative flex items-center gap-2"
                        >
                          <img
                            src={preview.url}
                            alt={`Preview ${index}`}
                            className="w-20 h-20 object-cover rounded"
                          />
                          <span className="text-sm text-gray-600 truncate max-w-[150px]">
                            {preview.name}
                          </span>
                          {!disable && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="p-1 text-red-500 hover:bg-red-100"
                              onClick={() => removeFile(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            />
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
              className="w-32 bg-majorelleBlue text-white dark:hover:shadow-sm dark:hover:shadow-white hover:bg-majorelleBlue70 rounded-md font-sans font-medium text-[16px] p-2"
              onClick={() => setDisable(false)}
            >
              Chỉnh sửa
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-32 bg-majorelleBlue text-white dark:hover:shadow-sm dark:hover:shadow-white hover:bg-majorelleBlue70 rounded-md font-sans font-medium text-[16px] p-2"
            >
              Gửi xét duyệt
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfileLecture;
