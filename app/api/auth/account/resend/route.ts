import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL?.replace(/\/$/, '');
const RESEND_ENDPOINT = process.env.ACCOUNT_RESEND_ENDPOINT || '/api/v1/auth/resend-otp';

export async function POST(request: Request) {
  if (!API_BASE_URL) return NextResponse.json({ message: 'Authentication service is not configured.' }, { status: 500 });

  try {
    const body = await request.json();
    const response = await fetch(`${API_BASE_URL}${RESEND_ENDPOINT}`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) return NextResponse.json({ message: payload?.detail || payload?.message || 'Unable to resend the code.' }, { status: response.status });
    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json({ message: 'Unable to resend the code right now.' }, { status: 502 });
  }
}
