import * as React from 'react';
import { addDays, format, isBefore, isAfter } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'react-toastify';
import { styleError } from '@/components/ToastNotify/toastNotifyStyle';
import ToastNotify from '@/components/ToastNotify/toastNotify';

interface DateRangePickerProps {
  date: DateRange;
  setDate: (date: DateRange) => void;
  className?: string;
}

export function DateRangePicker({ date, setDate, className }: DateRangePickerProps) {
  // Get min and max dates
  const minDate = new Date(2020, 0, 1); // Minimum date: Jan 1, 2020
  const maxDate = new Date(); // Maximum date: today

  const handleSelect = (selectedRange: DateRange | undefined) => {
    if (!selectedRange) {
      setDate({ from: undefined, to: undefined });
      return;
    }

    const { from, to } = selectedRange;

    // Validate selected dates
    if (from && isBefore(from, minDate)) {
      toast.error(<ToastNotify status={-1} message="Không thể chọn ngày trước năm 2020" />, {
        style: styleError,
      });
      return;
    }

    if (from && isAfter(from, maxDate)) {
      toast.error(<ToastNotify status={-1} message="Không thể chọn ngày trong tương lai" />, {
        style: styleError,
      });
      return;
    }

    if (to && isAfter(to, maxDate)) {
      toast.error(<ToastNotify status={-1} message="Không thể chọn ngày trong tương lai" />, {
        style: styleError,
      });
      return;
    }

    // If all validations pass, update the date
    setDate(selectedRange);
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-full justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'dd/MM/yyyy')} - {format(date.to, 'dd/MM/yyyy')}
                </>
              ) : (
                format(date.from, 'dd/MM/yyyy')
              )
            ) : (
              <span>Chọn khoảng thời gian</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            required
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
            disabled={(date) => isBefore(date, minDate) || isAfter(date, maxDate)}
            fromDate={minDate}
            toDate={maxDate}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
