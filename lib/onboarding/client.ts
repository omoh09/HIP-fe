export async function markInvoiceShared(invoiceId?: string | number | null) {
  if (!invoiceId) return;
  try {
    await fetch(`/api/onboarding/invoices/${encodeURIComponent(String(invoiceId))}/shared`, {
      method: 'POST',
      keepalive: true,
    });
  } catch {
    // Sharing must never fail because onboarding progress could not be recorded.
  }
}
