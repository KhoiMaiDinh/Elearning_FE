import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud, LucideIcon } from 'lucide-react';
import ImagePicker from '@/components/inputComponent/imagePicker';
import Asterisk from '../asterisk/asterisk';

type InputRegisterLectureProps = {
  labelText?: string;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  placeholder?: string;
  value?: any; // string or number
  className?: string;
  inputClassName?: string;
  error?: string;
  disabled?: boolean;
  multiple?: boolean;
  accept?: string;
  maxLength?: number;
  formatVND?: boolean;
  isRequired?: boolean;
  icon?: LucideIcon;
  iconColor?: string;
};

const InputRegisterLecture: React.FC<InputRegisterLectureProps> = ({
  labelText,
  type,
  onChange,
  name,
  placeholder,
  value,
  className,
  inputClassName,
  error,
  disabled,
  multiple,
  accept,
  maxLength,
  formatVND = false,
  isRequired = false,
  icon: Icon,
  iconColor = 'text-gray-500',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [displayValue, setDisplayValue] = useState<string>(value ?? '');

  const formattedVNDValue = useMemo(() => {
    if (!formatVND || value === undefined || value === null) return value ?? '';
    const raw = value.toString().replace(/[^\d]/g, '');
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(Number(raw));
  }, [value, formatVND]);

  useEffect(() => {
    setDisplayValue(formattedVNDValue);
  }, [formattedVNDValue]);

  const handleVNDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, '');
    const formatted = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(Number(raw));
    setDisplayValue(formatted);

    onChange?.({
      ...e,
      target: {
        ...e.target,
        value: raw,
      },
    } as React.ChangeEvent<HTMLInputElement>);

    setTimeout(() => {
      if (inputRef.current) {
        const pos = formatted.length - 2;
        inputRef.current.setSelectionRange(pos, pos);
      }
    }, 0);
  };

  const handleCustomClick = () => {
    if (fileInputRef.current && type === 'file') {
      fileInputRef.current.click();
    }
  };

  const handleCaretEnforcement = () => {
    if (inputRef.current && formatVND && value) {
      const maxCaret = inputRef.current.value.length - 2;
      const currentPos = inputRef.current.selectionStart || 0;

      if (currentPos > maxCaret) {
        inputRef.current.setSelectionRange(maxCaret, maxCaret);
      }
    }
  };

  return (
    <div
      className={`w-full flex flex-col text-black dark:text-lightSilver relative h-full mb-0 gap-1 ${className}`}
    >
      {labelText && (
        <Label className="flex gap-1">
          {labelText}
          {isRequired && <Asterisk />}
        </Label>
      )}

      <div className="relative">
        {Icon && (
          <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${iconColor}`}>
            <Icon size={18} />
          </div>
        )}

        {type === 'file' ? (
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
            {!disabled && (
              <div
                onClick={handleCustomClick}
                className="cursor-pointer shadow-sm flex font-sans font-normal text-xs text-white flex-row gap-1 w-fit px-4 py-2 items-center justify-center rounded-full dark:border dark:border-lightSilver/50 bg-custom-gradient-button-violet dark:bg-custom-gradient-button-blue hover:brightness-125 hover:underline"
              >
                Upload
                <UploadCloud className="w-4 h-4 text-white" />
              </div>
            )}
          </>
        ) : (
          <Input
            ref={inputRef}
            className={`w-full mb-0 ${Icon ? 'pl-10' : ''} ${inputClassName} ${
              disabled ? 'cursor-not-allowed opacity-50' : ''
            }`}
            type={type}
            id={name}
            name={name}
            placeholder={placeholder}
            value={formatVND ? displayValue : (value ?? '')}
            onChange={formatVND ? handleVNDChange : onChange}
            onKeyUp={formatVND ? handleCaretEnforcement : undefined}
            onClick={formatVND ? handleCaretEnforcement : undefined}
            disabled={disabled}
            maxLength={maxLength}
          />
        )}
      </div>

      <span className="mb-1 font-medium text-[9px] text-redPigment h-[9px]">
        {error && !disabled ? error : ''}
      </span>
    </div>
  );
};

export default InputRegisterLecture;
