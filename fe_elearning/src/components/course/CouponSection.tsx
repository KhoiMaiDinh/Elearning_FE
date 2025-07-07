'use client';

import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Clock, Copy, Check, Gift, Sparkles, Tag, Calendar } from 'lucide-react';
import type { CouponType } from '@/types/couponType';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

interface CouponProps {
  coupons?: CouponType[];
  sectionTitleClassName?: string;
  isLoading?: boolean;
  userInfo?: {
    username: string;
  };
}

export default function CouponSection({
  coupons,
  sectionTitleClassName = 'text-lg font-semibold',
  isLoading = false,
  userInfo,
}: CouponProps) {
  const [copiedCoupons, setCopiedCoupons] = useState<Set<string>>(new Set());
  const [showBlur, setShowBlur] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const theme = useTheme().theme;

  useEffect(() => {
    const container = scrollContainerRef.current;

    const checkScroll = () => {
      if (!container) return;
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const hasOverflow = scrollWidth > clientWidth;
      const atEnd = scrollLeft + clientWidth >= scrollWidth - 1; // slight buffer for float errors
      setShowBlur(hasOverflow && !atEnd);
    };

    if (container) {
      container.addEventListener('scroll', checkScroll);
    }

    checkScroll(); // initial check

    window.addEventListener('resize', checkScroll);
    return () => {
      container?.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [coupons]);

  // Helper functions to safely convert text/null to number
  const safeNumberConvert = (value: any): number => {
    if (value === null || value === undefined || value === '') {
      return 0;
    }

    if (typeof value === 'number') {
      return value;
    }

    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    }

    return 0;
  };

  const formatRevenue = (revenue: any): string => {
    const amount = safeNumberConvert(revenue);
    if (amount === 0) return '0đ';

    // Format with thousands separator
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatUsageCount = (count: any): number => {
    return safeNumberConvert(count);
  };

  const getDaysUntilExpiry = (expiresAt: Date | string): number => {
    try {
      const expireDate = expiresAt instanceof Date ? expiresAt : new Date(expiresAt);
      const today = new Date();

      // Chỉ so sánh ngày tháng năm, bỏ qua giờ phút giây
      expireDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      const diffTime = expireDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(0, diffDays);
    } catch {
      return 0;
    }
  };

  const getDaysUntilStart = (startsAt: Date | string): number => {
    try {
      const startDate = startsAt instanceof Date ? startsAt : new Date(startsAt);
      const today = new Date();

      // Chỉ so sánh ngày tháng năm, bỏ qua giờ phút giây
      startDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      const diffTime = startDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(0, diffDays);
    } catch {
      return 0;
    }
  };

  const getCouponStatus = (item: CouponType) => {
    const now = new Date();
    const startDate = new Date(item.starts_at);
    const endDate = new Date(item.expires_at);

    // Chỉ so sánh ngày tháng năm, bỏ qua giờ phút giây
    now.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    if (now < startDate) {
      return 'not_started';
    } else if (now > endDate) {
      return 'expired';
    } else {
      return 'active';
    }
  };

  const handleCopyCoupon = async (couponItem: CouponType, event: React.MouseEvent) => {
    event.stopPropagation(); // Ngăn event bubble up để không trigger redirect

    const status = getCouponStatus(couponItem);

    if (status === 'expired') {
      toast.error('Mã giảm giá đã hết hạn');
      return;
    }

    try {
      await navigator.clipboard.writeText(couponItem.code);
      setCopiedCoupons((prev) => new Set(prev).add(couponItem.code));

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

  const getUrgencyColor = (status: string, daysLeft: number, daysUntilStart: number) => {
    if (status === 'expired') {
      return 'text-red-500 bg-red-50 dark:bg-red-900/20';
    } else if (status === 'not_started') {
      return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
    } else {
      // Active coupon
      if (daysLeft <= 1) return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      if (daysLeft <= 3) return 'text-orange-500 bg-orange-50 dark:bg-orange-900/20';
      return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
    }
  };

  const getStatusText = (status: string, daysLeft: number, daysUntilStart: number) => {
    if (status === 'expired') {
      return 'Hết hạn';
    } else if (status === 'not_started') {
      return `Sắp tới ${daysUntilStart}D nữa`;
    } else {
      return `${daysLeft}D`;
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'not_started') {
      return <Calendar className="w-3 h-3 inline mr-1" />;
    }
    return <Clock className="w-3 h-3 inline mr-1" />;
  };

  const getCouponColor = (index: number) => {
    const colors = [
      {
        bg: 'bg-blue-50 dark:bg-blue-900/10',
        text: 'text-blue-600 dark:text-blue-400',
        border: 'border-blue-200 dark:border-blue-800',
      },
      {
        bg: 'bg-purple-50 dark:bg-purple-900/10',
        text: 'text-purple-600 dark:text-purple-400',
        border: 'border-purple-200 dark:border-purple-800',
      },
      {
        bg: 'bg-emerald-50 dark:bg-emerald-900/10',
        text: 'text-emerald-600 dark:text-emerald-400',
        border: 'border-emerald-200 dark:border-emerald-800',
      },
      {
        bg: 'bg-orange-50 dark:bg-orange-900/10',
        text: 'text-orange-600 dark:text-orange-400',
        border: 'border-orange-200 dark:border-orange-800',
      },
      {
        bg: 'bg-pink-50 dark:bg-pink-900/10',
        text: 'text-pink-600 dark:text-pink-400',
        border: 'border-pink-200 dark:border-pink-800',
      },
    ];
    return colors[index % colors.length];
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded animate-pulse" />
          <div className="h-5 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-56 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!coupons || coupons.length === 0) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-AntiFlashWhite dark:bg-slate-800 rounded flex items-center justify-center">
            <Gift className="w-3 h-3 text-black dark:text-white " />
          </div>
          <h3 className={sectionTitleClassName}>Mã giảm giá</h3>
        </div>
        <Card className="p-4 text-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 border-dashed">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
              <Gift className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-sm">Chưa có mã giảm giá</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5  rounded flex items-center justify-center">
            <Tag className="w-3 h-3 text-majorelleBlue" />
          </div>
          <h3 className={sectionTitleClassName}>Mã giảm giá</h3>
        </div>
        <Badge variant="secondary" className="text-xs px-2 py-0.5">
          {coupons.length}
        </Badge>
      </div>

      {/* Clean Card Design */}
      <div className="relative">
        <div ref={scrollContainerRef} className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {coupons.map((item, index) => {
            const status = getCouponStatus(item);
            const daysLeft = getDaysUntilExpiry(item.expires_at);
            const daysUntilStart = getDaysUntilStart(item.starts_at);
            const isCopied = copiedCoupons.has(item.code);
            const isOwner = item.creator_username === userInfo?.username;
            const colorTheme = getCouponColor(index);
            const isExpired = status === 'expired';

            return (
              <div
                onClick={() => router.push(`/profile/lecture?tab=uu-dai`)}
                key={item.code || index}
                className={`flex-shrink-0 m-2 w-56 relative transition-all duration-200 hover:scale-[1.02] group ${
                  isExpired ? 'opacity-50 hover:cursor-not-allowed' : 'hover:cursor-pointer'
                }`}
              >
                {/* Clean minimal design */}
                <Card
                  className={`p-3 ${colorTheme.bg} ${colorTheme.border} border hover:shadow-md transition-all duration-200`}
                >
                  {/* Top row: Discount + Time */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`px-2 py-1 rounded-full ${colorTheme.bg} ${colorTheme.text} text-sm font-semibold`}
                      >
                        {getDiscountText(item)} OFF
                      </div>
                    </div>

                    <div
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${getUrgencyColor(status, daysLeft, daysUntilStart)}`}
                    >
                      {getStatusIcon(status)}
                      {getStatusText(status, daysLeft, daysUntilStart)}
                    </div>
                  </div>

                  {/* Code section */}
                  <div
                    className={`bg-white dark:bg-slate-800 rounded p-2 border-2 border-dashed ${colorTheme.border} ${
                      !isExpired
                        ? 'cursor-pointer hover:border-solid hover:shadow-sm'
                        : 'cursor-not-allowed'
                    } transition-all duration-200`}
                    onClick={(e) => handleCopyCoupon(item, e)}
                  >
                    <div className="flex items-center justify-between">
                      <code className={`font-mono font-semibold ${colorTheme.text} tracking-wide`}>
                        {item.code}
                      </code>
                      <div
                        className={`transition-all duration-200 ${
                          isExpired
                            ? 'text-slate-400'
                            : isCopied
                              ? 'text-green-500'
                              : colorTheme.text
                        }`}
                      >
                        {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>

                  {/* Bottom row: Owner + Value */}
                  <div className="flex items-center justify-between mt-2 text-xs">
                    {isOwner ? (
                      <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                        <Sparkles className="w-3 h-3" />
                        <span className="font-medium">Của bạn</span>
                      </div>
                    ) : item.creator_username ? (
                      <span className="text-slate-500 dark:text-slate-400 dark:text-eerieBlack">
                        @
                        {item.creator_username.length > 8
                          ? item.creator_username.substring(0, 8) + '...'
                          : item.creator_username}
                      </span>
                    ) : (
                      <div />
                    )}

                    <span className={`font-semibold ${colorTheme.text}`}>x{item.value}</span>
                  </div>

                  {/* Stats row: Usage count + Revenue */}
                  {(item.usage_count || item.total_revenue) && (
                    <div className="flex items-center justify-between mt-1 text-xs text-slate-500 dark:text-slate-400">
                      <span>
                        Đã dùng: {formatUsageCount(item.usage_count)}/{item.value}
                      </span>
                      <span className="font-medium">{formatRevenue(item.total_revenue)}</span>
                    </div>
                  )}

                  {/* Expired overlay */}
                  {isExpired && (
                    <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[1px] flex items-center justify-center rounded-lg">
                      <div className="bg-white dark:bg-slate-800 px-2 py-1 rounded text-xs font-medium text-slate-600 dark:text-slate-300 shadow">
                        Đã hết hạn
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            );
          })}

          {/* Gradient overlay when content overflows */}
          {showBlur && (
            <div
              className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-10"
              style={{
                background: `linear-gradient(to left, ${
                  theme === 'dark' ? '#080f17' : '#ffffff'
                } , transparent)`,
              }}
            />
          )}
        </div>

        {/* Scroll indicator */}
        {coupons.length > 4 && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-700 rounded-full p-1.5 shadow-sm border opacity-60 hover:opacity-100 transition-opacity">
            <ChevronRight className="w-3 h-3 text-slate-500" />
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
