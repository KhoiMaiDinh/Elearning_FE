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
import { CourseForm, Section } from '@/types/courseType';
import { useSectionForm } from '@/hooks/course/useSectionForm';
import { Controller } from 'react-hook-form';
import InputRegisterLecture from '@/components/inputComponent/inputRegisterLecture';
import TextAreaRegisterLecture from '@/components/inputComponent/textAreaRegisterLecture';
import AddButton from '@/components/button/addButton';
import { Edit } from 'lucide-react';

interface AddSectionDialogProps {
  open: boolean;
  course: CourseForm;
  section: Section | null;
  onOpenChange: (open: boolean) => void;
  onSubmitSuccess: () => void;
  setShowAlertSuccess: (show: boolean) => void;
  setShowAlertError: (show: boolean) => void;
  setDescription: (desc: string) => void;
}

const SectionModal: React.FC<AddSectionDialogProps> = ({
  open,
  course,
  section,
  onOpenChange,
  onSubmitSuccess,
  setShowAlertSuccess,
  setShowAlertError,
  setDescription,
}) => {
  const onSave = (successMessage: string) => {
    setShowAlertSuccess(true);
    setDescription(successMessage);
    onSubmitSuccess();
    handleOpenChange(false);
    setTimeout(() => {
      setShowAlertSuccess(false);
    }, 3000);
  };

  const onFail = (errorMessage: string) => {
    setShowAlertError(true);
    setDescription(errorMessage);
    handleOpenChange(false);
    setTimeout(() => {
      setShowAlertError(false);
    }, 3000);
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
                  labelText="Mô tả chương"
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
