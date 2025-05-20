import AlertError from '@/components/alert/AlertError';
import AlertSuccess from '@/components/alert/AlertSuccess';
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
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);
  const [alertDescription, setAlertDescription] = useState('');

  const showSuccess = (message: string) => {
    setAlertDescription(message);
    setShowAlertSuccess(true);
    setTimeout(() => setShowAlertSuccess(false), 3000);
  };

  const showError = (message: string) => {
    setAlertDescription(message);
    setShowAlertError(true);
    setTimeout(() => setShowAlertError(false), 3000);
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
      {showAlertSuccess && <AlertSuccess description={alertDescription} />}
      {showAlertError && <AlertError description={alertDescription} />}
    </AlertDialog>
  );
};
export default DeleteCouponDialog;
