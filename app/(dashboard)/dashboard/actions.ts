"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from 'next/cache';

const API_BASE = "http://127.0.0.1:8000";

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

  const res = await axios.post(`${API_BASE}/api/invoices`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

/* ================= UPDATE / SAVE ================= */
export async function saveInvoice(id: string, data: InvoiceData) {
  const token = getAuthToken();

  const res = await axios.put(`${API_BASE}/invoices/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

  revalidatePath("/dashboard/invoices");
  revalidatePath(`/dashboard/invoices/${id}`);

  return res.data;
}

/* ================= SEND ================= */
export async function sendInvoice(
  data: InvoiceData,
  withPaymentLink: boolean
) {
  const token = getAuthToken();

  const endpoint = withPaymentLink
    ? "/invoices/send-with-payment"
    : "/invoices/send";

  const res = await axios.post(`${API_BASE}${endpoint}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
}

/* ================= LIST ================= */
export async function getInvoices() {
  const token = await getAuthToken();

  const res = await axios.get(`${API_BASE}/api/invoices`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
}

/* ================= GET ONE ================= */
export async function getInvoice(id: string) {
  const token = await getAuthToken();

  const res = await axios.get(`${API_BASE}/api/invoices/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
}

/* ================= GET CLIENT ================= */
export async function getClient() {
  const token = await getAuthToken();

  const res = await axios.get(`${API_BASE}/api/clients`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('Fetched clients:', res.data);
  return res.data;
}

/* ---------------- EXPORT CSV ---------------- */
export async function exportClientsCSV() {
  const res = await fetch(`${process.env.API_URL}/clients/export`, {
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Failed to export clients');
  return res.text();
}

/* ---------------- IMPORT CSV ---------------- */
export async function importClients(formData: FormData) {
  const res = await fetch(`${process.env.API_URL}/clients/import`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error('Import failed');

  revalidatePath('/clients');
  return res.json();
}