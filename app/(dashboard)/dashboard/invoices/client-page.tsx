'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  UserPlus,
  Printer,
  Share,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Upload,
  Download,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import InvoicePreview from '@/components/invoice/InvoicePreview';

type SortKey =
  | 'newest'
  | 'oldest'
  | 'due_date'
  | 'amount'
  | 'status';


export default function InvoiceModule({ invoices }: { invoices: any[] }) {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const invoicesPerPage = 25;

  /* ---------------- FILTER ---------------- */
  const filteredInvoices = invoices.filter((invoice) =>
    invoice.client_name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  /* ---------------- SORT ---------------- */
const sortedInvoices = [...filteredInvoices].sort((a, b) => {
  switch (sortBy) {
    case 'newest':
      return (
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
      );

    case 'oldest':
      return (
        new Date(a.created_at).getTime() -
        new Date(b.created_at).getTime()
      );

    case 'due_date':
      return (
        new Date(a.due_date ?? 0).getTime() -
        new Date(b.due_date ?? 0).getTime()
      );

    case 'amount':
      return (b.amount ?? 0) - (a.amount ?? 0);

    case 'status':
      return (a.status ?? '').localeCompare(b.status ?? '');

    default:
      return 0;
  }
});

  /* ---------------- PAGINATION ---------------- */
  const startIndex = (currentPage - 1) * invoicesPerPage;
  const paginatedInvoices = sortedInvoices.slice(
    startIndex,
    startIndex + invoicesPerPage
  );

  const totalPages = Math.ceil(filteredInvoices.length / invoicesPerPage);

  const handleAddInvoice = () => {
    router.push('/dashboard/invoices/new');
  };

  /* ---------------- STATUS BADGE ---------------- */
  const renderStatus = (status: string) => {
    const base =
      'px-3 py-1 rounded-full text-xs font-semibold capitalize';
    switch (status) {
      case 'paid':
        return <span className={`${base} bg-green-100 text-green-700`}>Paid</span>;
      case 'pending':
        return <span className={`${base} bg-yellow-100 text-yellow-700`}>Pending</span>;
      case 'draft':
        return <span className={`${base} bg-gray-100 text-gray-700`}>Draft</span>;
      case 'overdue':
        return <span className={`${base} bg-red-100 text-red-700`}>Overdue</span>;
      default:
        return <span className={`${base} bg-slate-100 text-slate-700`}>{status}</span>;
    }
  };

  // ---------------- Helper for Modal ----------------
  const openInvoiceModal = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  const closeInvoiceModal = () => {
    setSelectedInvoice(null);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-4xl font-extrabold text-gray-900">
          Invoice Management
        </h1>
        <p className="text-gray-500 mt-1">
          Track, manage, and monitor invoices
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl rounded-lg hover:scale-105 transition-transform">
          <CardHeader>
            <CardTitle>Total Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{invoices.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-lime-400 text-white shadow-xl rounded-lg hover:scale-105 transition-transform">
          <CardHeader>
            <CardTitle>Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">${filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0).toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <Input
          placeholder="Search by client name"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="lg:w-1/3"
        />

        <div className="flex items-center gap-2 flex-wrap">
          {/* 🔹 Compact Sort Dropdown */}
          <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as SortKey);
                  setCurrentPage(1);
                }}
                className="border rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="due_date">Due date</option>
                <option value="amount">Amount</option>
                <option value="status">Status</option>
              </select>


          <Button
            onClick={handleAddInvoice}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>

          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <MoreHorizontal />
            </Button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-20">
                <button className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100">
                  <Upload className="h-4 w-4" /> Import
                </button>
                <button className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100">
                  <Download className="h-4 w-4" /> Export
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">S/N</th>
              <th className="px-4 py-3 text-left">Client</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-left">Due Date</th>
              <th className="px-4 py-3 text-center">Status</th>
              {/* <th className="px-4 py-3 text-center">Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {paginatedInvoices.map((invoice, index) => (
              // <tr key={invoice.id} className="border-b hover:bg-gray-50">
              <tr
                  key={invoice.id}
                  onClick={() => openInvoiceModal(invoice)}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                >
                <td className="px-4 py-3 font-medium">
                  {startIndex + index + 1}
                </td>
                <td className="px-4 py-3">{invoice.client_name}</td>
                <td className="px-4 py-3 text-right font-semibold">
                  ₦{(invoice.amount ?? 0).toLocaleString()}
                </td>
                <td className="px-4 py-3">{invoice.due_date || '—'}</td>
                <td className="px-4 py-3 text-center">
                  {renderStatus(invoice.status)}
                </td>
                {/* <td className="px-4 py-3 text-center flex justify-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Printer className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Share className="h-4 w-4" />
                  </Button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invoice Modal */}
      {isModalOpen && selectedInvoice && (
  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
    <div className="bg-white w-full max-w-4xl rounded-xl shadow-xl overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">
          Invoice #{selectedInvoice.invoice_number}
        </h2>

        <button
          onClick={closeInvoiceModal}
          className="text-gray-500 hover:text-gray-800 text-xl"
        >
          ×
        </button>
      </div>

      {/* Body */}
      <div className="p-6 max-h-[75vh] overflow-y-auto bg-gray-50">
        <InvoicePreview data={selectedInvoice} />
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 px-6 py-4 border-t bg-white">
        <Button
          variant="outline"
          onClick={() => window.print()}
        >
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>

        <Button
          onClick={() => {
            navigator.clipboard.writeText(
              `${window.location.origin}/invoice/${selectedInvoice.id}`
            );
            alert("Invoice link copied!");
          }}
        >
          <Share className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>
    </div>
  </div>
)}


      {/* Pagination */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">
          Showing {startIndex + 1}–
          {Math.min(startIndex + invoicesPerPage, filteredInvoices.length)} of{' '}
          {filteredInvoices.length}
        </span>

        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <ChevronLeft />
          </Button>
          <span className="px-2 py-1 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
