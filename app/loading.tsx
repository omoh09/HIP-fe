export default function RootLoading() {
  return (
    <div className="min-h-[65vh] bg-white" aria-live="polite" aria-busy="true">
      <div className="page-container py-10">
        <div className="h-4 w-28 animate-pulse rounded-full bg-slate-100" />
        <div className="mt-8 h-12 max-w-2xl animate-pulse rounded-2xl bg-slate-100" />
        <div className="mt-4 h-5 max-w-xl animate-pulse rounded-full bg-slate-100" />
        <div className="mt-10 h-64 animate-pulse rounded-3xl border border-slate-100 bg-slate-50" />
      </div>
    </div>
  );
}
