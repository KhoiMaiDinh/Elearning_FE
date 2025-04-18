import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { APIChangeCourseStatus } from "@/utils/course";
import AlertSuccess from "@/components/alert/AlertSuccess";
import AlertError from "@/components/alert/AlertError";
interface ToggleSwitchProps {
  courseId: string;
  status: string;
}

const ToggleSwitchButton = ({ courseId, status }: ToggleSwitchProps) => {
  const [isChecked, setIsChecked] = useState(
    status === "PUBLISHED" ? true : false
  );
  const [description, setDescription] = useState("");
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);

  useEffect(() => {
    if (showAlertSuccess) {
      setTimeout(() => {
        setShowAlertSuccess(false);
      }, 3000);
    }
  }, [showAlertSuccess]);
  useEffect(() => {
    if (showAlertError) {
      setTimeout(() => {
        setShowAlertError(false);
      }, 3000);
    }
  }, [showAlertError]);
  const handleToggle = async () => {
    try {
      const response = await APIChangeCourseStatus(courseId, {
        status: isChecked ? "DRAFT" : "PUBLISHED",
      });
      if (response) {
        setShowAlertSuccess(true);
        setDescription("Bạn đã cập nhật trạng thái khóa học thành công");
        setIsChecked(!isChecked);
      }
    } catch (error) {
      setShowAlertError(true);
      setDescription("Cập nhật trạng thái khóa học thất bại");
      // Revert state on error
      // setIsChecked(!isChecked);
    }
  };

  return (
    <div className="flex items-center gap-2 justify-center px-8">
      <div className="flex flex-row items-center gap-2">
        <span
          className={` text-sm font-bold text-redPigment text-center ${
            isChecked ? "text-vividMalachite" : "text-redPigment"
          }`}
        >
          {isChecked ? "Hoạt động" : "Tắt"}
        </span>
        <Switch
          checked={isChecked}
          onCheckedChange={handleToggle}
          className={cn(
            "relative inline-flex h-4 w-7 cursor-pointer rounded-full transition-colors duration-200 ease-out",
            isChecked
              ? "bg-vividMalachite"
              : "bg-darkSilver dark:bg-lightSilver"
          )}
        >
          <span
            className={cn(
              "absolute left-[2px] top-[2px] h-3 w-3 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-out",
              isChecked ? "translate-x-3" : "translate-x-0"
            )}
          />
        </Switch>
      </div>
      {showAlertSuccess && <AlertSuccess description={description} />}
      {showAlertError && <AlertError description={description} />}
    </div>
  );
};

export default ToggleSwitchButton;
