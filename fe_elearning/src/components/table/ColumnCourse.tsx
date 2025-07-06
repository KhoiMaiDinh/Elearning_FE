'use client';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { useDispatch } from 'react-redux';
import { useSearchParams, useRouter } from 'next/navigation';
import { Translation } from '@/types/courseType';
import { clearCourse, setCourse } from '@/constants/courseSlice';
import { APIGetFullCourse } from '@/utils/course';
import { EyeIcon, FileDown } from 'lucide-react';
import { formatPrice } from '@/components/formatPrice';
import ExportReportPopUp from '../exportReport/exportReportPopUp';
import { useState } from 'react';

const ColumnCourse: ColumnDef<{
  course_id?: string;
  id?: string;
  category?: {
    slug?: string;
    children?: { slug: string; translations: Translation[] }[];
    parent?: { slug: string; translations: Translation[] };
    translations: Translation[];
  };
  title: string;
  subtitle: string;
  slug?: string;
  outcomes?: string[];
  is_disabled?: boolean;
  status?: string;
  instructor_id?: string;
  level: string;
  is_approved?: boolean;
  price: number;
  priceFinal?: number;
  avg_rating?: number;
  total_enrolled?: number;
}>[] = [
  {
    accessorKey: 'index',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        STT
        <CaretSortIcon className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row, table }) => {
      // eslint-disable-next-line
      const param = useSearchParams();
      const currentPage = param.get('page') ? Number(param.get('page')) - 1 : 0;
      const pageSize = table.getState().pagination.pageSize;
      const index = currentPage * pageSize + row.index + 1;
      return <div className="w-16 text-center font-bold">{index}</div>; // Hiển thị số thứ tự
    },
    enableSorting: true,
    sortingFn: (rowA, rowB) => rowA.index - rowB.index,
  },
  {
    accessorKey: 'title',
    header: () => {
      return <p className="w-[200px] text-left">Tên khóa học</p>;
    },
    cell: ({ row }) => {
      return <div className="w-[200px] text-left font-bold">{row.original.title}</div>; // Hiển thị số thứ tự
    },
  },

  {
    accessorKey: 'level',
    header: () => {
      return <p className="w-[200px] text-left">Mức độ</p>;
    },
    cell: ({ row }) => {
      return (
        <div className="w-[200px] text-left ">
          {row.original.level === 'BEGINNER'
            ? 'Cơ bản'
            : row.original.level === 'INTERMEDIATE'
              ? 'Trung bình'
              : 'Nâng cao'}
        </div>
      ); // Hiển thị số thứ tự
    },
  },
  {
    accessorKey: 'price',
    header: () => {
      return <p className="w-[200px] text-left">Giá</p>;
    },
    cell: ({ row }) => {
      return <div className="w-[200px] text-left ">{formatPrice(row.original.price)}</div>; // Hiển thị số thứ tự
    },
  },
  {
    accessorKey: 'status',
    header: () => {
      return <p className="w-[200px] text-left">Trạng thái</p>;
    },
    cell: ({ row }) => {
      return (
        <div
          className={` text-left w-fit px-2 py-1 rounded-md ${
            row.original.status === 'PUBLISHED'
              ? 'bg-vividMalachite/10 text-vividMalachite'
              : row.original.status === 'DRAFT'
                ? 'bg-blueberry/10 text-blueberry'
                : 'bg-redPigment/10 text-redPigment'
          }`}
        >
          {row.original.status === 'PUBLISHED'
            ? 'Hoạt động'
            : row.original.status === 'DRAFT'
              ? 'Không hoạt động'
              : 'BAN'}
        </div>
      ); // Hiển thị số thứ tự
    },
  },

  {
    id: 'actions',
    cell: ({ row }) => {
      // eslint-disable-next-line
      const dispatch = useDispatch();
      const handleViewMode = async (id: string) => {
        dispatch(clearCourse({}));

        try {
          const response = await APIGetFullCourse(id);
          if (response?.status === 200) {
            dispatch(setCourse(response?.data));
          }
        } catch (error) {
          console.error('Error getting course details:', error);
        }
      };
      const [isOpen, setIsOpen] = useState(false);
      return (
        <div className="flex items-center gap-2">
          <button
            className=" text-eerieBlack dark:text-white flex h-7 w-7 items-center justify-center rounded-md shadow-lg hover:brightness-125"
            onClick={() => row.original.id && handleViewMode(row.original.id)}
          >
            <EyeIcon className="h-4 w-4" />
          </button>
          <button
            className=" text-eerieBlack dark:text-white flex h-7 w-7 items-center justify-center rounded-md shadow-lg hover:brightness-125"
            onClick={() => setIsOpen(true)}
          >
            <FileDown className="h-4 w-4" />
          </button>
          <ExportReportPopUp
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            courseId={row.original.id}
          />
        </div>
      );
    },
  },
];

export default ColumnCourse;
