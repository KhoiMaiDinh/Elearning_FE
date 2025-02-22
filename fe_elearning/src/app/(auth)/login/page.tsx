"use client";
import "./login.css";
import AlertError from "@/components/alert/AlertError";
import AlertSuccess from "@/components/alert/AlertSuccess";
import { Button } from "@/components/ui/button";
import {
  APILoginEmail,
  APILoginGoogle,
  APIRegisterEmail,
  APIRegisterGoogle,
} from "@/utils/auth";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

const baseSchema = {
  email: Yup.string()
    .required("Email không được bỏ trống")
    .email("Email không hợp lệ"),
  password: Yup.string()
    .required("Mật khẩu không được bỏ trống")
    .matches(
      regexPassword,
      "Tối thiểu tám ký tự, ít nhất một chữ cái viết hoa, một chữ cái viết thường và một số"
    ),
};

const signupSchema = Yup.object().shape({
  ...baseSchema,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Mật khẩu không trùng khớp")
    .required("Xác nhận mật khẩu không được bỏ trống"),
  first_name: Yup.string()
    .required("Họ không được bỏ trống")
    .max(60, "Tối đa 60 ký tự"),
  last_name: Yup.string()
    .required("Tên không được bỏ trống")
    .max(60, "Tối đa 60 ký tự"),
});

const loginSchema = Yup.object().shape({
  ...baseSchema,
  confirmPassword: Yup.string(),
  first_name: Yup.string(),
  last_name: Yup.string(),
});

const Page = () => {
  const [activeButton, setActiveButton] = useState("login");
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    resolver: yupResolver(
      activeButton === "login" ? loginSchema : signupSchema
    ),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      first_name: "",
      last_name: "",
    },
  });

  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);
  const [alertDescription, setAlertDescription] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClearData = () => {
    setValue("email", "");
    setValue("password", "");
    setValue("confirmPassword", "");
    setValue("first_name", "");
    setValue("last_name", "");
  };

  const handleButtonClick = async (type: string) => {
    setActiveButton(type);
    handleClearData();
  };

  const onSubmit = async (data: any) => {
    const body = {
      email: data.email,
      password: data.password,
    };

    const bodySignUp = {
      ...body,
      last_name: data.last_name,
      first_name: data.first_name,
    };

    activeButton === "login" && handleLogin(body);
    activeButton === "signup" && (await handleSignup(bodySignUp));
  };

  const handleLogin = async (data: any) => {
    const response = await APILoginEmail(data);
    if (response?.status === 200) {
      localStorage.setItem("access_token", response?.data?.access_token);
      localStorage.setItem("refresh_token", response?.data?.refresh_token);
      localStorage.setItem("expires_at", response?.data?.exp_token); // Thời gian hết hạn

      setAlertDescription("Đăng nhập thành công");
      setShowAlertSuccess(true);

      setTimeout(() => {
        setShowAlertSuccess(false);
      }, 3000);
      router.push("/dashboard");
    } else {
      setAlertDescription("Đăng nhập thất bại");
      setShowAlertError(true);
      setTimeout(() => {
        setShowAlertError(false);
      }, 3000);
    }
  };

  const handleSignup = async (data: any) => {
    const response = await APIRegisterEmail(data);
    if (response?.status === 201) {
      setAlertDescription("Đăng ký thành công");
      setShowAlertSuccess(true);

      setTimeout(() => {
        setShowAlertSuccess(false);
      }, 3000);
      await handleLogin(data);

      // router.push('/cau-hinh/thong-tin-cua-hang');
    } else {
      setAlertDescription("Đăng ký thất bại");
      setShowAlertError(true);
      setTimeout(() => {
        setShowAlertError(false);
      }, 3000);
    }
  };

  const handleLoginByGoogle = async () => {
    try {
      // Remove any "use server" directive; call signIn directly.
      console.log("hi");
      signIn("google", {
        callbackUrl: "http://localhost:3000/login",
      });
      // console.log("Google login response:", response);
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  const handleRegisterByGoogle = async (data: any) => {
    const response = await APIRegisterGoogle(data);
  };
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-[url(/images/img_background.png)] bg-cover bg-center bg-no-repeat p-6">
      {" "}
      <div className="flex h-5/6 w-5/6 lg:h-2/3 md:h-2/3 sm:h-5/6  items-center mx-12 lg:ml-auto lg:w-1/3 md:bg-majorelleBlue20 lg:bg-white sm:bg-majorelleBlue20 bg-majorelleBlue20 rounded-lg">
        {" "}
        {/* Form nằm bên phải */}
        <div className="flex w-full flex-col items-center gap-6 rounded-lg p-8 ">
          {" "}
          {/* Header */}
          <div className="flex flex-row items-center gap-2 justify-center">
            {" "}
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
            {" "}
            <Button
              onClick={() => handleButtonClick("login")}
              className={`lg:w-36 md:w-28 sm:w-24 w-24 rounded-full ${
                activeButton === "login"
                  ? "bg-majorelleBlue text-white hover:bg-majorelleBlue"
                  : "bg-trnsp text-majorelleBlue hover:bg-majorelleBlue70 hover:text-white"
              } hover:shadow-lg`}
            >
              Đăng nhập
            </Button>
            {/* Nút Đăng ký */}
            <Button
              onClick={() => handleButtonClick("signup")}
              className={`lg:w-36 md:w-28 sm:w-24 w-24 rounded-full ${
                activeButton === "signup"
                  ? "bg-majorelleBlue text-white hover:bg-majorelleBlue"
                  : "bg-trnsp text-majorelleBlue hover:bg-majorelleBlue70 hover:text-white"
              } hover:shadow-lg`}
            >
              Đăng ký
            </Button>
          </div>
          {/* Mô tả */}
          {/* Divider */}
          <form
            className="flex flex-col gap-2.5 bg-white  w-[450px] rounded-[20px] font-sans"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* ten */}
            {activeButton === "signup" && (
              <div className="flex flex-row justify-between items-center">
                <Controller
                  name="first_name"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-col">
                        <label className="text-[#151717] font-semibold">
                          Họ
                        </label>
                      </div>

                      <div className="border-[1.5px] border-[#ecedec] rounded-[10px] h-[50px] flex items-center pl-2.5 transition duration-200 ease-in-out focus-within:border-[#2d79f3]">
                        <User size={20} />
                        <input
                          {...field}
                          type="text"
                          placeholder="Nhập họ"
                          className="ml-2.5 rounded-[10px] border-none w-[85%] h-full focus:outline-none placeholder:font-sans"
                        />
                      </div>

                      {errors.first_name?.message && (
                        <p className="p-1 px-4 text-xs text-redPigment">
                          {errors.first_name?.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                <Controller
                  name="last_name"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-col">
                        <label className="text-[#151717] font-semibold">
                          Tên
                        </label>
                      </div>

                      <div className="border-[1.5px] border-[#ecedec] rounded-[10px] h-[50px] flex items-center pl-2.5 transition duration-200 ease-in-out focus-within:border-[#2d79f3]">
                        <User size={20} />
                        <input
                          {...field}
                          type="text"
                          placeholder="Nhập tên"
                          className="ml-2.5 rounded-[10px] border-none w-[85%] h-full focus:outline-none placeholder:font-sans"
                        />
                      </div>

                      {errors.last_name?.message && (
                        <p className="p-1 px-4 text-xs text-redPigment">
                          {errors.last_name?.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
            )}
            {/* Email Field */}
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1">
                  <div className="flex flex-col">
                    <label className="text-[#151717] font-semibold">
                      Email
                    </label>
                  </div>

                  <div className="border-[1.5px] border-[#ecedec] rounded-[10px] h-[50px] flex items-center pl-2.5 transition duration-200 ease-in-out focus-within:border-[#2d79f3]">
                    <Mail size={20} />
                    <input
                      {...field}
                      type="text"
                      placeholder="Nhập email"
                      className="ml-2.5 rounded-[10px] border-none w-[85%] h-full focus:outline-none placeholder:font-sans"
                    />
                  </div>

                  {errors.email?.message && (
                    <p className="p-1 px-4 text-xs text-redPigment">
                      {errors.email?.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Password Field */}
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <div>
                  <div className="flex flex-col">
                    <label className="text-[#151717] font-semibold">
                      Mật khẩu
                    </label>
                  </div>
                  <div className="border-[1.5px] border-[#ecedec] rounded-[10px] h-[50px] flex items-center pl-2.5 transition duration-200 ease-in-out focus-within:border-[#2d79f3]">
                    <Lock size={20} />
                    <input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu"
                      className="ml-2.5 rounded-[10px] border-none w-[85%] h-full focus:outline-none placeholder:font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="ml-auto"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password?.message && (
                    <p className="p-1 px-4 text-xs text-redPigment">
                      {errors.password?.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Password Field */}
            {activeButton === "signup" && (
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <div>
                    <div className="flex flex-col">
                      <label className="text-[#151717] font-semibold">
                        Xác nhận mật khẩu
                      </label>
                    </div>
                    <div className="border-[1.5px] border-[#ecedec] rounded-[10px] h-[50px] flex items-center pl-2.5 transition duration-200 ease-in-out focus-within:border-[#2d79f3]">
                      <Lock size={20} />
                      <input
                        {...field}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Xác nhận mật khẩu"
                        className="ml-2.5 rounded-[10px] border-none w-[85%] h-full focus:outline-none placeholder:font-sans"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="ml-auto"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword?.message && (
                      <p className="p-1 px-4 text-xs text-redPigment">
                        {errors.confirmPassword?.message}
                      </p>
                    )}
                  </div>
                )}
              />
            )}

            {/* Checkbox & Forgot Password */}
            <div className="flex flex-row items-center gap-2.5 justify-between">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="remember" className="h-4 w-4" />
                <label
                  htmlFor="remember"
                  className="text-[14px] text-black font-normal"
                >
                  Ghi nhớ
                </label>
              </div>
              <span className="text-[14px] ml-[5px] text-[#2d79f3] font-medium cursor-pointer">
                Quên mật khẩu?
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-5 mb-2.5 bg-[#151717] text-white text-[15px] font-medium rounded-[10px] h-[50px] w-full cursor-pointer hover:bg-[#252727] self-end"
            >
              {activeButton === "login" ? "Đăng nhập" : "Đăng ký"}
            </button>

            {/* Sign Up Link */}
            {/* <p className="text-center text-black text-[14px] my-[5px]">
              Don&apos;t have an account?{" "}
              <span className="text-[14px] ml-[5px] text-[#2d79f3] font-medium cursor-pointer">
                Sign Up
              </span>
            </p> */}

            <p className="text-center text-black text-[14px] my-[5px]">Hoặc</p>

            {/* Social Login Buttons */}
            <div className="flex flex-row items-center gap-2.5 justify-between">
              {/* Google Button */}
              <button
                type="button"
                className="mt-2.5 w-full h-[50px] rounded-[10px] flex items-center justify-center gap-2.5 border border-[#ededef] bg-white cursor-pointer transition duration-200 ease-in-out hover:border-[#2d79f3]"
                onClick={() => signIn("google")}
              >
                <svg height="20" width="20" viewBox="0 0 512 512">
                  <path
                    fill="#FBBB00"
                    d="M113.47,309.408L95.648,375.94l-65.139,1.378C11.042,341.211,0,299.9,0,256c0-42.451,10.324-82.483,28.624-117.732h0.014l57.992,10.632l25.404,57.644c-5.317,15.501-8.215,32.141-8.215,49.456C103.821,274.792,107.225,292.797,113.47,309.408z"
                  />
                  <path
                    fill="#518EF8"
                    d="M507.527,208.176C510.467,223.662,512,239.655,512,256c0,18.328-1.927,36.206-5.598,53.451c-12.462,58.683-45.025,109.925-90.134,146.187l-0.014-0.014l-73.044-3.727l-10.338-64.535c29.932-17.554,53.324-45.025,65.646-77.911h-136.89V208.176h138.887L507.527,208.176z"
                  />
                  <path
                    fill="#28B446"
                    d="M416.253,455.624l0.014,0.014C372.396,490.901,316.666,512,256,512c-97.491,0-182.252-54.491-225.491-134.681l82.961-67.91c21.619,57.698,77.278,98.771,142.53,98.771c28.047,0,54.323-7.582,76.87-20.818L416.253,455.624z"
                  />
                  <path
                    fill="#F14336"
                    d="M419.404,58.936l-82.933,67.896c-23.335-14.586-50.919-23.012-80.471-23.012c-66.729,0-123.429,42.957-143.965,102.724l-83.397-68.276h-0.014C71.23,56.123,157.06,0,256,0C318.115,0,375.068,22.126,419.404,58.936z"
                  />
                </svg>
                Google
              </button>

              {/* Apple Button */}
              <button
                type="button"
                className="mt-2.5 w-full h-[50px] rounded-[10px] flex items-center justify-center gap-2.5 border border-[#ededef] bg-white cursor-pointer transition duration-200 ease-in-out hover:border-[#2d79f3]"
              >
                <svg height="20" width="20" viewBox="0 0 22.773 22.773">
                  <g>
                    <g>
                      <path d="M15.769,0c0.053,0,0.106,0,0.162,0c0.13,1.606-0.483,2.806-1.228,3.675c-0.731,0.863-1.732,1.7-3.351,1.573 c-0.108-1.583,0.506-2.694,1.25-3.561C13.292,0.879,14.557,0.16,15.769,0z" />
                      <path d="M20.67,16.716c0,0.016,0,0.03,0,0.045c-0.455,1.378-1.104,2.559-1.896,3.655c-0.723,0.995-1.609,2.334-3.191,2.334 c-1.367,0-2.275-0.879-3.676-0.903c-1.482-0.024-2.297,0.735-3.652,0.926c-0.155,0-0.31,0-0.462,0 c-0.995-0.144-1.798-0.932-2.383-1.642c-1.725-2.098-3.058-4.808-3.306-8.276c0-0.34,0-0.679,0-1.019 c0.105-2.482,1.311-4.5,2.914-5.478c0.846-0.52,2.009-0.963,3.304-0.765c0.555,0.086,1.122,0.276,1.619,0.464 c0.471,0.181,1.06,0.502,1.618,0.485c0.378-0.011,0.754-0.208,1.135-0.347c1.116-0.403,2.21-0.865,3.652-0.648 c1.733,0.262,2.963,1.032,3.723,2.22c-1.466,0.933-2.625,2.339-2.427,4.74C17.818,14.688,19.086,15.964,20.67,16.716z" />
                    </g>
                  </g>
                </svg>
                Apple
              </button>
            </div>
          </form>
        </div>
      </div>
      {showAlertSuccess && <AlertSuccess description={alertDescription} />}
      {showAlertError && <AlertError description={alertDescription} />}
    </div>
  );
};

export default Page;
