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
  min,
  max,
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
        multiple
        disabled={disabled}
        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
      />
      <label htmlFor={name} className="text-sm">
        {labelText}
      </label>
    </div>
  );
};

export default CreateCouponCheckbox;
