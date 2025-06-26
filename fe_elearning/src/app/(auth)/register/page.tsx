'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Lock, Mail, User, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { APIRegisterEmail } from '@/utils/auth';
import { Button } from '@/components/ui/button';
import { createRegistrationSchema } from '@/utils/validation';
import * as z from 'zod';
import ToastNotify from '@/components/ToastNotify/toastNotify';
import { styleError, styleSuccess } from '@/components/ToastNotify/toastNotifyStyle';
import { Checkbox } from '@/components/ui/checkbox';
import { toast, ToastContainer } from 'react-toastify';
import { useTheme } from 'next-themes';
import { getVietnameseErrorMessage } from '@/utils/auth';
import { ApiErrorResponse } from '@/types/apiResponse';

// Use the validation schema from utils
const formSchema = createRegistrationSchema();
type FormData = z.infer<typeof formSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const theme = useTheme();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  const onSubmit = async (values: FormData) => {
    try {
      setIsLoading(true);

      const response = await APIRegisterEmail({
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        password: values.password,
      });

      if (response?.status === 201 || response?.status === 200) {
        toast.success(
          <ToastNotify
            status={1}
            message={
              response?.data?.message ||
              'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.'
            }
          />,
          { style: styleSuccess }
        );
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch (err: any) {
      const errorResponse = err?.response;
      const statusCode = errorResponse?.status;
      const errorData: ApiErrorResponse = errorResponse?.data;

      let errorMessage = 'Đã xảy ra lỗi khi đăng ký';

      if (!errorResponse) {
        errorMessage = 'Lỗi kết nối. Vui lòng kiểm tra lại đường truyền';
      } else {
        // Use helper function to get Vietnamese error message
        errorMessage = getVietnameseErrorMessage(
          statusCode,
          errorData?.errorCode,
          errorData?.message
        );

        // If there are detailed validation errors, show them instead
        if (errorData?.details && errorData.details.length > 0) {
          errorMessage = errorData.details.map((detail) => detail.message).join(', ');
        }
      }

      toast.error(<ToastNotify status={-1} message={errorMessage} />, { style: styleError });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md z-10">
        <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font`-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-black dark:text-white">
              Tạo tài khoản
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Nhập thông tin của bạn để tạo tài khoản mới
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Tabs defaultValue="student" className="w-full">
              <TabsContent value="student">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="first_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Họ</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                  placeholder="Nguyễn"
                                  className="pl-10"
                                  {...field}
                                  disabled={isLoading}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="last_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tên</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                  placeholder="Văn A"
                                  className="pl-10"
                                  {...field}
                                  disabled={isLoading}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                placeholder="name@example.com"
                                className="pl-10"
                                {...field}
                                disabled={isLoading}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mật khẩu</FormLabel>
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
                          <FormLabel>Xác nhận mật khẩu</FormLabel>
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

                    <FormField
                      control={form.control}
                      name="terms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm text-gray-600 dark:text-gray-300">
                              Tôi đồng ý với{' '}
                              <Link
                                href="/terms"
                                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                              >
                                điều khoản dịch vụ
                              </Link>{' '}
                              và{' '}
                              <Link
                                href="/privacy"
                                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                              >
                                chính sách bảo mật
                              </Link>
                            </FormLabel>
                            <FormMessage />
                          </div>
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
                        'Đăng ký'
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
                  Hoặc đăng ký với
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
              <Button
                variant="outline"
                className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <svg
                  className="mr-2 h-4 w-4 text-[#1877F2]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z"></path>
                </svg>
                Facebook
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Đã có tài khoản?{' '}
              <div
                onClick={() => router.push('/login')}
                className="font-medium hover:cursor-pointer text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Đăng nhập
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
