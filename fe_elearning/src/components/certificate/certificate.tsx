'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Edit, Save, X } from 'lucide-react';
import Image from 'next/image';

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
  const [isEditing, setIsEditing] = useState(false);
  const [studentName, setStudentName] = useState(initialStudentName);
  const [courseName, setCourseName] = useState(initialCourseName);

  const handleDownloadPDF = async () => {
    const html2canvas = (await import('html2canvas')).default;
    const jsPDF = (await import('jspdf')).default;
    const certificate = document.getElementById('certificate');
    if (!certificate) return;

    try {
      const canvas = await html2canvas(certificate, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const imgWidth = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`chung-chi-${certificateId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Có lỗi xảy ra khi tạo PDF. Vui lòng thử lại.');
    }
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setStudentName(initialStudentName);
    setCourseName(initialCourseName);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Control Panel */}
      <Card className="mb-6 border-blue-100 shadow-md">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <Button
              onClick={handleDownloadPDF}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="mr-2 h-4 w-4" />
              Tải PDF
            </Button>
          </div>

          {isEditing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t">
              <div>
                <Label htmlFor="studentName">Tên học viên</Label>
                <Input
                  id="studentName"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="courseName">Tên khóa học</Label>
                <Input
                  id="courseName"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Certificate */}
      <div className="bg-white p-8 rounded-xl shadow-2xl border border-blue-200">
        <div
          id="certificate"
          className="relative bg-white p-12 border-8 border-double border-blue-500"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23e0f2fe' fillOpacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        >
          {/* Decorative Corners */}
          <div className="absolute top-4 left-4 w-16 h-16 border-l-4 border-t-4 border-blue-500"></div>
          <div className="absolute top-4 right-4 w-16 h-16 border-r-4 border-t-4 border-blue-500"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 border-l-4 border-b-4 border-blue-500"></div>
          <div className="absolute bottom-4 right-4 w-16 h-16 border-r-4 border-b-4 border-blue-500"></div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
              <div className="text-white text-2xl font-bold">
                <Image src="/images/logo.png" alt="logo" width={100} height={100} />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-blue-700 mb-2 tracking-wide">
              CHỨNG NHẬN HOÀN THÀNH
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto rounded"></div>
          </div>

          {/* Content */}
          <div className="text-center space-y-6">
            <p className="text-lg text-gray-700">Chứng nhận rằng</p>
            <h2 className="text-5xl font-bold text-blue-900 border-b-2 border-blue-500 pb-2 inline-block">
              {studentName}
            </h2>
            <p className="text-lg text-gray-700">đã hoàn thành xuất sắc khóa học</p>
            <h3 className="text-3xl font-semibold text-blue-600 px-8">{courseName}</h3>

            <div className="flex justify-center items-center space-x-8 text-gray-600 mt-8">
              <div className="text-center">
                <p className="font-semibold">Ngày hoàn thành</p>
                <p className="text-lg">{completionDate}</p>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-center">
                <p className="font-semibold">Thời lượng</p>
                <p className="text-lg">{duration}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-end mt-12 h-full pt-8 border-t border-gray-200">
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
    </div>
  );
}
