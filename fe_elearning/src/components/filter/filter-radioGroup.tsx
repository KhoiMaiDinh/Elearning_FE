'use client';
import React from 'react';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

type filterGroup = {
  title: string;
  data: { id: string; value: any }[];
  value: string;
  onChange: (value: string) => void;
};

const FilterRadioGroup: React.FC<filterGroup> = ({ title, data, value, onChange }) => (
  <div>
    <Label className="flex flex-row items-center text-[14px] font-bold py-2 font-sans">
      {title}
    </Label>
    <RadioGroup id={title} value={value} onValueChange={onChange}>
      <div className="flex flex-col gap-3">
        {data.map((item) => (
          <div className="flex items-center space-x-2" key={item.id}>
            <RadioGroupItem value={item.id} id={item.id} />
            <Label htmlFor={item.id} className="text-[12px]">
              {item.value}
            </Label>
          </div>
        ))}
      </div>
    </RadioGroup>
  </div>
);

export default FilterRadioGroup;
