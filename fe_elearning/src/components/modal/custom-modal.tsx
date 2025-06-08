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
import { showToast } from '@/utils/toast';
import { useTheme } from 'next-themes';

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
  const theme = useTheme();

  const handleResendEmailVerification = async () => {
    try {
      const response = await APIResendEmailVerification();
      if (response.status === 200) {
        showToast.success('Email xác thực đã được gửi lại');
      }
    } catch (error) {
      showToast.error('Lỗi khi gửi lại email xác thực');
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
