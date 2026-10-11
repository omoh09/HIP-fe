'use client';

import { useRef, useState } from 'react';
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
import WhatsAppShareButton from '@/components/invoice/WhatsAppShareButton';
import InvoiceListActions from '@/components/invoice/InvoiceListActions';
import { importInvoices } from '../actions';
import { formatMoney } from '@/lib/currency';
import { markInvoiceShared } from '@/lib/onboarding/client';

type SortKey =
  | 'newest'
  | 'oldest'
  | 'due_date'
  | 'amount'
  | 'amount_due'
  | 'status';

const getInvoiceDueDate = (invoice: any) => invoice?.dueDate ?? invoice?.due_date ?? '';
const getInvoiceAmountDue = (invoice: any) => invoice?.amountDue ?? invoice?.amount_due ?? invoice?.amount ?? 0;
const getInvoiceStatus = (invoice: any) => {
  const rawStatus = String(invoice?.status ?? '').toLowerCase().trim();
  const normalized = rawStatus.replace(/[-\s]/g, '_');
  const amount = Number(invoice?.amount ?? invoice?.total ?? 0);
  const amountPaid = Number(invoice?.amountPaid ?? invoice?.amount_paid ?? invoice?.payment?.amount ?? 0);
  const amountDue = Number(invoice?.amountDue ?? invoice?.amount_due ?? Math.max(amount - amountPaid, 0));

  // Keep the UI resilient to backend naming differences while making a
  // partial payment visible even when the API has not returned a normalized status.
  if (normalized === 'partial' || normalized === 'partially_paid' || normalized === 'partiallypay') return 'partial';
  if (amountPaid > 0 && amountDue > 0 && amountPaid < amount) return 'partial';
  return normalized || 'pending';
};
const getInvoiceDate = (invoice: any) => invoice?.invoiceDate ?? invoice?.invoice_date ?? invoice?.created_at ?? '';

const formatInvoiceDate = (value: string | undefined) => {
  if (!value) return '—';

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString();
};

const buildInvoicesCSV = (invoices: any[]) => {
  const rows = invoices.map((invoice) => ({
    invoiceNumber: invoice.invoiceNumber ?? invoice.invoice_number ?? '',
    clientName: invoice.clientName ?? invoice.client?.name ?? '',
    amount: invoice.amount ?? 0,
    amountDue: invoice.amount_due ?? invoice.amountDue ?? invoice.amount ?? 0,
    dueDate: invoice.due_date ?? invoice.dueDate ?? '',
    status: invoice.status ?? '',
  }));

  const headers = ['invoiceNumber', 'clientName', 'amount', 'amountDue', 'dueDate', 'status'];
  const escapeValue = (value: unknown) => {
    const stringValue = String(value ?? '');
    return /[",\n]/.test(stringValue) ? `"${stringValue.replace(/"/g, '""')}"` : stringValue;
  };

  const csvLines = [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => escapeValue(row[header as keyof typeof row])).join(',')),
  ];

  return csvLines.join('\n');
};

export default function InvoiceModule({ invoices }: { invoices: any[] }) {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invoiceList, setInvoiceList] = useState<any[]>(Array.isArray(invoices) ? invoices : []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const invoicesPerPage = 25;

  /* ---------------- FILTER ---------------- */
  const filteredInvoices = invoiceList.filter((invoice) => {
    if (!searchQuery) return true;

    const haystack = [invoice.clientName, invoice.clientEmail, invoice.invoiceNumber, invoice.reference]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return haystack.includes(searchQuery.toLowerCase());
  });


  /* ---------------- SORT ---------------- */
const sortedInvoices = [...filteredInvoices].sort((a, b) => {
  switch (sortBy) {
    case 'newest': {
      const aDate = getInvoiceDate(a);
      const bDate = getInvoiceDate(b);
      return new Date(bDate || 0).getTime() - new Date(aDate || 0).getTime();
    }

    case 'oldest': {
      const aDate = getInvoiceDate(a);
      const bDate = getInvoiceDate(b);
      return new Date(aDate || 0).getTime() - new Date(bDate || 0).getTime();
    }

    case 'due_date': {
      const aDueDate = getInvoiceDueDate(a);
      const bDueDate = getInvoiceDueDate(b);

      return new Date(aDueDate || 0).getTime() - new Date(bDueDate || 0).getTime();
    }

    case 'amount':
      return (b.amount ?? 0) - (a.amount ?? 0);

    case 'amount_due': {
      const aAmountDue = Number(getInvoiceAmountDue(a));
      const bAmountDue = Number(getInvoiceAmountDue(b));
      return bAmountDue - aAmountDue;
    }

    case 'status': {
      const aStatus = String(getInvoiceStatus(a)).toLowerCase();
      const bStatus = String(getInvoiceStatus(b)).toLowerCase();
      return aStatus.localeCompare(bStatus);
    }

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

  const handleExport = () => {
    try {
      const csv: string = buildInvoicesCSV(invoiceList);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'invoices.csv';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Could not export invoices.');
    } finally {
      setDropdownOpen(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      await importInvoices(formData);
      window.location.reload();
    } catch (error) {
      alert('Could not import invoices. Please choose a valid CSV file.');
    } finally {
      event.target.value = '';
    }
  };

  /* ---------------- STATUS BADGE ---------------- */
  const renderStatus = (status: string) => {
    const base =
      'px-3 py-1 rounded-full text-xs font-semibold capitalize';
    switch (status) {
      case 'paid':
        return <span className={`${base} bg-green-100 text-green-700`}>Paid</span>;
      case 'partial':
        return <span className={`${base} bg-blue-100 text-blue-700`}>Partial</span>;
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

  const handleInvoicePaymentSuccess = (updatedInvoice: any) => {
    setInvoiceList((prev) =>
      prev.map((invoice) => {
        const currentInvoiceId = invoice.id ?? invoice.invoiceNumber ?? invoice.reference;
        const updatedInvoiceId = updatedInvoice.id ?? updatedInvoice.invoiceNumber ?? updatedInvoice.reference;

        if (currentInvoiceId !== updatedInvoiceId) return invoice;

        return {
          ...invoice,
          ...updatedInvoice,
          amountDue: updatedInvoice.amountDue ?? invoice.amountDue ?? invoice.amount_due ?? invoice.amount ?? 0,
          amountPaid: updatedInvoice.amountPaid ?? invoice.amountPaid ?? invoice.amount_paid ?? 0,
          status: updatedInvoice.status ?? invoice.status,
          payment: {
            ...(invoice.payment || {}),
            ...(updatedInvoice.payment || {}),
          },
        };
      })
    );

    setSelectedInvoice((prev: any) => {
      if (!prev) return prev;

      const currentInvoiceId = prev.id ?? prev.invoiceNumber ?? prev.reference;
      const updatedInvoiceId = updatedInvoice.id ?? updatedInvoice.invoiceNumber ?? updatedInvoice.reference;

      if (currentInvoiceId !== updatedInvoiceId) return prev;

      return {
        ...prev,
        ...updatedInvoice,
        amountDue: updatedInvoice.amountDue ?? prev.amountDue ?? prev.amount_due ?? prev.amount ?? 0,
        amountPaid: updatedInvoice.amountPaid ?? prev.amountPaid ?? prev.amount_paid ?? 0,
        status: updatedInvoice.status ?? prev.status,
        payment: {
          ...(prev.payment || {}),
          ...(updatedInvoice.payment || {}),
        },
      };
    });

    router.refresh();
  };

  return (
    <section className="page-container min-w-0 space-y-6 py-8 lg:py-10">
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
            <p className="text-3xl font-semibold">{invoiceList.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-lime-400 text-white shadow-xl rounded-lg hover:scale-105 transition-transform">
          <CardHeader>
            <CardTitle>Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">${filteredInvoices.reduce((sum, inv) => sum + (inv.amount ?? 0), 0).toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
        <Input
          placeholder="Search by client name"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full lg:max-w-md"
        />

        <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto">
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
                <option value="amount_due">Amount Due</option>
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
                <label className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <Upload className="h-4 w-4" /> Import
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    hidden
                    onChange={handleImport}
                  />
                </label>
                <button
                  type="button"
                  onClick={handleExport}
                  className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100"
                >
                  <Download className="h-4 w-4" /> Export
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile invoice cards */}
      <div className="grid gap-3 md:hidden">
        {paginatedInvoices.map((invoice, index) => (
          <div
            key={`mobile-${invoice.invoiceNumber}-${index}`}
            className="relative w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-emerald-200 hover:bg-slate-50"
          >
          <button
            type="button"
            className="w-full text-left"
            onClick={() => openInvoiceModal(invoice)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-400">#{startIndex + index + 1} · {invoice.invoiceNumber || 'Invoice'}</p>
                <p className="mt-1 truncate font-semibold text-slate-900">{invoice.clientName || 'Unnamed client'}</p>
              </div>
              {renderStatus(String(getInvoiceStatus(invoice)))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-xs text-slate-400">Amount</p><p className="mt-1 font-semibold text-slate-900">{formatMoney(Number(invoice.amount ?? 0), invoice.currency || 'NGN')}</p></div>
              <div><p className="text-xs text-slate-400">Amount due</p><p className="mt-1 font-semibold text-amber-700">{formatMoney(Number(getInvoiceAmountDue(invoice)), invoice.currency || 'NGN')}</p></div>
              <div className="col-span-2"><p className="text-xs text-slate-400">Due date</p><p className="mt-1 text-slate-700">{formatInvoiceDate(getInvoiceDueDate(invoice))}</p></div>
            </div>
          </button>
          <div className="mt-3 flex justify-end">
            <InvoiceListActions invoice={invoice} />
          </div>
        </div>
        ))}
        {!paginatedInvoices.length && <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">No invoices found.</div>}
      </div>

      {/* Table */}
      <div className="hidden overflow-x-auto rounded-lg bg-white shadow md:block">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">S/N</th>
              <th className="px-4 py-3 text-left">Client</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-right">Amount Due</th>
              <th className="px-4 py-3 text-left">Due Date</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
              {/* <th className="px-4 py-3 text-center">Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {paginatedInvoices.map((invoice, index) => (
              // <tr key={invoice.id} className="border-b hover:bg-gray-50">
              <tr                  
                  key={`${invoice.invoiceNumber}-${index}`}
                  onClick={() => openInvoiceModal(invoice)}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                >
                <td className="px-4 py-3 font-medium">
                  {startIndex + index + 1}
                </td>
                <td className="px-4 py-3">{invoice.clientName}</td>
                <td className="px-4 py-3 text-right font-semibold">
                  {formatMoney(Number(invoice.amount ?? 0), invoice.currency || 'NGN')}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-amber-700">
                  {formatMoney(Number(getInvoiceAmountDue(invoice)), invoice.currency || 'NGN')}
                </td>
                <td className="px-4 py-3">{formatInvoiceDate(getInvoiceDueDate(invoice))}</td>
                <td className="px-4 py-3 text-center">
                  {renderStatus(String(getInvoiceStatus(invoice))) }
                </td>
                <td className="px-4 py-3 text-center">
                  <InvoiceListActions invoice={invoice} />
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
        <InvoicePreview data={selectedInvoice} onPaymentSuccess={handleInvoicePaymentSuccess} />
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

        <WhatsAppShareButton
          clientName={selectedInvoice.clientName}
          clientPhone={selectedInvoice.clientPhone ?? selectedInvoice.client?.phone ?? selectedInvoice.client_phone ?? selectedInvoice.client?.phone_number ?? selectedInvoice.client?.mobile ?? selectedInvoice.client?.whatsapp_number}
          invoiceNumber={selectedInvoice.invoiceNumber ?? selectedInvoice.invoice_number}
          amount={Number(selectedInvoice.amountDue ?? selectedInvoice.amount ?? 0)}
          currency={selectedInvoice.currency ?? 'NGN'}
          paymentLink={selectedInvoice.paymentLink ?? selectedInvoice.payment_link ?? selectedInvoice.publicUrl ?? selectedInvoice.public_url}
          invoiceData={selectedInvoice}
        />
        <Button
          variant="outline"
          disabled={!selectedInvoice.paymentLink && !selectedInvoice.payment_link && !selectedInvoice.publicUrl && !selectedInvoice.public_url}
          onClick={() => {
            const link = selectedInvoice.paymentLink ?? selectedInvoice.payment_link ?? selectedInvoice.publicUrl ?? selectedInvoice.public_url;
            if (!link) return;
            navigator.clipboard.writeText(link);
            void markInvoiceShared(selectedInvoice.id);
            alert("Payment link copied!");
          }}
        >
          <Share className="mr-2 h-4 w-4" />
          Copy payment link
        </Button>
      </div>
    </div>
  </div>
)}


      {/* Pagination */}
      <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
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
    </section>
  );
}
