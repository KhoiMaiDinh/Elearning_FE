'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import type React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '../ui/button';

interface PaginationProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalItem: number;
  itemPerPage: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  setCurrentPage,
  totalItem,
  itemPerPage,
}) => {
  const maxPage = Math.ceil(totalItem / itemPerPage);
  const router = useRouter();
  const pathName = usePathname();

  // If there's only one page or no items, don't render pagination
  if (maxPage <= 1 || totalItem === 0) {
    return null;
  }

  const handleChangePage = (page: number) => {
    if (page < 1 || page > maxPage) return;
    router.push(`${pathName}?page=${page}&limit=${itemPerPage}`);
    setCurrentPage(page);
  };

  const getDisplayedPages = () => {
    const pages: (number | string)[] = [];
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(maxPage - 1, currentPage + 1);

    // Always include the first page
    pages.push(1);

    // Add "..." if needed before the startPage
    if (startPage > 2) {
      pages.push('...');
    }

    // Add the range of pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add "..." if needed after the endPage
    if (endPage < maxPage - 1) {
      pages.push('...');
    }

    // Always include the last page if it's different from the first page
    if (maxPage > 1) {
      pages.push(maxPage);
    }

    return pages;
  };

  const displayedPages = getDisplayedPages();

  return (
    <nav className="flex items-center space-x-1" aria-label="Pagination">
      <Button
        variant="outline"
        size="icon"
        className={`h-8 w-8 rounded-md ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => handleChangePage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous page</span>
      </Button>

      {displayedPages &&
        displayedPages.length > 0 &&
        displayedPages.map((page, index) =>
          typeof page === 'number' ? (
            <Button
              key={index}
              variant={currentPage === page ? 'default' : 'outline'}
              size="icon"
              className={`h-8 w-8 rounded-md ${
                currentPage === page
                  ? 'bg-majorelleBlue text-white'
                  : 'bg-majorelleBlue70 hover:bg-majorelleBlue'
              }`}
              onClick={() => handleChangePage(page)}
              disabled={currentPage === page}
            >
              {page}
            </Button>
          ) : (
            <span
              key={index}
              className="text-gray-500 flex h-8 w-8 items-center justify-center text-sm"
            >
              &#8230;
            </span>
          )
        )}

      <Button
        variant="outline"
        size="icon"
        className={`h-8 w-8 rounded-md ${currentPage === maxPage ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => handleChangePage(currentPage + 1)}
        disabled={currentPage === maxPage}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next page</span>
      </Button>
    </nav>
  );
};

export default Pagination;
