import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "../ui/label";

type selectFilter = {
  label: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  placeholder?: string;
  data: { id: string; value: any }[];
};
const SelectFilter: React.FC<selectFilter> = ({
  label,
  placeholder,
  disabled,
  onChange,
  data,
}) => {
  return (
    <div className="flex flex-col gap-2 ">
      <div className="flex flex-row ">
        <Label className="flex flex-row items-center text-[14px] font-bold py-2 font-sans">
          {label}
        </Label>
      </div>
      <Select disabled={disabled}>
        <SelectTrigger className="w-28 sm:w-28 md:w-32 lg:w-36">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup
            onChange={() => onChange}
            className="text-[12px] font-sans font-medium"
          >
            {/* <SelectLabel>{placeholder}</SelectLabel> */}
            {data.map((item, index) => (
              <SelectItem key={index} value={item.id}>
                {item.value}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectFilter;
