import { InvoiceData } from "./types";

export default function InvoiceHeader({ data }: { data: InvoiceData }) {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h2 className="text-xl font-bold">Netlight Systems Ventures</h2>
        <p className="text-sm text-gray-500">GTBank / UBA</p>
      </div>

      <span
        className={`px-3 py-1 rounded text-sm font-semibold ${
          data.status === "pending"
            ? "bg-red-100 text-red-700"
            : "bg-green-100 text-green-700"
        }`}
      >
        {data.status}
      </span>
    </div>
  );
}
