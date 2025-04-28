"use client";

import { useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  totalItems: number;
  itemsPerPage?: number;
  handlePageChange?: (page: number) => void;
}

const PaginationComponent: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage = 10,
  handlePageChange,
}) => {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Nếu chỉ có 1 trang thì không cần hiển thị pagination
  if (totalPages <= 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        {/* Nút Previous */}
        <PaginationItem>
          <PaginationPrevious
            onClick={() =>
              handlePageChange &&
              currentPage > 1 &&
              handlePageChange(currentPage - 1)
            }
            className={
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>

        {/* Hiển thị danh sách trang */}
        {Array.from({ length: totalPages }, (_, index) => {
          const page = index + 1;
          return (
            <PaginationItem
              key={page}
              className="hover:cursor-pointer hover:shadow-sm hover:shadow-darkSilver dark:hover:shadow-lightSilver"
            >
              <PaginationLink
                onClick={() => handlePageChange && handlePageChange(page)}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* Nút Next */}
        <PaginationItem>
          <PaginationNext
            onClick={() =>
              handlePageChange &&
              currentPage < totalPages &&
              handlePageChange(currentPage + 1)
            }
            className={
              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationComponent;
