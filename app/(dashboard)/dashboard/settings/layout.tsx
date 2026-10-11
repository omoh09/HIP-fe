import type { ReactNode } from 'react';
import SettingsBackNav from '@/components/settings/settings-back-nav';

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return <><SettingsBackNav />{children}</>;
}
