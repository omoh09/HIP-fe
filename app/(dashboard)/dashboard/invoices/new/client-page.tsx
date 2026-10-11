"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, ImagePlus, Plus, Save, Trash2, Download, MessageCircle, X, ShieldCheck } from "lucide-react";
import { showToast } from "@/lib/toast";
import InvoicePreview from "@/components/invoice/InvoicePreview";
import { createInvoice, updateInvoice } from "../../actions";
import type { InvoiceData } from "@/components/invoice/types";
import { CURRENCY_SYMBOL } from "@/components/invoice/constants";
import { SUPPORTED_CURRENCIES } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import WhatsAppShareButton from "@/components/invoice/WhatsAppShareButton";
import { downloadInvoicePdf } from "@/lib/invoice/downloadPdf";

const emptyItem = () => ({ item: "", description: "", quantity: 1, rate: 0 });

type ClientOption = {
  id: number | string;
  client_name: string;
  client_email?: string | null;
  phone?: string | null;
};

type PlanUsage = {
  plan?: { code: string; name: string; active_client_limit?: number; platform_fee_percent?: number };
  clients?: { used: number; limit: number | null; remaining: number | null; unlimited: boolean };
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

function mapInvoiceDataForBackend(data: InvoiceData, clientId?: string | number | null) {
  return {
    client_id: clientId || null,
    logo: data.logo,
    status: data.status,
    currency: data.currency,
    invoice_number: data.invoiceNumber,
    invoice_date: data.invoiceDate,
    due_date: data.dueDate,
    client_name: data.clientName,
    client_email: data.clientEmail,
    client_phone: data.clientPhone,
    client_address: data.clientAddress,
    description: data.description ?? data.discription ?? "",
    discount_type: data.discountType,
    discount_value: Number(data.discountValue || 0),
    tax_rate: Number(data.taxRate || 0),
    items: data.items
      .filter((item) => Boolean(item.item?.trim()) || Boolean(item.description?.trim()) || Number(item.rate || 0) > 0)
      .map((item) => ({
        name: item.item?.trim(),
        description: item.description?.trim() || null,
        quantity: Number(item.quantity || 1),
        unit_price: Number(item.rate || 0),
      })),
  };
}

export default function ClientInvoice({ initialData, publicMode = false, isAuthenticated = true, resuming = false, clients = [], usage = null, mode = "create", invoiceId, initialClientId }: { initialData?: Partial<InvoiceData>; publicMode?: boolean; isAuthenticated?: boolean; resuming?: boolean; clients?: ClientOption[]; usage?: PlanUsage | null; mode?: "create" | "edit"; invoiceId?: string | number; initialClientId?: string | number | null }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [authGateOpen, setAuthGateOpen] = useState(false);
  const [gateAction, setGateAction] = useState("save");
  const [selectedClientId, setSelectedClientId] = useState<string>(initialClientId != null ? String(initialClientId) : initialData?.client?.id != null ? String(initialData.client.id) : "");
  const isEdit = mode === "edit";
  const [logoPreview, setLogoPreview] = useState(initialData?.logo ?? "");
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const applySavedLogo = () => {
      const saved = window.localStorage.getItem("business_logo") || initialData?.logo || "";
      if (saved) {
        setLogoPreview(saved);
        setData((current) => ({ ...current, logo: saved }));
      }
    };
    applySavedLogo();
    window.addEventListener("business-logo-updated", applySavedLogo);
    return () => window.removeEventListener("business-logo-updated", applySavedLogo);
  }, [initialData?.logo]);

  const [data, setData] = useState<InvoiceData>({
    status: "pending",
    currency: "NGN",
    invoiceNumber: "",
    invoiceDate: today(),
    dueDate: today(),
    clientName: "",
    clientEmail: "",
    clientAddress: "",
    description: "",
    discountType: "fixed",
    discountValue: 0,
    taxRate: 0,
    ...initialData,
    items: initialData?.items?.length ? initialData.items : [emptyItem()],
  });

  useEffect(() => {
    if (!publicMode || typeof window === "undefined") return;
    const saved = window.localStorage.getItem("hip-homorrd-public-invoice-draft");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as Partial<InvoiceData>;
      setData((current) => ({ ...current, ...parsed, items: parsed.items?.length ? parsed.items : current.items }));
      if (parsed.logo) setLogoPreview(parsed.logo);
    } catch {
      window.localStorage.removeItem("hip-homorrd-public-invoice-draft");
    }
  }, [publicMode]);

  useEffect(() => {
    if (!publicMode || typeof window === "undefined") return;
    const timer = window.setTimeout(() => {
      try { window.localStorage.setItem("hip-homorrd-public-invoice-draft", JSON.stringify(data)); } catch {}
    }, 180);
    return () => window.clearTimeout(timer);
  }, [data, publicMode]);

  const symbol = CURRENCY_SYMBOL[data.currency] ?? data.currency;
  const subtotal = useMemo(
    () => data.items.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.rate || 0), 0),
    [data.items]
  );
  const discount = data.discountType === "percentage"
    ? subtotal * Math.min(Math.max(Number(data.discountValue || 0), 0), 100) / 100
    : Math.min(Math.max(Number(data.discountValue || 0), 0), subtotal);
  const taxable = Math.max(subtotal - discount, 0);
  const tax = taxable * Math.max(Number(data.taxRate || 0), 0) / 100;
  const total = Math.max(taxable + tax, 0);

  const update = <K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) => {
    setData((current) => ({ ...current, [key]: value }));
  };

  const updateItem = (index: number, key: string, value: string | number) => {
    setData((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item),
    }));
  };

  const addItem = () => update("items", [...data.items, emptyItem()]);
  const removeItem = (index: number) => {
    update("items", data.items.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleLogo = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return showToast("Please choose an image file.", "error");
    if (file.size > 2 * 1024 * 1024) return showToast("Logo must be smaller than 2MB.", "error");

    const reader = new FileReader();
    reader.onload = () => {
      const value = String(reader.result ?? "");
      setLogoPreview(value);
      update("logo", value);
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    if (!data.clientName.trim()) return "Client name is required.";
    if (data.clientEmail.trim() && !/^\S+@\S+\.\S+$/.test(data.clientEmail)) return "Enter a valid client email.";
    if (!data.clientEmail.trim() && !(data.clientPhone || "").trim()) return "Add a client email or WhatsApp number.";
    if (!data.invoiceDate) return "Invoice date is required.";
    if (!data.dueDate) return "Due date is required.";
    if (new Date(data.dueDate) < new Date(data.invoiceDate)) return "Due date cannot be before invoice date.";
    const meaningfulItems = data.items.filter((item) => Boolean(item.item?.trim()) || Boolean(item.description?.trim()) || Number(item.rate || 0) > 0);
    if (meaningfulItems.some((item) => !item.item?.trim() || Number(item.quantity || 1) <= 0 || Number(item.rate || 0) < 0)) {
      return "Complete or remove each line item you started. Line items are optional.";
    }
    if (meaningfulItems.length > 0 && total <= 0) return "Invoice total must be greater than zero when line items are added.";
    return null;
  };

  const requestAuthentication = (action: "save" | "download" | "share" = "save") => {
    setGateAction(action);
    setAuthGateOpen(true);
  };

  const chooseClient = (value: string) => {
    setSelectedClientId(value);
    if (!value) {
      // Switching from a saved client to “Add a new client” must start with a
      // clean slate. Keeping the previous client's details caused invoices to
      // be created against the wrong person.
      setData((current) => ({ ...current, clientName: "", clientEmail: "", clientPhone: "", clientAddress: "" }));
      return;
    }
    const client = clients.find((item) => String(item.id) === value);
    if (!client) {
      showToast("That client is no longer available. Refresh the page and choose again.", "error");
      setSelectedClientId("");
      return;
    }
    setData((current) => ({
      ...current,
      clientName: client.client_name || "",
      clientEmail: client.client_email || "",
      clientPhone: client.phone || "",
      clientAddress: "",
    }));
  };

  const handleSave = () => {
    const validationError = validate();
    if (validationError) return showToast(validationError, "error");

    if (typeof navigator !== "undefined" && !navigator.onLine) {
      try { window.localStorage.setItem("hip-homorrd-public-invoice-draft", JSON.stringify(data)); } catch {}
      showToast("You’re offline. This invoice draft is saved on this device; reconnect to create and send it.", "success");
      return;
    }

    if (publicMode && !isAuthenticated) {
      try { window.localStorage.setItem("hip-homorrd-public-invoice-draft", JSON.stringify(data)); } catch {}
      requestAuthentication("save");
      return;
    }

    startTransition(async () => {
      try {
        const payload = mapInvoiceDataForBackend(data, selectedClientId || null);
        const result = isEdit
          ? await updateInvoice(String(invoiceId || data.id || ""), payload)
          : await createInvoice(payload);
        showToast(isEdit ? "Invoice updated successfully." : "Invoice created successfully.", "success");
        if (publicMode && typeof window !== "undefined") window.localStorage.removeItem("hip-homorrd-public-invoice-draft");
        const savedId = result?.id ?? result?.data?.id ?? result?.invoice?.id ?? invoiceId ?? data.id;
        if (savedId) {
          router.push(`/dashboard/invoices/${savedId}`);
        } else {
          router.push("/dashboard/invoices");
        }
        router.refresh();
      } catch (error: any) {
        showToast(error?.message || (isEdit ? "Unable to update invoice." : "Unable to create invoice."), "error");
      }
    });
  };

  const handleDownload = async () => {
    if (!previewRef.current) return;
    try {
      await downloadInvoicePdf(data, data.invoiceNumber || "invoice");
      showToast("Invoice PDF downloaded.", "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to generate the invoice PDF.", "error");
    }
  };

  return (
    <section className="page-container py-8 lg:py-10">
      {resuming && <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900">You’re signed in. Your draft has been restored—review it, then click <strong>Create invoice</strong> to save it to your workspace.</div>}
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-emerald-700">{publicMode ? "Free invoice builder" : isEdit ? "Edit invoice" : "New invoice"}</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">{isEdit ? "Edit invoice" : "Create an invoice"}</h1>
          <p className="mt-2 text-sm text-slate-500">{publicMode ? "Build the full invoice before you sign up. We only ask for an account when you are ready to create and save it." : isEdit ? "Update the invoice details below. Financial edits are locked after a successful or partial payment." : "Add the essentials, preview the invoice, then save it to your workspace."}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setPreviewVisible((value) => !value)}><Eye className="mr-2 h-4 w-4" />{previewVisible ? "Hide preview" : "Preview"}</Button>
          <Button onClick={handleSave} disabled={isPending} className="bg-emerald-600 text-white hover:bg-emerald-700"><Save className="mr-2 h-4 w-4" />{isPending ? (isEdit ? "Saving…" : "Creating…") : (isEdit ? "Save changes" : "Create invoice")}</Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.9fr)]">
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm"><CardHeader><SectionTitle title="Invoice details" subtitle="Dates, currency and your reference number." /></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Invoice number"><input value={data.invoiceNumber} onChange={(e) => update("invoiceNumber", e.target.value)} placeholder="INV-0001" className="field" /></Field>
            <Field label="Invoice currency"><select value={data.currency} onChange={(e) => update("currency", e.target.value)} className="field">{SUPPORTED_CURRENCIES.map((currency) => <option key={currency.code} value={currency.code}>{currency.symbol} {currency.code} — {currency.name}</option>)}</select><p className="mt-1.5 text-xs text-slate-500">Your dashboard base currency can be different. Online payment methods only appear when the connected provider supports this invoice currency.</p></Field>
            <Field label="Invoice date"><input type="date" value={data.invoiceDate} onChange={(e) => update("invoiceDate", e.target.value)} className="field" /></Field>
            <Field label="Due date"><input type="date" value={data.dueDate} min={data.invoiceDate} onChange={(e) => update("dueDate", e.target.value)} className="field" /></Field>
          </CardContent></Card>

          <Card className="border-slate-200 shadow-sm"><CardHeader><SectionTitle title="Client" subtitle="Select a saved client or add a new one without leaving the invoice." /></CardHeader><CardContent className="space-y-4">
            {!publicMode && usage?.clients && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <div><p className="font-semibold text-slate-900">{usage.plan?.name ?? 'Free'} plan · Client workspace</p><p className="mt-1 text-xs text-slate-500">{usage.clients.unlimited ? `${usage.clients.used} active clients · Unlimited` : `${usage.clients.used} of ${usage.clients.limit} active clients`}</p></div>
                  {!usage.clients.unlimited && <Link href="/pricing" className="shrink-0 text-xs font-semibold text-emerald-700 hover:text-emerald-800">Upgrade</Link>}
                </div>
                {!usage.clients.unlimited && usage.clients.limit ? <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(100, (usage.clients.used / usage.clients.limit) * 100)}%` }} /></div> : null}
              </div>
            )}
            {!publicMode && clients.length > 0 && <Field label="Bill to"><select value={selectedClientId} onChange={(e) => chooseClient(e.target.value)} className="field bg-white"><option value="">+ Add a new client</option>{clients.map((client) => <option key={String(client.id)} value={String(client.id)}>{client.client_name}{client.client_email ? ` · ${client.client_email}` : ''}</option>)}</select></Field>}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Client name"><input value={data.clientName} readOnly={Boolean(selectedClientId)} onChange={(e) => update("clientName", e.target.value)} placeholder="Acme Ltd" className="field read-only:bg-slate-50 read-only:text-slate-600 dark:read-only:bg-slate-800" /></Field>
              <Field label="Client email"><input type="email" value={data.clientEmail} readOnly={Boolean(selectedClientId)} onChange={(e) => update("clientEmail", e.target.value)} placeholder="billing@acme.com" className="field read-only:bg-slate-50 read-only:text-slate-600 dark:read-only:bg-slate-800" /></Field>
              <Field label="WhatsApp number"><input type="tel" value={data.clientPhone ?? ""} onChange={(e) => update("clientPhone", e.target.value)} placeholder="08012345678" className="field" /></Field>
              <Field label="Client address" className="sm:col-span-2"><textarea value={data.clientAddress ?? ""} onChange={(e) => update("clientAddress", e.target.value)} rows={3} placeholder="Optional billing address" className="field resize-none" /></Field>
            </div>
          </CardContent></Card>

          <Card className="border-slate-200 shadow-sm"><CardHeader><SectionTitle title="Branding" subtitle={publicMode ? "Add your logo now. It stays with this draft on this device." : "Your saved business logo is automatically used on this invoice."} /></CardHeader><CardContent>
            <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center">
              <span className="flex h-14 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white ring-1 ring-slate-200">{logoPreview ? <img src={logoPreview} alt="Business logo preview" className="max-h-12 max-w-20 object-contain" /> : <ImagePlus className="h-5 w-5 text-slate-400" />}</span>
              <div className="flex-1"><p className="text-sm font-semibold text-slate-900">{logoPreview ? "Business logo ready" : "No logo uploaded"}</p><p className="mt-1 text-xs text-slate-500">{publicMode ? "Optional. JPG, PNG or WebP up to 2MB." : "Manage your invoice branding from Settings → Branding."}</p></div>
              {publicMode ? <label className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Choose logo<input type="file" accept="image/*" className="sr-only" onChange={(event) => handleLogo(event.target.files?.[0])} /></label> : <Button type="button" variant="outline" onClick={() => window.location.href = "/dashboard/settings/branding"}>Manage</Button>}
            </div>
          </CardContent></Card>

          <Card className="border-slate-200 shadow-sm"><CardHeader><SectionTitle title="Line items" subtitle="Optional. Add them when you want an itemized invoice." /></CardHeader><CardContent className="space-y-4">
            {data.items.map((item, index) => (
              <div key={index} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="mb-3 flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Item {index + 1}</span><button type="button" onClick={() => removeItem(index)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label="Remove item"><Trash2 className="h-4 w-4" /></button></div>
                <div className="grid gap-3 sm:grid-cols-[1.5fr_1fr]">
                  <Field label="Item"><input value={item.item ?? ""} onChange={(e) => updateItem(index, "item", e.target.value)} placeholder="Website development" className="field bg-white" /></Field>
                  <Field label="Description"><input value={item.description ?? ""} onChange={(e) => updateItem(index, "description", e.target.value)} placeholder="Optional" className="field bg-white" /></Field>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-3"><Field label="Quantity"><input type="number" min="1" value={item.quantity ?? 1} onChange={(e) => updateItem(index, "quantity", Number(e.target.value))} className="field bg-white" /></Field><Field label="Rate"><input type="number" min="0" step="0.01" value={item.rate ?? 0} onChange={(e) => updateItem(index, "rate", Number(e.target.value))} className="field bg-white" /></Field><Field label="Amount"><div className="field flex items-center bg-slate-100 text-slate-700">{symbol}{(Number(item.quantity || 0) * Number(item.rate || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div></Field></div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addItem} className="w-full border-dashed"><Plus className="mr-2 h-4 w-4" />Add line item</Button>
          </CardContent></Card>

          <Card className="border-slate-200 shadow-sm"><CardHeader><SectionTitle title="Adjustments" subtitle="Optional discount and tax." /></CardHeader><CardContent className="grid gap-4 sm:grid-cols-3"><Field label="Discount type"><select value={data.discountType} onChange={(e) => update("discountType", e.target.value as InvoiceData["discountType"])} className="field"><option value="fixed">Fixed</option><option value="percentage">Percentage</option></select></Field><Field label={data.discountType === "percentage" ? "Discount (%)" : "Discount amount"}><input type="number" min="0" value={data.discountValue} onChange={(e) => update("discountValue", Number(e.target.value))} className="field" /></Field><Field label="Tax (%)"><input type="number" min="0" value={data.taxRate} onChange={(e) => update("taxRate", Number(e.target.value))} className="field" /></Field></CardContent></Card>
        </div>

        <div className="xl:sticky xl:top-24 xl:self-start">
          <Card className="overflow-hidden border-slate-200 shadow-sm"><CardHeader className="border-b border-slate-100"><div className="flex items-center justify-between"><SectionTitle title="Invoice summary" subtitle="This is what your client will see." /><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Live</span></div></CardHeader><CardContent className="p-0">
            <div className="bg-slate-100 p-4">
              <div className="max-h-[calc(100vh-240px)] overflow-auto rounded-xl">
                <InvoicePreview ref={previewRef} data={data} />
              </div>
              {!previewVisible && <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">Preview is always generated for PDF export. Use the Preview button above to focus on it.</div>}
            </div>
            <div className="flex flex-col gap-3 border-t border-slate-100 p-4 sm:flex-row">
              <Button variant="outline" className="flex-1" onClick={publicMode && !isAuthenticated ? () => requestAuthentication("download") : handleDownload}><Download className="mr-2 h-4 w-4" />Download PDF</Button>
              {publicMode && !isAuthenticated ? <Button type="button" variant="outline" className="flex-1 border-emerald-200 text-emerald-800 hover:bg-emerald-50" onClick={() => requestAuthentication("share")}><MessageCircle className="mr-2 h-4 w-4" />Share on WhatsApp</Button> : <WhatsAppShareButton clientName={data.clientName} clientPhone={data.clientPhone} invoiceNumber={data.invoiceNumber} amount={total} currency={data.currency} paymentLink={data.paymentLink || data.payment_link || data.publicUrl || data.public_url} invoiceData={data} />}
            </div>
          </CardContent></Card>
        </div>
      </div>

      {authGateOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="invoice-auth-title" onMouseDown={(event) => { if (event.target === event.currentTarget) setAuthGateOpen(false); }}>
          <div className="w-full max-w-md rounded-[24px] border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><ShieldCheck className="h-5 w-5" /></span>
              <button type="button" aria-label="Close" onClick={() => setAuthGateOpen(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-5 w-5" /></button>
            </div>
            <h2 id="invoice-auth-title" className="mt-5 text-2xl font-bold tracking-tight text-slate-950">Your invoice is ready to continue.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{gateAction === "save" ? "Sign in or create a free account to create this invoice and keep it in your workspace." : gateAction === "download" ? "Sign in or create a free account to download this invoice. Your draft is already saved on this device." : "Sign in or create a free account to share this invoice through your connected workflow. Your draft is already saved on this device."}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Link href="/sign-in?next=%2Fcreate-invoice%3Fresume%3D1" className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50">Sign in</Link>
              <Link href="/sign-up?next=%2Fcreate-invoice%3Fresume%3D1" className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700">Create free account</Link>
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-400">We keep the draft in your browser so you do not have to enter the invoice again after signing in.</p>
          </div>
        </div>
      )}
    </section>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) { return <label className={`block ${className}`}><span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>{children}</label>; }
function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) { return <div><h2 className="font-semibold text-slate-950 dark:text-white">{title}</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p></div>; }
function SummaryRow({ label, value }: { label: string; value: string }) { return <div className="flex justify-between"><span className="text-slate-400">{label}</span><span>{value}</span></div>; }
