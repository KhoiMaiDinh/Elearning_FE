"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";

const baseSchema = {
  email: Yup.string()
    .required("Email không được bỏ trống")
    .email("Email không hợp lệ"),
  password: Yup.string().required("Mật khẩu không được bỏ trống"),
};

const signupSchema = Yup.object().shape({
  ...baseSchema,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Mật khẩu không trùng khớp")
    .required("Xác nhận mật khẩu không được bỏ trống"),
});

const loginSchema = Yup.object().shape(baseSchema);

const Page = () => {
  const [activeButton, setActiveButton] = useState("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );

  const validateForm = async () => {
    try {
      const schema = activeButton === "signup" ? signupSchema : loginSchema;
      await schema.validate(formData, { abortEarly: false });
      setErrors({}); // Reset lỗi
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors: Record<string, string> = {};
        err.inner.forEach((error) => {
          if (error.path) validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors); // Cập nhật lỗi
      }
    }
  };

  const handleButtonClick = async (type: string) => {
    setActiveButton(type);
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
    }); // Reset form
    setErrors({});
  };

  const handleSubmit = async () => {
    setTouchedFields({
      email: true,
      password: true,
      confirmPassword: true,
    });
    await validateForm();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (touchedFields[name]) {
      validateForm(); // Chỉ validate nếu đã bấm nút hoặc trường này đã bị "touched"
    }
  };

  const handleInputBlur = (name: string) => {
    setTouchedFields((prev) => ({
      ...prev,
      [name]: true,
    }));
    validateForm(); // Validate khi rời khỏi ô nhập liệu
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-[url(/images/img_background.png)] bg-cover bg-center bg-no-repeat p-6">
      <div className="flex h-5/6 w-5/6 lg:h-2/3 md:h-2/3 sm:h-5/6  items-center mx-12 lg:ml-auto lg:w-1/3 md:bg-majorelleBlue20 lg:bg-white sm:bg-majorelleBlue20 bg-majorelleBlue20 rounded-lg">
        {/* Form nằm bên phải */}
        <div className="flex w-full flex-col items-center gap-6 rounded-lg p-8 ">
          {/* Header */}
          <div className="flex flex-row items-center gap-2 justify-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Chào mừng đến với ...!
            </h1>
            <Image
              src="/icons/ic_welcome.png"
              width={24}
              height={24}
              alt="logo"
              className="mb-2"
            />
          </div>

          {/* Tab Đăng nhập / Đăng ký */}
          <div className="flex justify-center gap-6 bg-majorelleBlue50 rounded-full w-fit p-2">
            <Button
              onClick={() => handleButtonClick("login")}
              className={`lg:w-36 md:w-28 sm:w-24 w-24 rounded-full  ${
                activeButton === "login"
                  ? "bg-majorelleBlue text-white hover:bg-majorelleBlue "
                  : "bg-trnsp text-majorelleBlue hover:bg-majorelleBlue70 hover:text-white"
              } hover:shadow-lg`}
            >
              Đăng nhập
            </Button>

            {/* Nút Đăng ký */}
            <Button
              onClick={() => handleButtonClick("signup")}
              className={`lg:w-36 md:w-28 sm:w-24 w-24 rounded-full  ${
                activeButton === "signup"
                  ? "bg-majorelleBlue text-white hover:bg-majorelleBlue "
                  : "bg-trnsp text-majorelleBlue hover:bg-majorelleBlue70 hover:text-white"
              } hover:shadow-lg`}
            >
              Đăng ký
            </Button>
          </div>

          {/* Mô tả */}
          <p className="text-center text-sm text-black50 lg:text-lightSilver md:text-black50 sm:text-black50 ">
            {activeButton === "login" ? "Đăng nhập" : "Đăng ký"} để khám phá
            tiềm năng của chính bạn!
          </p>

          {/* Nút Tiếp tục với Google */}
          <Button className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white py-3 hover:shadow-md hover:bg-white">
            <Image
              src="/icons/ic_google.png"
              width={20}
              height={20}
              alt="Google"
            />
            <span className="text-sm font-medium text-black">
              Tiếp tục với Google
            </span>
          </Button>

          {/* Divider */}
          <div className="relative flex w-full items-center">
            <div className="h-px w-full bg-gray-300" />
            <span className="mx-4 px-2 text-sm text-black50">HOẶC</span>
            <div className="h-px w-full bg-gray-300" />
          </div>

          {/* Form */}
          <div className="flex w-full flex-col gap-4">
            {/* Email */}
            <div>
              <input
                name="email"
                type="email"
                placeholder="Email"
                className="w-full rounded-full border border-gray-300 px-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-majorelleBlue"
                onChange={handleInputChange}
              />
              {errors.email && (
                <p className="p-1 px-4 text-xs text-redPigment">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu"
                  className="w-full rounded-full border border-gray-300 px-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-majorelleBlue"
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-gray-800"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Image
                    src={`/icons/ic_${showPassword ? "show" : "hide"}.png`}
                    width={24}
                    height={24}
                    alt="toggle visibility"
                  />
                </button>
              </div>
              {errors.password && (
                <p className="p-1 px-4 text-xs text-redPigment">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Password */}
            {activeButton === "signup" && (
              <div>
                <div className="relative">
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Xác nhận mật khẩu"
                    className="w-full rounded-full border border-gray-300 px-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-majorelleBlue"
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-gray-800"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Image
                      src={`/icons/ic_${
                        showConfirmPassword ? "show" : "hide"
                      }.png`}
                      width={24}
                      height={24}
                      alt="toggle visibility"
                    />
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="p-1 px-4 text-xs text-redPigment">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {/* Ghi nhớ tài khoản & Quên mật khẩu */}
            {activeButton === "login" && (
              <div className="flex justify-between text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Checkbox id="remember-me" />
                  <label htmlFor="remember-me">Ghi nhớ tài khoản</label>
                </div>
                <button className="hover:underline">Quên mật khẩu?</button>
              </div>
            )}
          </div>

          {/* Nút Đăng nhập */}
          <Button
            className="w-full rounded-full bg-majorelleBlue py-3 text-white font-bold hover:shadow-lg hover:bg-majorelleBlue70"
            onClick={() => handleSubmit()}
          >
            {activeButton === "login" ? "Đăng nhập" : "Đăng ký"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
