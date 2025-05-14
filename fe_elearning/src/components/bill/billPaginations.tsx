import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BillsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const BillsPagination: React.FC<BillsPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="flex items-center justify-center gap-4 mt-4">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="text-majorelleBlue border-majorelleBlue20 hover:bg-majorelleBlue20"
      >
        <ChevronLeft size={16} />
      </Button>
      <span className="text-darkSilver dark:text-lightSilver">
        Trang {currentPage} / {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="text-majorelleBlue border-majorelleBlue20 hover:bg-majorelleBlue20"
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  );
};

export default BillsPagination;
