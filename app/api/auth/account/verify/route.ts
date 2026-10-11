import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.API_BASE_URL?.replace(/\/$/, '');
const VERIFY_ENDPOINT = process.env.ACCOUNT_VERIFY_ENDPOINT || '/api/v1/auth/verify-otp';

export async function POST(request: Request) {
  if (!API_BASE_URL) return NextResponse.json({ message: 'Authentication service is not configured.' }, { status: 500 });

  try {
    const body = await request.json();
    const response = await fetch(`${API_BASE_URL}${VERIFY_ENDPOINT}`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) return NextResponse.json({ message: payload?.detail || payload?.message || 'Invalid or expired code.' }, { status: response.status });

    const token = payload?.token ?? payload?.access_token ?? payload?.access;
    if (token) {
      const cookieStore = await cookies();
      cookieStore.set('auth', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json({ message: 'Unable to verify this code right now.' }, { status: 502 });
  }
}
