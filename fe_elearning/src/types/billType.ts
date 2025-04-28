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

export interface OrderResponse {
  id: string;
  transaction_id: string | null;
  total_amount: string;
  currency: string;
  provider: string;
  payment_status: string;
  details: DetailsOrder[];
  createdAt: string;
  updatedAt: string;
}

export interface DetailsOrder {
  price: string;
  discount: string;
  final_price: string;
  course: OrderCourseDetail;
}

export interface OrderCourseDetail {
  id: string;
  title: string;
  slug: string | null;
  subtitle: string;
  description: string;
  language: string;
  level: string;
  requirements: [];
  outcomes: [];
  price: number;
  status: string;
}
