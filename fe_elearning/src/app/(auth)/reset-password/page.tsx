'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Lock, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { APIResetPassword } from '@/utils/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { createResetPasswordSchema } from '@/utils/validation';
import ToastNotify from '@/components/ToastNotify/toastNotify';
import { toast, ToastContainer } from 'react-toastify';
import { styleError, styleSuccess } from '@/components/ToastNotify/toastNotifyStyle';
import { useTheme } from 'next-themes';
// Use the validation schema from utils
const formSchema = createResetPasswordSchema();
type FormData = z.infer<typeof formSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const theme = useTheme();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: FormData) => {
    if (!token) {
      toast.error(<ToastNotify status={-1} message="Token không hợp lệ hoặc đã hết hạn" />, {
        style: styleError,
      });
      return;
    }

    try {
      setIsLoading(true);

      const response = await APIResetPassword({
        token,
        password: values.password,
      });

      if (response?.status === 200) {
        toast.success(
          <ToastNotify
            status={1}
            message="Đặt lại mật khẩu thành công! Bạn sẽ được chuyển hướng đến trang đăng nhập."
          />,
          { style: styleSuccess }
        );
        setTimeout(() => {
          router.push('/login');
        }, 3000);

        // Redirect to login page after 3 seconds
        toast.error(
          <ToastNotify status={-1} message="Không thể đặt lại mật khẩu. Vui lòng thử lại sau." />,
          { style: styleError }
        );
      }
    } catch (err: any) {
      toast.error(
        <ToastNotify
          status={-1}
          message={err?.response?.data?.message || 'Đã xảy ra lỗi khi đặt lại mật khẩu'}
        />,
        { style: styleError }
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="mt-4 text-center">
                <div
                  onClick={() => router.push('/forgot-password')}
                  className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                >
                  Yêu cầu liên kết đặt lại mật khẩu mới
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md z-10">
        <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-black dark:text-white">
              Đặt lại mật khẩu
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Nhập mật khẩu mới của bạn
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu mới</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            className="pl-10"
                            {...field}
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            className="pl-10"
                            {...field}
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-custom-gradient-button-blue hover:brightness-110 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                      Đang xử lý...
                    </div>
                  ) : (
                    'Đặt lại mật khẩu'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Quay lại đăng nhập
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
