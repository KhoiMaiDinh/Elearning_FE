'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { clearUser } from '@/constants/userSlice';
import { APIResendEmailVerification } from '@/utils/auth';
import { useDispatch } from 'react-redux';
import ToastNotify from '../ToastNotify/toastNotify';
import { toast } from 'react-toastify';
import { styleError, styleSuccess } from '../ToastNotify/toastNotifyStyle';

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  showContinueButton?: boolean;
  onContinue?: () => void;
}

export function CustomModal({
  isOpen,
  onClose,
  title,
  description,
  showContinueButton = false,
  onContinue,
}: CustomModalProps) {
  const dispatch = useDispatch();

  const handleResendEmailVerification = async () => {
    try {
      const response = await APIResendEmailVerification();
      if (response.status === 200) {
        toast.success(<ToastNotify status={1} message="Email xác thực đã được gửi lại" />, {
          style: styleSuccess,
        });
        // showToast.success('Email xác thực đã được gửi lại');
      }
    } catch (error) {
      toast.error(<ToastNotify status={-1} message="Lỗi khi gửi lại email xác thực" />, {
        style: styleError,
      });
      // showToast.error('Lỗi khi gửi lại email xác thực');
    }
  };

  const handleContinue = () => {
    dispatch(clearUser());
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_expires');
    onContinue?.();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {showContinueButton && (
            <Button variant="outline" onClick={handleContinue}>
              Tiếp tục ẩn danh
            </Button>
          )}
          <Button onClick={handleResendEmailVerification}>Gửi lại xác thực</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
