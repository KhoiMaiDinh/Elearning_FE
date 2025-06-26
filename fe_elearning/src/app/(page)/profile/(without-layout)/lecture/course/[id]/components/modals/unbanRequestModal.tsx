import ToastNotify from '@/components/ToastNotify/toastNotify';
import { styleError, styleSuccess } from '@/components/ToastNotify/toastNotifyStyle';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UnbanRequestType } from '@/types/unbanRequestType';
import { APIRequestCourseUnban } from '@/utils/unbanRequest';
import { Send } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface UnbanRequestModalProps {
  courseId: string;
  hasPendingRequest: boolean;
  handleSubmitSuccess: () => void;
}

export const UnbanRequestSchema = yup.object({
  reason: yup
    .string()
    .required('Lý do không được để trống')
    .max(1000, 'Lý do không được vượt quá 1000 ký tự'),
});

const UnbanRequestModal = ({
  courseId,
  hasPendingRequest,
  handleSubmitSuccess,
}: UnbanRequestModalProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Pick<UnbanRequestType, 'reason'>>({
    resolver: yupResolver(UnbanRequestSchema),
    defaultValues: { reason: '' },
  });

  const reasonValue = watch('reason');
  const reasonLength = reasonValue?.length || 0;

  const onSubmit = (data: Pick<UnbanRequestType, 'reason'>) => {
    handleRequestUnban(data.reason);
    setModalOpen(false);
    reset();
  };

  const handleRequestUnban = async (reason: string) => {
    setSubmitting(true);
    try {
      const response = await APIRequestCourseUnban(courseId, { reason: reason });
      if (response?.status === 201) {
        toast.success(
          <ToastNotify status={1} message="Yêu cầu mở khóa đã được gửi, vui lòng đợi phê duyệt" />,
          {
            style: styleSuccess,
          }
        );
        handleSubmitSuccess();
      }
    } catch {
      toast.error(<ToastNotify status={-1} message="Yêu cầu mở khóa không thành công" />, {
        style: styleError,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span tabIndex={0}>
              {' '}
              {/* Make span focusable for keyboard users */}
              <Button
                onClick={() => setModalOpen(true)}
                disabled={hasPendingRequest}
                className="flex items-center gap-2 pointer-events-auto" // keep pointer events
              >
                <Send className="w-4 h-4" />
                Yêu cầu mở khóa khóa học
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p className="flex-wrap text-wrap text-left text-white shadow whitespace-pre-line">
              {hasPendingRequest
                ? 'You already have a pending request'
                : 'Send course unban request'}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-sm:max-w-[500px] max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              Yêu cầu mở khóa khóa học
            </DialogTitle>
            <DialogDescription>
              Gửi yêu cầu để khóa học của bạn được xem xét mở khóa. Vui lòng giải thích các vi phạm
              đã được khắc phục và những cải tiến cụ thể đã thực hiện.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full pt-4 relative">
            <div className="space-y-2">
              <div className="flex w-full justify-between">
                <Label htmlFor="reason">Lý do yêu cầu mở khóa</Label>
                <div className="pr-1 pb-[2px] text-xs text-muted-foreground flex items-end ">
                  {reasonLength}/1000
                </div>
              </div>
              <Textarea
                id="reason"
                rows={4}
                disabled={submitting}
                placeholder="Giải thích cách bạn đã khắc phục từng vi phạm và những thay đổi bạn đã thực hiện..."
                {...register('reason')}
              />
            </div>
            <span className="mb-1 font-medium text-[9px] text-redPigment h-[9px]">
              {errors.reason?.message || ''}
            </span>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setModalOpen(false);
                  reset();
                }}
                disabled={submitting}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
              </Button>
            </div>

            {hasPendingRequest && (
              <p className="text-sm text-muted-foreground text-center">
                Bạn đã có một yêu cầu mở khóa đang chờ xử lý. Vui lòng đợi được xem xét.
              </p>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UnbanRequestModal;
