'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Mail, MessageCircle, MoreHorizontal, Send, Share2, Copy, Check, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { downloadInvoicePdf } from '@/lib/invoice/downloadPdf';
import { showToast } from '@/lib/toast';
import { markInvoiceShared } from '@/lib/onboarding/client';
import type { InvoiceData } from './types';
import { formatMoney } from '@/lib/currency';

function normalizePhone(phone?: string) {
  if (!phone) return '';
  const digits = phone.replace(/[^0-9]/g, '');
  if (!digits) return '';
  if (digits.startsWith('00')) return digits.slice(2);
  if (digits.startsWith('0')) return `234${digits.slice(1)}`;
  if (digits.startsWith('234')) return digits;
  return digits;
}

function buildMessage(invoice: InvoiceData, reminder = false) {
  const paid = Number(invoice.amountPaid ?? invoice.payment?.amount ?? 0);
  const total = Number(invoice.amount ?? 0);
  const due = Math.max(Number(invoice.amountDue ?? total - paid), 0);
  const amount = due > 0 ? due : total;
  const money = formatMoney(amount, invoice.currency || 'NGN', { showCode: true });
  const paymentLink = invoice.paymentLink || invoice.payment_link || invoice.publicUrl || invoice.public_url;

  return [
    `Hello${invoice.clientName ? ` ${invoice.clientName}` : ''},`,
    '',
    reminder
      ? `This is a friendly reminder regarding invoice ${invoice.invoiceNumber || ''}.`
      : `Please find invoice ${invoice.invoiceNumber || ''}.`,
    `Amount due: ${money}`,
    paymentLink ? `You can view and pay securely here: ${paymentLink}` : 'Please let me know if you need another copy of the invoice.',
    '',
    'Thank you.',
  ].join('\n');
}

export default function InvoiceListActions({ invoice }: { invoice: InvoiceData }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const paymentLink = invoice.paymentLink || invoice.payment_link || invoice.publicUrl || invoice.public_url || '';
  const phone = normalizePhone(invoice.clientPhone || invoice.client?.phone);
  const email = invoice.clientEmail || invoice.client?.email || '';
  const normalizedStatus = String(invoice.status || 'pending').toLowerCase().replace(/[-\s]/g, '_');
  const paidAmount = Number(invoice.amountPaid ?? invoice.payment?.amount ?? 0);
  const canEdit = invoice.canEdit ?? invoice.can_edit ?? (paidAmount <= 0 && !['paid', 'partial', 'partially_paid'].includes(normalizedStatus));
  const canRemind = invoice.canRemind ?? invoice.can_remind ?? ['pending', 'partial', 'partially_paid'].includes(normalizedStatus);

  const download = async () => {
    setBusy(true);
    try {
      await downloadInvoicePdf(invoice, invoice.invoiceNumber || 'invoice');
      showToast('Invoice PDF downloaded.', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to download invoice.', 'error');
    } finally {
      setBusy(false);
      setOpen(false);
    }
  };

  const shareWhatsApp = () => {
    const target = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(buildMessage(invoice))}`
      : `https://wa.me/?text=${encodeURIComponent(buildMessage(invoice))}`;
    window.open(target, '_blank', 'noopener,noreferrer');
    void markInvoiceShared(invoice.id);
    setOpen(false);
  };

  const shareTelegram = () => {
    const target = `https://t.me/share/url?url=${encodeURIComponent(paymentLink)}&text=${encodeURIComponent(buildMessage(invoice))}`;
    window.open(target, '_blank', 'noopener,noreferrer');
    void markInvoiceShared(invoice.id);
    setOpen(false);
  };

  const shareMore = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: invoice.invoiceNumber ? `Invoice ${invoice.invoiceNumber}` : 'Invoice',
          text: buildMessage(invoice),
          url: paymentLink || undefined,
        });
        await markInvoiceShared(invoice.id);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          showToast('Unable to open the sharing options.', 'error');
        }
      }
    } else {
      showToast('Use WhatsApp, Telegram or email to share this invoice.', 'error');
    }
    setOpen(false);
  };

  const shareEmail = (reminder = false) => {
    const subject = reminder
      ? `Payment reminder — ${invoice.invoiceNumber || 'Invoice'}`
      : `Invoice ${invoice.invoiceNumber || ''}`;
    const body = buildMessage(invoice, reminder);
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    if (!reminder) void markInvoiceShared(invoice.id);
    setOpen(false);
  };

  const sendReminder = () => {
    const reminderMessage = buildMessage(invoice, true);
    if (phone) {
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(reminderMessage)}`, '_blank', 'noopener,noreferrer');
      setOpen(false);
      return;
    }
    if (email) {
      shareEmail(true);
      return;
    }
    showToast('This client has no phone or email address. Add contact details first.', 'error');
    setOpen(false);
  };

  const copyLink = async () => {
    if (!paymentLink) {
      showToast('No public payment link is available for this invoice yet.', 'error');
      setOpen(false);
      return;
    }
    try {
      await navigator.clipboard.writeText(paymentLink);
      await markInvoiceShared(invoice.id);
      setCopied(true);
      showToast('Invoice link copied.', 'success');
      setTimeout(() => setCopied(false), 1500);
    } catch {
      showToast('Could not copy the invoice link.', 'error');
    }
    setOpen(false);
  };

  return (
    <div className="relative flex justify-center" onClick={(event) => event.stopPropagation()}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label={`Actions for ${invoice.invoiceNumber || 'invoice'}`}
        title="Invoice actions"
        onClick={() => setOpen((value) => !value)}
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>

      {open && (
        <div className="absolute right-0 top-10 z-40 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 text-left shadow-xl">
          {canEdit && (
            <button type="button" onClick={() => { setOpen(false); router.push(`/dashboard/invoices/${invoice.id}/edit`); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
              <Pencil className="h-4 w-4" /> Edit invoice
            </button>
          )}
          <button type="button" disabled={busy} onClick={download} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50">
            <Download className="h-4 w-4" /> {busy ? 'Generating PDF…' : 'Download invoice'}
          </button>
          {canRemind && (
            <button type="button" onClick={sendReminder} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
              <Send className="h-4 w-4" /> Send reminder
            </button>
          )}
          <div className="my-1 border-t border-slate-100" />
          <button type="button" onClick={shareWhatsApp} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-emerald-700 hover:bg-emerald-50">
            <MessageCircle className="h-4 w-4" /> Share via WhatsApp
          </button>
          <button type="button" onClick={shareTelegram} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-sky-700 hover:bg-sky-50">
            <Share2 className="h-4 w-4" /> Share via Telegram
          </button>
          <button type="button" onClick={() => shareEmail(false)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
            <Mail className="h-4 w-4" /> Share via email
          </button>
          <button type="button" onClick={shareMore} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
            <Share2 className="h-4 w-4" /> More sharing options
          </button>
          <button type="button" onClick={copyLink} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
            {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />} Copy invoice link
          </button>
        </div>
      )}
    </div>
  );
}
