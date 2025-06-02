import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud } from 'lucide-react';
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
  error?: string;
  disabled?: boolean;
  multiple?: boolean;
  accept?: string;
  maxLength?: number;
  formatVND?: boolean;
  isRequired?: boolean;
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
  maxLength,
  formatVND = false,
  isRequired = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [displayValue, setDisplayValue] = useState<string>(value || '');

  const formattedVNDValue = useMemo(() => {
    if (!formatVND || value === undefined || value === null) return value || '';
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
      className={`w-full flex flex-col  text-black dark:text-lightSilver relative h-full mb-0 gap-1 ${className}`}
    >
      {labelText && (
        <Label className="flex gap-1">
          {labelText}
          {isRequired && <Asterisk />}
        </Label>
      )}

      {type === 'file' ? (
        <>
          <Input
            type="file"
            id={name}
            name={name}
            ref={fileInputRef}
            className="hidden"
            onChange={onChange}
            disabled={disabled}
            multiple={multiple}
            accept={accept}
            inputMode="text"
          />
        </>
      ) : (
        <Input
          lang="vi"
          inputMode="text"
          autoComplete="off"
          // spellCheck={false}
          ref={inputRef}
          className="w-full mb-0"
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          value={formatVND ? displayValue : value}
          onChange={formatVND ? handleVNDChange : onChange}
          onKeyUp={formatVND ? handleCaretEnforcement : undefined}
          onClick={formatVND ? handleCaretEnforcement : undefined}
          disabled={disabled}
          maxLength={maxLength}
        />
      )}

      <span className="mb-1 font-medium text-[9px] text-redPigment h-[9px]">
        {error && !disabled ? error : ''}
      </span>
    </div>
  );
};

export default InputRegisterLecture;
