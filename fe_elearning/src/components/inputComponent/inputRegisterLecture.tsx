import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, UploadCloud } from "lucide-react";

type InputRegisterLectureProps = {
  labelText: string;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  placeholder?: string;
  value?: any; // Có thể là string hoặc string[]
  className?: string;
  error?: string;
  disabled?: boolean;
  multiple?: boolean;
  accept?: string;
};

const InputRegisterLecture: React.FC<InputRegisterLectureProps> = ({
  labelText,
  type,
  onChange,
  name,
  placeholder,
  value,
  className,
  error,
  disabled,
  multiple,
  accept,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Xử lý khi nhấp vào giao diện tùy chỉnh để kích hoạt input file
  const handleCustomClick = () => {
    if (fileInputRef.current && type === "file") {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className={`w-full max-w-md flex flex-col gap-1.5 ${className} font-sans font-normal text-black70 dark:text-lightSilver`}
    >
      <Label htmlFor={name}>{labelText}</Label>
      {type === "file" ? (
        <>
          {/* Input file ẩn */}
          <Input
            type="file"
            id={name}
            name={name}
            ref={fileInputRef}
            className="hidden" // Ẩn input file mặc định
            onChange={onChange}
            disabled={disabled}
            multiple={multiple}
            accept={accept}
          />
          {/* Giao diện tùy chỉnh */}
          <div
            onClick={handleCustomClick}
            className="cursor-pointer shadow-sm flex font-sans font-normal text-xs text-white flex-row gap-1 w-fit px-4 py-2 items-center justify-center rounded-full dark:border dark:border-lightSilver/50 bg-custom-gradient-button-violet dark:bg-custom-gradient-button-blue hover:brightness-125 hover:underline"
          >
            Upload
            <UploadCloud className="w-4 h-4 text-white" />
          </div>
        </>
      ) : (
        <Input
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      )}
      {error && (
        <div className="text-[12px] font-sans font-normal text-redPigment">
          {error}
        </div>
      )}
    </div>
  );
};

export default InputRegisterLecture;
