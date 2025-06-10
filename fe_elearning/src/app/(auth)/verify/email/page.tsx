'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { APIVerifyEmail } from '@/utils/auth';
import { Loader2 } from 'lucide-react';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('Đang xác thực email của bạn...');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get('token');
        if (!token) {
          setStatus('error');
          setMessage('Token không hợp lệ');
          return;
        }

        const response = await APIVerifyEmail(token);

        if (response?.status === 200) {
          setStatus('success');
          setMessage('Xác thực email thành công! Đang chuyển hướng...');
          // Redirect after 2 seconds
          setTimeout(() => {
            router.push('/');
          }, 2000);
        } else {
          setStatus('error');
          setMessage('Xác thực email thất bại. Vui lòng thử lại sau.');
        }
      } catch (error: any) {
        setStatus('error');
        setMessage(error?.response?.data?.message || 'Đã có lỗi xảy ra khi xác thực email');
      }
    };

    verifyEmail();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Xác thực Email</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {status === 'verifying' && (
            <Loader2 className="h-8 w-8 animate-spin text-LavenderIndigo" />
          )}
          {status === 'success' && (
            <div className="text-green-600 dark:text-green-400">
              <svg
                className="h-12 w-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}
          {status === 'error' && (
            <div className="text-red-600 dark:text-red-400">
              <svg
                className="h-12 w-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          )}
          <p className="text-center text-gray-600 dark:text-gray-300">{message}</p>
        </CardContent>
      </Card>
    </div>
  );
}
