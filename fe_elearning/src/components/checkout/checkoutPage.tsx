// ✅ CheckoutPage.tsx
"use client";

import { useState } from "react";
import ProductSummary from "./productSumary";
import StudentInfo from "./studentInfo";
import DiscountInput from "./discountInput";
import PaymentForm from "./paymentForm";
import { Card } from "@/components/ui/card";
import { UserType } from "@/types/userType";
type Props = {
  mode: "single" | "cart";
  products: { id: string; title: string; price: number }[];
  student: UserType;
};

export default function CheckoutPage({ mode, products, student }: Props) {
  const [discount, setDiscount] = useState("");

  const total = products.reduce((sum, p) => sum + p.price, 0);
  const discountedTotal = discount === "GIAM10" ? total * 0.9 : total;

  return (
    <div className="min-h-screen bg-AntiFlashWhite dark:bg-zinc-900 text-eerieBlack dark:text-white p-4 flex items-center justify-center">
      <Card className="w-full max-w-3xl rounded-2xl shadow-xl dark:shadow-md bg-white dark:bg-zinc-800 p-6 space-y-6">
        <h1 className="text-2xl font-bold">
          {mode === "single" ? "Thanh toán khóa học" : "Thanh toán giỏ hàng"}
        </h1>

        <ProductSummary products={products} />
        <StudentInfo student={student} />
        <DiscountInput discount={discount} setDiscount={setDiscount} />

        <div className="flex justify-between items-center font-semibold text-lg">
          <span>Tổng cộng:</span>
          <span className="text-Sunglow">
            {discountedTotal.toLocaleString()}đ
          </span>
        </div>

        <PaymentForm />
      </Card>
    </div>
  );
}
