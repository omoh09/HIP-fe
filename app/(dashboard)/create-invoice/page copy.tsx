'use client'; // Client-side component for React hooks and jsPDF

import { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import jsPDF to avoid SSR issues
const generatePDF = dynamic(() => import("jspdf").then((mod) => mod.jsPDF), {
  ssr: false,
});

export default function InvoicePage() {
  const [invoiceData, setInvoiceData] = useState({
    logo: "",
    invoiceNumber: "",
    dueDate: "",
    recipient: "",
    recipientEmail: "",
    clientName: "",
    clientEmail: "",
    items: [{ item: "", description: "", quantity: 1, rate: 0 }],
    taxRate: 0, // Tax rate in percentage
  });

  // Handle input changes for invoice data and items
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index?: number
  ) => {
    const { name, value } = e.target;

    if (index !== undefined) {
      const newItems = [...invoiceData.items];
      newItems[index][name] = value;
      setInvoiceData((prev) => ({
        ...prev,
        items: newItems,
      }));
    } else {
      setInvoiceData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Add a new item row
  const addItem = () => {
    setInvoiceData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { item: "", description: "", quantity: 1, rate: 0 },
      ],
    }));
  };

  // Calculate total, tax, and final total
  const calculateInvoiceTotals = () => {
    let subtotal = 0;
    invoiceData.items.forEach(item => {
      subtotal += item.quantity * item.rate;
    });

    const tax = (subtotal * (invoiceData.taxRate / 100)).toFixed(2);
    const total = (subtotal + parseFloat(tax)).toFixed(2);

    return {
      subtotal: subtotal.toFixed(2),
      tax,
      total,
    };
  };

  // Generate the invoice PDF
  const generateInvoicePDF = () => {
    const doc = new generatePDF();
    const {
      logo,
      invoiceNumber,
      dueDate,
      recipient,
      recipientEmail,
      clientName,
      clientEmail,
      items,
    } = invoiceData;

    const { subtotal, tax, total } = calculateInvoiceTotals();

    // Add logo if available
    if (logo) {
      doc.addImage(logo, "PNG", 10, 10, 50, 50); // Adjust logo size
    }

    // Invoice Header: Number and Due Date
    doc.text(`Invoice #${invoiceNumber}`, 250, 20);
    doc.text(`Due Date: ${dueDate}`, 250, 30);

    // Recipient and Client Information
    doc.text(`Recipient: ${recipient}`, 10, 80);
    doc.text(`Recipient Email: ${recipientEmail}`, 10, 90);
    doc.text(`Client: ${clientName}`, 10, 110);
    doc.text(`Client Email: ${clientEmail}`, 10, 120);

    // Table Headers for Items
    doc.text("Item", 10, 150);
    doc.text("Description", 60, 150);
    doc.text("Quantity", 160, 150);
    doc.text("Rate", 210, 150);
    doc.text("Amount", 250, 150);

    let yPosition = 160;
    let totalAmount = 0;

    // Add each item row
    items.forEach((item, index) => {
      doc.text(item.item, 10, yPosition);
      doc.text(item.description, 60, yPosition);
      doc.text(item.quantity.toString(), 160, yPosition);
      doc.text(item.rate.toString(), 210, yPosition);
      const amount = item.quantity * item.rate;
      doc.text(amount.toFixed(2), 250, yPosition);

      totalAmount += amount;
      yPosition += 10;
    });

    // Subtotal, Tax, and Total
    doc.text(`Subtotal: $${subtotal}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Tax (${invoiceData.taxRate}%): $${tax}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Total: $${total}`, 10, yPosition);

    // Footer with Terms
    yPosition += 20;
    doc.text("Terms: Payment is due within 30 days.", 10, yPosition);
    doc.text("Thank you for your business!", 10, yPosition + 10);

    // Save PDF
    doc.save(`${clientName}-Invoice-${invoiceNumber}.pdf`);
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start min-h-screen bg-gray-100">
      {/* Left Column: Form */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full lg:w-1/2">
        <h1 className="text-3xl font-bold text-center mb-6">Create Your Invoice</h1>

        <div className="space-y-6">
          {/* Invoice Header */}
          <div className="flex justify-between">
            <input
              type="text"
              name="invoiceNumber"
              value={invoiceData.invoiceNumber}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Invoice Number"
            />
            <input
              type="date"
              name="dueDate"
              value={invoiceData.dueDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Recipient and Client Info */}
          <div className="space-y-4">
            <input
              type="text"
              name="recipient"
              value={invoiceData.recipient}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Recipient Name"
            />
            <input
              type="email"
              name="recipientEmail"
              value={invoiceData.recipientEmail}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Recipient Email"
            />
            <input
              type="text"
              name="clientName"
              value={invoiceData.clientName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Client Name"
            />
            <input
              type="email"
              name="clientEmail"
              value={invoiceData.clientEmail}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Client Email"
            />
            <input
              type="number"
              name="taxRate"
              value={invoiceData.taxRate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Tax Rate (%)"
            />
          </div>

          {/* Itemized List */}
          <div>
            {invoiceData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-5 gap-4 mb-4">
                <input
                  type="text"
                  name="item"
                  value={item.item}
                  onChange={(e) => handleChange(e, index)}
                  className="p-2 border rounded"
                  placeholder="Item"
                />
                <input
                  type="text"
                  name="description"
                  value={item.description}
                  onChange={(e) => handleChange(e, index)}
                  className="p-2 border rounded"
                  placeholder="Description"
                />
                <input
                  type="number"
                  name="quantity"
                  value={item.quantity}
                  onChange={(e) => handleChange(e, index)}
                  className="p-2 border rounded"
                  placeholder="Quantity"
                />
                <input
                  type="number"
                  name="rate"
                  value={item.rate}
                  onChange={(e) => handleChange(e, index)}
                  className="p-2 border rounded"
                  placeholder="Rate"
                />
                <input
                  type="text"
                  readOnly
                  value={(item.quantity * item.rate).toFixed(2)}
                  className="p-2 border rounded bg-gray-100"
                />
              </div>
            ))}
            <button
              onClick={addItem}
              className="bg-green-500 text-white p-2 rounded"
            >
              Add Another Item
            </button>
          </div>

          {/* Total, Tax, and Final Total */}
          <div className="mt-4">
            <p className="font-bold">Subtotal: ${calculateInvoiceTotals().subtotal}</p>
            <p className="font-bold">Tax ({invoiceData.taxRate}%): ${calculateInvoiceTotals().tax}</p>
            <p className="font-bold">Total: ${calculateInvoiceTotals().total}</p>
          </div>

          {/* Generate Invoice Button */}
          <button
            onClick={generateInvoicePDF}
            className="w-full mt-6 bg-blue-500 text-white p-2 rounded-lg"
          >
            Generate Invoice
          </button>
        </div>
      </div>

      {/* Right Column: Invoice Preview */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full lg:w-1/2 ml-4 mt-6 lg:mt-0">
        <h2 className="text-2xl font-bold text-center mb-6">Invoice Preview</h2>

        <div className="space-y-4">
          {/* Invoice Header */}
          <div className="flex justify-between">
            <div>
              <h3 className="font-bold text-xl">Invoice #{invoiceData.invoiceNumber}</h3>
              <p>Due Date: {invoiceData.dueDate}</p>
            </div>
          </div>

          {/* Recipient and Client Info */}
          <div>
            <p><strong>Recipient:</strong> {invoiceData.recipient}</p>
            <p><strong>Email:</strong> {invoiceData.recipientEmail}</p>
            <p><strong>Client:</strong> {invoiceData.clientName}</p>
            <p><strong>Email:</strong> {invoiceData.clientEmail}</p>
          </div>

          {/* Itemized Table Preview */}
          <div>
            <table className="min-w-full border-collapse">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="border p-2">Item</th>
                  <th className="border p-2">Description</th>
                  <th className="border p-2">Quantity</th>
                  <th className="border p-2">Rate</th>
                  <th className="border p-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item, index) => (
                  <tr key={index}>
                    <td className="border p-2">{item.item}</td>
                    <td className="border p-2">{item.description}</td>
                    <td className="border p-2">{item.quantity}</td>
                    <td className="border p-2">${item.rate}</td>
                    <td className="border p-2">${(item.quantity * item.rate).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total, Tax, and Final Total Preview */}
          <div className="mt-4">
            <p className="font-bold">Subtotal: ${calculateInvoiceTotals().subtotal}</p>
            <p className="font-bold">Tax: ${calculateInvoiceTotals().tax}</p>
            <p className="font-bold">Total: ${calculateInvoiceTotals().total}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
