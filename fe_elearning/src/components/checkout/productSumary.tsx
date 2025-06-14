// components/ProductSummary.tsx
import { formatPrice } from '../formatPrice';
type Props = {
  products: { id: string; title: string; price: number }[];
};

export default function ProductSummary({ products }: Props) {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Khoá học</h2>
      <ul className="space-y-1">
        {products &&
          products.length > 0 &&
          products.map((p) => (
            <li
              key={p.id}
              className="flex justify-between border-b border-gray-200 dark:border-gray-700 py-1"
            >
              <span>{p.title}</span>
              <span>{formatPrice(p.price)}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}
