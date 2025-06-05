'use client';

import { useState } from 'react';
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
    completed: 'default',
    pending: 'secondary',
    processing: 'outline',
    failed: 'destructive',
  };
  return (
    <Badge variant={(variants[status as keyof typeof variants] as "default" | "secondary" | "outline" | "destructive") || 'secondary'} className="capitalize">
      {status}
    </Badge>
  );
};

export default function InstructorPayouts() {
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [dataPayout, setDataPayout] = useState([]);
  const [filter, setFilter] = useState({
    page:1,
    limmit:10,
    status: undefined,

  })

  const handleGetPayout = async() =>{
    try{
      const res = await APIGetPayout(filter);
      if(res?.status === 200){
        setDataPayout(res?.data)
      }
    }

  }

  // Filter payouts based on status, search term, and date range
  const filteredPayouts = payoutData.filter((payout) => {
    const matchesStatus = statusFilter === 'all' || payout.status === statusFilter;
    const matchesSearch =
      payout.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate summary statistics
  const totalEarnings = payoutData.reduce((sum, payout) => sum + payout.amount, 0);
  const pendingPayments = payoutData
    .filter((p) => p.status === 'pending' || p.status === 'processing')
    .reduce((sum, payout) => sum + payout.amount, 0);
  const completedPayments = payoutData.filter((p) => p.status === 'completed').length;
  const failedPayments = payoutData.filter((p) => p.status === 'failed').length;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Instructor Payouts</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time instructor earnings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingPayments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Payments</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedPayments}</div>
            <p className="text-xs text-muted-foreground">Successfully processed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Payments</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{failedPayments}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
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
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payouts Table */}
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                Detailed history of all instructor payments and transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayouts.map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell className="font-medium">{payout.id}</TableCell>
                      <TableCell>{payout.instructor}</TableCell>
                      <TableCell className="font-medium">
                        ${payout.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(payout.status)}
                          {getStatusBadge(payout.status)}
                        </div>
                      </TableCell>
                      <TableCell>{payout.paymentMethod}</TableCell>
                      <TableCell>{payout.transactionDate}</TableCell>
                      <TableCell>{payout.period}</TableCell>
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
                              <DialogTitle>Payment Details - {payout.id}</DialogTitle>
                              <DialogDescription>
                                Complete transaction information for {payout.instructor}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedPayout && (
                              <div className="space-y-6">
                                {/* Payment Overview */}
                                <div className="grid gap-4 md:grid-cols-2">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Payment Overview</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                          Transaction ID:
                                        </span>
                                        <span className="font-medium">{selectedPayout.id}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Instructor:</span>
                                        <span className="font-medium">
                                          {selectedPayout.instructor}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Amount:</span>
                                        <span className="font-bold text-lg">
                                          ${selectedPayout.amount.toLocaleString()}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Status:</span>
                                        <div className="flex items-center gap-2">
                                          {getStatusIcon(selectedPayout.status)}
                                          {getStatusBadge(selectedPayout.status)}
                                        </div>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                          Payment Method:
                                        </span>
                                        <span className="font-medium">
                                          {selectedPayout.paymentMethod}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Period:</span>
                                        <span className="font-medium">{selectedPayout.period}</span>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Payment Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                          Transaction Date:
                                        </span>
                                        <span className="font-medium">
                                          {selectedPayout.transactionDate}
                                        </span>
                                      </div>
                                      {selectedPayout.processedDate && (
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">
                                            Processed Date:
                                          </span>
                                          <span className="font-medium">
                                            {selectedPayout.processedDate}
                                          </span>
                                        </div>
                                      )}
                                      {selectedPayout.failureReason && (
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">
                                            Failure Reason:
                                          </span>
                                          <span className="font-medium text-red-600">
                                            {selectedPayout.failureReason}
                                          </span>
                                        </div>
                                      )}
                                      {selectedPayout.bankDetails && (
                                        <>
                                          <div className="flex justify-between">
                                            <span className="text-muted-foreground">Bank:</span>
                                            <span className="font-medium">
                                              {selectedPayout.bankDetails.bankName}
                                            </span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-muted-foreground">Account:</span>
                                            <span className="font-medium">
                                              {selectedPayout.bankDetails.accountNumber}
                                            </span>
                                          </div>
                                        </>
                                      )}
                                      {selectedPayout.paypalEmail && (
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">
                                            PayPal Email:
                                          </span>
                                          <span className="font-medium">
                                            {selectedPayout.paypalEmail}
                                          </span>
                                        </div>
                                      )}
                                    </CardContent>
                                  </Card>
                                </div>

                                {/* Course Earnings Breakdown */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">
                                      Course Earnings Breakdown
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Course Name</TableHead>
                                          <TableHead>Students</TableHead>
                                          <TableHead className="text-right">Earnings</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {selectedPayout.courses.map((course, index) => (
                                          <TableRow key={index}>
                                            <TableCell className="font-medium">
                                              {course.name}
                                            </TableCell>
                                            <TableCell>{course.students}</TableCell>
                                            <TableCell className="text-right font-medium">
                                              ${course.earnings.toLocaleString()}
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </CardContent>
                                </Card>

                                {/* Fee Breakdown */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">Fee Breakdown</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                          Gross Earnings:
                                        </span>
                                        <span className="font-medium">
                                          $
                                          {(
                                            selectedPayout.amount +
                                            selectedPayout.fees.platformFee +
                                            selectedPayout.fees.processingFee
                                          ).toLocaleString()}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                          Platform Fee (15%):
                                        </span>
                                        <span className="font-medium">
                                          -${selectedPayout.fees.platformFee.toLocaleString()}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                          Processing Fee:
                                        </span>
                                        <span className="font-medium">
                                          -${selectedPayout.fees.processingFee.toLocaleString()}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                          Tax Withholding:
                                        </span>
                                        <span className="font-medium">
                                          -${selectedPayout.fees.tax.toLocaleString()}
                                        </span>
                                      </div>
                                      <hr />
                                      <div className="flex justify-between font-bold text-lg">
                                        <span>Net Payment:</span>
                                        <span>${selectedPayout.amount.toLocaleString()}</span>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
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
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>Download Receipt</DropdownMenuItem>
                            <DropdownMenuItem>Resend Payment</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Contact Instructor</DropdownMenuItem>
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

        <TabsContent value="analytics" className="space-y-4">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
