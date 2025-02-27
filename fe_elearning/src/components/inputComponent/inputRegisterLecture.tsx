// @/components/inputComponent/inputRegisterLecture.tsx
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  return (
    <div
      className={`w-full max-w-md flex flex-col gap-1.5 ${className} font-sans font-normal text-black70 dark:text-lightSilver`}
    >
      <Label htmlFor={name}>{labelText}</Label>
      <Input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        // Không truyền value nếu type="file"
        {...(type !== "file" && { value })}
        onChange={onChange}
        disabled={disabled}
        multiple={multiple}
        accept={accept}
      />
      {error && (
        <div className="text-[12px] font-sans font-normal text-redPigment">
          {error}
        </div>
      )}
    </div>
  );
};

export default InputRegisterLecture;
