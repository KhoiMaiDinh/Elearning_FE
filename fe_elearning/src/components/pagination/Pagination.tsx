import Image from 'next/image';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';

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

  const handleChangePage = (page: number) => {
    if (page < 1 || page > maxPage) return;
    router.push(`${pathName}?page=${page}&&limit=${itemPerPage}`);
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

    // Always include the last page
    if (maxPage > 1) {
      pages.push(maxPage);
    }

    return pages;
  };

  const displayedPages = getDisplayedPages();

  return (
    <div className="flex-center flex flex-row items-center gap-2">
      <div
        className={`${currentPage === 1 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={() => handleChangePage(currentPage - 1)}
      >
        <Image src={'/icons/ic_arrow_left.png'} width={12} height={12} alt="arrow-left"></Image>
      </div>
      {displayedPages.map((page, index) =>
        typeof page === 'number' ? (
          <div
            onClick={() => handleChangePage(page)}
            key={index}
            className={`${
              currentPage === page
                ? 'bg-majorelleBlue20'
                : 'border dark:border-lightSilver bg-white border-darkSilver'
            } flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-md p-1`}
          >
            <p
              className={`font-normal ${
                currentPage === page ? 'text-white' : 'text-LavenderIndigo'
              }`}
            >
              {page}
            </p>
          </div>
        ) : (
          <div key={index} className="h-[30px] w-[30px]">
            <p className="text-LavenderIndigo">...</p>
          </div>
        )
      )}
      <div
        className={`${currentPage === maxPage ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={() => handleChangePage(currentPage + 1)}
      >
        <Image src={'/icons/ic_arrow_right.png'} width={12} height={12} alt="arrow-right"></Image>
      </div>
    </div>
  );
};

export default Pagination;
