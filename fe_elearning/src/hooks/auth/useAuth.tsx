import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from '@/constants/userSlice';
import { APIGetCurrentUser } from '@/utils/user';
import ToastNotify from '@/components/ToastNotify/toastNotify';
import { toast } from 'react-toastify';
import { styleError, styleSuccess } from '@/components/ToastNotify/toastNotifyStyle';
import { useState } from 'react';
import { getVietnameseErrorMessage } from '@/utils/auth';
import { ApiErrorResponse } from '@/types/apiResponse';

export function useAuth() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [bannedUntil, setBannedUntil] = useState('');
  const [showBannedModal, setShowBannedModal] = useState(false);
  const [showUnverifiedModal, setShowUnverifiedModal] = useState(false);

  const clearLoginData = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_expires');
    dispatch(clearUser());
  };

  const handleGetCurrentUser = async () => {
    const response = await APIGetCurrentUser();
    if (response?.status === 200) {
      dispatch(setUser(response.data));
    }
  };

  const handleSuccess = async (response: any) => {
    const decodedToken = JSON.parse(atob(response.data.access_token.split('.')[1]));
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);
    localStorage.setItem('token_expires', response.data.token_expires.toString());

    // Check if user is banned
    if (decodedToken.banned_until) {
      clearLoginData();
      setBannedUntil(decodedToken.banned_until);
      setShowBannedModal(true);
      return;
    }

    // Check if email is verified
    if (!decodedToken.is_verified) {
      setShowUnverifiedModal(true);
      return;
    }

    toast.success(<ToastNotify status={1} message="Đăng nhập thành công" />, {
      style: styleSuccess,
    });
    await handleGetCurrentUser();
    router.push('/');
  };

  const handleError = (error: any) => {
    const errorResponse = error?.response;
    const statusCode = errorResponse?.status;
    const errorData: ApiErrorResponse = errorResponse?.data;

    let errorMessage = 'Đã xảy ra lỗi khi đăng nhập';

    if (!errorResponse) {
      errorMessage = 'Lỗi kết nối. Vui lòng kiểm tra lại đường truyền';
    } else {
      errorMessage = getVietnameseErrorMessage(
        statusCode,
        errorData?.errorCode,
        errorData?.message
      );

      if (errorData?.details && errorData.details.length > 0) {
        errorMessage = errorData.details.map((detail) => detail.message).join(', ');
      }
    }

    toast.error(<ToastNotify status={-1} message={errorMessage} />, { style: styleError });
  };

  return {
    showBannedModal,
    bannedUntil,
    showUnverifiedModal,
    handleSuccess,
    handleError,
    clearLoginData,
    setShowBannedModal,
    setShowUnverifiedModal,
  };
}
