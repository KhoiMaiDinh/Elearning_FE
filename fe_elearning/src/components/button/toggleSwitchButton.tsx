import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { APIChangeCourseStatus } from '@/utils/course';
import { RootState } from '@/constants/store';
import { useSelector } from 'react-redux';
import ToastNotify from '../ToastNotify/toastNotify';
import { toast, ToastContainer } from 'react-toastify';
import { styleSuccess } from '../ToastNotify/toastNotifyStyle';
import { styleError } from '../ToastNotify/toastNotifyStyle';
import { useTheme } from 'next-themes';
interface ToggleSwitchProps {
  courseId: string;
  status: string;
}

const ToggleSwitchButton = ({ courseId, status }: ToggleSwitchProps) => {
  const courseInfo = useSelector((state: RootState) => state.course.courseInfo);
  const theme = useTheme();
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isLoadingCourseInfo, setIsLoadingCourseInfo] = useState<boolean>(true);

  useEffect(() => {
    if (courseInfo) {
      setIsChecked(courseInfo.status === 'PUBLISHED');
      setIsLoadingCourseInfo(false);
    } else {
      setIsLoadingCourseInfo(true);
    }
  }, [courseInfo]);

  const handleToggle = async () => {
    if (isLoadingCourseInfo) return; // Nếu đang loading thì không cho toggle

    try {
      const response = await APIChangeCourseStatus(courseId, {
        status: isChecked ? 'DRAFT' : 'PUBLISHED',
      });
      if (response) {
        toast.success(
          <ToastNotify status={1} message="Bạn đã cập nhật trạng thái khóa học thành công" />,
          { style: styleSuccess }
        );
        setIsChecked(!isChecked);
      }
    } catch (error) {
      console.log(error);
      toast.error(<ToastNotify status={-1} message="Cập nhật trạng thái khóa học thất bại" />, {
        style: styleError,
      });
    }
  };

  return (
    <div className="flex items-center gap-2 justify-center px-8">
      {status && !isLoadingCourseInfo && (
        <div className="flex flex-row items-center gap-2">
          <span
            className={cn(
              'text-sm font-bold text-center',
              isChecked ? 'text-vividMalachite' : 'text-redPigment'
            )}
          >
            {isChecked ? 'Hoạt động' : 'Tắt'}
          </span>
          <Switch
            checked={isChecked}
            onCheckedChange={handleToggle}
            disabled={isLoadingCourseInfo}
            className={cn(
              'relative inline-flex h-4 w-7 cursor-pointer rounded-full transition-colors duration-200 ease-out',
              isChecked ? 'bg-vividMalachite' : 'bg-darkSilver dark:bg-lightSilver'
            )}
          >
            <span
              className={cn(
                'absolute left-[2px] top-[2px] h-3 w-3 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-out',
                isChecked ? 'translate-x-3' : 'translate-x-0'
              )}
            />
          </Switch>
        </div>
      )}
    </div>
  );
};

export default ToggleSwitchButton;
