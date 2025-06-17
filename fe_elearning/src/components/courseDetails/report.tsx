import { useState } from 'react';
import { Flag, X } from 'lucide-react';
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
  const {
    control,
    handleSubmit,
    setValue,
    // formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(schema) as unknown as Resolver<any>,
    defaultValues: {
      content: '',
    },
  });

  const [showReport, setShowReport] = useState(false);
  const theme = useTheme();
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
  };

  const _handleCloseReport = () => {
    setShowReport(false);
  };

  return (
    <>
      <div className="flex flex-col items-end gap-3">
        {/* Menu Options */}
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
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Báo cáo vi phạm</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Popup Report Form */}
      {showReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-[90%] max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-eerieBlack">
            <button
              className="absolute right-3 top-3 text-gray-400 hover:text-red-500"
              onClick={() => setShowReport(false)}
            >
              <X size={20} />
            </button>
            <h2 className="mb-4 text-lg font-semibold text-eerieBlack dark:text-white">
              Gửi báo cáo vi phạm
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="content"
                  className="text-sm font-medium text-gray-700 dark:text-white"
                >
                  {label}
                </label>
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <Controller
                control={control}
                name="content"
                render={({ field }: { field: any }) => (
                  <textarea
                    {...field}
                    required
                    placeholder="Nội dung báo cáo..."
                    className="min-h-[100px] w-full rounded border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-majorelleBlue dark:bg-black dark:text-white"
                  />
                )}
              />
              <button
                type="submit"
                className="self-end rounded bg-majorelleBlue px-4 py-2 text-white hover:bg-opacity-80"
              >
                Gửi báo cáo
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
