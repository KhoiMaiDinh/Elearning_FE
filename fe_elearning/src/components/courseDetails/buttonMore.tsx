import { useState } from 'react';
import { Flag, Star, X } from 'lucide-react';
import { APICreateReport } from '@/utils/report';
import { useForm, Controller, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ToastNotify from '../ToastNotify/toastNotify';
import { toast, ToastContainer } from 'react-toastify';
import { styleSuccess } from '../ToastNotify/toastNotifyStyle';
import { styleError } from '../ToastNotify/toastNotifyStyle';
import { useTheme } from 'next-themes';
const schema = yup.object({
  content: yup.string().required('Nội dung báo cáo không được để trống'),
});

export default function ButtonMore({ course_id }: { course_id: string }) {
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

  const [showMore, setShowMore] = useState(false);
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
      type: 'COURSE',
      content_id: course_id,
      reason: data.content,
    };
    await handleCreateReport(dataReport);
  };

  const handleClearData = () => {
    setValue('content', '');
  };

  return (
    <>
      <div className="fixed bottom-10 right-2 z-50 flex flex-col items-end gap-3">
        {/* Menu Options */}
        {showMore && (
          <div className="mb-2 w-40 rounded-lg bg-white p-2 shadow-md dark:bg-eerieBlack">
            <ul className="flex flex-col gap-2 text-sm">
              <li
                className="flex items-center gap-2 cursor-pointer hover:text-majorelleBlue"
                onClick={() => {
                  setShowReport(true);
                  setShowMore(false);
                }}
              >
                <Flag size={16} />
                <span>Báo cáo</span>
              </li>
              <li className="flex items-center gap-2 cursor-pointer hover:text-majorelleBlue">
                <Star size={16} />
                <span>Đánh giá</span>
              </li>
            </ul>
          </div>
        )}

        {/* Nút ba chấm */}
        <button
          onClick={() => setShowMore((prev) => !prev)}
          className="text-white flex h-10 w-10 items-center justify-center rounded-full bg-custom-gradient-button-violet dark:bg-custom-gradient-button-blue shadow-md transition hover:scale-110"
        >
          <div className="flex items-center gap-1">
            <div className="h-1 w-1 rounded-full bg-white" />
            <div className="h-1 w-1 rounded-full bg-white" />
            <div className="h-1 w-1 rounded-full bg-white" />
          </div>
        </button>
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
              Gửi báo cáo khóa học
            </h2>
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
