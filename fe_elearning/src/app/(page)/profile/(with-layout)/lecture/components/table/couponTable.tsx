import { Button } from '@/components/ui/button';
import { Edit, BarChart3, Trash2 } from 'lucide-react';
import CouponTableSkeleton from '@/components/skeleton/couponTableSkeleton';
import { CouponType } from '@/types/couponType';
import Pagination from '@/components/pagination/paginations';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CouponTableProps {
  coupons: CouponType[];
  loading: boolean;
  status: 'active' | 'scheduled' | 'expired';
  onEdit?: (coupon: CouponType) => void;
  onDelete?: (coupon: CouponType) => void;
  onActiveChange?: (val: boolean) => void;
  limit: number;
  totalRecords: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

const CouponTable = ({
  coupons,
  loading,
  status,
  onEdit,
  onDelete,
  onActiveChange,
  limit = 10,
  totalRecords = 0,
  currentPage,
  setCurrentPage,
  setLimit,
}: CouponTableProps) => {
  return (
    <>
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Code
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Discount
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Khóa học
                </th>

                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  {status == 'scheduled' ? 'Số lượng' : 'Lượt sử dụng'}
                </th>

                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Ngày bắt đầu
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Ngày kết thúc
                </th>
                {status !== 'scheduled' && (
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Doanh thu
                  </th>
                )}
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Trạng thái
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Chế độ
                </th>
                {status != 'active' && (
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Thao tác
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {loading && <CouponTableSkeleton rows={limit} coupon_status={status} />}
              {!loading && coupons.length === 0 && (
                <tr>
                  <td
                    colSpan={status !== 'scheduled' ? 8 : 7}
                    className="p-4 text-center text-muted-foreground"
                  >
                    Không tìm thấy mã ưu đãi nào.
                  </td>
                </tr>
              )}
              {!loading &&
                coupons &&
                coupons.length > 0 &&
                coupons?.map((coupon) => (
                  <tr
                    key={coupon.code}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <td className="p-4 align-middle">{coupon.code}</td>
                    <td className="p-4 align-middle">{coupon.value}%</td>
                    <td className="p-4 align-middle">
                      {coupon.course ? coupon.course.title : 'All Courses'}
                    </td>
                    <td className="p-4 pr-7 align-middle">
                      {status !== 'scheduled' && `${coupon.usage_count || '0'} /`}
                      {coupon.usage_limit ?? '∞'}
                    </td>

                    <td className="p-4 align-middle">
                      {coupon.starts_at
                        ? new Date(coupon.starts_at).toLocaleDateString('vi-VN')
                        : '-'}
                    </td>
                    <td className="p-4 align-middle">
                      {coupon.expires_at
                        ? new Date(coupon.expires_at).toLocaleDateString('vi-VN')
                        : '∞'}
                    </td>
                    {status === 'active' && (
                      <td className="p-4 align-middle">{coupon.revenue ?? '0'}</td>
                    )}

                    <td className="p-4 align-middle">
                      {coupon.is_active ? (
                        <Badge className="bg-teaGreen text-goGreen hover:bg-teaGreen/25 min-w-12">
                          Active
                        </Badge>
                      ) : (
                        <Badge className="bg-carminePink/25 text-redPigment hover:bg-carminePink/10 min-w-12">
                          Inactive
                        </Badge>
                      )}
                    </td>

                    <td className="p-4 align-middle">
                      {coupon.is_public ? (
                        <Badge
                          variant="outline"
                          className="border-gray-200 text-PaleViolet min-w-16 justify-center"
                        >
                          Public
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-gray-200 text-darkSilver min-w-16 justify-center"
                        >
                          Private
                        </Badge>
                      )}
                    </td>

                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2">
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onEdit(coupon)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500"
                            onClick={() => onDelete(coupon)}
                          >
                            <Trash2 className="h-4 w-4 text-redPigment" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            Hiển thị <strong>{coupons.length}</strong> / <strong>{totalRecords}</strong> active
            coupons
          </div>
          <Select defaultValue={String(limit)} onValueChange={(val) => setLimit(Number(val))}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={limit} />
            </SelectTrigger>
            <SelectContent className="min-w-[70px] w-[70px]">
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <Pagination
            currentPage={currentPage || 1}
            itemPerPage={limit || 1}
            totalItem={totalRecords || 1}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </>
  );
};

export default CouponTable;
