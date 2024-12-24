import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

type textAreaRegisterLecture = {
  labelText: string;
  type?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  className?: string;
  onChange?: (e: React.FormEvent<HTMLTextAreaElement>) => void;
  error?: string;
  disabled?: boolean;
};
const TextAreaRegisterLecture: React.FC<textAreaRegisterLecture> = ({
  labelText,
  type,
  onChange,
  name,
  placeholder,
  value,
  className,
  error,
  disabled,
}) => {
  return (
    <div
      className={`grid w-full gap-1.5 ${className} font-sans font-normal text-black70`}
    >
      <Label htmlFor={name}>{labelText}</Label>
      <Textarea
        placeholder={placeholder}
        id={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      {error && (
        <div className="text-[12px] font-sans font-normal text-redPigment">
          {error}
        </div>
      )}
    </div>
  );
};

export default TextAreaRegisterLecture;
