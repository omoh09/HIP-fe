'use client';

import { useMemo, useState } from 'react';
import {
  UserPlus,
  Upload,
  Download,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { exportClientsCSV, importClients } from '../actions';

/* ---------------- TYPES ---------------- */
type Client = {
  client_name: string;
  client_email: string;
  invoice_count: number;
  total_paid: number;
  last_paid_at: string | null;
};

function ClientTableSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-24 rounded-lg bg-gray-200"
          />
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow p-4 space-y-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-6 bg-gray-200 rounded"
          />
        ))}
      </div>
    </div>
  );
}


/* ---------------- COMPONENT ---------------- */
export default function ClientTable({
  clients = [],
}: {
  clients?: Client[];
}) {
  const initialClients: Client[] = Array.isArray(clients) ? clients : [];
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'total_paid'>('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const clientsPerPage = 25;

 /* ---------------- LOADING STATE ---------------- */
  if (!clients) {
    return <ClientTableSkeleton />;
  }

  /* ---------------- FILTER ---------------- */
  const filteredClients = useMemo(() => {
  const q = search.toLowerCase().trim();

  if (!q) return initialClients;

  return initialClients.filter((client) => {
    const name = client.client_name?.toLowerCase() ?? '';
    const email = client.client_email?.toLowerCase() ?? '';

    return name.includes(q) || email.includes(q);
  });
}, [initialClients, search]);

  /* ---------------- SORT ---------------- */
  const sortedClients = useMemo(() => {
    return [...filteredClients].sort((a, b) => {
      if (sortBy === 'name') {
        return a.client_name.localeCompare(b.client_name);
      }
      return b.total_paid - a.total_paid;
    });
  }, [filteredClients, sortBy]);

  /* ---------------- PAGINATION ---------------- */
  const startIndex = (currentPage - 1) * clientsPerPage;
  const paginatedClients = sortedClients.slice(
    startIndex,
    startIndex + clientsPerPage
  );
  const totalPages = Math.ceil(sortedClients.length / clientsPerPage);

  /* ---------------- METRICS ---------------- */
  const totalClients = filteredClients.length;
  const totalAmountPaid = filteredClients.reduce(
    (sum, c) => sum + c.total_paid,
    0
  );

  /* ---------------- EXPORT ---------------- */
  const handleExport = async () => {
    const csv = await exportClientsCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'clients.csv';
    a.click();

    URL.revokeObjectURL(url);
    setDropdownOpen(false);
  };

  /* ---------------- IMPORT ---------------- */
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    const formData = new FormData();
    formData.append('file', e.target.files[0]);

    await importClients(formData);
    window.location.reload();
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-6">
      {/* METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <CardHeader>
            <CardTitle>Total Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{totalClients}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-lime-400 text-white">
          <CardHeader>
            <CardTitle>Total Amount Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">
              ₦{totalAmountPaid.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* CONTROLS */}
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <Input
          placeholder="Search client name"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="lg:w-1/3"
        />

        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as 'name' | 'total_paid');
              setCurrentPage(1);
            }}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="name">Sort by Name</option>
            <option value="total_paid">Sort by Total Paid</option>
          </select>

          {/* <Button className="bg-green-600 text-white">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Client
          </Button>

          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setDropdownOpen((p) => !p)}
            >
              <MoreHorizontal />
            </Button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white shadow rounded z-20">
                <label className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100">
                  <Upload className="h-4 w-4" />
                  Import
                  <input
                    type="file"
                    accept=".csv"
                    hidden
                    onChange={handleImport}
                  />
                </label>

                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100"
                >
                  <Download className="h-4 w-4" />
                  Export
                </button>
              </div>
            )}
          </div> */}
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">S/N</th>
              <th className="px-4 py-3 text-left">Client</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-right">Invoices</th>
              <th className="px-4 py-3 text-right">Total Paid</th>
              {/* <th className="px-4 py-3 text-left">Last Paid</th> */}
            </tr>
          </thead>
          <tbody>
            {paginatedClients.map((client, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  {startIndex + index + 1}
                </td>
                <td className="px-4 py-3 font-medium">
                  {client.client_name}
                </td>
                <td className="px-4 py-3">{client.client_email}</td>
                <td className="px-4 py-3 text-right">
                  {client.invoice_count}
                </td>
                <td className="px-4 py-3 text-right font-semibold">
                  ₦{client.total_paid.toLocaleString()}
                </td>
                {/* <td className="px-4 py-3">
                  {client.last_paid_at ?? '—'}
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center text-sm">
        <span>
          Showing {startIndex + 1}–
          {Math.min(startIndex + clientsPerPage, sortedClients.length)} of{' '}
          {sortedClients.length}
        </span>

        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <ChevronLeft />
          </Button>

          <span>
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
