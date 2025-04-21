// components/DiscountInput.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  discount: string;
  setDiscount: (value: string) => void;
};

export default function DiscountInput({ discount, setDiscount }: Props) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="discount">Mã giảm giá</Label>
      <Input
        id="discount"
        value={discount}
        onChange={(e) => setDiscount(e.target.value)}
        placeholder="Nhập mã giảm giá nếu có..."
        className="bg-white dark:bg-zinc-800"
      />
    </div>
  );
}
