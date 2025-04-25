// components/ProductSummary.tsx
type Props = {
  products: { id: string; title: string; price: number }[];
};

export default function ProductSummary({ products }: Props) {
  const formattedPrice = (price: number) => {
    return !isNaN(price)
      ? new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(price)
      : "N/A";
  };
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Khoá học</h2>
      <ul className="space-y-1">
        {products.map((p) => (
          <li
            key={p.id}
            className="flex justify-between border-b border-gray-200 dark:border-gray-700 py-1"
          >
            <span>{p.title}</span>
            <span>{formattedPrice(p.price)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
