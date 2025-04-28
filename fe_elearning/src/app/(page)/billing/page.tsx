"use client";

import React, { useEffect, useState } from "react";
import BillsTable from "@/components/bill/billTable";
import BillsPagination from "@/components/bill/billPaginations";
import AnimateWrapper from "@/components/animations/animateWrapper";
import { Bill, OrderResponse } from "@/types/billType";
import { APIGetListOrderByMe } from "@/utils/order";
import { useDispatch, useSelector } from "react-redux";
import { setOrders } from "@/constants/orderSlice";
import { RootState } from "@/constants/store";
const BillsPage = () => {
  const orders = useSelector((state: RootState) => state.order.orders);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [bills, setBills] = useState<OrderResponse[]>([]);

  const itemsPerPage = 2;

  const filteredBills = bills.filter(
    (bill) =>
      bill.details.some((detail) =>
        detail.course.title.toLowerCase().includes(searchTerm.toLowerCase())
      ) || bill.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(bills.length / itemsPerPage);
  const paginatedBills = bills.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleGetBills = async () => {
    try {
      setIsLoading(true);
      const response = await APIGetListOrderByMe();
      if (response?.status === 200) {
        setBills(response.data);
        dispatch(setOrders(response.data));
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetBills();
  }, []);

  return (
    <div className="container mx-auto py-8 bg-AntiFlashWhite dark:bg-eerieBlack min-h-screen text-richBlack dark:text-AntiFlashWhite">
      <div className="flex flex-col gap-6">
        <AnimateWrapper delay={0.2} direction="up">
          <div>
            <h1 className="text-2xl font-bold text-cosmicCobalt dark:text-AntiFlashWhite">
              Lịch sử thanh toán
            </h1>
            <p className="text-darkSilver dark:text-lightSilver">
              Danh sách các hóa đơn đã thanh toán cho khóa học của bạn
            </p>
          </div>
        </AnimateWrapper>
        <AnimateWrapper delay={0.2} direction="up">
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
        </AnimateWrapper>
      </div>
    </div>
  );
};

export default BillsPage;
