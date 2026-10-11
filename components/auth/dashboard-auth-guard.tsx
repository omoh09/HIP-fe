'use client';

/**
 * Legacy compatibility wrapper.
 *
 * Dashboard authentication is enforced by app/(dashboard)/layout.tsx on the
 * server before the dashboard shell is rendered. Keeping this component as a
 * transparent wrapper avoids duplicate client-side redirects and loading
 * states for pages that still import it.
 */
export default function DashboardAuthGuard({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
