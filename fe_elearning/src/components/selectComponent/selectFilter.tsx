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

type selectFilter = {
  className?: string;
  label?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  placeholder?: string;
  data: { id: string; value: any }[];
  error?: string;
  value?: string;
};
const SelectFilter: React.FC<selectFilter> = ({
  className,
  label,
  placeholder,
  disabled,
  onChange,
  data,
  error,
  value,
}) => {
  return (
    <div className="flex flex-col gap-2 ">
      <div className="flex flex-row ">
        {label && (
          <Label className="flex flex-row items-center text-[14px] font-bold py-2 font-sans pr-2">
            {label}
          </Label>
        )}
      </div>
      <Select disabled={disabled} onValueChange={onChange} value={value}>
        <SelectTrigger className={`w-fit ${className}`}>
          <SelectValue placeholder={placeholder} className="space-x-2" />
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
      {error && <div className="text-[12px] font-sans font-normal text-redPigment">{error}</div>}
    </div>
  );
};

export default SelectFilter;
