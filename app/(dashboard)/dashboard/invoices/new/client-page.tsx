"use client";

import { useState, useTransition, useRef } from "react";
import { InvoiceData } from "@/components/invoice/types";
import InvoicePreview from "@/components/invoice/InvoicePreview";
import { FaEye, FaSave } from "react-icons/fa";
import { createInvoice } from "../../actions";

type Props = {
  initialData?: InvoiceData;
};

function mapInvoiceDataForBackend(data: InvoiceData) {
  return {
    logo: data.logo,
    status: data.status,
    currency: data.currency,
    invoice_number: data.invoiceNumber, // snake_case
    invoice_date: data.invoiceDate,
    due_date: data.dueDate,
    client_name: data.clientName,
    client_email: data.clientEmail,
    client_address: data.clientAddress,
    discount_type: data.discountType,
    discount_value: data.discountValue,
    tax_rate: data.taxRate,
    items: data.items.map((item) => ({
      item: item.item,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.rate, // renamed
    })),
  };
}

export default function ClientInvoice({ initialData }: Props) {
  const [isPending, startTransition] = useTransition();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [showDiscount, setShowDiscount] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<InvoiceData>(
    initialData ?? {
      logo: "",
      status: "DRAFT",
      currency: "NGN",
      invoiceNumber: "", // backend will assign
      invoiceDate: "",
      dueDate: "",
      clientName: "",
      clientEmail: "",
      clientAddress: "",
      items: [{ item: "", description: "", quantity: 1, rate: 0 }],
      discountType: "fixed",
      discountValue: 0,
      taxRate: 0,
    }
  );

  /* ---------------- HELPERS ---------------- */
  const update = (key: keyof InvoiceData, value: any) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const updateItem = (index: number, key: string, value: any) => {
    const items = [...data.items];
    items[index] = { ...items[index], [key]: value };
    setData({ ...data, items });
  };

  const addItem = () =>
    setData({
      ...data,
      items: [...data.items, { item: "", description: "", quantity: 1, rate: 0 }],
    });

  const removeItem = (index: number) =>
    setData({ ...data, items: data.items.filter((_, i) => i !== index) });

  /* ---------------- SUBMIT ---------------- */
  const handleSave = () => {
    startTransition(async () => {
      try {
        const backendPayload = mapInvoiceDataForBackend(data);
        const invoice = await createInvoice(backendPayload);
        console.log("Invoice created:", invoice);
        window.location.href = `/dashboard/invoices`;
      } catch (error) {
        console.error("Create invoice failed", error);
        alert("Failed to create invoice");
      }
    });
  };


  /* ---------------- DOWNLOAD ---------------- */
  const handleDownload = async () => {
    if (!previewRef.current) return;

    const html2canvas = (await import("html2canvas")).default;
    const jsPDF = (await import("jspdf")).default;

    const canvas = await html2canvas(previewRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/jpeg", 0.85);

    const pdf = new jsPDF("p", "mm", "a4", true);
    const margin = 10;
    const pdfWidth = 210 - margin * 2;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "JPEG", margin, margin, pdfWidth, pdfHeight);
    pdf.save("Invoice.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* ================= INVOICE FORM ================= */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm w-full space-y-6">
          <h1 className="text-2xl font-bold">Create Invoice</h1>

          {/* Logo & Status */}
          <div>
          <label className="block font-medium mb-1">Upload Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => update("logo", reader.result as string);
              reader.readAsDataURL(file);
            }}
          />
        </div>
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Upload Logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => update("logo", reader.result as string);
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
                <option value="DRAFT">DRAFT</option>
                <option value="UNPAID">UNPAID</option>
                <option value="PAID">PAID</option>
              </select>
            </div>
          </div> */}

          {/* Currency */}
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

          {/* Invoice Info */}
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

          {/* Client Details */}
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
              value={data.clientAddress}
              onChange={(e) => update("clientAddress", e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* Items */}
          <div className="space-y-4">
            <h2 className="font-semibold">Items</h2>
            {data.items.map((item, i) => (
              <div key={i} className="relative border rounded-lg p-4 bg-gray-50 space-y-3">
                <button
                  onClick={() => removeItem(i)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    placeholder="Item"
                    value={item.item}
                    onChange={(e) => updateItem(i, "item", e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                  <input
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => updateItem(i, "description", e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateItem(i, "quantity", Number(e.target.value))}
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="number"
                    min={0}
                    value={item.rate}
                    onChange={(e) => updateItem(i, "rate", Number(e.target.value))}
                    className="border p-2 rounded w-full"
                  />
                  <input
                    readOnly
                    value={(item.quantity * item.rate).toFixed(2)}
                    className="border p-2 rounded bg-gray-100 w-full"
                  />
                </div>
              </div>
            ))}
            <button onClick={addItem} className="text-blue-600 text-sm font-medium">
              + Add another item
            </button>
          </div>

          {/* Discount */}
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
                  <button onClick={() => setShowDiscount(false)} className="text-sm text-red-500">
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <select
                    value={data.discountType}
                    onChange={(e) => update("discountType", e.target.value)}
                    className="border p-2 rounded w-full"
                  >
                    <option value="fixed">Fixed</option>
                    <option value="percentage">Percentage (%)</option>
                  </select>
                  <input
                    type="number"
                    min={0}
                    value={data.discountValue}
                    onChange={(e) => update("discountValue", Number(e.target.value))}
                    className="border p-2 rounded w-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-6 border-t items-center">
            <button
              onClick={() => setPreviewVisible(!previewVisible)}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-5 py-3 rounded-lg font-semibold shadow transform hover:scale-105 transition"
            >
              <FaEye /> {previewVisible ? "Hide Preview" : "Preview"}
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-lg font-semibold shadow transform hover:scale-105 transition"
            >
              <FaSave /> Create Invoice
            </button>
            {/* <button
              onClick={() => handleSend(false)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold shadow transform hover:scale-105 transition"
            >
              <FaPaperPlane /> Send (No Payment Link)
            </button> */}
            {/* <button
              onClick={() => handleSend(true)}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-lg font-semibold shadow transform hover:scale-105 transition"
            >
              <FaCreditCard /> Send (With Payment Link)
            </button> */}
          </div>

          {/* Preview */}
          {previewVisible && (
            <div className="mt-6 border rounded-lg p-4 bg-gray-50 shadow-sm">
              <h2 className="font-semibold mb-4 text-gray-700">Live Preview</h2>
              <InvoicePreview ref={previewRef} data={data} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
