'use client';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
export default function BannedNotice({ note }: { note: string }) {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-eerieBlack p-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader className="flex flex-col items-center">
          <AlertTriangle className="text-redPigment w-12 h-12 mb-2" />
          <CardTitle className="text-center text-2xl font-bold">
            Tài khoản của bạn đã bị khóa
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-gray/60 dark:text-gray/30">
            Chúng tôi đã phát hiện hành vi vi phạm điều khoản sử dụng. Tài khoản của bạn hiện không
            thể đăng nhập hoặc sử dụng dịch vụ.
          </p>
          <p className="text-sm text-gray/60 dark:text-gray/30">{note}</p>
          <p className="text-sm text-gray/60 dark:text-gray/30">
            Nếu bạn nghĩ đây là sự nhầm lẫn, vui lòng liên hệ đội ngũ hỗ trợ.
          </p>
        </CardContent>

        <CardFooter>
          <Button variant="destructive" className="w-full" onClick={() => router.push('/')}>
            Quay lại trang chủ
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
