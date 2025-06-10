import React from 'react';
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

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmClassName?: string;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmDialog: React.FC<ConfirmDeleteDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  title = 'Xác nhận xóa',
  description = 'Bạn có chắc chắn muốn xóa không? Hành động này không thể hoàn tác.',
  confirmClassName,
  confirmText = 'Xóa',
  cancelText = 'Hủy',
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center justify-between text-majorelleBlue">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            className={`bg-redPigment hover:bg-redPigment/70 ${confirmClassName}`}
            onClick={onConfirm}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
