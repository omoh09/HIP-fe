import { InvoiceItem } from "./types";

type Props = {
  items: InvoiceItem[];
  onChange: (index: number, field: string, value: any) => void;
  addItem: () => void;
};

export default function InvoiceItems({ items, onChange, addItem }: Props) {
  return (
    <div>
      {items.map((item, i) => (
        <div
          key={i}
          className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-3"
        >
          <input
            value={item.item}
            onChange={(e) => onChange(i, "item", e.target.value)}
            placeholder="Item"
            className="border p-2 rounded"
          />
          <input
            value={item.description}
            onChange={(e) => onChange(i, "description", e.target.value)}
            placeholder="Description"
            className="border p-2 rounded"
          />
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => onChange(i, "quantity", +e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="number"
            value={item.rate}
            onChange={(e) => onChange(i, "rate", +e.target.value)}
            className="border p-2 rounded"
          />
          <input
            readOnly
            value={(item.quantity * item.rate).toFixed(2)}
            className="border p-2 rounded bg-gray-100"
          />
        </div>
      ))}

      <button
        onClick={addItem}
        className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
      >
        Add Item
      </button>
    </div>
  );
}
