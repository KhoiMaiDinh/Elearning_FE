import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CourseForm, SectionType } from '@/types/courseType';
import { useSectionForm } from '@/hooks/course/useSectionForm';
import { Controller } from 'react-hook-form';
import InputRegisterLecture from '@/components/inputComponent/inputRegisterLecture';
import TextAreaRegisterLecture from '@/components/inputComponent/textAreaRegisterLecture';
import AddButton from '@/components/button/addButton';
import { Edit } from 'lucide-react';
import ToastNotify from '@/components/ToastNotify/toastNotify';
import { toast, ToastContainer } from 'react-toastify';
import { styleSuccess } from '@/components/ToastNotify/toastNotifyStyle';
import { styleError } from '@/components/ToastNotify/toastNotifyStyle';
import { useTheme } from 'next-themes';
interface AddSectionDialogProps {
  open: boolean;
  course: CourseForm;
  section: SectionType | null;
  onOpenChange: (open: boolean) => void;
  onSubmitSuccess: () => void;
}

const SectionModal: React.FC<AddSectionDialogProps> = ({
  open,
  course,
  section,
  onOpenChange,
  onSubmitSuccess,
}) => {
  const theme = useTheme();
  const onSave = (successMessage: string) => {
    toast.success(<ToastNotify status={1} message={successMessage} />, { style: styleSuccess });
    onSubmitSuccess();
    onSubmitSuccess();
    handleOpenChange(false);
  };

  const onFail = (errorMessage: string) => {
    toast.error(<ToastNotify status={-1} message={errorMessage} />, {
      style: styleError,
    });
    handleOpenChange(false);
  };
  const { formMethods, submitting, handleCreateSection, handleUpdateSection } = useSectionForm(
    course,
    section,
    onSave,
    onFail
  );

  const handleOpenChange = (open: boolean) => {
    if (submitting) return;
    if (!open) formMethods.reset();
    onOpenChange(open);
  };
  const isEditing = !!section;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl px-4">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Chỉnh Sửa chương' : 'Thêm chương mới'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? `Sửa thông tin chương - ${course.title}`
              : `Thêm chương mới - ${course.title}`}
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto p-2">
          <div>
            <Controller
              name="title"
              control={formMethods.control}
              render={({ field }) => (
                <InputRegisterLecture
                  {...field}
                  labelText="Tiêu đề"
                  isRequired={true}
                  error={formMethods.formState.errors.title?.message}
                  maxLength={60}
                />
              )}
            />
          </div>
          <div>
            <Controller
              name="description"
              control={formMethods.control}
              render={({ field }) => (
                <TextAreaRegisterLecture
                  {...field}
                  value={field.value ?? ''}
                  label="Mô tả chương"
                  className="text-black font-normal mb-2 h-[300px]"
                  error={formMethods.formState.errors.description?.message}
                />
              )}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={submitting}>
            Hủy
          </Button>
          {isEditing ? (
            <AddButton
              label="Sửa chương"
              disabled={submitting}
              loading={submitting}
              onClick={formMethods.handleSubmit(handleUpdateSection)}
              icon={Edit}
            />
          ) : (
            <AddButton
              label="Thêm chương mới"
              disabled={submitting}
              loading={submitting}
              onClick={formMethods.handleSubmit(handleCreateSection)}
            />
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SectionModal;
