'use client';

import {
  ArrowUp,
  BarChart3,
  DollarSign,
  Percent,
  Plus,
  Search,
  SlidersHorizontal,
  Ticket,
} from 'lucide-react';

import { Button } from '../../../../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../../../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../../components/ui/tabs';
import { Progress } from '../../../../../components/ui/progress';
import { Chart } from '../../../../../components/ui/dashboard-chart';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../../../components/ui/dropdown-menu';
import { APIGetCouponsFromInstructor } from '@/utils/coupon';
import { useEffect, useState } from 'react';
import { CouponQueryType, CouponType } from '@/types/couponType';
import { OffsetPaginationType } from '@/types/paginationType';
import { useSearchParams } from 'next/navigation';
import UpsertCouponDialog from './dialog/upsertCouponDialog';
import CouponTable from './table/couponTable';
import DeleteCouponDialog from './dialog/deleteCouponDialog';

export enum CouponStatus {
  EXPIRED = 'EXPIRED',
  VALID_NOW = 'VALID_NOW',
  NOT_STARTED = 'NOT_STARTED',
}

type Tab = 'active' | 'scheduled' | 'expired' | 'analytics';

const CouponManagement = () => {
  const searchParams = useSearchParams();

  const fetchCoupons = async () => {
    try {
      setCouponLoading(true);
      const response = await APIGetCouponsFromInstructor(couponQueryParams);
      setCoupons(response?.data);
      setPagination(response?.pagination);
    } catch (error) {
      console.log(error);
    } finally {
      setCouponLoading(false);
    }
  };

  const [coupons, setCoupons] = useState<CouponType[]>([]);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponQueryParams, setCouponQueryParams] = useState<CouponQueryType>({
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 10,
    status: CouponStatus.VALID_NOW,
    is_active: undefined,
    is_public: undefined,
    usage_exceeded: undefined,
    q: undefined,
  });
  const [pagination, setPagination] = useState<OffsetPaginationType | null>(null);

  const couponUsageData = [
    { name: 'Jan', withCoupon: 18, withoutCoupon: 27 },
    { name: 'Feb', withCoupon: 22, withoutCoupon: 30 },
    { name: 'Mar', withCoupon: 20, withoutCoupon: 29 },
    { name: 'Apr', withCoupon: 25, withoutCoupon: 37 },
    { name: 'May', withCoupon: 32, withoutCoupon: 46 },
  ];

  const [currentTab, setCurrentTab] = useState<Tab>('active');

  const handleChangeTab = () => {
    switch (currentTab) {
      case 'active':
        setCouponQueryParams({
          ...couponQueryParams,
          status: CouponStatus.VALID_NOW,
        });
        break;
      case 'scheduled':
        setCouponQueryParams({
          ...couponQueryParams,
          status: CouponStatus.NOT_STARTED,
        });
        break;
      case 'expired':
        setCouponQueryParams({
          ...couponQueryParams,
          status: CouponStatus.EXPIRED,
        });
        break;
      case 'analytics':
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    handleChangeTab();
  }, [currentTab]);

  useEffect(() => {
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    if (page && limit) {
      setCouponQueryParams({
        ...couponQueryParams,
        page: Number(page),
        limit: Number(limit),
      });
    }
  }, [searchParams]);

  useEffect(() => {
    fetchCoupons();
  }, [couponQueryParams]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [selectedCoupon, setSelectedCoupon] = useState<CouponType | undefined>(undefined);

  const handleCreate = () => {
    setMode('create');
    setSelectedCoupon(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (coupon: CouponType) => {
    setMode('edit');
    setSelectedCoupon(coupon);
    setDialogOpen(true);
  };

  const handleDelete = async (coupon: CouponType) => {
    setSelectedCoupon(coupon);
    setDeleteDialogOpen(true);
  };

  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setCouponQueryParams((prev) => ({
        ...prev,
        q: searchInput.trim() === '' ? undefined : searchInput.trim(),
        page: 1,
      }));
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchInput]);

  return (
    <div className="space-y-4">
      <DeleteCouponDialog
        onOpenChange={setDeleteDialogOpen}
        open={deleteDialogOpen}
        coupon={selectedCoupon}
        handleSuccess={() => {
          fetchCoupons();
          setDialogOpen(false);
        }}
        handleError={() => setDialogOpen(false)}
      />
      <UpsertCouponDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={mode}
        status={currentTab as any}
        coupon={selectedCoupon}
        handleSuccess={() => {
          fetchCoupons();
          setDialogOpen(false);
        }}
        handleError={() => setDialogOpen(false)}
      />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quản lý Coupon</h2>
          <p className="text-muted-foreground">
            Tạo và quản lý mã khuyến mãi cho các khóa học của bạn
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4" />
          Tạo Coupon
        </Button>
      </div>

      {/* Coupon Overview Cards */}
      {/* <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Coupon</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                <ArrowUp className="mr-1 h-4 w-4" />3
              </span>{' '}
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coupon Redemptions</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">487</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                <ArrowUp className="mr-1 h-4 w-4" />
                12%
              </span>{' '}
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue with Coupons</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$8,572</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                <ArrowUp className="mr-1 h-4 w-4" />
                18%
              </span>{' '}
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Discount</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">27.5%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500 flex items-center">
                <ArrowUp className="mr-1 h-4 w-4 rotate-180" />
                2.3%
              </span>{' '}
              from last month
            </p>
          </CardContent>
        </Card>
      </div> */}

      {/* Tabs for different coupon views */}
      <Tabs
        defaultValue="active"
        className="space-y-4"
        value={currentTab}
        onValueChange={(val) => setCurrentTab(val as Tab)}
      >
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="scheduled">Lên Lịch</TabsTrigger>
            <TabsTrigger value="expired">Hết Hạn</TabsTrigger>
            {/* <TabsTrigger value="analytics">Analytics</TabsTrigger> */}
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Tìm coupons..."
                className="h-8 w-[200px] rounded-md border border-input bg-background pl-8 pr-3 py-0 text-sm text-black ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span>Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 h-64 overflow-y-scroll">
                <DropdownMenuLabel>Filter theo</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>Toàn bộ khóa học</DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <div className="p-2">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">Lượt sử dụng</p>
                  <div className="space-y-1">
                    <DropdownMenuCheckboxItem
                      checked={couponQueryParams.usage_exceeded === true}
                      onCheckedChange={() =>
                        setCouponQueryParams((prev) => ({
                          ...prev,
                          usage_exceeded: prev.usage_exceeded === true ? undefined : true,
                        }))
                      }
                    >
                      Hết lượt sử dụng
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={couponQueryParams.usage_exceeded === false}
                      onCheckedChange={() =>
                        setCouponQueryParams((prev) => ({
                          ...prev,
                          usage_exceeded: prev.usage_exceeded === false ? undefined : false,
                        }))
                      }
                    >
                      Còn lượt sử dụng
                    </DropdownMenuCheckboxItem>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <div className="p-2">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">Chế độ</p>
                  <div className="space-y-1">
                    <DropdownMenuCheckboxItem
                      checked={couponQueryParams.is_public === true}
                      onCheckedChange={() =>
                        setCouponQueryParams((prev) => ({
                          ...prev,
                          is_public: prev.is_public === true ? undefined : true,
                        }))
                      }
                    >
                      Public
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={couponQueryParams.is_public === false}
                      onCheckedChange={() =>
                        setCouponQueryParams((prev) => ({
                          ...prev,
                          is_public: prev.is_public === false ? undefined : false,
                        }))
                      }
                    >
                      Private
                    </DropdownMenuCheckboxItem>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <div className="p-2">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">Trạng thái</p>
                  <div className="space-y-1">
                    <DropdownMenuCheckboxItem
                      checked={couponQueryParams.is_active === true}
                      onCheckedChange={() =>
                        setCouponQueryParams((prev) => ({
                          ...prev,
                          is_active: prev.is_active === true ? undefined : true,
                        }))
                      }
                    >
                      Active
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={couponQueryParams.is_active === false}
                      onCheckedChange={() =>
                        setCouponQueryParams((prev) => ({
                          ...prev,
                          is_active: prev.is_active === false ? undefined : false,
                        }))
                      }
                    >
                      Ina
                    </DropdownMenuCheckboxItem>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <TabsContent value="active" className="space-y-4">
          <CouponTable
            coupons={coupons}
            loading={couponLoading}
            status="active"
            setCurrentPage={(page) => {
              setCouponQueryParams({
                ...couponQueryParams,
                page: page,
              });
            }}
            limit={couponQueryParams.limit}
            setLimit={(limit) => {
              setCouponQueryParams({
                ...couponQueryParams,
                limit: limit,
              });
            }}
            totalRecords={pagination?.totalRecords || 0}
            currentPage={couponQueryParams.page}
          />
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <CouponTable
            coupons={coupons}
            loading={couponLoading}
            status="scheduled"
            onEdit={handleEdit}
            onDelete={handleDelete}
            setCurrentPage={(page) => {
              setCouponQueryParams({
                ...couponQueryParams,
                page: page,
              });
            }}
            limit={couponQueryParams.limit}
            setLimit={(limit) => {
              setCouponQueryParams({
                ...couponQueryParams,
                limit: limit,
              });
            }}
            totalRecords={pagination?.totalRecords || 0}
            currentPage={couponQueryParams.page}
          />
        </TabsContent>

        <TabsContent value="expired" className="space-y-4">
          <CouponTable
            coupons={coupons}
            loading={couponLoading}
            status="expired"
            setCurrentPage={(page) => {
              setCouponQueryParams({
                ...couponQueryParams,
                page: page,
              });
            }}
            limit={couponQueryParams.limit}
            setLimit={(limit) => {
              setCouponQueryParams({
                ...couponQueryParams,
                limit: limit,
              });
            }}
            totalRecords={pagination?.totalRecords || 0}
            currentPage={couponQueryParams.page}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Coupon Usage Over Time</CardTitle>
                <CardDescription>Monthly breakdown of coupon usage</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <Chart
                  type="bar"
                  data={couponUsageData}
                  categories={['withCoupon', 'withoutCoupon']}
                  index="name"
                  colors={['#8b5cf6', '#94a3b8']}
                  valueFormatter={(value) => `${value} enrollments`}
                  showLegend={true}
                  showGridLines={false}
                  showXAxis={true}
                  showYAxis={true}
                />
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-full bg-[#8b5cf6]"></div>
                    <span>With Coupon</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-full bg-[#94a3b8]"></div>
                    <span>Without Coupon</span>
                  </div>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Coupons</CardTitle>
                <CardDescription>By revenue generated</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <Chart
                  type="bar"
                  data={[
                    { name: 'SPRING25', value: 3625 },
                    { name: 'WINTER30', value: 5880 },
                    { name: 'NEWSTUDENT', value: 2175 },
                    { name: 'WEBDEV15', value: 1428 },
                    { name: 'DATASCIENCE20', value: 1344 },
                  ]}
                  categories={['value']}
                  index="name"
                  colors={['#8b5cf6']}
                  valueFormatter={(value) => `$${value}`}
                  showLegend={false}
                  showGridLines={false}
                  showXAxis={true}
                  showYAxis={true}
                />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Coupon Impact by Course</CardTitle>
                <CardDescription>How coupons affect each course's sales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Web Development</span>
                      <span className="text-sm font-medium">48%</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-full w-[48%] rounded-full bg-purple-500"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Sales with coupon: 48%</span>
                      <span>Sales without coupon: 52%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Data Science</span>
                      <span className="text-sm font-medium">35%</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-full w-[35%] rounded-full bg-purple-500"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Sales with coupon: 35%</span>
                      <span>Sales without coupon: 65%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">UI/UX Design</span>
                      <span className="text-sm font-medium">42%</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-full w-[42%] rounded-full bg-purple-500"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Sales with coupon: 42%</span>
                      <span>Sales without coupon: 58%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Mobile App Development</span>
                      <span className="text-sm font-medium">38%</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-full w-[38%] rounded-full bg-purple-500"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Sales with coupon: 38%</span>
                      <span>Sales without coupon: 62%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Coupon Performance</CardTitle>
                <CardDescription>Impact on sales and revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Coupon Usage Rate</span>
                      <span className="text-sm font-medium">41%</span>
                    </div>
                    <Progress value={41} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      Percentage of sales using coupons
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Avg. Discount</span>
                      <span className="text-sm font-medium">27.5%</span>
                    </div>
                    <Progress value={27.5} className="h-2" />
                    <p className="text-xs text-muted-foreground">Average discount percentage</p>
                  </div>

                  <div className="rounded-lg border p-3 mt-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                        <BarChart3 className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">$8,572</p>
                        <p className="text-xs text-muted-foreground">Revenue from coupon sales</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                        <Percent className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">$2,350</p>
                        <p className="text-xs text-muted-foreground">Discount amount</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Coupon Conversion Rate</CardTitle>
              <CardDescription>How coupons affect purchase decisions</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <Chart
                type="line"
                data={[
                  { name: 'Jan', withCoupon: 68, withoutCoupon: 42 },
                  { name: 'Feb', withCoupon: 72, withoutCoupon: 45 },
                  { name: 'Mar', withCoupon: 70, withoutCoupon: 48 },
                  { name: 'Apr', withCoupon: 75, withoutCoupon: 51 },
                  { name: 'May', withCoupon: 82, withoutCoupon: 53 },
                ]}
                categories={['withCoupon', 'withoutCoupon']}
                index="name"
                colors={['#8b5cf6', '#94a3b8']}
                valueFormatter={(value) => `${value}%`}
                showLegend={true}
                showGridLines={true}
                showXAxis={true}
                showYAxis={true}
              />
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-[#8b5cf6]"></div>
                  <span>With Coupon (Conversion Rate)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-[#94a3b8]"></div>
                  <span>Without Coupon (Conversion Rate)</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CouponManagement;
