import Certificate from '@/components/certificate/certificate';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Mock data - trong thực tế sẽ fetch từ database
const certificateData = {
  '1': {
    studentName: 'Nguyễn Văn An',
    courseName: 'Lập Trình React Nâng Cao',
    completionDate: '15/12/2024',
    instructor: 'Thầy Minh Tuấn',
    duration: '40 giờ',
    certificateId: 'CERT-2024-001',
  },
  '2': {
    studentName: 'Trần Thị Bình',
    courseName: 'Thiết Kế UI/UX Chuyên Nghiệp',
    completionDate: '20/12/2024',
    instructor: 'Cô Hương Giang',
    duration: '60 giờ',
    certificateId: 'CERT-2024-002',
  },
  '3': {
    studentName: 'Lê Minh Cường',
    courseName: 'Data Science với Python',
    completionDate: '10/12/2024',
    instructor: 'Thầy Đức Anh',
    duration: '80 giờ',
    certificateId: 'CERT-2024-003',
  },
};

interface PageProps {
  params: {
    id: string;
  };
}

export default function CertificatePage({ params }: PageProps) {
  const certificate = certificateData[params.id as keyof typeof certificateData];

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
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại danh sách
            </Button>
          </Link>
        </div>

        <Certificate
          studentName={certificate.studentName}
          courseName={certificate.courseName}
          completionDate={certificate.completionDate}
          instructor={certificate.instructor}
          duration={certificate.duration}
          certificateId={certificate.certificateId}
        />
      </div>
    </div>
  );
}
