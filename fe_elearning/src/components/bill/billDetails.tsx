import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { OrderResponse } from "@/types/billType";

interface BillDetailsProps {
  bill: OrderResponse;
}

const BillDetails: React.FC<BillDetailsProps> = ({ bill }) => {
  console.log("🚀 ~ bill:", bill);
  const detailsRef = useRef<HTMLDivElement>(null);

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const handleDownloadPDF = async () => {
    if (detailsRef.current) {
      try {
        const canvas = await html2canvas(detailsRef.current, {
          scale: 2, // Tăng độ phân giải
          backgroundColor: "#ffffff", // Nền trắng
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${bill.id}-invoice.pdf`);
      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Nội dung chi tiết hóa đơn */}
      <div
        ref={detailsRef}
        className="p-4 bg-white dark:bg-richBlack rounded-lg"
      >
        <h3 className="text-lg font-semibold text-majorelleBlue">
          Chi tiết hóa đơn #{bill.id}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-darkSilver dark:text-lightSilver">
          <div>
            <p>
              <span className="font-medium text-richBlack dark:text-AntiFlashWhite">
                Phương thức thanh toán:
              </span>{" "}
              {bill?.provider}
            </p>
            <p>
              <span className="font-medium text-richBlack dark:text-AntiFlashWhite">
                Mã giao dịch:
              </span>{" "}
              {bill?.transaction_id}
            </p>
            <p>
              <span className="font-medium text-richBlack dark:text-AntiFlashWhite">
                Tiền tệ:
              </span>{" "}
              {bill?.currency}
            </p>
          </div>
          <div>
            <p className="font-medium text-richBlack dark:text-AntiFlashWhite">
              Khóa học đã mua:
            </p>
            <ul className="list-disc list-inside">
              {bill.details.map((detail, index) => (
                <li key={index}>
                  {detail.course.title} -{" "}
                  <span className="text-beautyGreen">
                    {formatPrice(Number(detail.final_price))}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="text-sm italic mt-2">
          Ngày thanh toán: {new Date(bill.createdAt).toLocaleString("vi-VN")}
        </p>
        <p className="text-lg font-semibold text-beautyGreen mt-2">
          Tổng: {formatPrice(Number(bill.total_amount))}
        </p>
      </div>

      {/* Nút tải PDF */}
      <Button
        variant="outline"
        className="w-full text-majorelleBlue border-majorelleBlue hover:bg-majorelleBlue20"
        onClick={handleDownloadPDF}
      >
        Tải hóa đơn (PDF)
      </Button>
    </div>
  );
};

export default BillDetails;
