'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Clock, Copy, Check, Gift, Sparkles, Tag } from 'lucide-react';
import type { CouponType } from '@/types/couponType';
import { toast } from 'react-toastify';

interface CouponProps {
  coupon?: CouponType[];
  sectionTitleClassName?: string;
  isLoading?: boolean;
  userInfo?: {
    username: string;
  };
}

export default function CouponSection({
  coupon,
  sectionTitleClassName = 'text-2xl font-bold',
  isLoading = false,
  userInfo,
}: CouponProps) {
  const [copiedCoupons, setCopiedCoupons] = useState<Set<string>>(new Set());

  const getDaysUntilExpiry = (expiresAt: Date | string): number => {
    try {
      const expireDate = expiresAt instanceof Date ? expiresAt : new Date(expiresAt);
      const today = new Date();
      const diffTime = expireDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(0, diffDays);
    } catch {
      return 0;
    }
  };

  const handleCopyCoupon = async (couponItem: CouponType) => {
    try {
      await navigator.clipboard.writeText(couponItem.code);
      setCopiedCoupons((prev) => new Set(prev).add(couponItem.code));
      toast.success('Đã sao chép mã giảm giá!');

      setTimeout(() => {
        setCopiedCoupons((prev) => {
          const newSet = new Set(prev);
          newSet.delete(couponItem.code);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      toast.error('Không thể sao chép mã giảm giá');
    }
  };

  const getDiscountText = (coupon: CouponType): string => {
    return `${coupon.value}%`;
  };

  const getUrgencyColor = (daysLeft: number) => {
    if (daysLeft <= 1)
      return 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800';
    if (daysLeft <= 3)
      return 'text-orange-600 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-900/20 dark:border-orange-800';
    return 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/20 dark:border-emerald-800';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl animate-pulse" />
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-80 h-36 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!coupon || coupon.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <h3 className={sectionTitleClassName}>Mã giảm giá</h3>
        </div>
        <Card className="p-12 text-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 border-dashed border-2 border-slate-200 dark:border-slate-700">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
              <Gift className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <p className="text-slate-600 dark:text-slate-300 font-medium text-lg">
                Chưa có mã giảm giá nào
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Hãy quay lại sau để nhận ưu đãi hấp dẫn!
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-custom-gradient-button-violet rounded-xl flex items-center justify-center shadow-lg">
            <Tag className="w-5 h-5 text-white" />
          </div>
          <h3 className={sectionTitleClassName}>Mã giảm giá</h3>
        </div>
        <Badge
          variant="secondary"
          className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
        >
          {coupon.length} mã có sẵn
        </Badge>
      </div>

      {/* Coupon Cards */}
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {coupon.map((item, index) => {
            const daysLeft = getDaysUntilExpiry(item.expires_at);
            const isCopied = copiedCoupons.has(item.code);
            const isExpired = daysLeft <= 0;
            const isOwner = item.creator_username === userInfo?.username;

            return (
              <Card
                key={item.code || index}
                className={`flex-shrink-0 w-80 relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group border-0 shadow-md ${
                  isExpired
                    ? 'opacity-60 grayscale'
                    : 'hover:shadow-blue-100 dark:hover:shadow-blue-900/20 bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-900'
                }`}
              >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full -translate-y-10 translate-x-10 opacity-60" />

                <div className="p-5 space-y-4">
                  {/* Header with owner/creator badge */}
                  <div className="flex items-center justify-between">
                    {isOwner ? (
                      <Badge className="bg-custom-gradient-button-violet text-white border-0 text-xs font-medium shadow-md">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Của bạn
                      </Badge>
                    ) : item.creator_username ? (
                      <Badge
                        variant="outline"
                        className="text-xs bg-white/80 text-majorelleBlue border-majorelleBlue/20 dark:bg-slate-800/80 dark:text-majorelleBlue dark:border-majorelleBlue/20"
                      >
                        {item.creator_username}
                      </Badge>
                    ) : (
                      <div />
                    )}

                    {/* Expiry status */}
                    <div
                      className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border font-medium ${getUrgencyColor(daysLeft)}`}
                    >
                      <Clock className="w-3 h-3" />
                      <span>
                        {isExpired
                          ? 'Đã hết hạn'
                          : daysLeft === 1
                            ? 'Còn 1 ngày'
                            : `Còn ${daysLeft} ngày`}
                      </span>
                    </div>
                  </div>

                  {/* Coupon code section */}
                  <div className="space-y-3">
                    <div
                      className={`bg-slate-100 dark:bg-slate-800 rounded-lg p-3 border-2 border-dashed border-slate-300 dark:border-slate-600 cursor-pointer transition-all duration-200 ${
                        !isExpired
                          ? 'hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700'
                          : ''
                      }`}
                      onClick={() => !isExpired && handleCopyCoupon(item)}
                    >
                      <div className="flex items-center justify-between">
                        <code className="text-lg font-bold font-mono text-vividMalachite tracking-wider">
                          {item.code}
                        </code>
                        <div
                          className={`p-1 rounded transition-all duration-200 ${
                            isExpired
                              ? 'text-slate-400'
                              : isCopied
                                ? 'text-green-600 bg-green-100 dark:bg-green-900/20'
                                : 'text-majorelleBlue hover:bg-majorelleBlue/10 dark:hover:bg-majorelleBlue/20'
                          }`}
                        >
                          {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Discount badges */}
                  <div className="flex gap-2">
                    <Badge className="bg-vividMalachite/20 text-vividMalachite border-0 font-bold px-3 py-1 shadow-md">
                      Giảm {getDiscountText(item)}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-white/80 text-majorelleBlue border-majorelleBlue/20 font-semibold px-3 py-1 dark:bg-slate-800/80 dark:text-majorelleBlue dark:border-majorelleBlue/20"
                    >
                      x{item.value}
                    </Badge>
                  </div>
                </div>

                {/* Expired overlay */}
                {isExpired && (
                  <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                    <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-full text-sm font-semibold text-slate-600 dark:text-slate-300 shadow-lg border border-slate-200 dark:border-slate-600">
                      Đã hết hạn
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Scroll indicator */}
        {coupon.length > 3 && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 rounded-full p-2 shadow-lg border border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100 transition-opacity">
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </div>
        )}
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
