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
import { APIGetCurrentUser, APIUpdateCurrentUser } from "@/utils/user";
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
  profile_image: yup
    .object()
    .shape({
      key: yup.string().required("Ảnh đại diện không được để trống"),
      bucket: yup.string(),
      status: yup.string(),
      rejected_reason: yup.string(),
    })
    .required("Ảnh đại diện không được để trống"),
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
      profile_image: {
        key: "",
        bucket: undefined,
        status: undefined,
        rejected_reason: undefined,
      },
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
      setValue("profile_image", {
        key: userInfo.profile_image?.key || "",
        bucket: userInfo.profile_image?.bucket || "",
        status: userInfo.profile_image?.status || "",
        rejected_reason: userInfo.profile_image?.rejected_reason || "",
      });

      // Chỉ set imagePreview khi có query parameters
      if (
        profileImage.key.startsWith("data:image") ||
        profileImage.key.startsWith("blob:") ||
        profileImage.key.includes("?")
      ) {
        setImagePreview(
          profileImage.key.startsWith("data:image") ||
            profileImage.key.startsWith("blob:")
            ? profileImage.key
            : process.env.NEXT_PUBLIC_BASE_URL_IMAGE + profileImage.key
        );
      }
    }
  }, [userInfo, setValue, disable]);

  // Đồng bộ preview khi profile_image thay đổi
  useEffect(() => {
    if (profileImage?.key) {
      // Chỉ set imagePreview trong 2 trường hợp:
      // 1. Khi là local file (data:image hoặc blob:)
      // 2. Khi có query parameters (presigned URL)
      if (
        profileImage.key.startsWith("data:image") ||
        profileImage.key.startsWith("blob:") ||
        profileImage.key.includes("?")
      ) {
        setImagePreview(
          profileImage.key.startsWith("data:image") ||
            profileImage.key.startsWith("blob:")
            ? profileImage.key
            : process.env.NEXT_PUBLIC_BASE_URL_IMAGE + profileImage.key
        );
      }
    }
    console.log("🚀 ~ ProfileStudent ~ profileImage:", profileImage);
  }, [profileImage]);

  // Lấy presigned URL từ backend

  // Upload file lên MinIO bằng presigned URL với axios
  const uploadToMinIO = async (file: File): Promise<string> => {
    try {
      const presignedData = await APIGetPresignedUrl({
        filename: file.name,
        entity: "user",
        entity_property: "profile_image",
      });
      const { postURL, formData } = presignedData?.data;

      const uploadFormData = new FormData();
      // Thêm các field từ formData
      Object.entries(formData).forEach(([key, value]) => {
        uploadFormData.append(key, value as string);
      });
      uploadFormData.append("file", file); // Thêm file

      // Upload file lên MinIO bằng axios

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

  const onSubmit = async (data: FieldValues) => {
    if (!disable && userInfo?.id) {
      let profileImageKey = data.profile_image.key;

      // Cắt bỏ query parameters nếu có
      if (profileImageKey.includes("?")) {
        profileImageKey = profileImageKey.split("?")[0];
      }

      const dataSubmit = {
        first_name: data.first_name,
        last_name: data.last_name,
        username: data.username,
        profile_image: {
          ...data.profile_image,
          key: profileImageKey,
        },
      };

      handleUpdateProfileUser(dataSubmit);
    }
  };

  const handleGetCurrentUser = async () => {
    const response = await APIGetCurrentUser();
    if (response?.status === 200) {
      dispatch(setUser(response?.data));
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
        handleGetCurrentUser();
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
                      src={imagePreview}
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
                      onChange={async (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          try {
                            // Hiển thị preview ngay

                            setSelectedFile(file);

                            const previewUrl = URL.createObjectURL(file);

                            setImagePreview(previewUrl);

                            // Upload file
                            const uploadedKey = await uploadToMinIO(file);

                            // Cập nhật form value với file đã upload
                            setValue("profile_image", {
                              key: uploadedKey,
                              bucket: undefined,
                              status: undefined,
                              rejected_reason: undefined,
                            });
                          } catch (error) {
                            setAlertDescription("Upload ảnh thất bại");
                            setShowAlertError(true);
                            setTimeout(() => setShowAlertError(false), 3000);
                          }
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
