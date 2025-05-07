"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/constants/store";
const VnpayReturnPage = () => {
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [result, setResult] = useState<"success" | "fail" | null>(null);
  const [message, setMessage] = useState("Đang xử lý...");

  useEffect(() => {
    if (userInfo.id) {
      setIsLoading(true);
      const transactionStatus = searchParams.get("vnp_TransactionStatus");
      const responseCode = searchParams.get("vnp_ResponseCode");

      if (transactionStatus === "00" && responseCode === "00") {
        setResult("success");
        setMessage("🎉 Thanh toán thành công! Cảm ơn bạn đã sử dụng dịch vụ.");
      } else {
        setResult("fail");
        const reason = getFailReason(responseCode);
        setMessage(`❌ Thanh toán không thành công. Lý do: ${reason}`);
      }
    } else {
      router.push("/login");
    }
  }, [searchParams, userInfo.id]);

  const getFailReason = (code: string | null) => {
    const reasons: Record<string, string> = {
      "07": "Giao dịch bị nghi ngờ gian lận.",
      "09": "Thẻ/Tài khoản chưa đăng ký dịch vụ InternetBanking.",
      "10": "Xác thực thông tin không đúng quá 3 lần.",
      "11": "Hết thời gian chờ thanh toán.",
      "12": "Tài khoản bị khóa.",
      "13": "Nhập sai OTP.",
      "24": "Khách hàng đã hủy giao dịch.",
      "51": "Không đủ số dư.",
      "65": "Vượt quá hạn mức trong ngày.",
      "75": "Ngân hàng bảo trì.",
      "79": "Sai mật khẩu thanh toán quá số lần quy định.",
      "99": "Lỗi không xác định.",
      default: "Lỗi không xác định hoặc không rõ mã lỗi.",
    };
    return reasons[code || ""] || reasons["default"];
  };

  const getParam = (key: string) => searchParams.get(key) || "";

  return !isLoading ? (
    <div className="min-h-screen bg-gradient-to-tr from-[#f0f4ff] via-white to-[#e6f7ff] dark:from-eerieBlack dark:via-black dark:to-eerieBlack flex items-center justify-center px-4 py-10">
      <div className="relative w-full max-w-2xl bg-card shadow-2xl rounded-3xl p-6 md:p-10 border border-border space-y-6">
        <div className="absolute top-4 left-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/")}
            className="flex items-center gap-1 text-sm"
          >
            <ArrowLeft size={16} />
            Quay lại
          </Button>
        </div>

        <div className="flex flex-col items-center text-center">
          {result === "success" && (
            <CheckCircle2
              size={64}
              className="text-vividMalachite animate-pulse mb-2"
            />
          )}
          {result === "fail" && (
            <XCircle size={64} className="text-redPigment animate-pulse mb-2" />
          )}
          <h1 className="text-2xl font-bold tracking-tight">
            {result === "success"
              ? "Thanh toán thành công"
              : result === "fail"
              ? "Thanh toán thất bại"
              : "Đang xử lý kết quả..."}
          </h1>
          <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
            {message}
          </p>
        </div>

        <div className="bg-muted/50 p-4 rounded-xl text-sm space-y-2">
          <InfoRow label="Mã giao dịch" value={getParam("vnp_TransactionNo")} />
          <InfoRow label="Mã tham chiếu" value={getParam("vnp_TxnRef")} />
          <InfoRow label="Ngân hàng" value={getParam("vnp_BankCode")} />
          <InfoRow label="Loại thẻ" value={getParam("vnp_CardType")} />
          <InfoRow
            label="Số tiền"
            value={`${(+getParam("vnp_Amount") / 100).toLocaleString(
              "vi-VN"
            )}₫`}
          />
          <InfoRow
            label="Thông tin đơn hàng"
            value={getParam("vnp_OrderInfo")}
          />
        </div>

        <div className="text-center">
          <Button onClick={() => router.push("/")} className="mt-2">
            Về trang chủ
          </Button>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="w-10 h-10 animate-spin" />
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between text-sm">
    <span className="text-muted-foreground w-1/2 line-clamp-1">{label}:</span>
    <span className="font-medium text-right w-1/2 line-clamp-1">{value}</span>
  </div>
);

export default VnpayReturnPage;
