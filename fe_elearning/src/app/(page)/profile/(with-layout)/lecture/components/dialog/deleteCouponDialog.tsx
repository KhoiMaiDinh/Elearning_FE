import ToastNotify from '@/components/ToastNotify/toastNotify';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Spinner } from '@/components/ui/spinner';
import { CouponType } from '@/types/couponType';
import { APIDeleteCoupon } from '@/utils/coupon';
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { styleError, styleSuccess } from '@/components/ToastNotify/toastNotifyStyle';
import { useTheme } from 'next-themes';
type DialogOptions = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupon?: CouponType;
  handleSuccess?: () => void;
  handleError?: () => void;
};

const DeleteCouponDialog: React.FC<DialogOptions> = ({
  open,
  onOpenChange,
  coupon,
  handleSuccess,
  handleError,
}) => {
  const [loading, setIsLoading] = useState(false);
  const theme = useTheme();
  const showSuccess = (message: string) => {
    toast.success(<ToastNotify status={1} message={message} />, { style: styleSuccess });
  };

  const showError = (message: string) => {
    toast.error(<ToastNotify status={-1} message={message} />, { style: styleError });
  };

  const handleDelete = async () => {
    setIsLoading(true);
    if (!coupon) {
      showError('Không tìm thấy Coupon');
      setIsLoading(false);
      handleError?.();
      return;
    }

    try {
      await APIDeleteCoupon(coupon?.code);
      showSuccess(`Xóa thành công Coupon ${coupon?.code}`);
      handleSuccess?.();
    } catch (error) {
      console.log(error);
      showError(`Xóa thất bại Coupon ${coupon?.code}`);
      handleError?.();
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center justify-between text-majorelleBlue">
            Bạn có chắc chắn không?
            {loading && <Spinner className="text-majorelleBlue" size="small" />}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn Coupon của bạn.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading} className="border-lightSilver">
            Thoát
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            className="bg-redPigment hover:bg-redPigment/70"
            onClick={handleDelete}
          >
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default DeleteCouponDialog;
