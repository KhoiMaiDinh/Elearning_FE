'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { APIGetListStudentByCourse } from '@/utils/course';
import { StudentType } from '@/types/userType';
import Pagination from '../pagination/paginations';

interface StudentListProps {
  courseId: string;
}

export default function StudentList({ courseId }: StudentListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<StudentType[]>([]);
  const [filterParams, setFilterParams] = useState({
    page: 1,
    limit: 10,
  });
  const [total, setTotal] = useState(0);
  const filteredStudents = students.filter(
    (student) =>
      student.user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.user.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGetListStudent = async () => {
    const response = await APIGetListStudentByCourse(courseId, filterParams);
    if (response?.status === 200) {
      setStudents(response?.data || []);
      setTotal(response?.total || 0);
    }
  };

  useEffect(() => {
    handleGetListStudent();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Search className="w-5 h-5 text-gray-500" />
        <Input
          placeholder="Tìm kiếm học viên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Học viên</TableHead>
              <TableHead>Tiến độ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.user.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage
                        src={
                          process.env.NEXT_PUBLIC_BASE_URL_IMAGE + student.user.profile_image.key
                        }
                      />
                      <AvatarFallback>
                        {student.user.first_name[0]}
                        {student.user.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {student.user.first_name} {student.user.last_name}
                      </div>
                      <div className="text-sm text-gray-500">{student.user.email}</div>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="w-full max-w-md">
                    <div className="flex justify-between mb-1 text-sm">
                      <span>{student.progress.progress}%</span>
                    </div>
                    <Progress value={student.progress.progress} className="h-2" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination
          currentPage={filterParams.page}
          totalItem={Number(total)}
          itemPerPage={Number(filterParams.limit)}
          setCurrentPage={(page) => setFilterParams({ ...filterParams, page })}
        />
      </div>
    </div>
  );
}
