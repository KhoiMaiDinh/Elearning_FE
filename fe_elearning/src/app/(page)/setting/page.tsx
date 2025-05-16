'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect } from 'react';
import { useTheme } from 'next-themes';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import AnimateWrapper from '@/components/animations/animateWrapper';

const FormSchema = z.object({
  marketing_emails: z.boolean().default(false).optional(),
  security_emails: z.boolean(),
});

const Page = () => {
  const { theme, setTheme } = useTheme(); // Sử dụng hook từ `next-themes`

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      marketing_emails: true,
      security_emails: theme === 'dark', // Khởi tạo theo theme hiện tại
    },
  });

  // Đồng bộ trạng thái form khi theme thay đổi
  useEffect(() => {
    form.setValue('security_emails', theme === 'dark');
  }, [theme, form]);

  return (
    <Form {...form}>
      <AnimateWrapper delay={0.2} direction="up">
        <div className="flex flex-col gap-4">
          <h3 className="mb-4 text-lg font-medium">Cài đặt</h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="marketing_emails"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Thông báo</FormLabel>
                    <FormDescription>Nhận thông báo về những khóa học mới.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="security_emails"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Chế độ tối</FormLabel>
                    <FormDescription>Màn hình hiển thị nền tối.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(value) => {
                        field.onChange(value);
                        setTheme(value ? 'dark' : 'light'); // Cập nhật theme
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
      </AnimateWrapper>
    </Form>
  );
};

export default Page;
