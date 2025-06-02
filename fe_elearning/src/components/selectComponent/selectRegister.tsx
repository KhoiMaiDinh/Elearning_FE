import * as React from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type selectFilter = {
  label: string;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  data: { id: string; value: any }[];
  error?: string;
  className?: string;
  value?: string;
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
}) => {
  return (
    <div
      className={`w-full max-w-full flex flex-col gap-1.5 ${className} font-sans font-normal text-black70 dark:text-lightSilver`}
    >
      {/* <Label>{label}</Label> */}
      <Select disabled={disabled} onValueChange={onValueChange} value={value}>
        <SelectTrigger className="w-full sm:min-w-28 md:min-w-32 lg:min-w-36 ">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup className="text-[12px] font-sans font-medium">
            {/* <SelectLabel>{placeholder}</SelectLabel> */}
            {data.map((item, index) => (
              <SelectItem key={index} value={item.id}>
                {item.value}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {error && <div className="text-[12px] font-sans font-normal text-redPigment">{error}</div>}
    </div>
  );
};

export default SelectRegister;
