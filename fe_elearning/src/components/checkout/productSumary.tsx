// components/ProductSummary.tsx
import { formatPrice } from '../../helpers/formatPrice';
import { BookOpen, Star, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CourseForm } from '@/types/courseType';

type Props = {
  products: CourseForm[];
};

export default function ProductSummary({ products }: Props) {
  return (
    <div className="space-y-4">
      {products &&
        products.length > 0 &&
        products.map((product, index) => (
          <div
            key={product.id}
            className="group relative p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-slate-700/50 dark:to-slate-600/50 hover:shadow-md transition-all duration-200"
          >
            {/* Course Icon */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-custom-gradient-button-blue rounded-lg flex items-center justify-center shadow-sm">
                {product.thumbnail?.key ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_BASE_URL_IMAGE}${product.thumbnail.key}`}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <BookOpen className="w-6 h-6 text-white" />
                )}
              </div>

              {/* Course Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 leading-tight mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {product.title}
                    </h3>

                    {/* Course Features */}
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current text-yellow-400" />
                        <span>4.8</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Trọn đời</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Khóa học
                      </Badge>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <div className="text-xl font-bold text-slate-800 dark:text-slate-100">
                      {formatPrice(product.price)}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      Thanh toán một lần
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>
        ))}

      {/* Summary for multiple products */}
      {products.length > 1 && (
        <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-700 rounded-xl">
          <div className="flex justify-between items-center">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Tổng {products.length} khóa học
            </span>
            <span className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {formatPrice(products.reduce((sum, p) => sum + p.price, 0))}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
