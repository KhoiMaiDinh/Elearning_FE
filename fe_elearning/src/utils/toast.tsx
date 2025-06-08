import { toast } from 'react-toastify';
import { toastStyles } from '@/config/toast-config';
import ToastNotify from '@/components/ToastNotify/toastNotify';

export const showToast = {
  success: (message: string) => {
    toast.success(<ToastNotify status={1} message={message} />, { style: toastStyles.success });
  },
  error: (message: string) => {
    toast.error(<ToastNotify status={-1} message={message} />, { style: toastStyles.error });
  },
};
