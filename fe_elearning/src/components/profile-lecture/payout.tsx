'use client';

import { useEffect, useState } from 'react';
import {
  Download,
  Eye,
  Search,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { APIGetPayout } from '@/utils/payout';
import { PayoutType } from '@/types/payoutType';
import { formatPrice } from '../formatPrice';

// Mock data for instructor payouts
// const payoutData = [
//   {
//     id: 'PAY-001',
//     instructor: 'John Doe',
//     instructorId: 'INS-001',
//     amount: 15750.0,
//     currency: 'USD',
//     status: 'completed',
//     paymentMethod: 'Bank Transfer',
//     transactionDate: '2024-01-15',
//     processedDate: '2024-01-16',
//     courses: [
//       { name: 'Complete Web Development', earnings: 8500.0, students: 170 },
//       { name: 'Advanced JavaScript', earnings: 4250.0, students: 85 },
//       { name: 'React Masterclass', earnings: 3000.0, students: 60 },
//     ],
//     fees: {
//       platformFee: 2250.0,
//       processingFee: 47.25,
//       tax: 0.0,
//     },
//     period: 'December 2023',
//     bankDetails: {
//       accountNumber: '****1234',
//       bankName: 'Chase Bank',
//       routingNumber: '****5678',
//     },
//   },
//   {
//     id: 'PAY-002',
//     instructor: 'Jane Smith',
//     instructorId: 'INS-002',
//     amount: 12300.0,
//     currency: 'USD',
//     status: 'pending',
//     paymentMethod: 'PayPal',
//     transactionDate: '2024-01-10',
//     processedDate: null,
//     courses: [
//       { name: 'Python for Data Science', earnings: 9200.0, students: 184 },
//       { name: 'Machine Learning Basics', earnings: 5350.0, students: 107 },
//     ],
//     fees: {
//       platformFee: 2050.0,
//       processingFee: 36.9,
//       tax: 0.0,
//     },
//     period: 'December 2023',
//     paypalEmail: 'jane.smith@email.com',
//   },
//   {
//     id: 'PAY-003',
//     instructor: 'Alex Johnson',
//     instructorId: 'INS-003',
//     amount: 8900.0,
//     currency: 'USD',
//     status: 'failed',
//     paymentMethod: 'Bank Transfer',
//     transactionDate: '2024-01-08',
//     processedDate: null,
//     courses: [
//       { name: 'UI/UX Design Fundamentals', earnings: 6700.0, students: 134 },
//       { name: 'Figma Masterclass', earnings: 3550.0, students: 71 },
//     ],
//     fees: {
//       platformFee: 1350.0,
//       processingFee: 26.7,
//       tax: 0.0,
//     },
//     period: 'December 2023',
//     failureReason: 'Invalid bank account details',
//     bankDetails: {
//       accountNumber: '****9876',
//       bankName: 'Bank of America',
//       routingNumber: '****4321',
//     },
//   },
//   {
//     id: 'PAY-004',
//     instructor: 'Sarah Williams',
//     instructorId: 'INS-004',
//     amount: 6750.0,
//     currency: 'USD',
//     status: 'completed',
//     paymentMethod: 'Stripe',
//     transactionDate: '2024-01-05',
//     processedDate: '2024-01-06',
//     courses: [
//       { name: 'Digital Marketing Strategy', earnings: 4500.0, students: 90 },
//       { name: 'Social Media Marketing', earnings: 3375.0, students: 67 },
//     ],
//     fees: {
//       platformFee: 1125.0,
//       processingFee: 20.25,
//       tax: 0.0,
//     },
//     period: 'December 2023',
//     stripeAccountId: 'acct_****5678',
//   },
//   {
//     id: 'PAY-005',
//     instructor: 'Mike Brown',
//     instructorId: 'INS-005',
//     amount: 4200.0,
//     currency: 'USD',
//     status: 'processing',
//     paymentMethod: 'Bank Transfer',
//     transactionDate: '2024-01-12',
//     processedDate: null,
//     courses: [
//       { name: 'Photography Basics', earnings: 3150.0, students: 63 },
//       { name: 'Photo Editing with Lightroom', earnings: 1890.0, students: 38 },
//     ],
//     fees: {
//       platformFee: 840.0,
//       processingFee: 12.6,
//       tax: 0.0,
//     },
//     period: 'December 2023',
//     bankDetails: {
//       accountNumber: '****5555',
//       bankName: 'Wells Fargo',
//       routingNumber: '****7777',
//     },
//   },
// ];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'pending':
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'processing':
      return <Clock className="h-4 w-4 text-blue-500" />;
    case 'failed':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusBadge = (status: string) => {
  const variants = {
    completed: 'success',
    pending: 'warning',
    processing: 'warning',
    failed: 'destructive',
  };
  return (
    <Badge
      variant={
        (variants[status as keyof typeof variants] as
          | 'default'
          | 'secondary'
          | 'outline'
          | 'destructive') || 'secondary'
      }
      className="capitalize"
    >
      {status}
    </Badge>
  );
};

export default function InstructorPayouts() {
  const [selectedPayout, setSelectedPayout] = useState<PayoutType | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [dataPayout, setDataPayout] = useState<PayoutType[]>([]);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState({
    page: 1,
    limmit: 10,
    status: undefined,
  });

  const handleGetPayout = async () => {
    try {
      const res = await APIGetPayout(filter);
      if (res?.status === 200) {
        setDataPayout(res?.data?.data);
        setTotal(res?.data?.total);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetPayout();
  }, [filter]);

  // Filter payouts based on status, search term, and date range
  const filteredPayouts = dataPayout.filter((payout) => {
    const matchesStatus = statusFilter === 'all' || payout.payout_status === statusFilter;
    const matchesSearch =
      payout.payee?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight"> Tất cả thanh toán</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Thanh toán</TabsTrigger>
          <TabsTrigger value="analytics">Lịch sử</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search instructors or transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="completed">Đã thanh toán</SelectItem>
                <SelectItem value="pending">Chờ xử lý</SelectItem>
                <SelectItem value="processing">Đang xử lý</SelectItem>
                <SelectItem value="failed">Thất bại</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payouts Table */}
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử thanh toán</CardTitle>
              <CardDescription>Lịch sử thanh toán của tất cả khoá học</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã thanh toán</TableHead>
                    <TableHead>Người thanh toán</TableHead>
                    <TableHead>Số tiền</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Phương thức thanh toán (Bank)</TableHead>
                    <TableHead>Ngày thanh toán</TableHead>
                    <TableHead>Ngày xử lý</TableHead>
                    <TableHead>Lý do thất bại</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayouts.map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell className="font-medium">{payout.id}</TableCell>
                      <TableCell>{payout.payee?.username}</TableCell>
                      <TableCell className="font-medium">
                        {formatPrice(Number(payout.amount || 0))}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(payout.payout_status)}
                          {getStatusBadge(payout.payout_status)}
                        </div>
                      </TableCell>
                      <TableCell>{payout.bank_code}</TableCell>
                      <TableCell>{payout.paid_out_sent_at}</TableCell>
                      <TableCell>{payout.failure_reason}</TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedPayout(payout)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Chi tiết thanh toán - {payout.id}</DialogTitle>
                              <DialogDescription>
                                Chi tiết thanh toán cho {payout.payee?.username}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedPayout && (
                              <div className="space-y-6">
                                {/* Payment Overview */}
                                <div className="grid gap-4 md:grid-cols-2">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">
                                        Tổng quan thanh toán
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                          Mã thanh toán:
                                        </span>
                                        <span className="font-medium">{selectedPayout.id}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                          Người thanh toán:
                                        </span>
                                        <span className="font-medium">
                                          {selectedPayout.payee?.username}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Số tiền:</span>
                                        <span className="font-bold text-lg">
                                          ${selectedPayout.amount?.toLocaleString()}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Trạng thái:</span>
                                        <div className="flex items-center gap-2">
                                          {getStatusIcon(selectedPayout.payout_status)}
                                          {getStatusBadge(selectedPayout.payout_status)}
                                        </div>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                          Phương thức thanh toán (Bank):
                                        </span>
                                        <span className="font-medium">
                                          {selectedPayout.bank_code}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                          Ngày thanh toán:
                                        </span>
                                        <span className="font-medium">
                                          {selectedPayout.paid_out_sent_at}
                                        </span>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Chi tiết thanh toán</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                          Ngày thanh toán:
                                        </span>
                                        <span className="font-medium">
                                          {selectedPayout.paid_out_sent_at}
                                        </span>
                                      </div>
                                      {selectedPayout.paid_out_sent_at && (
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Ngày xử lý:</span>
                                          <span className="font-medium">
                                            {selectedPayout.paid_out_sent_at}
                                          </span>
                                        </div>
                                      )}
                                      {selectedPayout.failure_reason && (
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">
                                            Lý do thất bại:
                                          </span>
                                          <span className="font-medium text-red-600">
                                            {selectedPayout.failure_reason}
                                          </span>
                                        </div>
                                      )}
                                      {selectedPayout.bank_account_number && (
                                        <>
                                          <div className="flex justify-between">
                                            <span className="text-muted-foreground">
                                              Ngân hàng:
                                            </span>
                                            <span className="font-medium">
                                              {selectedPayout.bank_code}
                                            </span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-muted-foreground">
                                              Số tài khoản:
                                            </span>
                                            <span className="font-medium">
                                              {selectedPayout.bank_account_number}
                                            </span>
                                          </div>
                                        </>
                                      )}
                                      {selectedPayout.payee?.email && (
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Email:</span>
                                          <span className="font-medium">
                                            {selectedPayout.payee?.email}
                                          </span>
                                        </div>
                                      )}
                                    </CardContent>
                                  </Card>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                            <DropdownMenuItem>Tải xuất kết quả</DropdownMenuItem>
                            <DropdownMenuItem>Gửi lại thanh toán</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Liên hệ người thanh toán</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Payout Trends</CardTitle>
                <CardDescription>Monthly payout amounts over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <PayoutTrendsChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Payment Method Distribution</CardTitle>
                <CardDescription>Breakdown by payment method</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <PayoutBreakdownChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
