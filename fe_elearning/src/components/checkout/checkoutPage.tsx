// ✅ CheckoutPage.tsx
'use client';

import { useState } from 'react';
import ProductSummary from './productSumary';
import StudentInfo from './studentInfo';
import DiscountInput from './discountInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserType } from '@/types/userType';
import { APICreateOrder } from '@/utils/order';
import { Button } from '../ui/button';
import { formatPrice } from '../formatPrice';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CreditCard, ArrowLeft, Shield } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

type Props = {
  mode: 'single' | 'cart';
  products: { id: string; title: string; price: number }[];
  student: UserType;
};

export default function CheckoutPage({ mode, products, student }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [discount, setDiscount] = useState('');
  const [discountValue, setDiscountValue] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = products.reduce((sum, p) => sum + p.price, 0);
  const total = subtotal - discountValue;

  const handlePayment = async (data: any) => {
    setIsProcessing(true);
    try {
      const response = await APICreateOrder(data);
      if (response?.status === 200) {
        window.location.href = response?.data?.payment?.payment_url;
      } else {
        toast({
          title: 'Thanh toán thất bại',
          description: 'Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Lỗi hệ thống',
        description: 'Không thể kết nối tới máy chủ. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            {mode === 'single' ? 'Thanh toán khóa học' : 'Thanh toán giỏ hàng'}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Hoàn tất thanh toán để bắt đầu hành trình học tập của bạn
          </p>
        </div>

        {/* Main Content */}
        <Card className="shadow-lg">
          <CardContent className="p-8 space-y-8">
            {/* Student Info Section */}
            <div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
                Thông tin học viên
              </h2>
              <StudentInfo student={student} />
            </div>

            <Separator />

            {/* Products Section */}
            <div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
                Chi tiết đơn hàng
              </h2>
              <ProductSummary products={products} />
            </div>

            <Separator />

            {/* Discount Section */}
            <div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
                Mã giảm giá
              </h2>
              <DiscountInput
                discount={discount}
                setDiscount={setDiscount}
                onDiscountChange={setDiscountValue}
                course={products}
              />
            </div>

            <Separator />

            {/* Order Summary */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
                Tổng kết đơn hàng
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Tạm tính</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                {discountValue > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Giảm giá</span>
                    <span>-{formatPrice(discountValue)}</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between text-xl font-bold text-slate-800 dark:text-slate-100">
                  <span>Tổng cộng</span>
                  <span className="text-blue-600 dark:text-blue-400">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Security Notice */}
              <div className="flex items-center gap-3 mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Shield className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    Thanh toán an toàn
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-12 border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700"
                onClick={() => router.back()}
                disabled={isProcessing}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại
              </Button>

              <Button
                className="h-12 bg-custom-gradient-button-violet hover:brightness-110 text-white font-semibold shadow-lg"
                onClick={() =>
                  handlePayment({
                    course_ids: products.map((product) => product.id),
                    ...(discount ? { coupon_code: discount } : {}),
                  })
                }
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang xử lý...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    <span>Thanh toán ngay</span>
                  </div>
                )}
              </Button>
            </div>

            {/* Additional Info */}
            <div className="text-center text-sm text-slate-500 dark:text-slate-400">
              Truy cập khóa học ngay sau khi thanh toán thành công
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
