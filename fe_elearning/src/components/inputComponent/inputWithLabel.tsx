import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';

type inputWithLabel = {
  labelText: string;
  type?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  name?: string;
  placeholder?: string;
  value?: string;
  className?: string;
};
const InputWithLabel: React.FC<inputWithLabel> = ({
  labelText,
  type,
  onChange,
  name,
  placeholder,
  value,
  className,
}) => {
  return (
    <div className={`grid w-full max-w-sm items-center gap-1.5 ${className}`}>
      <Label htmlFor="email">{labelText}</Label>
      <Input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
      />
    </div>
  );
};

export default InputWithLabel;
