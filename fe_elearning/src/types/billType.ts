export interface Bill {
  id: string;
  courseTitle: string;
  amount: number;
  date: string;
  status: string;
  invoiceUrl?: string;
  details: {
    paymentMethod: string;
    transactionId: string;
    email: string;
    courses: { name: string; price: number }[];
  };
}
