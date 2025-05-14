"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Loader2,
  Download,
  Share2,
  Clock,
  CreditCard,
  Receipt,
  Home,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/constants/store";
import Confetti from "react-confetti";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useWindowSize } from "@/hooks/use-window-size";

const VnpayReturnPage = () => {
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  const [result, setResult] = useState<"success" | "fail" | null>(null);
  const [message, setMessage] = useState("Đang xử lý...");
  const [transactionTime, setTransactionTime] = useState<Date | null>(null);

  const getFailReason = (code: string | null) => {
    const reasons: Record<string, string> = {
      "07": "Giao dịch bị nghi ngờ gian lận",
      "09": "Thẻ/Tài khoản chưa đăng ký dịch vụ InternetBanking",
      "10": "Xác thực thông tin không đúng quá 3 lần",
      "11": "Đã hết hạn chờ thanh toán",
      "12": "Thẻ/Tài khoản bị khóa",
      "13": "Nhập sai mật khẩu xác thực giao dịch (OTP)",
      "24": "Khách hàng đã hủy giao dịch",
      "51": "Tài khoản không đủ số dư để thực hiện giao dịch",
      "65": "Tài khoản vượt quá hạn mức giao dịch trong ngày",
      "75": "Ngân hàng thanh toán đang bảo trì",
      "79": "Nhập sai mật khẩu thanh toán quá số lần quy định",
      "99": "Các lỗi khác",
      default: "Lỗi không xác định",
    };
    return reasons[code || ""] || reasons["default"];
  };

  const getTransactionStatusMessage = (status: string | null) => {
    const statusMessages: Record<string, string> = {
      "00": "Giao dịch thành công",
      "01": "Giao dịch chưa hoàn tất",
      "02": "Giao dịch bị lỗi",
      "04": "Giao dịch đảo (Đã bị trừ tiền tại Ngân hàng nhưng chưa thành công ở VNPAY)",
      "05": "VNPAY đang xử lý giao dịch này",
      "06": "VNPAY đã gửi yêu cầu hoàn tiền sang Ngân hàng",
      "07": "Giao dịch bị nghi ngờ gian lận",
      "09": "Giao dịch hoàn trả bị từ chối",
      default: "Trạng thái không xác định",
    };
    return statusMessages[status || ""] || statusMessages["default"];
  };

  const getBankName = (code: string) => {
    const banks: Record<string, string> = {
      NCB: "Ngân hàng Quốc Dân (NCB)",
      VIETCOMBANK: "Ngân hàng Ngoại Thương (Vietcombank)",
      VIETINBANK: "Ngân hàng Công Thương (VietinBank)",
      BIDV: "Ngân hàng Đầu tư và Phát triển Việt Nam (BIDV)",
      AGRIBANK: "Ngân hàng Nông nghiệp (Agribank)",
      SACOMBANK: "Ngân hàng Sài Gòn Thương Tín (Sacombank)",
      TECHCOMBANK: "Ngân hàng Kỹ Thương (Techcombank)",
      MBBANK: "Ngân hàng Quân Đội (MB Bank)",
      VPBANK: "Ngân hàng Việt Nam Thịnh Vượng (VP Bank)",
      default: code,
    };
    return banks[code] || banks["default"];
  };

  const getCardType = (type: string) => {
    const types: Record<string, string> = {
      ATM: "Thẻ ATM nội địa",
      CREDIT: "Thẻ tín dụng/ghi nợ quốc tế",
      QRCODE: "QR Code",
      default: type,
    };
    return types[type] || types["default"];
  };

  useEffect(() => {
    if (userInfo.id) {
      const timer = setTimeout(() => {
        const transactionStatus = searchParams.get("vnp_TransactionStatus");
        const responseCode = searchParams.get("vnp_ResponseCode");
        const payDate = searchParams.get("vnp_PayDate"); // Format: YYYYMMDDHHmmss

        if (payDate) {
          const year = parseInt(payDate.substring(0, 4));
          const month = parseInt(payDate.substring(4, 6)) - 1;
          const day = parseInt(payDate.substring(6, 8));
          const hour = parseInt(payDate.substring(8, 10));
          const minute = parseInt(payDate.substring(10, 12));
          const second = parseInt(payDate.substring(12, 14));
          setTransactionTime(new Date(year, month, day, hour, minute, second));
        } else {
          setTransactionTime(new Date());
        }

        if (transactionStatus === "00" && responseCode === "00") {
          setResult("success");
          setMessage(
            "Thanh toán đã được xử lý thành công. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi."
          );
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 8000);
        } else {
          setResult("fail");
          const statusMessage = getTransactionStatusMessage(transactionStatus);
          const reasonMessage = getFailReason(responseCode);
          setMessage(`${statusMessage}. ${reasonMessage}`);
        }
        setIsLoading(false);
      }, 1500);

      return () => clearTimeout(timer);
    } else {
      router.push("/login");
    }
  }, [searchParams, userInfo.id, router]);

  const getParam = (key: string) => searchParams.get(key) || "";

  const formatCurrency = (amount: string) => {
    const value = parseInt(amount) / 100;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDateTime = (date: Date | null) => {
    if (!date) return "";
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(date);
  };

  const handleDownloadReceipt = () => {
    // Implement receipt download functionality
    alert("Tính năng tải biên lai sẽ sớm được cập nhật!");
  };

  const handleShareTransaction = () => {
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: `Biên lai thanh toán - ${getParam("vnp_TxnRef")}`,
        text: `Giao dịch ${
          result === "success" ? "thành công" : "thất bại"
        } - Mã giao dịch: ${getParam("vnp_TransactionNo")}`,
        url: window.location.href,
      });
    } else {
      alert("Trình duyệt của bạn không hỗ trợ tính năng chia sẻ!");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-tr from-[#f0f4ff] via-white to-[#e6f7ff] dark:from-eerieBlack dark:via-black dark:to-eerieBlack">
        <div className="relative w-24 h-24 mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-muted animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <CreditCard className="w-10 h-10 text-muted-foreground" />
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-2">Đang xử lý thanh toán</h2>
        <p className="text-muted-foreground text-sm mb-4">
          Vui lòng đợi trong giây lát...
        </p>
        <div className="flex space-x-1">
          <div
            className="w-2 h-2 rounded-full bg-blueberry animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-2 rounded-full bg-blueberry animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-2 rounded-full bg-blueberry animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#f0f4ff] via-white to-[#e6f7ff] dark:from-eerieBlack dark:via-black dark:to-eerieBlack flex items-center justify-center px-4 py-10">
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-3xl bg-card shadow-2xl rounded-3xl overflow-hidden"
      >
        {/* Status Banner */}
        <div
          className={`w-full h-16 flex items-center justify-center ${
            result === "success"
              ? "bg-gradient-to-r from-green-400 to-emerald-600"
              : "bg-gradient-to-r from-red-400 to-rose-600"
          }`}
        >
          <div className="flex items-center space-x-2">
            {result === "success" ? (
              <CheckCircle2 size={24} className="text-white" />
            ) : (
              <XCircle size={24} className="text-white" />
            )}
            <h2 className="text-white font-bold text-lg">
              {result === "success"
                ? "Thanh toán thành công"
                : "Thanh toán thất bại"}
            </h2>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {/* Transaction Summary */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
            <div
              className={`flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center ${
                result === "success"
                  ? "bg-green-100 dark:bg-green-900/30 text-vividMalachite"
                  : "bg-red-100 dark:bg-red-900/30 text-carminePink"
              }`}
            >
              {result === "success" ? (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <CheckCircle2 size={40} />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <XCircle size={40} />
                </motion.div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <h1 className="text-2xl font-bold">
                  {formatCurrency(getParam("vnp_Amount"))}
                </h1>
                <Badge
                  variant={result === "success" ? "default" : "destructive"}
                  className={`${
                    result === "success"
                      ? "bg-green-100 text-vividMalachite border-green-200 dark:bg-green-900/30 dark:border-green-800"
                      : "bg-red-100 text-carminePink border-red-200 dark:bg-red-900/30 dark:border-red-800"
                  }`}
                >
                  {result === "success" ? "Thành công" : "Thất bại"}
                </Badge>
              </div>
              <p className="text-muted-foreground mb-2">
                {getParam("vnp_OrderInfo")}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground">
                <Clock size={14} />
                <span>{formatDateTime(transactionTime)}</span>
              </div>
            </div>
          </div>

          {/* Message */}
          <div
            className={`mb-6 p-4 rounded-xl ${
              result === "success"
                ? "bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30"
                : "bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30"
            }`}
          >
            <p
              className={`text-sm ${
                result === "success"
                  ? "text-vividMalachite"
                  : "text-carminePink"
              }`}
            >
              {message}
            </p>
          </div>

          {/* Transaction Details Tabs */}
          <Tabs defaultValue="details" className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Chi tiết giao dịch</TabsTrigger>
              <TabsTrigger value="payment">Thông tin thanh toán</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-4 space-y-4">
              <Card>
                <CardContent className="p-4 space-y-3">
                  <InfoRow
                    icon={<Receipt size={16} />}
                    label="Mã giao dịch"
                    value={getParam("vnp_TransactionNo")}
                    copyable
                  />
                  <InfoRow
                    icon={<Receipt size={16} />}
                    label="Mã tham chiếu"
                    value={getParam("vnp_TxnRef")}
                    copyable
                  />
                  <InfoRow
                    icon={<Clock size={16} />}
                    label="Thời gian"
                    value={formatDateTime(transactionTime)}
                  />
                  <InfoRow
                    icon={<CreditCard size={16} />}
                    label="Số tiền"
                    value={formatCurrency(getParam("vnp_Amount"))}
                    highlight
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="payment" className="mt-4 space-y-4">
              <Card>
                <CardContent className="p-4 space-y-3">
                  <InfoRow
                    icon={<CreditCard size={16} />}
                    label="Ngân hàng"
                    value={getBankName(getParam("vnp_BankCode"))}
                  />
                  <InfoRow
                    icon={<CreditCard size={16} />}
                    label="Loại thẻ"
                    value={getCardType(getParam("vnp_CardType"))}
                  />
                  <InfoRow
                    icon={<CreditCard size={16} />}
                    label="Cổng thanh toán"
                    value="VNPAY"
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-auto py-3"
              onClick={handleDownloadReceipt}
            >
              <Download size={18} className="mb-1" />
              <span className="text-xs">Tải biên lai</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-auto py-3"
              onClick={handleShareTransaction}
            >
              <Share2 size={18} className="mb-1" />
              <span className="text-xs">Chia sẻ</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-auto py-3"
              onClick={() => router.push("/billing/history")}
            >
              <Receipt size={18} className="mb-1" />
              <span className="text-xs">Lịch sử</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-auto py-3"
              onClick={() => router.push("/contact")}
            >
              <MessageSquare size={18} className="mb-1" />
              <span className="text-xs">Hỗ trợ</span>
            </Button>
          </div> */}

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Button
              onClick={() => router.push("/")}
              className={`${
                result === "success"
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  : "bg-gradient-to-r from-blueberry to-LavenderIndigo hover:from-blueberry/90 hover:to-LavenderIndigo/90"
              } text-white`}
            >
              <Home className="mr-2 h-4 w-4" />
              Về trang chủ
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

interface InfoRowProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  copyable?: boolean;
  highlight?: boolean;
}

const InfoRow = ({
  label,
  value,
  icon,
  copyable = false,
  highlight = false,
}: InfoRowProps) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
  };

  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <span className="text-muted-foreground">{label}:</span>
      </div>
      <div className="flex items-center gap-1">
        <span
          className={`font-medium text-right ${
            highlight ? "text-lg text-foreground" : "text-foreground"
          }`}
        >
          {value}
        </span>
        {copyable && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full hover:bg-muted"
            onClick={handleCopy}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
            >
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </svg>
            <span className="sr-only">Copy to clipboard</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default VnpayReturnPage;
