"use client";
import React, { useState, useEffect } from "react";
import { useForm, Controller, FieldValues } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputRegisterLecture from "@/components/inputComponent/inputRegisterLecture";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserType } from "@/types/userType";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/constants/store";
import { APIUpdateCurrentUser } from "@/utils/user";
import axios from "axios";
import { APIGetPresignedUrl } from "@/utils/storage";
import { setUser } from "@/constants/userSlice";

// Schema validation với Yup
const schema = yup.object().shape({
  first_name: yup
    .string()
    .required("Họ không được bỏ trống")
    .max(60, "Tối đa 60 ký tự"),
  last_name: yup
    .string()
    .required("Tên không được bỏ trống")
    .max(60, "Tối đa 60 ký tự"),
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Email không được để trống"),
  username: yup
    .string()
    .required("Biệt danh không được bỏ trống")
    .max(60, "Tối đa 60 ký tự"),
  profile_image: yup.string().required("Ảnh đại diện không được để trống"),
});

const ProfileStudent = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<UserType>({
    resolver: yupResolver(schema),
    defaultValues: {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      profile_image: "",
    },
  });

  const dispatch = useDispatch();

  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const [disable, setDisable] = useState(true);
  const [imagePreview, setImagePreview] = useState<string>(""); // Preview cho profile_image
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Lưu file thực tế
  const profileImage = watch("profile_image"); // Theo dõi giá trị profile_image
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);
  const [alertDescription, setAlertDescription] = useState("");

  // Đồng bộ dữ liệu từ Redux và preview ảnh
  useEffect(() => {
    if (userInfo) {
      setValue("first_name", userInfo.first_name);
      setValue("last_name", userInfo.last_name);
      setValue("email", userInfo.email);
      setValue("username", userInfo.username);
      setValue("profile_image", userInfo.profile_image || "");
      setImagePreview(userInfo.profile_image || "");
    }
  }, [userInfo, setValue, disable]);

  // Đồng bộ preview khi profile_image thay đổi
  useEffect(() => {
    if (profileImage) {
      setImagePreview(profileImage);
    }
  }, [profileImage]);

  // Lấy presigned URL từ backend

  // Upload file lên MinIO bằng presigned URL với axios
  const uploadToMinIO = async (file: File): Promise<string> => {
    try {
      const presignedData = await APIGetPresignedUrl({
        filename: file.name,
        resource: "user",
      });
      const { postURL, formData } = presignedData?.data;

      const uploadFormData = new FormData();
      // Thêm các field từ formData
      Object.entries(formData).forEach(([key, value]) => {
        uploadFormData.append(key, value as string);
      });
      uploadFormData.append("file", file); // Thêm file
      for (const value of uploadFormData.values()) {
        console.log(value);
      }

      // Upload file lên MinIO bằng axios
      const url = process.env.NEXT_PUBLIC_BASE_URL_IMAGE!;

      const response = await axios.post(postURL, uploadFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 204 || response.status === 200) {
        return postURL + "/" + uploadFormData.get("key");
      } else {
        throw new Error("Upload thất bại");
      }
    } catch (error) {
      console.error("Error uploading to MinIO:", error);
      throw error;
    }
  };

  const onSubmit = async (data: FieldValues) => {
    if (!disable && userInfo?.id) {
      let updatedProfileImage = data.profile_image;

      // Nếu có file mới, upload lên MinIO
      if (selectedFile) {
        try {
          updatedProfileImage = await uploadToMinIO(selectedFile);
          setValue("profile_image", updatedProfileImage); // Cập nhật profile_image với URL từ MinIO
        } catch (error) {
          setAlertDescription("Upload ảnh thất bại");
          setShowAlertError(true);
          setTimeout(() => setShowAlertError(false), 3000);
          return;
        }
      }

      const dataSubmit = {
        first_name: data.first_name,
        last_name: data.last_name,
        username: data.username,
        profile_image: updatedProfileImage,
      };

      handleUpdateProfileUser(dataSubmit);
    }
  };

  const handleUpdateProfileUser = async (data: any) => {
    try {
      const response = await APIUpdateCurrentUser(data);
      if (response?.status === 200) {
        setAlertDescription("Cập nhật thành công");
        setShowAlertSuccess(true);
        setDisable(true); // Quay lại chế độ disable
        setSelectedFile(null); // Xóa file tạm sau khi upload thành công
        dispatch(setUser(response?.data));
        setTimeout(() => setShowAlertSuccess(false), 3000);
      } else {
        setAlertDescription("Cập nhật thất bại");
        setShowAlertError(true);
        setTimeout(() => setShowAlertError(false), 3000);
      }
    } catch (err) {
      setAlertDescription("Cập nhật thất bại");
      setShowAlertError(true);
      setTimeout(() => setShowAlertError(false), 3000);
    }
  };

  return (
    <div className="bg-white dark:bg-black50 w-full p-4 rounded-b-sm">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full h-full gap-2 flex flex-col"
      >
        {/* Thông tin cá nhân */}
        <div className="bg-white dark:bg-black50 shadow-md rounded-lg p-3 border gap-3 flex flex-col">
          <p className="text-[16px] font-sans font-medium text-black dark:text-AntiFlashWhite">
            Thông tin cá nhân
          </p>
          <div className="flex w-full">
            <Controller
              name="profile_image"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-2 items-center">
                  <Avatar className="w-24 h-24">
                    <AvatarImage
                      src={
                        imagePreview?.startsWith("data:image") ||
                        imagePreview?.startsWith("blob:")
                          ? imagePreview
                          : process.env.NEXT_PUBLIC_BASE_URL_IMAGE +
                            imagePreview
                      }
                      alt="Profile Image"
                      className="object-cover"
                    />
                  </Avatar>
                  {!disable && (
                    <InputRegisterLecture
                      labelText="Ảnh đại diện"
                      type="file"
                      accept="image/*"
                      error={errors.profile_image?.message}
                      disabled={disable}
                      onChange={(e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          const imageUrl = URL.createObjectURL(file);
                          setValue("profile_image", imageUrl); // Lưu URL tạm thời để preview
                          setSelectedFile(file); // Lưu file thực tế để upload
                        }
                      }}
                    />
                  )}
                </div>
              )}
            />
          </div>
          <div className="grid lg:grid-cols-2 grid-cols-1 md:grid-cols-2 w-full p-3 gap-3">
            <Controller
              name="first_name"
              control={control}
              render={({ field }) => (
                <InputRegisterLecture
                  {...field}
                  labelText="Họ"
                  error={errors.first_name?.message}
                  disabled={disable}
                />
              )}
            />
            <Controller
              name="last_name"
              control={control}
              render={({ field }) => (
                <InputRegisterLecture
                  {...field}
                  labelText="Tên"
                  className="w-fit"
                  error={errors.last_name?.message}
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
                  disabled={true} // Email không cho chỉnh sửa
                />
              )}
            />
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <InputRegisterLecture
                  {...field}
                  labelText="Biệt danh"
                  error={errors.username?.message}
                  disabled={disable}
                />
              )}
            />
          </div>
        </div>

        {/* Nút điều khiển */}
        <div className="w-full flex items-center justify-center p-4">
          {disable ? (
            <button
              className="w-32 bg-majorelleBlue text-white dark:hover:shadow-sm dark:hover:shadow-white hover:bg-majorelleBlue70 rounded-md font-sans font-medium text-[16px] p-2"
              onClick={() => setDisable(false)}
            >
              Chỉnh sửa
            </button>
          ) : (
            <div className="flex flex-row w-full gap-3 items-center justify-center">
              <button
                className="w-32 bg-redPigment text-white dark:hover:shadow-sm dark:hover:shadow-white hover:bg-majorelleBlue70 rounded-md font-sans font-medium text-[16px] p-2"
                onClick={() => setDisable(true)}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="w-32 bg-majorelleBlue text-white dark:hover:shadow-sm dark:hover:shadow-white hover:bg-majorelleBlue70 rounded-md font-sans font-medium text-[16px] p-2"
              >
                Gửi xét duyệt
              </button>
            </div>
          )}
        </div>

        {/* Alert Success */}
        {showAlertSuccess && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-md shadow-lg">
            {alertDescription}
          </div>
        )}
        {/* Alert Error */}
        {showAlertError && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-md shadow-lg">
            {alertDescription}
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfileStudent;
