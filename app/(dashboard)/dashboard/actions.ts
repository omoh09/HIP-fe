"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from 'next/cache';

const API_BASE_URL = process.env.API_BASE_URL?.replace(/\/$/, '');

/* ---------------- AUTH HELPER ---------------- */
async function getAuthToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth")?.value;

  if (!token) redirect("/sign-in");

  return token;
}

/* ================= CREATE INVOICE ================= */
export async function createInvoice(data: any) {
  const token = await getAuthToken();

  try {
    const res = await axios.post(`${API_BASE_URL}/api/v1/invoices`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error: any) {
    const errors = error?.response?.data?.errors;
    const firstValidation = errors && typeof errors === 'object'
      ? Object.values(errors).flat().find((value) => typeof value === 'string')
      : null;
    throw new Error(firstValidation || error?.response?.data?.message || 'Unable to create invoice.');
  }
}


/* ================= UPDATE INVOICE ================= */
export async function updateInvoice(id: string | number, data: any) {
  const token = await getAuthToken();
  if (!id) throw new Error('Invoice id is required to update an invoice.');

  try {
    const res = await axios.put(`${API_BASE_URL}/api/v1/invoices/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    revalidatePath('/dashboard/invoices');
    revalidatePath(`/dashboard/invoices/${id}`);
    revalidatePath(`/dashboard/invoices/${id}/edit`);
    return res.data;
  } catch (error: any) {
    const errors = error?.response?.data?.errors;
    const firstValidation = errors && typeof errors === 'object'
      ? Object.values(errors).flat().find((value) => typeof value === 'string')
      : null;
    throw new Error(firstValidation || error?.response?.data?.message || 'Unable to update invoice.');
  }
}

/* ================= UPDATE / SAVE ================= */
// export async function saveInvoice(id: string, data: InvoiceData) {
//   const token = getAuthToken();

//   const res = await axios.put(`${API_BASE_URL}/invoices/${id}`, data, {
//     headers: { Authorization: `Bearer ${token}` },
//   });

//   revalidatePath("/dashboard/invoices");
//   revalidatePath(`/dashboard/invoices/${id}`);

//   return res.data;
// }

/* ================= SEND ================= */
// export async function sendInvoice(
//   data: InvoiceData,
//   withPaymentLink: boolean
// ) {
//   const token = getAuthToken();

//   const endpoint = withPaymentLink
//     ? "/invoices/send-with-payment"
//     : "/invoices/send";

//   const res = await axios.post(`${API_BASE_URL}${endpoint}`, data, {
//     headers: { Authorization: `Bearer ${token}` },
//   });

//   return res.data;
// }

/* ================= LIST ================= */
export async function getInvoices() {
  const token = await getAuthToken();

  const res = await axios.get(`${API_BASE_URL}/api/v1/invoices`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
}

/* ================= TRANSACTIONS ================= */
export async function getTransactions(params: {
  status?: string;
  provider?: string;
  reference?: string;
  per_page?: number;
  page?: number;
} = {}) {
  const token = await getAuthToken();

  const res = await axios.get(`${API_BASE_URL}/api/v1/transactions`, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });

  return res.data;
}

/* ================= GET ONE ================= */
export async function getInvoice(id: string) {
  const token = await getAuthToken();
  if (!id || id === 'undefined' || id === 'null') throw new Error('Invalid invoice id.');

  try {
    const res = await axios.get(`${API_BASE_URL}/api/v1/invoices/${encodeURIComponent(id)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error: any) {
    if (error?.response?.status === 404) throw new Error('Invoice not found.');
    throw new Error(error?.response?.data?.message || 'Unable to load invoice.');
  }
}

/* ================= GET CLIENT ================= */
export async function getClient() {
  const token = await getAuthToken();

  const res = await axios.get(`${API_BASE_URL}/api/v1/clients`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}


/* ================= CREATE CLIENT ================= */
export async function createClient(data: { name: string; email?: string; phone?: string; preferred_currency?: string }) {
  const token = await getAuthToken();
  try {
    const res = await axios.post(`${API_BASE_URL}/api/v1/clients`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    revalidatePath('/dashboard/clients');
    revalidatePath('/dashboard/invoices/new');
    return res.data;
  } catch (error: any) {
    const errors = error?.response?.data?.errors;
    const firstValidation = errors && typeof errors === 'object'
      ? Object.values(errors).flat().find((value) => typeof value === 'string')
      : null;
    throw new Error(firstValidation || error?.response?.data?.message || 'Unable to create client.');
  }
}

/* ---------------- EXPORT CSV ---------------- */
export async function exportClientsCSV() {
  const token = await getAuthToken();
  const res = await fetch(`${API_BASE_URL}/api/v1/clients/export`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to export clients');
  return res.text();
}

export async function exportInvoicesCSV(invoices: any[]) {
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

  return [headers.join(','), ...rows.map((row) => headers.map((header) => escapeValue(row[header as keyof typeof row])).join(','))].join('\n');
}

/* ---------------- IMPORT CSV ---------------- */
export async function importInvoices(formData: FormData) {
  const token = await getAuthToken();
  const res = await fetch(`${API_BASE_URL}/api/v1/invoices/import`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) throw new Error('Invoice import failed');

  revalidatePath('/dashboard/invoices');
  return res.json();
}

export async function importClients(formData: FormData) {
  const token = await getAuthToken();
  const res = await fetch(`${API_BASE_URL}/api/v1/clients/import`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) throw new Error('Client import failed');

  revalidatePath('/dashboard/clients');
  return res.json();
}

/* ================= PLAN USAGE ================= */
export async function getPlanUsage() {
  const token = await getAuthToken();
  const res = await axios.get(`${API_BASE_URL}/api/v1/plan`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data?.data ?? res.data;
}


/* ================= ARCHIVE CLIENT ================= */
export async function archiveClient(id: string | number) {
  const token = await getAuthToken();
  const res = await axios.patch(`${API_BASE_URL}/api/v1/clients/${id}/archive`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  revalidatePath('/dashboard/clients');
  revalidatePath('/dashboard/invoices/new');
  return res.data;
}

/* ================= MARKET / CURRENCY ================= */
export async function getMarketSettings() {
  const token = await getAuthToken();
  const res = await axios.get(`${API_BASE_URL}/api/v1/market`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function updateMarketSettings(data: {
  country_code: string;
  base_currency: string;
  billing_currency?: string;
  locale?: string;
}) {
  const token = await getAuthToken();
  const res = await axios.patch(`${API_BASE_URL}/api/v1/market`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/invoices/new');
  revalidatePath('/dashboard/settings/market');
  return res.data;
}
