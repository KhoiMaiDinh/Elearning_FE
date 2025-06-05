import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Download, Calendar, Clock, User, BookOpen } from "lucide-react"
import Link from "next/link"

const certificates = [
  {
    id: "1",
    studentName: "Nguyễn Văn An",
    courseName: "Lập Trình React Nâng Cao",
    completionDate: "15/12/2024",
    instructor: "Thầy Minh Tuấn",
    duration: "40 giờ",
    status: "Hoàn thành",
    category: "Lập trình",
  },
  {
    id: "2",
    studentName: "Trần Thị Bình",
    courseName: "Thiết Kế UI/UX Chuyên Nghiệp",
    completionDate: "20/12/2024",
    instructor: "Cô Hương Giang",
    duration: "60 giờ",
    status: "Hoàn thành",
    category: "Thiết kế",
  },
  {
    id: "3",
    studentName: "Lê Minh Cường",
    courseName: "Data Science với Python",
    completionDate: "10/12/2024",
    instructor: "Thầy Đức Anh",
    duration: "80 giờ",
    status: "Hoàn thành",
    category: "Data Science",
  },
  {
    id: "4",
    studentName: "Phạm Thu Hà",
    courseName: "Digital Marketing Toàn Diện",
    completionDate: "25/12/2024",
    instructor: "Cô Mai Linh",
    duration: "50 giờ",
    status: "Hoàn thành",
    category: "Marketing",
  },
]

export default function CertificateList() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Tổng chứng chỉ</p>
                <p className="text-2xl font-bold">{certificates.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Đã hoàn thành</p>
                <p className="text-2xl font-bold">{certificates.filter((c) => c.status === "Hoàn thành").length}</p>
              </div>
              <User className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Danh mục</p>
                <p className="text-2xl font-bold">{new Set(certificates.map((c) => c.category)).size}</p>
              </div>
              <BookOpen className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100">Tháng này</p>
                <p className="text-2xl font-bold">4</p>
              </div>
              <Calendar className="h-8 w-8 text-amber-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((certificate) => (
          <Card key={certificate.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="secondary" className="text-xs">
                  {certificate.category}
                </Badge>
                <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                  {certificate.status}
                </Badge>
              </div>
              <CardTitle className="text-lg line-clamp-2">{certificate.courseName}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{certificate.studentName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Hoàn thành: {certificate.completionDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Thời lượng: {certificate.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>GV: {certificate.instructor}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Link href={`/certificate/${certificate.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="mr-2 h-4 w-4" />
                    Xem
                  </Button>
                </Link>
                <Link href={`/certificate/${certificate.id}`} className="flex-1">
                  <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                    <Download className="mr-2 h-4 w-4" />
                    Tải PDF
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
