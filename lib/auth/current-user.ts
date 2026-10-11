import 'server-only';

import axios from 'axios';
import { cookies } from 'next/headers';
import type { User } from '@/lib/types/user';
import { API_BASE_URL, backendHeaders } from '@/app/api/_lib/backend';

export async function getCurrentUser(): Promise<User | null> {
  if (!API_BASE_URL) return null;

  const token = (await cookies()).get('auth')?.value;
  if (!token) return null;

  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/auth/me`, {
      headers: backendHeaders(token),
      timeout: 10_000,
      validateStatus: () => true,
    });

    if (response.status < 200 || response.status >= 300) return null;

    const account = (response.data?.user ?? response.data) as User & {
      business_logo?: string;
      business_name?: string;
    };

    return {
      ...account,
      logo: account.logo ?? account.business_logo,
      businessName: account.businessName ?? account.business_name ?? account.name,
    };
  } catch {
    return null;
  }
}
