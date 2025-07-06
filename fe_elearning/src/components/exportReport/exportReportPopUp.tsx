'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Check, FileSpreadsheet, FileType } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface Course {
  id: string;
  title: string;
}

interface ExportReportPopUpProps {
  isOpen: boolean;
  onClose: () => void;
  courseId?: string;
  courses?: Course[];
}

export default function ExportReportPopUp({
  isOpen,
  onClose,
  courseId,
  courses = [],
}: ExportReportPopUpProps) {
  const [fileType, setFileType] = useState<'excel' | 'pdf'>('excel');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [openCourseSelect, setOpenCourseSelect] = useState(false);

  const handleExport = () => {
    // Handle export logic here
    console.log({
      fileType,
      selectedCourses,
      dateRange,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Xuất báo cáo</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Định dạng file</Label>
            <RadioGroup
              defaultValue={fileType}
              onValueChange={(value) => setFileType(value as 'excel' | 'pdf')}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excel" id="excel" />
                <Label htmlFor="excel" className="flex items-center gap-1">
                  <FileSpreadsheet className="h-4 w-4" />
                  Excel
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf" className="flex items-center gap-1">
                  <FileType className="h-4 w-4" />
                  PDF
                </Label>
              </div>
            </RadioGroup>
          </div>

          {!courseId && (
            <div className="space-y-2">
              <Label>Khóa học</Label>
              <Popover open={openCourseSelect} onOpenChange={setOpenCourseSelect}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-full justify-between">
                    {selectedCourses.length === 0
                      ? 'Chọn khóa học'
                      : `${selectedCourses.length} khóa học đã chọn`}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <Command>
                    <CommandInput placeholder="Tìm khóa học..." />
                    <CommandEmpty>Không tìm thấy khóa học.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        onSelect={() => {
                          setSelectedCourses(
                            selectedCourses.length === courses.length
                              ? []
                              : courses.map((course) => course.id)
                          );
                        }}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            selectedCourses.length === courses.length ? 'opacity-100' : 'opacity-0'
                          }`}
                        />
                        Chọn tất cả
                      </CommandItem>
                      {courses.map((course) => (
                        <CommandItem
                          key={course.id}
                          onSelect={() => {
                            setSelectedCourses((prev) =>
                              prev.includes(course.id)
                                ? prev.filter((id) => id !== course.id)
                                : [...prev, course.id]
                            );
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              selectedCourses.includes(course.id) ? 'opacity-100' : 'opacity-0'
                            }`}
                          />
                          {course.title}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          )}

          <div className="space-y-2">
            <Label>Thời gian</Label>
            <DateRangePicker
              date={dateRange || { from: undefined, to: undefined }}
              setDate={setDateRange}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleExport}>Xuất báo cáo</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
