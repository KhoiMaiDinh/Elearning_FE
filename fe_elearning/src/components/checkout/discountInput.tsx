// components/DiscountInput.tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { APIGetCouponByCode } from '@/utils/coupon';
import { debounce } from 'lodash';
import { CouponType } from '@/types/couponType';
import { Check, AlertCircle, Tag, Loader2, Percent } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CourseForm } from '@/types/courseType';

type Props = {
  discount: string;
  setDiscount: (value: string) => void;
  onDiscountChange: (value: number) => void;
  course: CourseForm[];
};

export default function DiscountInput({ discount, setDiscount, onDiscountChange, course }: Props) {
  const [error, setError] = useState<string>('');
  const [coupon, setCoupon] = useState<CouponType | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const handleCheckCoupon = async () => {
    if (!discount.trim()) {
      setCoupon(null);
      setError('');
      setIsValid(false);
      onDiscountChange(0);
      return;
    }

    setIsChecking(true);
    try {
      const response = await APIGetCouponByCode(discount);
      if (response?.status === 200) {
        setCoupon(response?.data);
        setIsValid(true);
        setError('');
      } else if (response?.status === 404) {
        console.log('Mã giảm giá không tồn tại');
        setCoupon(null);
        setIsValid(false);
        setError('Mã giảm giá không hợp lệ');
        onDiscountChange(0);
      } else {
        setCoupon(null);
        setIsValid(false);
        setError('Mã giảm giá không hợp lệ');
        onDiscountChange(0);
      }
    } catch (err) {
      setCoupon(null);
      setIsValid(false);
      setError('Có lỗi xảy ra khi kiểm tra mã giảm giá');
      onDiscountChange(0);
    } finally {
      setIsChecking(false);
    }
  };

  const debouncedCheck = debounce(handleCheckCoupon, 800);

  useEffect(() => {
    debouncedCheck();
    return () => {
      debouncedCheck.cancel();
    };
  }, [discount]);

  useEffect(() => {
    if (coupon && isValid) {
      if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
        setError('Mã giảm giá đã hết hạn');
        setIsValid(false);
        onDiscountChange(0);
        return;
      } else if (coupon.value === null) {
        setError('');
        setIsValid(true);
        onDiscountChange(0);
        return;
      } else if (coupon.value && coupon.usage_count && coupon.usage_count >= coupon.value) {
        setError('Mã giảm giá đã hết số lần sử dụng');
        setIsValid(false);
        onDiscountChange(0);
        return;
      } else if (coupon.starts_at && new Date(coupon.starts_at) > new Date()) {
        setError('Mã giảm giá chưa tới thời gian áp dụng');
        setIsValid(false);
        onDiscountChange(0);
        return;
      } else {
        setError('');
        setIsValid(true);
        // Calculate discount value based on coupon value
        const totalPrice =
          course && course.length > 0 ? course.reduce((acc, course) => acc + course.price, 0) : 0;
        const discountAmount = (coupon.value / 100) * totalPrice || 0;
        onDiscountChange(discountAmount);
      }
    }
  }, [coupon, isValid, onDiscountChange]);

  const clearDiscount = () => {
    setDiscount('');
    setCoupon(null);
    setError('');
    setIsValid(false);
    onDiscountChange(0);
  };

  return (
    <div className="space-y-4">
      {/* Input Field */}
      <div className="space-y-2">
        <Label htmlFor="discount" className="text-slate-700 dark:text-slate-300 font-medium">
          Mã giảm giá
        </Label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Tag className="w-4 h-4 text-slate-400" />
          </div>
          <Input
            id="discount"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            placeholder="Nhập mã giảm giá của bạn..."
            className={`pl-10 pr-12  bg-white h-full py-0 dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 transition-colors ${
              isValid
                ? 'border-green-500 dark:border-green-400'
                : error
                  ? 'border-red-500 dark:border-red-400'
                  : ''
            }`}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isChecking ? (
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
            ) : isValid ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : error ? (
              <AlertCircle className="w-4 h-4 text-red-500" />
            ) : null}
          </div>
        </div>
      </div>

      {/* Success State */}
      {isValid && coupon && (
        <Alert className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
          <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-800 dark:text-green-300">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">Mã giảm giá hợp lệ!</span>
                {coupon.value && (
                  <div className="text-sm mt-1">Giảm {coupon.value.toLocaleString('vi-VN')}%</div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearDiscount}
                className="text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-800/30"
              >
                Bỏ chọn
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Error State */}
      {error && (
        <Alert className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertDescription className="text-red-800 dark:text-red-300">{error}</AlertDescription>
        </Alert>
      )}

      {/* Popular Discounts (Optional) */}
      <div className="text-xs text-slate-500 dark:text-slate-400">
        💡 Mẹo: Theo dõi fanpage để nhận mã giảm giá mới nhất
      </div>
    </div>
  );
}
