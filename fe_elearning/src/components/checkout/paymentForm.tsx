// components/PaymentForm.tsx
import { Button } from "@/components/ui/button";

export default function PaymentForm() {
  const handleSubmit = () => {
    alert("Thanh toán đang được xử lý...");
  };

  return (
    <div className="pt-4">
      <Button
        className="w-full bg-majorelleBlue text-white hover:bg-majorelleBlue/90"
        onClick={handleSubmit}
      >
        Thanh toán ngay
      </Button>
    </div>
  );
}
