import CheckoutPage from "@/components/checkout/checkoutPage";
import { RootState } from "@/constants/store";
import { useSelector } from "react-redux";

export default function CheckoutCartPage() {
  const products = useSelector((state: RootState) => state.cart.products);
  const student = useSelector((state: RootState) => state.user.userInfo);

  //   return <CheckoutPage mode="cart" products={products} student={student} />;
}
