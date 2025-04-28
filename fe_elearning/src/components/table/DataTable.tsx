import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "../ui/input";
import Pagination from "../pagination/Pagination";

import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import SkeletonTable from "../skeleton/SkeletonTable";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterSearch?: {
    accessorKey: string;
    header: string;
  };
  titleTable?: string;
  visible?: boolean;
  totalItems?: number;
  setCurrentPage?: (page: number) => void;
  currentPage?: number;
  loading?: boolean;
  itemsPerPage?: number;
  setItemsPerPage?: (page: number) => void;
  onClickAddNew?: () => void;
  children?: React.JSX.Element; // Nội dung của Popover
  openValue?: boolean | undefined;
  onClickOpenFilter?: () => void;
  filter?: boolean;
  // onClickRefresh: () => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterSearch,
  titleTable,
  totalItems,
  loading,
  itemsPerPage,
  currentPage,
  setCurrentPage,
  setItemsPerPage,
  onClickAddNew,
  children,
  openValue,
  onClickOpenFilter,
  filter = true,
}: // onClickRefresh,
DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [rowSelection, setRowSelection] = React.useState<any>({});
  const [showAlert, setShowAlert] = useState(false); // Trạng thái hiển thị thông báo

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage && setItemsPerPage(Number(value));
  };
  const totalRows = data ? data.length : 0;

  return (
    <div className="flex w-full flex-col gap-4 rounded-md border border-lightSilver p-4">
      <div className="flex w-full flex-col items-center justify-between pt-4 md:flex-row">
        <p className="text-md text-LavenderIndigo font-[700] lg:text-[1rem]">
          {titleTable}
        </p>

        <div className="flex flex-row gap-4">
          {onClickAddNew && (
            <Button
              style={{ backgroundColor: "#7152F3", color: "white" }}
              onClick={onClickAddNew}
            >
              <div className="flex items-center gap-2">
                <Image
                  src={"/icons/ic_add_white.png"}
                  alt="add"
                  width={12}
                  height={12}
                />
                <span>Thêm mới</span>
              </div>
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <SkeletonTable />
      ) : (
        <div className="rounded-md border border-lightSilver">
          <Table className="overflow-auto shadow-2xl">
            <TableHeader className="relative bg-majorelleBlue20">
              {table?.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header, index) => {
                    const isLastColumn =
                      index === headerGroup.headers.length - 1;
                    return (
                      <TableHead
                        key={header.id}
                        className={`text-center font-sans font-semibold text-White ${
                          isLastColumn
                            ? "sticky right-0 top-0 z-20 bg-majorelleBlue20"
                            : "z-10 bg-majorelleBlue20"
                        }`}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table && table.getRowModel().rows?.length > 0 ? (
                table.getRowModel().rows.map((row, index) => {
                  const isLastColumn =
                    index === table.getRowModel().rows.length - 1;
                  return (
                    <TableRow
                      className={`text-center`}
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell, index) => {
                        const isLastColumn =
                          index === row.getVisibleCells().length - 1;
                        return (
                          <TableCell
                            key={cell.id}
                            className={`${
                              isLastColumn
                                ? "sticky right-0 top-0 z-20 bg-White"
                                : "z-10"
                            }`}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {currentPage && (
        <div className="flex w-full">
          <div className="flex w-full flex-row justify-between gap-5">
            {" "}
            <div className="flex lg:w-1/4">
              <Select
                defaultValue="10"
                onValueChange={handleItemsPerPageChange}
              >
                <SelectTrigger className="h-[30px] w-[70px] border border-lightSilver">
                  {itemsPerPage}
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between lg:w-1/4">
              <div className="item-starts flex">
                <p className="text-sm text-LavenderIndigo">
                  Tổng: {totalItems}
                </p>
              </div>
            </div>
            <div className="flex justify-end lg:w-1/4">
              <Pagination
                currentPage={Number(currentPage)}
                setCurrentPage={setCurrentPage ?? (() => {})}
                totalItem={totalItems || 0}
                itemPerPage={Number(itemsPerPage)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
