'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import type { InvoiceData } from '@/components/invoice/types';
import { mapInvoiceResponse } from '@/app/utils/mapInvoice';
import { getInvoices, getMarketSettings, getPlanUsage } from '../actions';
import { Download, FileBarChart, Users, WalletCards, LockKeyhole, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { formatMoney, CURRENCY_SYMBOLS } from '@/lib/currency';

ChartJS.register(CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement, LineElement);

type ReportItem = {
  date: string;
  revenue: number;
  clients: number;
};

function buildReportSeries(invoices: InvoiceData[], range?: [Date | null, Date | null], currency = 'NGN'): ReportItem[] {
  const groups = new Map<string, { label: string; revenue: number; clients: Set<string> }>();

  invoices.filter((invoice) => (invoice.currency || 'NGN') === currency).forEach((invoice) => {
    const rawDate = invoice.invoiceDate || invoice.dueDate || '';
    const parsed = new Date(rawDate);
    if (Number.isNaN(parsed.getTime())) return;

    if (range?.[0]) {
      const start = new Date(range[0]);
      start.setHours(0, 0, 0, 0);
      if (parsed < start) return;
    }
    if (range?.[1]) {
      const end = new Date(range[1]);
      end.setHours(23, 59, 59, 999);
      if (parsed > end) return;
    }

    const monthKey = `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}`;
    const label = parsed.toLocaleDateString('en', { month: 'short', year: 'numeric' });
    if (!groups.has(monthKey)) groups.set(monthKey, { label, revenue: 0, clients: new Set<string>() });

    const bucket = groups.get(monthKey)!;
    bucket.revenue += Number(invoice.amountPaid ?? invoice.payment?.amount ?? 0);
    bucket.clients.add(invoice.clientName || invoice.client?.name || 'Unknown client');
  });

  return Array.from(groups.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, value]) => ({ date: value.label, revenue: value.revenue, clients: value.clients.size }));
}

export default function ReportModule() {
  const [selectedDateRange, setSelectedDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [reportInvoices, setReportInvoices] = useState<InvoiceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('NGN');
  const [reportsAllowed, setReportsAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const planUsage = await getPlanUsage();
        const allowed = Boolean(planUsage?.plan?.features?.reports);
        setReportsAllowed(allowed);
        if (!allowed) { setIsLoading(false); return; }
        const [response, marketResponse] = await Promise.all([getInvoices(), getMarketSettings()]);
        const invoices = mapInvoiceResponse(response);
        setSelectedCurrency(marketResponse?.data?.base_currency || 'NGN');
        setReportInvoices(invoices);

        const dates = invoices
          .map((invoice) => new Date(invoice.invoiceDate || invoice.dueDate || ''))
          .filter((date) => !Number.isNaN(date.getTime()));

        if (dates.length) {
          setSelectedDateRange([
            new Date(Math.min(...dates.map((date) => date.getTime()))),
            new Date(Math.max(...dates.map((date) => date.getTime()))),
          ]);
        }
      } catch (error: any) {
        setErrorMessage(error?.message || 'Unable to load invoice report data');
      } finally {
        setIsLoading(false);
      }
    };
    loadInvoices();
  }, []);

  const filteredData = useMemo(
    () => buildReportSeries(reportInvoices, selectedDateRange, selectedCurrency),
    [reportInvoices, selectedDateRange, selectedCurrency]
  );

  const totals = useMemo(() => {
    const scoped = reportInvoices.filter((invoice) => (invoice.currency || 'NGN') === selectedCurrency);
    const paid = scoped.reduce((sum, invoice) => sum + Number(invoice.amountPaid ?? invoice.payment?.amount ?? 0), 0);
    const outstanding = scoped.reduce((sum, invoice) => sum + Number(invoice.amountDue ?? 0), 0);
    const clients = new Set(scoped.map((invoice) => invoice.clientName || invoice.client?.name).filter(Boolean));
    return { paid, outstanding, clients: clients.size };
  }, [reportInvoices, selectedCurrency]);

  const availableCurrencies = useMemo(() => Array.from(new Set(reportInvoices.map((invoice) => invoice.currency || 'NGN'))).sort(), [reportInvoices]);

  const chartData = {
    labels: filteredData.map((item) => item.date),
    datasets: [{
      label: 'Paid Revenue',
      data: filteredData.map((item) => item.revenue),
      borderColor: 'rgb(5, 150, 105)',
      backgroundColor: 'rgba(5, 150, 105, 0.12)',
      fill: true,
      tension: 0.35,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' as const } },
    scales: { y: { beginAtZero: true, ticks: { callback: (value: string | number) => `${CURRENCY_SYMBOLS[selectedCurrency] ?? selectedCurrency} ${Number(value).toLocaleString()}` } } },
  };

  const handleExportReport = () => {
    const headers = ['Period', 'Currency', 'Paid Revenue', 'Unique Clients'];
    const escape = (value: unknown) => {
      const text = String(value ?? '');
      return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
    };
    const rows = filteredData.map((item) => [item.date, selectedCurrency, item.revenue.toFixed(2), item.clients]);
    const csv = [headers, ...rows].map((row) => row.map(escape).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hip-homorrd-report.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  if (reportsAllowed === false) {
    return <div className="page-container py-10"><div className="mx-auto max-w-2xl rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><LockKeyhole className="h-5 w-5" /></span><h1 className="mt-5 text-2xl font-bold text-slate-950">Reports are included with Base and Plus.</h1><p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-500">Your Free workspace keeps invoicing, client payment links and verified reviews available. Upgrade when you need collection reporting and exports.</p><Link href="/dashboard/settings/billing?plan=base" className="mt-6 inline-flex items-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white">View Base plan <ArrowRight className="ml-2 h-4 w-4" /></Link></div></div>;
  }

  return (
    <div className="page-container w-full min-w-0 space-y-5 py-4 sm:space-y-6 sm:py-6">
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <FileBarChart className="h-5 w-5 text-emerald-600" />
            <h1 className="text-xl font-semibold text-slate-950 sm:text-2xl">Reports · {selectedCurrency}</h1>
          </div>
          <p className="mt-1 text-sm text-slate-500">Understand collections one currency at a time. Hip Homorrd does not mix currencies using an assumed exchange rate.</p>
        </div>
        <div className="flex w-full gap-2 sm:w-auto"><select value={selectedCurrency} onChange={(event) => setSelectedCurrency(event.target.value)} className="field min-w-28">{availableCurrencies.length ? availableCurrencies.map((currency) => <option key={currency} value={currency}>{currency}</option>) : <option value={selectedCurrency}>{selectedCurrency}</option>}</select><Button onClick={handleExportReport} variant="outline" className="flex-1 sm:w-auto">
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button></div>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Paid revenue</CardTitle></CardHeader><CardContent><div className="flex items-center justify-between gap-3"><p className="text-2xl font-semibold text-slate-950">{formatMoney(totals.paid, selectedCurrency)}</p><WalletCards className="h-5 w-5 text-emerald-600" /></div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Outstanding</CardTitle></CardHeader><CardContent><div className="flex items-center justify-between gap-3"><p className="text-2xl font-semibold text-slate-950">{formatMoney(totals.outstanding, selectedCurrency)}</p><FileBarChart className="h-5 w-5 text-amber-600" /></div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Unique clients</CardTitle></CardHeader><CardContent><div className="flex items-center justify-between gap-3"><p className="text-2xl font-semibold text-slate-950">{totals.clients}</p><Users className="h-5 w-5 text-slate-600" /></div></CardContent></Card>
      </div>

      <Card className="min-w-0 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Revenue report</CardTitle>
          <div className="mt-3 w-full max-w-full overflow-hidden">
            <DatePicker
              selected={selectedDateRange[0]}
              onChange={(dates) => setSelectedDateRange(dates as [Date | null, Date | null])}
              startDate={selectedDateRange[0]}
              endDate={selectedDateRange[1]}
              selectsRange
              isClearable
              dateFormat="dd MMM yyyy"
              className="field w-full sm:w-auto"
              placeholderText="Select date range"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="rounded-xl bg-slate-50 p-8 text-center text-sm text-slate-500">Loading report...</div>
          ) : errorMessage ? (
            <div className="rounded-xl bg-red-50 p-8 text-center text-sm text-red-600">{errorMessage}</div>
          ) : filteredData.length ? (
            <div className="h-[280px] w-full min-w-0 sm:h-[360px]">
              <Line data={chartData} options={options} />
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-500">No report data is available for this period.</div>
          )}
        </CardContent>
      </Card>

      <Card className="min-w-0 overflow-hidden">
        <CardHeader><CardTitle className="text-base sm:text-lg">Monthly collection summary</CardTitle></CardHeader>
        <CardContent className="p-0 sm:p-0">
          <div className="overflow-x-auto">
            <table className="min-w-[520px] w-full text-sm">
              <thead className="border-y border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr><th className="px-4 py-3">Period</th><th className="px-4 py-3 text-right">Paid revenue</th><th className="px-4 py-3 text-right">Clients</th></tr>
              </thead>
              <tbody>
                {filteredData.map((item) => <tr key={item.date} className="border-b border-slate-100 last:border-0"><td className="px-4 py-3 font-medium text-slate-800">{item.date}</td><td className="px-4 py-3 text-right font-semibold text-slate-900">{formatMoney(item.revenue, selectedCurrency)}</td><td className="px-4 py-3 text-right text-slate-600">{item.clients}</td></tr>)}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
