import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type InputConfig = {
  data?: any[];
  dataKey?: string;
  dataValue?: string;
  labelText: string;
  type?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement> | undefined;
  name?: string;
  placeholder?: string;
  value?: any;
  className?: string;
  error?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  isRequired?: boolean;
};

const CreateCouponInput: React.FC<InputConfig> = ({
  data,
  dataKey,
  dataValue,
  labelText,
  type,
  onChange,
  onBlur,
  name,
  placeholder,
  value,
  error,
  disabled,
  min,
  max,
  isRequired = false,
}) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <label htmlFor="code" className="text-right text-sm font-medium -translate-y-2">
        {isRequired && (
          <span className="text-[#f43f5e] mr-1 select-none font-semibold animate-pulse">*</span>
        )}
        {labelText}{' '}
      </label>
      <div className="col-span-3 flex flex-col">
        {type !== 'select' ? (
          <Input
            onBlur={onBlur}
            min={min}
            max={max}
            type={type}
            id={name}
            name={name}
            placeholder={placeholder}
            multiple
            disabled={disabled}
            value={
              type === 'date' && value instanceof Date ? value.toISOString().split('T')[0] : value
            }
            onChange={(e) => {
              if (type === 'date') {
                const dateValue = new Date(e.target.value);
                onChange?.(dateValue as any); // cast required for Controller
              } else {
                onChange?.(e);
              }
            }}
            className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        ) : (
          <Select disabled={disabled} onValueChange={(val) => onChange?.(val as any)} value={value}>
            <SelectTrigger
              className={`col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-darkSilver ${
                disabled
                  ? 'cursor-not-allowed border-solid bg-[#e5e7e9] font-bold text-black'
                  : 'cursor-pointer bg-white text-black'
              }`}
            >
              <SelectValue className="placeholder:text-darkSilver" placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-white/70 backdrop-blur-md border border-gray-200 shadow-md rounded-md">
              <SelectGroup>
                {data &&
                  data.map((item) => (
                    <SelectItem key={item[dataKey!]} value={item[dataKey!]} className="">
                      {item[dataValue!]}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}

        <span className="my-1 text-[9px] text-redPigment h-[9px]">
          {error && !disabled ? error : ''}
        </span>
      </div>
    </div>
  );
};

export default CreateCouponInput;
