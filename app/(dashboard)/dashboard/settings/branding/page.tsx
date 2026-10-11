'use client';

import { useEffect, useState } from "react";
import { ImagePlus, Loader2, CheckCircle2, LockKeyhole, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import { useUser } from "@/app/context/UserContext";

function extractLogo(payload: any): string {
  return String(
    payload?.logo_url ??
    payload?.logoUrl ??
    payload?.logo ??
    payload?.url ??
    payload?.data?.logo_url ??
    payload?.data?.logoUrl ??
    payload?.data?.logo ??
    payload?.data?.url ??
    ""
  );
}

export default function BrandingPage() {
  const { user } = useUser();
  const [logo, setLogo] = useState("");
  const [pending, setPending] = useState(false);
  const [brandingAllowed, setBrandingAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const cached = window.localStorage.getItem("business_logo") || user?.logo || "";
    setLogo(cached);
    fetch('/api/billing/subscription', { cache: 'no-store' }).then((r) => r.json()).then((payload) => setBrandingAllowed(Boolean(payload?.data?.plan?.features?.custom_branding))).catch(() => setBrandingAllowed(false));
  }, [user?.logo]);

  const handleUpload = async (file?: File) => {
    if (!file) return;
    if (brandingAllowed === false) { showToast("Saved custom branding is available on Base and Plus.", "error"); return; }
    if (!file.type.startsWith("image/")) {
      showToast("Please choose a PNG, JPG or WebP image.", "error");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast("Logo must be smaller than 2MB.", "error");
      return;
    }

    const localReader = new FileReader();
    localReader.onload = () => {
      const localPreview = String(localReader.result || "");
      setLogo(localPreview);
      window.localStorage.setItem("business_logo", localPreview);
      window.dispatchEvent(new Event("business-logo-updated"));
    };
    localReader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("logo", file);
    setPending(true);
    try {
      const response = await fetch("/api/settings/logo", { method: "POST", body: formData, credentials: "include" });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.message || "Unable to save your logo.");

      const savedLogo = extractLogo(payload);
      if (savedLogo) {
        setLogo(savedLogo);
        window.localStorage.setItem("business_logo", savedLogo);
        window.dispatchEvent(new Event("business-logo-updated"));
      }
      showToast("Branding saved. New invoices will use this logo.", "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to save your logo.", "error");
    } finally {
      setPending(false);
    }
  };

  return (
    <section className="page-container py-8 lg:py-10">
      <div className="mb-8">
        <p className="text-sm font-medium text-emerald-700">Settings</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Branding</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">Upload your business logo once. Hip Homorrd will use it automatically on new invoices and invoice previews.</p>
      </div>

      {brandingAllowed === false && <div className="mb-5 flex max-w-2xl flex-col gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex gap-3"><LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" /><div><p className="font-semibold text-emerald-950">Saved branding is a Base / Plus feature.</p><p className="mt-1 text-sm text-emerald-800">You can preview a logo in the public invoice builder, but saving it to every future invoice requires a paid plan.</p></div></div><Link href="/dashboard/settings/billing?plan=base" className="inline-flex shrink-0 items-center text-sm font-bold text-emerald-800">View plans <ArrowRight className="ml-1 h-4 w-4" /></Link></div>}
      <Card className="max-w-2xl border-slate-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><ImagePlus className="h-5 w-5" /></span>
            <div><h2 className="font-semibold text-slate-950">Business logo</h2><p className="text-sm text-slate-500">Recommended: a clear square or horizontal logo.</p></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-32 w-56 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              {logo ? <img src={logo} alt="Business logo" className="max-h-24 max-w-[200px] object-contain" /> : <div className="text-center text-sm text-slate-400"><ImagePlus className="mx-auto mb-2 h-7 w-7" />No logo uploaded</div>}
            </div>
            <div>
              <label className="inline-flex cursor-pointer items-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700">
                {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImagePlus className="mr-2 h-4 w-4" />}
                {pending ? "Saving…" : logo ? "Replace logo" : "Upload logo"}
                <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" disabled={pending || brandingAllowed === false} onChange={(e) => handleUpload(e.target.files?.[0])} />
              </label>
              <p className="mt-3 text-xs leading-5 text-slate-500">PNG, JPG or WebP · maximum 2MB.</p>
              {logo && <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-emerald-700"><CheckCircle2 className="h-4 w-4" />Ready for your invoices</p>}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
