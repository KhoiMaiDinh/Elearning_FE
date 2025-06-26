import { useState } from 'react';
import { Flag, Send } from 'lucide-react';
import { APICreateReport } from '@/utils/report';
import { useForm, Controller, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ToastNotify from '../ToastNotify/toastNotify';
import { toast } from 'react-toastify';
import { styleSuccess } from '../ToastNotify/toastNotifyStyle';
import { styleError } from '../ToastNotify/toastNotifyStyle';
import { useTheme } from 'next-themes';
import { Button } from '../ui/button';
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Dialog,
  DialogContent,
} from '../ui/dialog';

const schema = yup.object({
  content: yup.string().required('Nội dung báo cáo không được để trống'),
});

export default function ReportButton({
  course_id,
  type,
  label,
}: {
  course_id: string;
  type: string;
  label?: string;
}) {
  const { control, handleSubmit, setValue, watch } = useForm<any>({
    resolver: yupResolver(schema) as unknown as Resolver<any>,
    defaultValues: {
      content: '',
    },
  });

  const [showReport, setShowReport] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const theme = useTheme();
  const content = watch('content');

  const handleCreateReport = async (data: any) => {
    const response = await APICreateReport(data);
    if (response?.status === 201) {
      setShowReport(false);
      handleClearData();
      toast.success(<ToastNotify status={1} message="Báo cáo đã được gửi thành công" />, {
        style: styleSuccess,
      });
    } else {
      toast.error(<ToastNotify status={-1} message="Báo cáo không thành công" />, {
        style: styleError,
      });
    }
  };

  const onSubmit = async (data: any) => {
    const dataReport = {
      type: type,
      content_id: course_id,
      reason: data.content,
    };
    await handleCreateReport(dataReport);
  };

  const handleClearData = () => {
    setValue('content', '');
    setSelectedReason(null);
  };

  const handleReasonSelect = (value: string, label: string) => {
    setSelectedReason(value);
    setValue('content', value === 'other' ? '' : label);
  };

  return (
    <>
      <div className="flex flex-col items-end gap-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div
                className="flex items-center gap-2 cursor-pointer text-redPigment hover:cursor-pointer"
                onClick={() => {
                  setShowReport(true);
                }}
              >
                <Flag className="w-4 h-4" />
                {label && <span>{label}</span>}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Báo cáo vi phạm</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Dialog
          open={showReport}
          onOpenChange={(open) => {
            if (!open) {
              handleClearData();
            }
            setShowReport(open);
          }}
        >
          <DialogContent className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 w-full max-w-md">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-white flex items-center space-x-2">
                <Flag className="w-5 h-5 text-red-400" />
                <span>Báo cáo vi phạm</span>
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-slate-300 text-sm">
                Vui lòng chọn lý do báo cáo:
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                {[
                  { value: 'spam', label: 'Spam hoặc quảng cáo' },
                  { value: 'inappropriate', label: 'Nội dung không phù hợp' },
                  { value: 'harassment', label: 'Quấy rối hoặc bắt nạt' },
                  { value: 'misinformation', label: 'Thông tin sai lệch' },
                  { value: 'copyright', label: 'Vi phạm bản quyền' },
                  { value: 'other', label: 'Lý do khác' },
                ].map((reason) => (
                  <Button
                    key={reason.value}
                    type="button"
                    variant={selectedReason === reason.value ? 'default' : 'ghost'}
                    className={`w-full justify-start ${
                      selectedReason === reason.value
                        ? 'bg-majorelleBlue text-white'
                        : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white'
                    }`}
                    onClick={() => handleReasonSelect(reason.value, reason.label)}
                  >
                    {reason.label}
                  </Button>
                ))}
              </div>

              {selectedReason === 'other' && (
                <Controller
                  control={control}
                  name="content"
                  render={({ field }) => (
                    <textarea
                      {...field}
                      required
                      placeholder="Nhập lý do khác..."
                      className="min-h-[100px] w-full rounded bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 p-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-majorelleBlue"
                    />
                  )}
                />
              )}

              <DialogFooter className="border-t border-gray-200 dark:border-slate-700 pt-4 space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                  onClick={() => {
                    setShowReport(false);
                    handleClearData();
                  }}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  className="bg-majorelleBlue text-white hover:bg-opacity-80"
                  disabled={!selectedReason || (selectedReason === 'other' && !content)}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Gửi báo cáo
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
