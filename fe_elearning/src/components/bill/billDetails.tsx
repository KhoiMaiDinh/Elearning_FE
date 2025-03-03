import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Bill } from "@/types/billType";

interface BillDetailsProps {
  bill: Bill;
}

const BillDetails: React.FC<BillDetailsProps> = ({ bill }) => {
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
              {bill.details.paymentMethod}
            </p>
            <p>
              <span className="font-medium text-richBlack dark:text-AntiFlashWhite">
                Mã giao dịch:
              </span>{" "}
              {bill.details.transactionId}
            </p>
            <p>
              <span className="font-medium text-richBlack dark:text-AntiFlashWhite">
                Email:
              </span>{" "}
              {bill.details.email}
            </p>
          </div>
          <div>
            <p className="font-medium text-richBlack dark:text-AntiFlashWhite">
              Khóa học đã mua:
            </p>
            <ul className="list-disc list-inside">
              {bill.details.courses.map((course, index) => (
                <li key={index}>
                  {course.name} -{" "}
                  <span className="text-beautyGreen">
                    {formatPrice(course.price)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="text-sm italic mt-2">
          Ngày thanh toán: {new Date(bill.date).toLocaleString("vi-VN")}
        </p>
        <p className="text-lg font-semibold text-beautyGreen mt-2">
          Tổng: {formatPrice(bill.amount)}
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
