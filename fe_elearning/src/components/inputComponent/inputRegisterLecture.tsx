import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

type inputRegisterLecture = {
  labelText: string;
  type?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  name?: string;
  placeholder?: string;
  value?: any;
  className?: string;
  error?: string;
};
const InputRegisterLecture: React.FC<inputRegisterLecture> = ({
  labelText,
  type,
  onChange,
  name,
  placeholder,
  value,
  className,
  error,
}) => {
  return (
    <div
      className={` w-full max-w-md flex flex-col gap-1.5 ${className} font-sans font-normal text-black70`}
    >
      <Label htmlFor="email">{labelText}</Label>
      <Input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        className={className}
        multiple
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
