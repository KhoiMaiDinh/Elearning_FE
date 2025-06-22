'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface CertificateProps {
  studentName: string;
  courseName: string;
  completionDate: string;
  instructor: string;
  duration: string;
  certificateId: string;
}

export default function Certificate({
  studentName: initialStudentName,
  courseName: initialCourseName,
  completionDate,
  instructor,
  duration,
  certificateId,
}: CertificateProps) {
  const [studentName] = useState(initialStudentName);
  const [courseName] = useState(initialCourseName);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownloadPDF = async () => {
    const certificate = document.getElementById('certificate');
    if (!certificate) return;

    setIsDownloading(true);
    try {
      // Đảm bảo ảnh/logo được tải xong
      await new Promise((res) => setTimeout(res, 300));

      const canvas = await html2canvas(certificate, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1123, 794],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, 1123, 794);
      pdf.save(`chung-chi-${certificateId}.pdf`);

      toast({
        title: 'Tải thành công',
        description: 'Chứng chỉ đã được tải xuống thành công.',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'Lỗi tải xuống',
        description: 'Có lỗi xảy ra khi tạo PDF. Vui lòng thử lại.',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className=" mx-auto p-4">
      <div className="flex justify-end mb-4">
        <Button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="bg-majorelleBlue hover:brightness-110 hover:bg-majorelleBlue shadow-sm shadow-majorelleBlue text-white"
        >
          {isDownloading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang tạo PDF...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Tải PDF
            </>
          )}
        </Button>
      </div>

      <div
        id="certificate"
        className="mx-auto bg-white border border-blue-300  rounded-md overflow-hidden"
        style={{
          width: '1123px',
          height: '794px',
          padding: '48px',
          boxSizing: 'border-box',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Logo + Header */}
        <div className="text-center mb-4">
          <img src="/images/logo.png" alt="Logo" className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-blue-700 mb-2">CHỨNG NHẬN HOÀN THÀNH</h1>
        </div>
        <hr className="w-40 h-1 bg-blue-500 mt-2 mx-auto rounded mb-8" />

        {/* Content */}
        <div className="text-center space-y-6">
          <p className="text-lg text-gray-700">Chứng nhận rằng</p>
          <h2 className="text-5xl font-bold text-blue-900 pb-2">{studentName}</h2>
          <p className="text-lg text-gray-700">đã hoàn thành khóa học</p>
          <h3 className="text-3xl font-semibold text-blue-600">{courseName}</h3>

          <div className="flex justify-center items-center space-x-16 text-gray-600 mt-8">
            <div className="text-center">
              <p className="font-semibold">Ngày hoàn thành</p>
              <p className="text-lg">{completionDate}</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">Thời lượng</p>
              <p className="text-lg">{duration}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-end mt-12 pt-8 border-t border-gray-200">
          <div className="text-center">
            <div className="w-32 h-px bg-gray-400 mb-2"></div>
            <p className="text-sm text-gray-600">Giảng viên</p>
            <p className="font-semibold text-gray-800">{instructor}</p>
          </div>

          <div className="text-center">
            <div className="w-32 h-px bg-gray-400 mb-2"></div>
            <p className="text-sm text-gray-600">Mã chứng chỉ</p>
            <p className="font-semibold text-gray-800">{certificateId}</p>
          </div>

          <div className="text-center">
            <div className="w-32 h-px bg-gray-400 mb-2"></div>
            <p className="text-sm text-gray-600">Ngày cấp</p>
            <p className="font-semibold text-gray-800">{completionDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
