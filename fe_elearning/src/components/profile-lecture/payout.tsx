'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Download,
  Eye,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
  Loader2,
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { APIGetPayout } from '@/utils/payout';
import { PayoutType } from '@/types/payoutType';
import { formatPrice } from '../formatPrice';
import Pagination from '../pagination/paginations';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'SENT':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'PENDING':
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'PROCESSING':
      return <Clock className="h-4 w-4 text-blue-500" />;
    case 'FAILED':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusBadge = (status: string) => {
  const variants = {
    SENT: 'Thành công',
    PENDING: 'Chờ xử lý',
    PROCESSING: 'Đang xử lý',
    FAILED: 'Thất bại',
  };
  return (
    <Badge
      variant="outline"
      className={`${
        status === 'SENT'
          ? 'bg-green-500 text-white'
          : status === 'PENDING'
            ? 'bg-yellow-500 text-white'
            : status === 'PROCESSING'
              ? 'bg-blue-500 text-white'
              : status === 'FAILED'
                ? 'bg-red-500 text-white'
                : 'bg-gray-500 text-white'
      }`}
    >
      {status === 'SENT'
        ? 'Thành công'
        : status === 'PENDING'
          ? 'Chờ xử lý'
          : status === 'PROCESSING'
            ? 'Đang xử lý'
            : status === 'FAILED'
              ? 'Thất bại'
              : ''}
    </Badge>
  );
};

export default function InstructorPayouts() {
  const [selectedPayout, setSelectedPayout] = useState<PayoutType | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dataPayout, setDataPayout] = useState<PayoutType[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [filter, setFilter] = useState({
    page: currentPage,
    limit: itemsPerPage,
    status: undefined,
  });
  const [isExporting, setIsExporting] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    setFilter((prev) => ({
      ...prev,
      page: currentPage,
    }));
  }, [currentPage]);

  // Filter payouts based on status and search term
  const filteredPayouts = dataPayout.filter((payout) => {
    const matchesStatus = statusFilter === 'all' || payout.payout_status === statusFilter;
    const matchesSearch =
      payout.payee?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Export all data to Excel with UTF-8 encoding
  const handleExportAllToExcel = async () => {
    try {
      setIsExporting(true);

      const exportData = dataPayout.map((payout) => ({
        'Mã thanh toán': payout.id,
        'Người thanh toán': payout.payee?.username || '',
        'Số tiền': formatPrice(Number(payout.amount || 0)),
        'Trạng thái':
          payout.payout_status === 'SENT'
            ? 'Thành công'
            : payout.payout_status === 'PENDING'
              ? 'Chờ xử lý'
              : payout.payout_status === 'PROCESSING'
                ? 'Đang xử lý'
                : payout.payout_status === 'FAILED'
                  ? 'Thất bại'
                  : '',
        'Phương thức thanh toán': payout.bank_code || '',
        'Ngày thanh toán': new Date(payout.issued_at).toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
        'Kỳ thanh toán': `${payout.month}/${payout.year}`,
        'Lý do thất bại': payout.failure_reason || '',
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Payouts');

      // Ensure UTF-8 encoding
      XLSX.writeFile(
        workbook,
        `payouts-${new Date().toISOString().replace(/[:.]/g, '-').split('T')[0]}.xlsx`,
        { bookSST: true }
      );
      setIsExporting(false);
    } catch (error) {
      console.error('Error exporting Excel:', error);
      setIsExporting(false);
    }
  };

  // Export individual payout to PDF
  const handleExportIndividual = (payout: PayoutType) => {
    try {
      setIsExporting(true);

      // Create PDF in portrait mode with UTF-8 support
      const doc = new jsPDF();

      // Add font for Vietnamese
      doc.setFont('helvetica');
      doc.setFontSize(16);

      // Title
      doc.text(`Chi tiết thanh toán - ${payout.id}`, 20, 20);

      // Overview data
      const overviewData = [
        ['Mã thanh toán', payout.id],
        ['Người thanh toán', payout.payee?.username || ''],
        ['Số tiền', formatPrice(Number(payout.amount || 0))],
        [
          'Trạng thái',
          payout.payout_status === 'SENT'
            ? 'Thành công'
            : payout.payout_status === 'PENDING'
              ? 'Chờ xử lý'
              : payout.payout_status === 'PROCESSING'
                ? 'Đang xử lý'
                : payout.payout_status === 'FAILED'
                  ? 'Thất bại'
                  : '',
        ],
        ['Phương thức thanh toán', payout.bank_code || ''],
        ['Ngày thanh toán', payout.paid_out_sent_at || ''],
      ];

      // Details data
      const detailsData = [
        ['Ngày thanh toán', payout.paid_out_sent_at || ''],
        ...(payout.paid_out_sent_at ? [['Ngày xử lý', payout.paid_out_sent_at]] : []),
        ...(payout.failure_reason ? [['Lý do thất bại', payout.failure_reason]] : []),
        ...(payout.bank_account_number
          ? [
              ['Ngân hàng', payout.bank_code || ''],
              ['Số tài khoản', payout.bank_account_number],
            ]
          : []),
        ...(payout.payee?.email ? [['Email', payout.payee.email]] : []),
      ];

      // Add overview table
      (doc as any).autoTable({
        head: [['Thông tin', 'Chi tiết']],
        body: overviewData,
        startY: 30,
        theme: 'grid',
        styles: {
          fontSize: 10,
          cellPadding: 5,
          font: 'helvetica',
          textColor: [0, 0, 0],
        },
        headStyles: {
          fillColor: [63, 81, 181],
          textColor: [255, 255, 255],
          fontSize: 11,
          fontStyle: 'bold',
          halign: 'center',
        },
        columnStyles: {
          0: { fontStyle: 'bold', fillColor: [240, 240, 240] },
          1: { halign: 'left' },
        },
        margin: { top: 30, left: 20, right: 20 },
      });

      // Add details title
      const finalY = (doc as any).lastAutoTable.finalY + 20;
      doc.setFontSize(14);
      doc.text('Chi tiết thanh toán', 20, finalY);

      // Add details table
      (doc as any).autoTable({
        head: [['Thông tin', 'Chi tiết']],
        body: detailsData,
        startY: finalY + 10,
        theme: 'grid',
        styles: {
          fontSize: 10,
          cellPadding: 5,
          font: 'helvetica',
          textColor: [0, 0, 0],
        },
        headStyles: {
          fillColor: [63, 81, 181],
          textColor: [255, 255, 255],
          fontSize: 11,
          fontStyle: 'bold',
          halign: 'center',
        },
        columnStyles: {
          0: { fontStyle: 'bold', fillColor: [240, 240, 240] },
          1: { halign: 'left' },
        },
        margin: { top: 20, left: 20, right: 20 },
      });

      // Add footer with page numbers
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(
          `Trang ${i} / ${pageCount}`,
          doc.internal.pageSize.width - 30,
          doc.internal.pageSize.height - 10
        );
      }

      // Save the PDF
      const timestamp = new Date().toISOString().split('T')[0];
      doc.save(`payout-${payout.id}-${timestamp}.pdf`);

      setIsExporting(false);
    } catch (error) {
      console.error('Error exporting individual PDF:', error);
      setIsExporting(false);
    }
  };

  useEffect(() => {
    if (detailsRef.current) {
      html2canvas(detailsRef.current).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
      });
    }
  }, [selectedPayout]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight"> Tất cả thanh toán</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExportAllToExcel} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xuất...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export Excel
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsContent value="transactions" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Mã thanh toán..."
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
                <SelectItem value="SENT">Đã thanh toán</SelectItem>
                <SelectItem value="PENDING">Chờ xử lý</SelectItem>
                <SelectItem value="PROCESSING">Đang xử lý</SelectItem>
                <SelectItem value="FAILED">Thất bại</SelectItem>
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
                    <TableHead>Ngày thanh toán</TableHead>
                    <TableHead>Kỳ thanh toán</TableHead>

                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayouts &&
                    filteredPayouts.length > 0 &&
                    filteredPayouts.map((payout) => (
                      <TableRow key={payout.id}>
                        <TableCell className="font-medium">{payout.id}</TableCell>
                        <TableCell>{payout.payee?.username}</TableCell>
                        <TableCell className="font-medium">
                          {formatPrice(Number(payout.amount || 0))}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(payout.payout_status)}
                            {getStatusBadge(payout.payout_status as string)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(payout.issued_at).toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </TableCell>
                        <TableCell>
                          {payout.month}/{payout.year}
                        </TableCell>
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
                                <div className="space-y-6" ref={detailsRef}>
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
                                            {formatPrice(Number(selectedPayout.amount || 0))}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Trạng thái:</span>
                                          <div className="flex items-center gap-2">
                                            {getStatusIcon(selectedPayout.payout_status)}
                                            {getStatusBadge(selectedPayout.payout_status)}
                                          </div>
                                        </div>

                                        {selectedPayout.payee?.email && (
                                          <div className="flex justify-between">
                                            <span className="text-muted-foreground">Email:</span>
                                            <span className="font-medium">
                                              {selectedPayout.payee?.email}
                                            </span>
                                          </div>
                                        )}
                                        {selectedPayout.paid_out_sent_at && (
                                          <div className="flex justify-between">
                                            <span className="text-muted-foreground">
                                              Ngày thanh toán:
                                            </span>
                                            <span className="font-medium">
                                              {new Date(
                                                selectedPayout.issued_at
                                              ).toLocaleDateString('vi-VN', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                              })}
                                            </span>
                                          </div>
                                        )}
                                      </CardContent>
                                    </Card>

                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">
                                          Chi tiết thanh toán
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-2">
                                        {selectedPayout.transaction_code && (
                                          <div className="flex justify-between">
                                            <span className="text-muted-foreground">
                                              Mã giao dịch:
                                            </span>
                                            <span className="font-medium">
                                              {selectedPayout.transaction_code}
                                            </span>
                                          </div>
                                        )}
                                        {selectedPayout.failure_reason ? (
                                          <div className="flex justify-between">
                                            <span className="text-muted-foreground">
                                              Lý do thất bại:
                                            </span>
                                            <span className="font-medium text-red-600">
                                              {selectedPayout.failure_reason}
                                            </span>
                                          </div>
                                        ) : null}
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

                                        {selectedPayout.evidence && (
                                          <div className="flex justify-between">
                                            <span className="text-muted-foreground">Chứng từ:</span>
                                            <img
                                              src={
                                                process.env.NEXT_PUBLIC_BASE_URL_IMAGE +
                                                selectedPayout.evidence.key
                                              }
                                              alt="Chứng từ"
                                              className="w-1/2 object-contain cursor-pointer"
                                              onClick={() => {
                                                window.open(
                                                  process.env.NEXT_PUBLIC_BASE_URL_IMAGE +
                                                    selectedPayout.evidence.key,
                                                  '_blank'
                                                );
                                              }}
                                            />
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
                              <DropdownMenuItem onClick={() => handleExportIndividual(payout)}>
                                Tải xuất kết quả
                              </DropdownMenuItem>
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

          {/* Pagination */}
          <div className="flex justify-center mt-4">
            {total > itemsPerPage && (
              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalItem={total}
                itemPerPage={itemsPerPage}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
