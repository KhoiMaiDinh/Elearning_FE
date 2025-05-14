import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { APIChangeCourseStatus } from '@/utils/course';
import AlertSuccess from '@/components/alert/AlertSuccess';
import AlertError from '@/components/alert/AlertError';
import { RootState } from '@/constants/store';
import { useSelector } from 'react-redux';

interface ToggleSwitchProps {
  courseId: string;
  status: string;
}

const ToggleSwitchButton = ({ courseId, status }: ToggleSwitchProps) => {
  const courseInfo = useSelector((state: RootState) => state.course.courseInfo);

  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('');
  const [showAlertSuccess, setShowAlertSuccess] = useState<boolean>(false);
  const [showAlertError, setShowAlertError] = useState<boolean>(false);
  const [isLoadingCourseInfo, setIsLoadingCourseInfo] = useState<boolean>(true);

  useEffect(() => {
    if (courseInfo) {
      setIsChecked(courseInfo.status === 'PUBLISHED');
      setIsLoadingCourseInfo(false);
    } else {
      setIsLoadingCourseInfo(true);
    }
  }, [courseInfo]);

  useEffect(() => {
    if (showAlertSuccess) {
      const timer = setTimeout(() => setShowAlertSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showAlertSuccess]);

  useEffect(() => {
    if (showAlertError) {
      const timer = setTimeout(() => setShowAlertError(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showAlertError]);

  const handleToggle = async () => {
    if (isLoadingCourseInfo) return; // Nếu đang loading thì không cho toggle

    try {
      const response = await APIChangeCourseStatus(courseId, {
        status: isChecked ? 'DRAFT' : 'PUBLISHED',
      });
      if (response) {
        setShowAlertSuccess(true);
        setDescription('Bạn đã cập nhật trạng thái khóa học thành công');
        setIsChecked(!isChecked);
      }
    } catch (error) {
      console.log(error);
      setShowAlertError(true);
      setDescription('Cập nhật trạng thái khóa học thất bại');
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
      {showAlertSuccess && <AlertSuccess description={description} />}
      {showAlertError && <AlertError description={description} />}
    </div>
  );
};

export default ToggleSwitchButton;
