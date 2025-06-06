'use client';
import Certificate from '@/components/certificate/certificate';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { APIGetCertificateById } from '@/utils/certificate';
import { CertificateType } from '@/types/certificateType';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/constants/store';
import { formatDuration } from '@/helpers/durationFormater';

export default function CertificatePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const [certificate, setCertificate] = useState<CertificateType | null>(null);

  const handleGetCertificateById = async () => {
    const response = await APIGetCertificateById(id);
    if (response?.status === 200) {
      setCertificate(response?.data || null);
    }
  };

  useEffect(() => {
    handleGetCertificateById();
  }, [id]);

  if (!certificate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy chứng chỉ</h1>
          <Link href="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại danh sách
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/profile/student">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại danh sách
            </Button>
          </Link>
        </div>

        <Certificate
          studentName={userInfo?.first_name + ' ' + userInfo?.last_name}
          courseName={certificate.course.title}
          completionDate={new Date(certificate.completed_at).toLocaleDateString('vi-VN')}
          instructor={
            certificate.course.instructor?.user?.first_name +
            ' ' +
            certificate.course.instructor?.user?.last_name
          }
          duration={formatDuration(
            certificate.course.sections?.reduce(
              (acc, section) =>
                acc + section.items.reduce((acc, item) => acc + (item.duration_in_seconds || 0), 0),
              0
            ) || 0
          )}
          certificateId={certificate.certificate_code}
        />
      </div>
    </div>
  );
}
