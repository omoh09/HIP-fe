"use client";

import { useEffect, useRef, useState } from "react";
import { InvoiceData } from "./types";
import { CURRENCY_SYMBOL } from "./constants";

type Props = {
  data: InvoiceData;
  setData: React.Dispatch<React.SetStateAction<InvoiceData>>;
  onDownload: () => void;
};

export default function InvoiceForm({ data, setData, onDownload }: Props) {
  /* ---------------- STATE ---------------- */
  const [showDiscount, setShowDiscount] = useState(
    data.discountValue > 0
  );
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const [tooltipVisible, setTooltipVisible] = useState(false);

  const handleDownload = async () => {
    try {
      await fetch("/api/track-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceNumber: data.invoiceNumber,
          clientEmail: data.clientEmail || "Guest",
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error("Failed to log download:", err);
    }

    // 2️⃣ Proceed to download PDF
    onDownload();
  };

  /* ---------------- HELPERS ---------------- */
  const update = (key: keyof InvoiceData, value: any) =>
    setData({ ...data, [key]: value });

  const updateItem = (index: number, key: string, value: any) => {
    const items = [...data.items];
    items[index] = { ...items[index], [key]: value };
    setData({ ...data, items });
  };

  const removeItem = (index: number) => {
    const items = data.items.filter((_, i) => i !== index);
    setData({ ...data, items });
  };

  const subtotal = data.items.reduce(
    (sum, i) => sum + i.quantity * i.rate,
    0
  );

  /* ---------------- ENTER TO FOCUS NEXT ---------------- */
  const handleEnter =
    (index: number) =>
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        inputRefs.current[index + 1]?.focus();
      }
    };

  /* ---------------- DRAG & DROP ---------------- */
  const dragItem = useRef<number | null>(null);

  const onDragStart = (index: number) => {
    dragItem.current = index;
  };

  const onDrop = (index: number) => {
    if (dragItem.current === null) return;
    const items = [...data.items];
    const [moved] = items.splice(dragItem.current, 1);
    items.splice(index, 0, moved);
    dragItem.current = null;
    setData({ ...data, items });
  };

  /* ---------------- VALIDATION ---------------- */
  const hasItemError = (item: any) =>
    !item.item || item.quantity <= 0 || item.rate < 0;

  /* ================= RENDER ================= */
  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm w-full lg:w-1/2 space-y-8">
      <h1 className="text-2xl font-bold">Create Invoice</h1>
      
      {/* ================= LOGO + STATUS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">Upload Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () =>
                update("logo", reader.result as string);
              reader.readAsDataURL(file);
            }}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Invoice Status</label>
          <select
            value={data.status}
            onChange={(e) => update("status", e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="UNPAID">UNPAID</option>
            <option value="PAID">PAID</option>
            <option value="DRAFT">DRAFT</option>
          </select>
        </div>
      </div>

      {/* ================= CURRENCY ================= */}
      <div>
        <label className="block font-medium mb-1">Currency</label>
        <select
          value={data.currency}
          onChange={(e) => update("currency", e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="NGN">₦ NGN</option>
          <option value="USD">$ USD</option>
          <option value="EUR">€ EUR</option>
        </select>
      </div>

      {/* ================= INVOICE META ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block font-medium mb-1">Invoice Number</label>
          <input
            value={data.invoiceNumber}
            onChange={(e) => update("invoiceNumber", e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Invoice Date</label>
          <input
            type="date"
            value={data.invoiceDate}
            onChange={(e) => update("invoiceDate", e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Due Date</label>
          <input
            type="date"
            value={data.dueDate}
            onChange={(e) => update("dueDate", e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
      </div>

      {/* ================= CLIENT DETAILS ================= */}
      <div className="space-y-3">
        <h2 className="font-semibold">Client Details</h2>
        <input
          placeholder="Client Name"
          value={data.clientName}
          onChange={(e) => update("clientName", e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          placeholder="Client Email"
          value={data.clientEmail}
          onChange={(e) => update("clientEmail", e.target.value)}
          className="border p-2 rounded w-full"
        />
        <textarea
          placeholder="Client Address"
          value={data.clientAddress || ""}
          onChange={(e) => update("clientAddress", e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* ================= ITEMS ================= */}
      <div className="space-y-4">
        <h2 className="font-semibold">Items</h2>

        {data.items.map((item, i) => (
          <div
            key={i}
            draggable
            onDragStart={() => onDragStart(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(i)}
            className={`relative border rounded-lg p-4 space-y-3 bg-gray-50 cursor-move ${
              hasItemError(item)
                ? "border-red-300"
                : "border-gray-200"
            }`}
          >
            {/* DELETE */}
            <button
              onClick={() => removeItem(i)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              ×
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600">
                  Item
                </label>
                <input
                  ref={(el) =>
                    (inputRefs.current[i * 4] = el!)
                  }
                  onKeyDown={handleEnter(i * 4)}
                  value={item.item}
                  onChange={(e) =>
                    updateItem(i, "item", e.target.value)
                  }
                  className="border p-2 rounded w-full"
                  placeholder="e.g. Website design"
                />
                {!item.item && (
                  <p className="text-xs text-red-500 mt-1">
                    Item name required
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600">
                  Description
                </label>
                <input
                  ref={(el) =>
                    (inputRefs.current[i * 4 + 1] = el!)
                  }
                  onKeyDown={handleEnter(i * 4 + 1)}
                  value={item.description}
                  onChange={(e) =>
                    updateItem(i, "description", e.target.value)
                  }
                  className="border p-2 rounded w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600">
                  Qty
                </label>
                <input
                  type="number"
                  min={1}
                  ref={(el) =>
                    (inputRefs.current[i * 4 + 2] = el!)
                  }
                  onKeyDown={handleEnter(i * 4 + 2)}
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(
                      i,
                      "quantity",
                      Number(e.target.value)
                    )
                  }
                  className="border p-2 rounded w-full"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600">
                  Rate
                </label>
                <input
                  type="number"
                  min={0}
                  ref={(el) =>
                    (inputRefs.current[i * 4 + 3] = el!)
                  }
                  onKeyDown={handleEnter(i * 4 + 3)}
                  value={item.rate}
                  onChange={(e) =>
                    updateItem(
                      i,
                      "rate",
                      Number(e.target.value)
                    )
                  }
                  className="border p-2 rounded w-full"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600">
                  Total
                </label>
                <input
                  readOnly
                  value={(
                    item.quantity * item.rate
                  ).toFixed(2)}
                  className="border p-2 rounded bg-gray-100 w-full"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={() =>
            setData({
              ...data,
              items: [
                ...data.items,
                { item: "", description: "", quantity: 1, rate: 0 },
              ],
            })
          }
          className="text-blue-600 text-sm font-medium"
        >
          + Add another item
        </button>
      </div>

      {/* ================= DISCOUNT ================= */}
      <div className="space-y-3">
        {!showDiscount ? (
          <button
            onClick={() => setShowDiscount(true)}
            className="text-blue-600 text-sm font-medium"
          >
            + Add discount
          </button>
        ) : (
          <div className="border rounded-lg p-4 bg-gray-50 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Discount</h3>
              <button
                onClick={() => {
                  setShowDiscount(false);
                  update("discountValue", 0);
                }}
                className="text-sm text-red-500"
              >
                Remove
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                value={data.discountType}
                onChange={(e) =>
                  update("discountType", e.target.value)
                }
                className="border p-2 rounded w-full"
              >
                <option value="fixed">Fixed</option>
                <option value="percentage">Percentage (%)</option>
              </select>

              <input
                type="number"
                min={0}
                value={data.discountValue}
                onChange={(e) =>
                  update(
                    "discountValue",
                    Number(e.target.value)
                  )
                }
                className="border p-2 rounded w-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* ================= ACTIONS ================= */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t items-center sm:items-start relative">
        
        {/* Download PDF Button */}
        <button
          onClick={handleDownload}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow-sm transition"
        >
          Download Invoice (PDF)
        </button>

       

        {/* Sign-Up / Catchy Button */}
        <div className="relative">
          <button
            onClick={() => window.location.href = "/signup"}
            onMouseEnter={() => setTooltipVisible(true)}
            onMouseLeave={() => setTooltipVisible(false)}
            className="ml-0 sm:ml-4 mt-2 sm:mt-0 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white px-6 py-3 rounded-lg font-bold shadow-lg transform hover:scale-105 transition"
          >
            Sign Up & Save Your Invoice
          </button>

          {/* Tooltip */}
          {tooltipVisible && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-60 bg-gray-900 text-white text-xs p-2 rounded shadow-lg text-center">
              Sign up now to save and edit your invoices anytime
            </div>
          )}
        </div>

      </div>

    </div>
  );
}










