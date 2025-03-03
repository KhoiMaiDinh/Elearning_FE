"use client";

import React, { useState } from "react";
import BillsTable from "@/components/bill/billTable";
import BillsPagination from "@/components/bill/billPaginations";

const billData = [
  {
    id: "BILL001",
    courseTitle: "Lập Trình Web Toàn Diện Với JavaScript",
    amount: 699000,
    date: "2025-02-15",
    status: "completed",
    invoiceUrl: "/invoices/bill001.pdf",
    details: {
      paymentMethod: "Thẻ tín dụng",
      transactionId: "TXN123456",
      email: "user@example.com",
      courses: [
        { name: "Lập Trình Web Toàn Diện Với JavaScript", price: 699000 },
      ],
    },
  },
  {
    id: "BILL002",
    courseTitle: "Phân tích dữ liệu với Python",
    amount: 700000,
    date: "2025-02-10",
    status: "completed",
    details: {
      paymentMethod: "Chuyển khoản ngân hàng",
      transactionId: "TXN123457",
      email: "user2@example.com",
      courses: [{ name: "Phân tích dữ liệu với Python", price: 700000 }],
    },
  },
  // Thêm dữ liệu mẫu khác...
];

const BillsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredBills = billData.filter(
    (bill) =>
      bill.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBills.length / itemsPerPage);
  const paginatedBills = filteredBills.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mx-auto py-8 bg-AntiFlashWhite dark:bg-eerieBlack min-h-screen text-richBlack dark:text-AntiFlashWhite">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-cosmicCobalt dark:text-AntiFlashWhite">
            Lịch sử thanh toán
          </h1>
          <p className="text-darkSilver dark:text-lightSilver">
            Danh sách các hóa đơn đã thanh toán cho khóa học của bạn
          </p>
        </div>

        <BillsTable
          bills={paginatedBills}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <BillsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default BillsPage;
