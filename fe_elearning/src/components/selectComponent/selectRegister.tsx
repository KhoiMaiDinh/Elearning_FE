import * as React from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '../ui/label';
import Asterisk from '../asterisk/asterisk';

type selectFilter = {
  label?: string;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  data: { id: string; value: any }[];
  error?: string;
  className?: string;
  value?: string;
  isRequired?: boolean;
  inputClassName?: string;
};
const SelectRegister: React.FC<selectFilter> = ({
  label,
  placeholder,
  disabled,
  onValueChange,
  data,
  error,
  className,
  value,
  isRequired = false,
  inputClassName,
}) => {
  return (
    <div
      className={`w-full max-w-full flex flex-col gap-1.5 ${className} font-sans font-normal text-black70 dark:text-lightSilver`}
    >
      {label && (
        <Label className="flex gap-1">
          {label}
          {isRequired && <Asterisk />}
        </Label>
      )}
      <Select disabled={disabled} onValueChange={onValueChange} value={value}>
        <SelectTrigger className={`w-full sm:min-w-28 md:min-w-32 lg:min-w-36 ${inputClassName} `}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup className="text-[12px] font-sans font-medium">
            {/* <SelectLabel>{placeholder}</SelectLabel> */}
            {data &&
              data.length > 0 &&
              data.map((item, index) => (
                <SelectItem key={index} value={item.id}>
                  {item.value}
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {error && <div className="mb-1 font-medium text-[9px] text-redPigment h-[9px]">{error}</div>}
    </div>
  );
};

export default SelectRegister;
