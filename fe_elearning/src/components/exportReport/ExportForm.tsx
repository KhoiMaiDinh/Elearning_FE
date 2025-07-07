'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Check, FileSpreadsheet, FileType } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ExportFormProps } from '@/types/reportTypes';

export default function ExportForm({ formData, onFormChange, courses, courseId }: ExportFormProps) {
  const [openCourseSelect, setOpenCourseSelect] = useState(false);

  const handleFileTypeChange = (value: string) => {
    onFormChange({
      ...formData,
      fileType: value as 'excel' | 'pdf',
    });
  };

  const handleCourseSelectionChange = (courseIds: string[]) => {
    onFormChange({
      ...formData,
      selectedCourses: courseIds,
    });
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    onFormChange({
      ...formData,
      [field]: value,
    });
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="space-y-2">
        <Label>Định dạng file</Label>
        <RadioGroup
          value={formData.fileType}
          onValueChange={handleFileTypeChange}
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
                {formData.selectedCourses.length === 0
                  ? 'Chọn khóa học'
                  : `${formData.selectedCourses.length} khóa học đã chọn`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0">
              <Command>
                <CommandInput placeholder="Tìm khóa học..." />
                <CommandEmpty>Không tìm thấy khóa học.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      const allSelected = formData.selectedCourses.length === courses.length;
                      handleCourseSelectionChange(
                        allSelected ? [] : courses.map((course) => course.id)
                      );
                    }}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        formData.selectedCourses.length === courses.length
                          ? 'opacity-100'
                          : 'opacity-0'
                      }`}
                    />
                    Chọn tất cả
                  </CommandItem>
                  {courses.map((course) => (
                    <CommandItem
                      key={course.id}
                      onSelect={() => {
                        const isSelected = formData.selectedCourses.includes(course.id);
                        handleCourseSelectionChange(
                          isSelected
                            ? formData.selectedCourses.filter((id) => id !== course.id)
                            : [...formData.selectedCourses, course.id]
                        );
                      }}
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${
                          formData.selectedCourses.includes(course.id) ? 'opacity-100' : 'opacity-0'
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
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Từ ngày</Label>
            <Input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleDateChange('endDate', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Đến ngày</Label>
            <Input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleDateChange('startDate', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
