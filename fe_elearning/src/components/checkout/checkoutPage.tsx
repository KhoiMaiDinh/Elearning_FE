// ✅ CheckoutPage.tsx
'use client';

import { useState } from 'react';
import ProductSummary from './productSumary';
import StudentInfo from './studentInfo';
import DiscountInput from './discountInput';
import { Card } from '@/components/ui/card';
import { UserType } from '@/types/userType';
import { APICreateOrder } from '@/utils/order';
import { Button } from '../ui/button';
import { formatPrice } from '../formatPrice';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

type Props = {
  mode: 'single' | 'cart';
  products: { id: string; title: string; price: number }[];
  student: UserType;
};

export default function CheckoutPage({ mode, products, student }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [discount, setDiscount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const total = products.reduce((sum, p) => sum + p.price, 0);
  const discountedTotal = discount === 'GIAM10' ? total * 0.9 : total;

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
    <div className="min-h-screen bg-AntiFlashWhite dark:bg-zinc-900 text-eerieBlack dark:text-white p-4 flex items-center justify-center">
      <Card className="w-full max-w-3xl rounded-2xl shadow-xl dark:shadow-md bg-white dark:bg-zinc-800 p-6 space-y-6">
        <h1 className="text-2xl font-bold">
          {mode === 'single' ? 'Thanh toán khóa học' : 'Thanh toán giỏ hàng'}
        </h1>

        <ProductSummary products={products} />
        <StudentInfo student={student} />
        <DiscountInput discount={discount} setDiscount={setDiscount} />

        <div className="flex justify-between items-center font-semibold text-lg">
          <span>Tổng cộng:</span>
          <span className="text-Sunglow">{formatPrice(discountedTotal)}</span>
        </div>

        <div className="pt-4 flex gap-4 justify-between">
          <Button
            className="w-full bg-custom-gradient-button-red text-white hover:brightness-125"
            onClick={() => {
              router.back();
            }}
            disabled={isProcessing}
          >
            Quay lại
          </Button>
          <Button
            className="w-full bg-custom-gradient-button-violet dark:bg-custom-gradient-button-blue hover:brightness-125 text-white"
            onClick={() =>
              handlePayment({
                course_ids: products.map((product) => product.id),
                ...(discount ? { coupon_code: discount } : {}),
              })
            }
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              'Thanh toán ngay'
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
