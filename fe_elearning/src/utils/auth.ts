import { OAuthToken } from '@/types/oauthToken';
import axiosInstance from './axios';
import {
  ApiResponse,
  LoginSuccessResponse,
  RegisterSuccessResponse,
  ApiErrorResponse,
  HttpStatusCode,
} from '@/types/apiResponse';

const APILoginEmail = async (data: any): Promise<ApiResponse<LoginSuccessResponse>> => {
  try {
    const response = await axiosInstance.post('/auth/email/login', data);
    return { data: response.data, status: response.status };
  } catch (err: any) {
    console.error('Error during login email:', err);
    // Re-throw the error to be handled by the calling component
    throw err;
  }
};

const APIRegisterEmail = async (data: any): Promise<ApiResponse<RegisterSuccessResponse>> => {
  try {
    const response = await axiosInstance.post('/auth/email/register', data);
    return { data: response.data, status: response.status };
  } catch (err: any) {
    console.error('Error during register email:', err);
    // Re-throw the error to be handled by the calling component
    throw err;
  }
};

const APILoginGoogle = async (data: OAuthToken): Promise<ApiResponse<LoginSuccessResponse>> => {
  try {
    const response = await axiosInstance.post('/auth/google/login', data);
    return { data: response.data, status: response.status };
  } catch (err: any) {
    console.log('Error during login google:', err);
    throw err;
  }
};

const APIRegisterGoogle = async (data: any): Promise<ApiResponse<RegisterSuccessResponse>> => {
  try {
    const response = await axiosInstance.post('/auth/google/register', data);
    return { data: response.data, status: response.status };
  } catch (err: any) {
    console.error('Error during register google:', err);
    // Re-throw the error to be handled by the calling component
    throw err;
  }
};

const APIRefreshToken = async (): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.post(`/auth/refresh`, {}, { withCredentials: true });
    return { data: response.data, status: response.status };
  } catch (err: any) {
    console.error('Error during refresh token:', err);
    // Re-throw the error to be handled by the calling component
    throw err;
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

const APIForgotPassword = async (data: any): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.post('/auth/forgot-password', data);
    return { data: response.data, status: response.status };
  } catch (err: any) {
    console.error('Error during forgot password:', err);
    // Re-throw the error to be handled by the calling component
    throw err;
  }
};

const APIResetPassword = async (data: any): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.post('/auth/reset-password', data);
    return { data: response.data, status: response.status };
  } catch (err: any) {
    console.error('Error during reset password:', err);
    // Re-throw the error to be handled by the calling component
    throw err;
  }
};

const APIResendEmailVerification = async (): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.post('/auth/verify/email/resend');
    return { data: response.data, status: response.status };
  } catch (err: any) {
    console.error('Error during resend email verification:', err);
    // Re-throw the error to be handled by the calling component
    throw err;
  }
};

const APIVerifyEmail = async (token: string): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.post('/auth/verify/email', { token });
    return { data: response.data, status: response.status };
  } catch (err: any) {
    console.error('Error during verify email:', err);
    // Re-throw the error to be handled by the calling component
    throw err;
  }
};

// Helper function to extract error message from API response
export const getErrorMessage = (error: any): string => {
  const errorResponse = error?.response;
  const statusCode = errorResponse?.status;
  const errorData: ApiErrorResponse = errorResponse?.data;

  if (!errorResponse) {
    return 'Lỗi kết nối. Vui lòng kiểm tra lại đường truyền';
  }

  // If there are detailed validation errors, combine them
  if (errorData?.details && errorData.details.length > 0) {
    return errorData.details.map((detail) => detail.message).join(', ');
  }

  // Return the main error message
  return errorData?.message || `Lỗi ${statusCode}: Đã xảy ra lỗi không xác định`;
};

// Helper function to get Vietnamese error messages based on status code and error code
export const getVietnameseErrorMessage = (
  statusCode: number,
  errorCode?: string,
  message?: string
): string => {
  switch (statusCode) {
    case HttpStatusCode.BAD_REQUEST:
      return message || 'Dữ liệu không hợp lệ';

    case HttpStatusCode.FORBIDDEN:
      switch (errorCode) {
        case 'ACCOUNT_BANNED':
          return 'Tài khoản của bạn đã bị cấm. Vui lòng liên hệ admin';
        case 'ACCOUNT_LOCKED':
          return 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ admin';
        case 'TOO_MANY_ATTEMPTS':
          return 'Bạn đã đăng nhập sai quá nhiều lần. Vui lòng thử lại sau';
        case 'REGISTRATION_DISABLED':
          return 'Tạm thời không thể đăng ký tài khoản mới';
        case 'EMAIL_DOMAIN_RESTRICTED':
          return 'Email domain này không được phép đăng ký';
        default:
          return message || 'Không có quyền truy cập';
      }

    case HttpStatusCode.NOT_FOUND:
      switch (errorCode) {
        case 'E002':
          return 'Email không tồn tại trong hệ thống';
        default:
          return message || 'Không tìm thấy thông tin';
      }

    case HttpStatusCode.UNPROCESSABLE_ENTITY:
      switch (errorCode) {
        case 'ACCOUNT_NOT_VERIFIED':
          return 'Tài khoản chưa được xác thực. Vui lòng kiểm tra email';
        case 'E001':
          return 'Tên đăng nhập hoặc email đã tồn tại';
        case 'E003':
          return 'Email này đã được sử dụng. Vui lòng chọn email khác';
        case 'E005':
          return 'Thao tác không hợp lệ đối với tài khoản không phải local';
        case 'WEAK_PASSWORD':
          return 'Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn';
        case 'INVALID_EMAIL_FORMAT':
          return 'Định dạng email không hợp lệ';

        default:
          return message || 'Dữ liệu không thể xử lý';
      }

    case HttpStatusCode.UNAUTHORIZED:
      switch (errorCode) {
        case 'E004':
          return 'Email hoặc mật khẩu không chính xác';

        default:
          return message || 'Vui lòng đăng nhập để tiếp tục';
      }

    case HttpStatusCode.INTERNAL_SERVER_ERROR:
      return 'Lỗi máy chủ. Vui lòng thử lại sau';

    default:
      return message || 'Lỗi máy chủ. Vui lòng thử lại sau';
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
