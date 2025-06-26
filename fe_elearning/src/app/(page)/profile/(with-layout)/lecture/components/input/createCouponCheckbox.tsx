import { Input } from '@/components/ui/input';

type CheckboxConfig = {
  labelText: string;
  type?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  name?: string;
  placeholder?: string;
  value?: any;
  className?: string;
  error?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
};

const CreateCouponCheckbox: React.FC<CheckboxConfig> = ({
  labelText,
  onChange,
  name,
  placeholder,
  value,
  disabled,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Input
        type="checkbox"
        id={name}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        checked={value}
        disabled={disabled}
        className="focus-within:ring-0 ring-0 border-0 focus:border-0 shadow-none"
      />
      <label htmlFor={name} className="text-sm">
        {labelText}
      </label>
    </div>
  );
};

export default CreateCouponCheckbox;
