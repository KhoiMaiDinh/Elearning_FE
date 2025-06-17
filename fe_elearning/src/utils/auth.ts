import axiosInstance from './axios';
const APILoginEmail = async (data: any) => {
  try {
    const response = await axiosInstance.post('/auth/email/login', data);
    if (response.status === 200) {
      return { data: response.data, status: response.status };
    }
    return null; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  } catch (err) {
    console.error('Error during login email:', err);
    throw err; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
};

const APIRegisterEmail = async (data: any) => {
  try {
    const response = await axiosInstance.post('/auth/email/register', data);

    return { data: response.data, status: response.status };
  } catch (err) {
    console.error('Error during register email:', err);
    throw err; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
};

const APILoginGoogle = async (data: any) => {
  try {
    const response = await axiosInstance.post('/auth/google/login', data);

    return { data: response.data, status: response.status };
  } catch (err) {
    console.error('Error during login google:', err);
    throw err; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
};

const APIRegisterGoogle = async (data: any) => {
  try {
    const response = await axiosInstance.post('/auth/google/register', data);

    return { data: response.data, status: response.status };
  } catch (err) {
    console.error('Error during register google:', err);
    throw err; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
};

const APIRefreshToken = async () => {
  try {
    const response = await axiosInstance.post(`/auth/refresh`, {}, { withCredentials: true });

    return { data: response.data, status: response.status };
  } catch (err) {
    console.error('Error during get info company:', err);
    throw err; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
};

// const APIChangePassword = async (data: ChangePasswordReqType) => {
//   try {
//     const response = await axiosInstance.put(`/admin/change-password`, data)

//     return response.data
//   } catch (err) {
//     console.error('Error during change password:', err)
//     throw err // Ném lỗi ra để xử lý ở chỗ gọi hàm
//   }
// }

const APIForgotPassword = async (data: any) => {
  try {
    const response = await axiosInstance.post('/auth/forgot-password', data);
    return { data: response.data, status: response.status };
  } catch (err) {
    console.error('Error during forgot password:', err);
    throw err; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
};

const APIResetPassword = async (data: any) => {
  try {
    const response = await axiosInstance.post('/auth/reset-password', data);
    return { data: response.data, status: response.status };
  } catch (err) {
    console.error('Error during reset password:', err);
    throw err; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
};

const APIResendEmailVerification = async () => {
  try {
    const response = await axiosInstance.post('/auth/verify/email/resend');
    return { data: response.data, status: response.status };
  } catch (err) {
    console.error('Error during resend email verification:', err);
    throw err; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
};

const APIVerifyEmail = async (token: string) => {
  try {
    const response = await axiosInstance.post('/auth/verify/email', { token });
    return { data: response.data, status: response.status };
  } catch (err) {
    console.error('Error during verify email:', err);
    throw err; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
};

export {
  APILoginEmail,
  APIRegisterEmail,
  APILoginGoogle,
  APIRegisterGoogle,
  APIForgotPassword,
  APIResetPassword,
  APIRefreshToken,
  APIResendEmailVerification,
  APIVerifyEmail,
};
